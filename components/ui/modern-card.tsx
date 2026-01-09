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
    default: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl",
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in ${
        variants[variant]
      } ${hoverable ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

