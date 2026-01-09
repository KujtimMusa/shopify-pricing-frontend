'use client'

import React from 'react'
import { Info } from 'lucide-react'

interface ConfidenceExplanationProps {
  confidence: number
  competitorCount: number
  salesDataDays: number
}

export function ConfidenceExplanation({
  confidence,
  competitorCount,
  salesDataDays,
}: ConfidenceExplanationProps) {
  const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low'
  
  const explanations: string[] = []
  
  if (competitorCount === 0) {
    explanations.push('Keine Wettbewerbsdaten verfügbar')
  }
  
  if (salesDataDays === 0) {
    explanations.push('Keine Verkaufsdaten verfügbar')
  }
  
  if (confidenceLevel === 'low') {
    explanations.push('Niedrige Datenqualität - manuelle Prüfung empfohlen')
  }
  
  if (explanations.length === 0) {
    return null
  }
  
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Confidence-Erklärung
          </p>
          <ul className="text-xs text-blue-800 space-y-1">
            {explanations.map((explanation, idx) => (
              <li key={idx}>• {explanation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
