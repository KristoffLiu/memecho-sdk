import { useState, useEffect, useCallback } from 'react'
import { MemEchoClient } from '../client'
import { Memory, CreateMemoryRequest, UpdateMemoryRequest, SearchMemoryRequest, SearchMemoryResponse } from '../types'

// 创建 MemEcho 客户端的 Hook
export function useMemEchoClient(apiKey: string, baseUrl?: string) {
  const [client] = useState(() => new MemEchoClient({ apiKey, baseUrl }))
  return client
}

// 获取单个记忆的 Hook
export function useMemory(id: string, client: MemEchoClient) {
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMemory = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.getMemory(id)
      if (response.success && response.data) {
        setMemory(response.data)
      } else {
        setError(response.error || 'Failed to fetch memory')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [id, client])

  useEffect(() => {
    fetchMemory()
  }, [fetchMemory])

  return { memory, loading, error, refetch: fetchMemory }
}

// 创建记忆的 Hook
export function useCreateMemory(client: MemEchoClient) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMemory = useCallback(async (request: CreateMemoryRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.createMemory(request)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || 'Failed to create memory')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [client])

  return { createMemory, loading, error }
}

// 搜索记忆的 Hook
export function useSearchMemories(client: MemEchoClient) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchMemories = useCallback(async (request: SearchMemoryRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.searchMemories(request)
      if (response.success && response.data) {
        setMemories(response.data.memories)
        setTotal(response.data.total)
        setHasMore(response.data.hasMore)
      } else {
        setError(response.error || 'Failed to search memories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [client])

  return { memories, total, hasMore, loading, error, searchMemories }
}

// 记忆列表的 Hook
export function useMemoriesList(client: MemEchoClient, limit = 10) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchMemories = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.listMemories(limit, currentOffset)
      if (response.success && response.data) {
        if (reset) {
          setMemories(response.data)
          setOffset(limit)
        } else {
          setMemories(prev => [...prev, ...response.data!])
          setOffset(prev => prev + limit)
        }
        setHasMore(response.data.length === limit)
      } else {
        setError(response.error || 'Failed to fetch memories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [client, limit, offset])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMemories(false)
    }
  }, [loading, hasMore, fetchMemories])

  const refresh = useCallback(() => {
    setOffset(0)
    fetchMemories(true)
  }, [fetchMemories])

  useEffect(() => {
    fetchMemories(true)
  }, [client, limit])

  return { memories, loading, error, hasMore, loadMore, refresh }
}
