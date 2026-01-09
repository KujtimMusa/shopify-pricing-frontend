"use client"

import * as React from "react"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient"
  hoverable?: boolean
  children: React.ReactNode
}

export function ModernCard({
  variant = "default",
  hoverable = true,
  className = "",
  children,
  ...props
}: ModernCardProps) {
  const variants = {
    default: "border shadow-lg",
    glass: "backdrop-blur-xl border shadow-xl",
    gradient: "border-0 shadow-xl",
  }
  
  const variantStyles = {
    default: { backgroundColor: '#1e293b', borderColor: '#475569' },
    glass: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderColor: 'rgba(71, 85, 105, 0.3)' },
    gradient: { background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' },
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-300 animate-fade-in ${
        variants[variant]
      } ${hoverable ? "hover:shadow-2xl cursor-pointer" : ""} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </div>
  )
}

