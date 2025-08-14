import { apiClient } from './apiConfig'
import type { ApiResponse } from './apiConfig'

// Tipos para el sistema de pagos
export interface CreatePaymentRequest {
  wallpaperNumbers: number[]
  buyerEmail: string
  buyerName: string
  buyerIdentificationNumber: string
  buyerContactNumber: string
  amount: number
}

export interface Purchase {
  id: string
  wallpaperNumbers: number[]
  buyerEmail: string
  buyerName: string
  buyerContactNumber: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface PaymentResponse {
  message: string
  purchase: {
    id: string
    wallpaperNumbers: number[]
    amount: number
    currency: string
    status: string
  }
  payment: {
    preferenceId: string
    paymentUrl: string
    externalReference: string
  }
}

export interface GetPurchasesResponse {
  email: string
  count: number
  purchases: Purchase[]
}

export class PaymentService {
  /**
   * Crear un nuevo pago para un wallpaper
   */
  async createPayment(request: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await apiClient.post<PaymentResponse>('/payment/create', request)
      return response
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  /**
   * Obtener todas las compras de un usuario por email
   */
  async getPurchasesByEmail(email: string): Promise<ApiResponse<GetPurchasesResponse>> {
    try {
      const response = await apiClient.get<GetPurchasesResponse>(
        `/purchases?email=${encodeURIComponent(email)}`,
      )
      return response
    } catch (error) {
      console.error('Error getting purchases:', error)
      throw error
    }
  }

  /**
   * Obtener todas las compras (solo para administradores)
   */
  async getAllPurchases(): Promise<ApiResponse<GetPurchasesResponse>> {
    try {
      const response = await apiClient.get<GetPurchasesResponse>('/purchases')
      return response
    } catch (error) {
      console.error('Error getting all purchases:', error)
      throw error
    }
  }

  /**
   * Verificar si un usuario ya compró un wallpaper específico
   */
  async hasUserPurchasedWallpaper(email: string, wallpaperNumber: number): Promise<boolean> {
    try {
      const response = await this.getPurchasesByEmail(email)
      if (response.success && response.data) {
        return response.data.purchases.some(
          (purchase) =>
            purchase.wallpaperNumbers.includes(wallpaperNumber) &&
            (purchase.status === 'APPROVED' || purchase.status === 'PENDING'),
        )
      }
      return false
    } catch (error) {
      console.error('Error checking wallpaper purchase:', error)
      return false
    }
  }
}

// Instancia singleton del servicio de pagos
export const paymentService = new PaymentService()
