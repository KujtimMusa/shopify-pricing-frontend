'use client'

import React, { useState } from 'react'

interface PriceRecommendationBreakdownProps {
  currentPrice: number
  recommendedPrice: number
  factors?: {
    competitorAdjustment?: number
    demandAdjustment?: number
    inventoryAdjustment?: number
  }
  averageCompetitorPrice?: number
  demandGrowth?: number
  daysOfStock?: number
  onApply?: (price: number) => Promise<void>
  onKeep?: () => void
}

export function PriceRecommendationBreakdown({
  currentPrice,
  recommendedPrice,
  factors = {},
  averageCompetitorPrice,
  demandGrowth = 0,
  daysOfStock = 0,
  onApply,
  onKeep
}: PriceRecommendationBreakdownProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<'volume' | 'margin' | 'balanced'>('balanced')
  const [isApplying, setIsApplying] = useState(false)
  
  const totalAdjustment = recommendedPrice - currentPrice
  const isIncrease = totalAdjustment > 0
  const isDecrease = totalAdjustment < 0
  
  const competitorAdjustment = factors.competitorAdjustment || 0
  const demandAdjustment = factors.demandAdjustment || 0
  const inventoryAdjustment = factors.inventoryAdjustment || 0
  
  const handleApply = async () => {
    if (!onApply) return
    setIsApplying(true)
    try {
      await onApply(recommendedPrice)
    } catch (error) {
      console.error('Failed to apply price:', error)
    } finally {
      setIsApplying(false)
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">💡 Preisempfehlung</h3>
        <div className={`text-3xl font-bold ${isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-gray-600'}`}>
          {recommendedPrice.toFixed(2)}€
        </div>
      </div>
      
      {/* Calculation */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-700 font-medium">Aktueller Preis</span>
          <span className="text-xl font-semibold text-gray-900">{currentPrice.toFixed(2)}€</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-sm font-semibold text-gray-900 mb-2">📊 Anpassungsfaktoren:</p>
          
          {averageCompetitorPrice !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                🏪 Wettbewerb (Ø {averageCompetitorPrice.toFixed(2)}€)
              </span>
              <span className={`font-bold ${competitorAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {competitorAdjustment >= 0 ? '+' : ''}{competitorAdjustment.toFixed(2)}€
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              📈 Nachfrage ({(demandGrowth * 100).toFixed(0)}%)
            </span>
            <span className={`font-bold ${demandAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {demandAdjustment >= 0 ? '+' : ''}{demandAdjustment.toFixed(2)}€
            </span>
          </div>
          
          {daysOfStock > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                📦 Lager ({daysOfStock.toFixed(0)} Tage)
              </span>
              <span className={`font-bold ${inventoryAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {inventoryAdjustment >= 0 ? '+' : ''}{inventoryAdjustment.toFixed(2)}€
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-3 border-t-2 border-gray-300">
          <span className="font-bold text-gray-900">Anpassung</span>
          <span className={`text-2xl font-bold ${isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-gray-600'}`}>
            {isIncrease ? '+' : ''}{totalAdjustment.toFixed(2)}€
          </span>
        </div>
      </div>
      
      {/* Explanation */}
      {isDecrease && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📉 Warum senken?</h4>
          <p className="text-sm text-blue-800">
            {averageCompetitorPrice && currentPrice > averageCompetitorPrice ? (
              <>
                Du bist teurer als der Durchschnitt ({averageCompetitorPrice.toFixed(2)}€). 
                Mit steigender Nachfrage kannst du durch Preissenkung mehr Verkäufe generieren, 
                bevor das Lager leer ist.
              </>
            ) : (
              <>
                Mit steigender Nachfrage kannst du durch Preissenkung mehr Verkäufe generieren, 
                bevor das Lager leer ist.
              </>
            )}
          </p>
        </div>
      )}
      
      {isIncrease && (
        <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">📈 Warum erhöhen?</h4>
          <p className="text-sm text-green-800">
            {demandGrowth > 0 ? (
              <>
                Die Nachfrage steigt ({(demandGrowth * 100).toFixed(0)}%). 
                Du kannst den Preis erhöhen, um die Marge zu optimieren.
              </>
            ) : (
              <>
                Basierend auf Wettbewerbsanalyse und Lagerbestand kannst du den Preis erhöhen.
              </>
            )}
          </p>
        </div>
      )}
      
      {/* Strategy Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Strategie wählen:
        </label>
        <select
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value as 'volume' | 'margin' | 'balanced')}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="volume">🚀 Hoher Absatz</option>
          <option value="margin">💰 Hohe Marge</option>
          <option value="balanced">⚖️ Ausgewogen</option>
        </select>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        {onApply && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              isDecrease
                ? 'bg-red-600 text-white hover:bg-red-700'
                : isIncrease
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isApplying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Wird angewendet...
              </span>
            ) : (
              <>
                {isDecrease ? 'Auf' : isIncrease ? 'Auf' : 'Bei'} {recommendedPrice.toFixed(2)}€ {isDecrease ? 'senken' : isIncrease ? 'erhöhen' : 'beibehalten'}
              </>
            )}
          </button>
        )}
        {onKeep && (
          <button
            onClick={onKeep}
            className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
          >
            {currentPrice.toFixed(2)}€ beibehalten
          </button>
        )}
      </div>
    </div>
  )
}

