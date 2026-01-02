'use client'

import React from 'react'
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'

interface ConfidenceBasis {
  ml_models?: number
  competitor_count?: number
  sales_30d?: number
  margin_stable?: boolean
  margin_pct?: number | null
}

interface ConfidenceIndicatorProps {
  confidence: number // 0-1 or 0-100
  reasoning?: string
  compact?: boolean
  confidenceBasis?: ConfidenceBasis
}

export function ConfidenceIndicator({ 
  confidence, 
  reasoning, 
  compact = false,
  confidenceBasis
}: ConfidenceIndicatorProps) {
  // Normalize confidence to 0-100
  const confidencePct = confidence > 1 ? confidence : confidence * 100
  
  // Determine level
  const level = 
    confidencePct >= 85 ? 'high' :
    confidencePct >= 60 ? 'medium' :
    'low'
  
  const config = {
    high: {
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      barColor: 'bg-green-500',
      label: 'High Confidence',
      description: 'Strong signals support this price'
    },
    medium: {
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      barColor: 'bg-yellow-500',
      label: 'Medium Confidence',
      description: 'Moderate evidence supports this price'
    },
    low: {
      icon: HelpCircle,
      color: 'red',
      bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      barColor: 'bg-red-500',
      label: 'Low Confidence',
      description: 'Limited data available - use caution'
    }
  }
  
  const current = config[level]
  const Icon = current.icon
  
  // Generate basis items based on confidence level
  const basisItems: string[] = []
  if (confidenceBasis) {
    const mlModels = confidenceBasis.ml_models || 4
    const compCount = confidenceBasis.competitor_count || 0
    const sales30d = confidenceBasis.sales_30d || 0
    const marginPct = confidenceBasis.margin_pct
    
    // Always show ML models if available
    if (mlModels > 0) {
      basisItems.push(`✅ ${mlModels} ML-Modelle (XGBoost Ensemble)`)
    }
    
    // Always show competitor count (even if 0, but only for high confidence)
    if (level === 'high' || compCount > 0) {
      basisItems.push(`✅ ${compCount} Wettbewerber analysiert`)
    }
    
    // Always show sales if available
    if (sales30d > 0) {
      basisItems.push(`✅ ${sales30d} Verkäufe (30 Tage)`)
    }
    
    // Show margin if stable
    if (marginPct !== undefined && marginPct !== null && confidenceBasis.margin_stable) {
      basisItems.push(`✅ Margin ${Math.round(marginPct)}% stabil`)
    }
  }
  
  // Compact version (for header badge)
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${current.bgColor} ${current.borderColor}`}>
        <Icon className={`w-4 h-4 ${current.textColor}`} />
        <span className={`text-sm font-semibold ${current.textColor}`}>
          {confidencePct.toFixed(0)}%
        </span>
      </div>
    )
  }
  
  // Full version
  return (
    <div className={`space-y-4 p-5 rounded-lg border-2 ${current.bgColor} ${current.borderColor}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bold ${current.textColor} mb-1`}>
            Unsere KI ist zu {confidencePct.toFixed(0)}% sicher
          </h3>
          <p className="text-sm text-gray-600">
            Basierend auf {confidenceBasis?.ml_models || 4} ML-Modellen + Marktanalyse
          </p>
        </div>
        <Icon className={`w-8 h-8 ${current.textColor}`} />
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${current.barColor} transition-all duration-500 ease-out`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        
        {/* Threshold markers */}
        <div className="absolute top-0 left-[60%] w-px h-3 bg-gray-400 opacity-30" />
        <div className="absolute top-0 left-[85%] w-px h-3 bg-gray-400 opacity-30" />
      </div>
      
      {/* Basis Items */}
      {basisItems.length > 0 && (
        <ul className="space-y-2">
          {basisItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Fallback if no basis data */}
      {basisItems.length === 0 && (
        <p className="text-sm text-gray-600">
          {current.description}
        </p>
      )}
      
    </div>
  )
}






