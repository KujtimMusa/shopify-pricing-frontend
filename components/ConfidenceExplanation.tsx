'use client'

import React from 'react'

interface ConfidenceExplanationProps {
  confidence: number
  mlConfidence?: number
  metaConfidence?: number
  competitorCount?: number
  salesDataDays?: number
}

export function ConfidenceExplanation({
  confidence,
  mlConfidence,
  metaConfidence,
  competitorCount = 0,
  salesDataDays = 0
}: ConfidenceExplanationProps) {
  const confidencePercent = Math.round(confidence * 100)
  const mlConfidencePercent = mlConfidence ? Math.round(mlConfidence * 100) : null
  const metaConfidencePercent = metaConfidence ? Math.round(metaConfidence * 100) : null
  
  // Only show warnings if confidence is below 70%
  const showWarnings = confidencePercent < 70

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-l-4 border-blue-500">
      <h4 className="font-bold text-lg mb-3 text-gray-900">
        Wie kommt die <span className="text-green-600">{confidencePercent}%</span> Sicherheit zustande?
      </h4>
      
      {/* ML Models */}
      {(mlConfidencePercent !== null || metaConfidencePercent !== null) && (
        <div className="space-y-2 mb-4">
          {mlConfidencePercent !== null && (
            <div className="flex justify-between bg-white/60 p-2 rounded">
              <span className="text-sm text-gray-700">🤖 ML Detector (526k Samples)</span>
              <span className="font-bold text-green-600">{mlConfidencePercent}%</span>
            </div>
          )}
          {metaConfidencePercent !== null && (
            <div className="flex justify-between bg-white/60 p-2 rounded">
              <span className="text-sm text-gray-700">🧠 Meta Labeler</span>
              <span className="font-bold text-green-600">{metaConfidencePercent}%</span>
            </div>
          )}
        </div>
      )}
      
      {/* Data Basis - Only show warnings if confidence < 70% */}
      {showWarnings && (
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">📊 Verkaufsdaten:</span>
            <span className={`font-semibold ${salesDataDays >= 30 ? 'text-green-600' : 'text-yellow-600'}`}>
              {salesDataDays} Tage {salesDataDays >= 30 ? '✓' : '⚠️'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">🏪 Wettbewerber:</span>
            <span className={`font-semibold ${competitorCount >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>
              {competitorCount} {competitorCount >= 3 ? '✓' : '⚠️'}
            </span>
          </div>
        </div>
      )}
      
      {/* Only show warning message if confidence < 70% */}
      {showWarnings && (
        <div className="mt-4 bg-yellow-100 p-3 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Bei unter 70% solltest du die Empfehlung kritisch prüfen.
          </p>
        </div>
      )}
      
      {/* High confidence message */}
      {confidencePercent >= 85 && (
        <div className="mt-4 bg-green-100 p-3 rounded border border-green-200">
          <p className="text-sm text-green-800">
            ✅ Hohe Sicherheit basierend auf mehreren ML-Modellen und umfassender Marktanalyse.
          </p>
        </div>
      )}
    </div>
  )
}


