'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowRight, Sparkles, RefreshCw } from 'lucide-react'
import { fetchProducts, syncProducts } from '@/lib/api'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { Link } from '@/navigation'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { currentShop, isDemoMode, refresh: refreshShop } = useShop()

  // Lade Produkte beim Shop-Wechsel
  useEffect(() => {
    if (!currentShop) {
      console.log('[ProductsPage] No current shop, skipping load')
      return
    }
    console.log('[ProductsPage] Shop changed, reloading products:', currentShop.name, 'isDemoMode:', isDemoMode)
    loadProducts()
  }, [currentShop?.id, isDemoMode])
  
  // Höre auf Shop-Wechsel Events (für sofortiges Reload)
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[ProductsPage] Shop switched event received:', event.detail)
      // Kurze Verzögerung, damit Shop-Context aktualisiert ist
      setTimeout(() => {
        loadProducts()
      }, 300)
    }
    
    window.addEventListener('shop-switched', handleShopSwitch as EventListener)
    return () => window.removeEventListener('shop-switched', handleShopSwitch as EventListener)
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('[ProductsPage] Loading products, currentShop:', currentShop?.name, 'isDemoMode:', isDemoMode)
      // Nutze Shop-Context (kein shop_id mehr nötig)
      const data = await fetchProducts()
      console.log('[ProductsPage] Products loaded:', data.length, 'products')
      setProducts(data || [])
    } catch (error) {
      console.error('[ProductsPage] Fehler beim Laden der Produkte:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (isDemoMode) {
      alert('Demo-Shop: Produkte können nicht synchronisiert werden. Nutze einen echten Shopify-Shop.')
      return
    }
    
    if (!currentShop || currentShop.type === 'demo') {
      alert('Bitte wähle einen echten Shopify-Shop aus!')
      return
    }
    
    setLoading(true)
    try {
      await syncProducts(currentShop.id)
      await loadProducts()
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error)
      alert('Fehler beim Synchronisieren. Prüfe die Konsole für Details.')
    } finally {
      setLoading(false)
    }
  }

  // Zähle Produkte mit Empfehlungen (für Anzeige)
  const productsWithRecommendations = products.filter((p: any) => 
    p.has_recommendation || p.recommendation_count > 0
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PriceIQ
          </h2>
        </div>
        
        {/* Shop Switcher */}
        <div className="mb-6">
          <ShopSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <Link 
            href="/" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/products" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors bg-gray-100"
          >
            Produkte
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Empfehlungen
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        {/* Page Header mit modernem Styling */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Produkte
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {products.length} Produkte{productsWithRecommendations > 0 && ` - ${productsWithRecommendations} mit AI-Empfehlungen`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentShop && (
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  {currentShop.name} {isDemoMode && '(Demo)'}
                </div>
              )}
              {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
                <button
                  onClick={handleSync}
                  disabled={loading}
                  className="btn-modern btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Synchronisiere...' : 'Produkte synchronisieren'}
                </button>
              )}
              {isDemoMode && (
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  Demo-Mode: Keine Synchronisation möglich
                </div>
              )}
              <Link
                href="/"
                className="btn-modern btn-secondary"
              >
                Zurück
              </Link>
            </div>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card">
                <div className="space-y-4">
                  <div className="skeleton h-6 w-3/4" />
                  <div className="skeleton h-8 w-1/2" />
                  <div className="skeleton h-4 w-1/4" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-purple-300/30 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl">
                <Package className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Keine Produkte gefunden
            </h3>
            {isDemoMode ? (
              <>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Demo-Shop: Produkte werden automatisch geladen. Falls keine angezeigt werden, prüfe die Browser-Console.
                </p>
                <button
                  onClick={() => loadProducts()}
                  className="btn-modern btn-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Produkte neu laden
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Synchronisiere deine Produkte oder füge welche manuell hinzu.
                </p>
                <button
                  onClick={handleSync}
                  className="btn-modern btn-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Produkte synchronisieren
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const hasRecommendation = product.has_recommendation || product.recommendation_count > 0
              const inventory = product.inventory || product.inventory_quantity || 0
              
              // Bestimme Inventory-Level
              const getInventoryClass = (inv: number) => {
                if (inv < 10) return 'inventory-critical'
                if (inv < 30) return 'inventory-low'
                if (inv < 100) return 'inventory-good'
                return 'inventory-high'
              }

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`product-card ${hasRecommendation ? 'has-recommendation' : ''}`}
                >
                  {/* AI Badge - NUR WENN RECOMMENDATION EXISTIERT */}
                  {hasRecommendation && (
                    <div className="ai-badge">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="space-y-4">
                    {/* Product Title */}
                    <h3 className="product-title">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div>
                      <div className="product-price">
                        €{product.price?.toFixed(2) || '0.00'}
                      </div>
                      <p className="text-sm text-gray-600">
                        Preis: <span className="font-medium">€{product.price?.toFixed(2) || '0.00'}</span>
                      </p>
                    </div>

                    {/* Inventory - MIT NEUER BADGE STYLE */}
                    <div>
                      <span className={`product-inventory ${getInventoryClass(inventory)}`}>
                        <Package className="h-3 w-3" />
                        Lager: {inventory}
                      </span>
                    </div>

                    {/* Recommendation Link */}
                    <Link
                      href={`/recommendations?product_id=${product.id}`}
                      className="recommendation-link"
                    >
                      Preisempfehlungen anzeigen
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </div>
      </main>
    </div>
  )
}
