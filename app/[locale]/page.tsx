'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'

export default function Home() {
  const { currentShop, isDemoMode, shops, loading, switchToShop } = useShop()
  const searchParams = useSearchParams()
  
  // Auto-Switch nach OAuth Installation (aus URL oder localStorage)
  useEffect(() => {
    // Prüfe zuerst URL-Parameter
    const shopId = searchParams?.get('shop_id')
    const mode = searchParams?.get('mode')
    const installed = searchParams?.get('installed')
    
    if (shopId && mode === 'live' && installed === 'true') {
      console.log('[Home] Auto-switching to installed shop from URL:', shopId)
      switchToShop(parseInt(shopId), false)
      
      // Clean URL (entferne Query-Parameter)
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname)
      }
      return;
    }
    
    // Fallback: Prüfe localStorage (falls /dashboard bereits shop_id gespeichert hat)
    if (typeof window !== 'undefined' && !shopId) {
      const storedShopId = localStorage.getItem('current_shop_id')
      const storedMode = localStorage.getItem('shop_mode')
      
      if (storedShopId && !currentShop) {
        console.log('[Home] Auto-switching to shop from localStorage:', storedShopId)
        const shopIdNum = parseInt(storedShopId)
        const useDemo = storedMode === 'demo'
        
        if (!isNaN(shopIdNum)) {
          switchToShop(shopIdNum, useDemo).catch((err) => {
            console.error('[Home] Error switching to shop from localStorage:', err)
          })
        }
      }
    }
  }, [searchParams, switchToShop, currentShop])

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Pricing Optimizer</h1>
        
        {loading ? (
          <div className="text-gray-600">Lade Shop-Status...</div>
        ) : currentShop ? (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-green-900">
              ✅ {isDemoMode ? 'Demo-Shop aktiv' : 'Shop verbunden'}
            </h3>
            <p className="text-green-700 mb-2">
              Shop: <strong>{currentShop.name}</strong>
            </p>
            <p className="text-green-700">
              {isDemoMode ? (
                <>
                  Produkte: <strong>{currentShop.product_count} Demo-Produkte</strong>
                </>
              ) : (
                <>
                  Produkte: <strong>{currentShop.product_count} Produkte</strong>
                  {' • '}
                  URL: <strong>{currentShop.shop_url}</strong>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-yellow-900">⚠️ Kein Shop aktiv</h3>
            <p className="text-yellow-700 mb-4">
              Nutze den Shop-Switcher in der Sidebar, um einen Shop auszuwählen oder einen neuen Shopify-Shop zu installieren:
            </p>
            <a 
              href="http://localhost:8000/auth/shopify/install?shop=priceiq-2.myshopify.com"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop installieren
            </a>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/products" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Produkte</h2>
            <p className="text-gray-600">Verwalte deine Shopify-Produkte und synchronisiere sie mit der Datenbank.</p>
          </Link>
          
          <Link href="/recommendations" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Preisempfehlungen</h2>
            <p className="text-gray-600">Sieh dir Preisempfehlungen basierend auf verschiedenen Strategien an.</p>
          </Link>
        </div>
        </div>
      </main>
    </div>
  )
}

