/**
 * Shopify GraphQL Service
 * Frontend Service für Shopify GraphQL API Integration
 */

import { API_URL } from './api'

// ============================================
// TYPES
// ============================================

export interface ShopifyVariant {
  id: string
  price: number
  compare_at_price?: number | null
  sku?: string | null
  inventory_quantity: number
  title: string
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  status: string
  vendor?: string | null
  product_type?: string | null
  variants: ShopifyVariant[]
}

export interface ShopifyProductsResponse {
  products: ShopifyProduct[]
  page_info: {
    has_next_page: boolean
    end_cursor?: string | null
  }
  total: number
}

export interface ApplyPriceRequest {
  product_id: number
  recommended_price: number
  variant_id?: string
}

export interface ApplyPriceResponse {
  success: boolean
  new_price: number
  variant_id: string
  message?: string | null
}

export interface BulkUpdateRequest {
  updates: Array<{
    variant_id: string
    new_price: number
  }>
}

export interface BulkUpdateResponse {
  success: boolean
  results: Array<{
    variant_id: string
    success: boolean
    result?: any
    error?: string
  }>
  total: number
  successful: number
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Holt alle Produkte von Shopify via GraphQL
 */
export async function getShopifyProducts(
  shopId: number,
  first: number = 50
): Promise<ShopifyProductsResponse> {
  const response = await fetch(
    `${API_URL}/api/shopify/products?shop_id=${shopId}&first=${first}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Fehler beim Laden der Shopify Produkte')
  }

  return response.json()
}

/**
 * Wendet empfohlenen Preis auf Shopify an (via GraphQL)
 */
export async function applyRecommendedPrice(
  request: ApplyPriceRequest
): Promise<ApplyPriceResponse> {
  const response = await fetch(`${API_URL}/api/shopify/apply-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Fehler beim Anwenden des Preises')
  }

  return response.json()
}

/**
 * Aktualisiert mehrere Preise gleichzeitig
 */
export async function bulkUpdatePrices(
  shopId: number,
  request: BulkUpdateRequest
): Promise<BulkUpdateResponse> {
  const response = await fetch(
    `${API_URL}/api/shopify/bulk-update-prices?shop_id=${shopId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Fehler beim Bulk Update')
  }

  return response.json()
}

/**
 * Holt ein einzelnes Produkt von Shopify
 */
export async function getShopifyProduct(
  productId: string,
  shopId: number
): Promise<ShopifyProduct> {
  const response = await fetch(
    `${API_URL}/api/shopify/product/${productId}?shop_id=${shopId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Fehler beim Laden des Produkts')
  }

  return response.json()
}

