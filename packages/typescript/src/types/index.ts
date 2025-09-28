// MemEcho API 类型定义

export interface MemEchoConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

export interface MemEchoResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Memory {
  id: string
  content: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CreateMemoryRequest {
  content: string
  metadata?: Record<string, any>
}

export interface UpdateMemoryRequest {
  content?: string
  metadata?: Record<string, any>
}

export interface SearchMemoryRequest {
  query: string
  limit?: number
  offset?: number
}

export interface SearchMemoryResponse {
  memories: Memory[]
  total: number
  hasMore: boolean
}
