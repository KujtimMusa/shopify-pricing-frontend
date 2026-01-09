'use client'

import React from 'react'
import { Link } from '@/navigation'
import { ModernCard } from '@/components/ui/modern-card'
import { 
  AlertCircle, 
  Sparkles,
  TrendingUp,
  Target,
  Plus
} from 'lucide-react'

interface DashboardStats {
  missed_revenue: {
    total: number
    product_count: number
    recommendation_count?: number
    avg_per_product: number
  }
}

interface MissedRevenueHeroProps {
  stats: DashboardStats
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function MissedRevenueHero({ stats }: MissedRevenueHeroProps) {
  const { total, product_count, recommendation_count, avg_per_product } = stats.missed_revenue

  if (product_count === 0) return null

  const percentIncrease = total > 0 ? Math.round((total / (total * 0.3)) * 100) : 0

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-8 shadow-xl animate-fade-in">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
      
      <div className="relative flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/30 blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <AlertCircle className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">
              Du verlierst aktuell Geld!
            </h2>
          </div>
          <p className="text-sm text-red-50">
            {product_count} {product_count === 1 ? 'Produkt hat' : 'Produkte haben'} suboptimale Preise
            {recommendation_count && recommendation_count !== product_count && (
              <span className="ml-2 text-red-100">
                ({recommendation_count} Empfehlungen verfügbar)
              </span>
            )}
          </p>

          <ModernCard variant="glass" className="relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Potenzial diesen Monat
                  </p>
                  <div className="flex items-baseline gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">
                      +{percentIncrease}% mehr Umsatz möglich
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2 animate-fade-in">
                  <Plus className="h-8 w-8 text-green-600" />
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  mehr Umsatz möglich
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Produkte</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product_count} mit Potenzial
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Ø pro Produkt</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(avg_per_product)}/Monat
                  </p>
                </div>
              </div>
              
              <Link href="/products">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                  <Target className="h-5 w-5" />
                  Produkte optimieren
                </button>
              </Link>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
