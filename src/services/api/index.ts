// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios
export * from './authService'
export * from './categoryService'
export * from './playerService'
export * from './teamService'
export * from './tournamentService'

// Exportar tipos comunes
export type { ApiResponse, ApiError } from './apiConfig'
export type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from '@/types/CategoryType'
