import { MemEchoConfig, MemEchoResponse, Memory, CreateMemoryRequest, UpdateMemoryRequest, SearchMemoryRequest, SearchMemoryResponse } from '../types'

export class MemEchoClient {
  private apiKey: string
  private baseUrl: string
  private timeout: number

  constructor(config: MemEchoConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.memecho.com'
    this.timeout = config.timeout || 10000
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<MemEchoResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async createMemory(request: CreateMemoryRequest): Promise<MemEchoResponse<Memory>> {
    return this.request<Memory>('/memories', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getMemory(id: string): Promise<MemEchoResponse<Memory>> {
    return this.request<Memory>(`/memories/${id}`)
  }

  async updateMemory(id: string, request: UpdateMemoryRequest): Promise<MemEchoResponse<Memory>> {
    return this.request<Memory>(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    })
  }

  async deleteMemory(id: string): Promise<MemEchoResponse<void>> {
    return this.request<void>(`/memories/${id}`, {
      method: 'DELETE',
    })
  }

  async searchMemories(request: SearchMemoryRequest): Promise<MemEchoResponse<SearchMemoryResponse>> {
    const params = new URLSearchParams({
      q: request.query,
      limit: request.limit?.toString() || '10',
      offset: request.offset?.toString() || '0',
    })

    return this.request<SearchMemoryResponse>(`/memories/search?${params}`)
  }

  async listMemories(limit = 10, offset = 0): Promise<MemEchoResponse<Memory[]>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    return this.request<Memory[]>(`/memories?${params}`)
  }
}
