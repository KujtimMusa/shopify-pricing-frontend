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
    <div className="p-3 border" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: '#f1f5f9' }}>
            Confidence-Erklärung
          </p>
          <ul className="text-xs space-y-1" style={{ color: '#cbd5e1' }}>
            {explanations.map((explanation, idx) => (
              <li key={idx}>• {explanation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
