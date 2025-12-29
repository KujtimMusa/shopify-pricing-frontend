'use client'

import React, { useState } from 'react'
import { searchCompetitors, CompetitorSearchResponse } from '@/lib/api'
import { PositionBadge } from './PositionBadge'
import { CompetitorList } from './CompetitorList'

interface CompetitorAnalysisButtonProps {
  productId: string | number
  productTitle: string
  currentPrice?: number
  className?: string
}

export function CompetitorAnalysisButton({
  productId,
  productTitle,
  currentPrice,
  className = ''
}: CompetitorAnalysisButtonProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CompetitorSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setShowResults(false)

    try {
      const result = await searchCompetitors(productId, {
        maxResults: 5,
        forceRefresh: false
      })
      
      setData(result)
      setShowResults(true)
    } catch (err: any) {
      console.error('[CompetitorAnalysisButton] Fehler beim Laden:', err)
      
      let errorMessage = 'Fehler beim Laden der Wettbewerber-Daten'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Produkt nicht gefunden. Prüfe Shop-Auswahl und Produkt-ID.'
      } else if (err?.response?.status === 429) {
        errorMessage = 'API-Limit erreicht. Bitte später erneut versuchen.'
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server-Fehler. Bitte später erneut versuchen oder Support kontaktieren.'
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      {/* Button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Analyse läuft...</span>
          </>
        ) : (
          <>
            <span>🔍</span>
            <span>Wettbewerbsanalyse</span>
          </>
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          <p className="font-medium mb-1">⚠️ Fehler</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results Container */}
      {showResults && data && !loading && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg space-y-3">
          {/* Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Zusammenfassung</h4>
            
            {data.summary.found > 0 ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Gefunden:</span>
                  <span className="ml-2 font-medium">{data.summary.found} Wettbewerber</span>
                </div>
                <div>
                  <span className="text-gray-600">Durchschnitt:</span>
                  <span className="ml-2 font-medium">€{data.summary.avg_price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Minimum:</span>
                  <span className="ml-2 font-medium">€{data.summary.min_price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Maximum:</span>
                  <span className="ml-2 font-medium">€{data.summary.max_price.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Keine Wettbewerber gefunden.</p>
            )}

            {/* Position Badge */}
            {data.summary.found > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">Ihre Position:</span>
                <PositionBadge position={data.summary.your_position} />
              </div>
            )}

            {/* Your Price */}
            {data.your_price > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <span className="text-sm text-gray-600">Ihr Preis: </span>
                <span className="text-sm font-semibold text-blue-900">€{data.your_price.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Competitors List */}
          {data.competitors && data.competitors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Wettbewerber</h4>
              <CompetitorList competitors={data.competitors} />
            </div>
          )}

          {/* No Competitors Message */}
          {data.summary.found === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p>Keine Wettbewerber für dieses Produkt gefunden.</p>
              <p className="text-xs mt-1">Dies kann verschiedene Gründe haben (Produktname, Marke, Verfügbarkeit).</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

