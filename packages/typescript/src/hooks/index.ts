import { useState, useEffect, useCallback } from 'react'
import { MemEchoClient } from '../client'
import { QueryData, QueryResult, MemoryLibraryInformation, MemoryLibraryList, AppendData, AppendResult, HealthResponse } from '../types'

// 创建 MemEcho 客户端的 Hook
export function useMemEchoClient(apiKey: string, baseUrl?: string) {
  const [client] = useState(() => new MemEchoClient({ apiKey, baseUrl }))
  return client
}

// 健康检查 Hook
export function useHealthCheck(client: MemEchoClient) {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.healthCheck()
      setHealth(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return { health, loading, error, refetch: checkHealth }
}

// 内存查询 Hook
export function useMemoryQuery(client: MemEchoClient) {
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryMemory = useCallback(async (queryData: QueryData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.queryMemory(queryData)
      setResult(response)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [client])

  return { result, loading, error, queryMemory }
}

// 内存库列表 Hook
export function useMemoryLibraries(client: MemEchoClient) {
  const [libraries, setLibraries] = useState<MemoryLibraryList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLibraries = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.listMemoryLibraries()
      setLibraries(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchLibraries()
  }, [fetchLibraries])

  return { libraries, loading, error, refetch: fetchLibraries }
}

// 创建内存库 Hook
export function useCreateMemoryLibrary(client: MemEchoClient) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLibrary = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.createMemoryLibrary(data)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [client])

  return { createLibrary, loading, error }
}

// 追加数据到内存库 Hook
export function useAppendToMemoryLibrary(client: MemEchoClient) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appendData = useCallback(async (data: AppendData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.appendToMemoryLibrary(data)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [client])

  return { appendData, loading, error }
}
