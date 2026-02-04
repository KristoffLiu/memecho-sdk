import { Configuration, DefaultApi } from '../lib/api/generated'
import { MemEchoConfig } from '../types'

export class MemEchoClient {
  private api: DefaultApi
  private configuration: Configuration

  constructor(config: MemEchoConfig) {
    this.configuration = new Configuration({
      basePath: config.baseUrl || 'https://api.memecho.com',
      apiKey: config.apiKey,
      // 添加默认的认证头
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    this.api = new DefaultApi(this.configuration)

    // 重写 API 方法以确保认证头正确应用
    this.overrideApiMethods()
  }

  private overrideApiMethods() {
    const api = this.api as any
    const originalRequest = api.request?.bind(api)

    if (originalRequest) {
      api.request = async (context: any, initOverrides?: any) => {
        // 确保有 headers 对象
        if (!context.headers) {
          context.headers = {}
        }

        // 强制添加认证头
        const apiKey = this.configuration.apiKey
        const keyValue = typeof apiKey === 'function' ? apiKey('') : apiKey || ''
        context.headers['Authorization'] = `Bearer ${keyValue}`
        context.headers['Content-Type'] = 'application/json'

        return originalRequest(context, initOverrides)
      }
    }
  }

  // 健康检查
  async healthCheck() {
    return this.api.healthCheckHealthGet()
  }

  // 内存查询
  async queryMemory(queryData: any) {
    console.log('[SDK Debug] queryMemory 接收参数:', queryData)
    console.log('[SDK Debug] 包装后参数:', { queryData })
    return this.api.memoryQueryEndpointApiV1MemoryQueryPost({ queryData })
  }

  // 获取内存库信息
  async getMemoryLibrary(request: any) {
    return this.api.getMemoryLibraryEndpointApiV1MemoryGetPost(request)
  }

  // 创建内存库
  async createMemoryLibrary(data: any) {
    return this.api.createMemoryLibraryEndpointApiV1MemoryCreatePost({ memoryLibraryCreationData: data })
  }

  // 列出内存库
  async listMemoryLibraries() {
    return this.api.listMemoryLibrariesEndpointApiV1MemoryListGet()
  }

  // 追加数据到内存库
  async appendToMemoryLibrary(data: any) {
    return this.api.appendAssistantMessageEndpointApiV1MemoryAppendAssistantMessagePost({ appendData: data })
  }

  // 导入文件到内存库 (SSE)
  async importFile(
    fileUrl: string,
    memoryLibId: string,
    onProgress?: (event: { type: string; stage?: string; progress?: number; message?: string; extra_data?: any; error?: string }) => void
  ): Promise<string> {
    return this._importFileInternal('/api/v1/memory/import_file', fileUrl, memoryLibId, onProgress)
  }

  // 快速导入文件到内存库 (SSE) - memecho服务方提供的高速通道
  async importFileFast(
    fileUrl: string,
    memoryLibId: string,
    onProgress?: (event: { type: string; stage?: string; progress?: number; message?: string; extra_data?: any; error?: string }) => void
  ): Promise<string> {
    return this._importFileInternal('/api/v1/memory/import_file_fast', fileUrl, memoryLibId, onProgress)
  }

  private async _importFileInternal(
    endpoint: string,
    fileUrl: string,
    memoryLibId: string,
    onProgress?: (event: { type: string; stage?: string; progress?: number; message?: string; extra_data?: any; error?: string }) => void
  ): Promise<string> {
    const api = this.api as any
    const response = await api.request({
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        file_url: fileUrl,
        memory_lib_id: memoryLibId
      }
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`File import failed: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('No response body for file import')
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalMessageId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const jsonStr = trimmed.substring(6).trim();
          if (!jsonStr) continue;

          const event = JSON.parse(jsonStr);
          onProgress?.(event);

          if (event.type === 'progress' && event.stage === 'completed') {
            if (event.extra_data && event.extra_data.message_id) {
              finalMessageId = event.extra_data.message_id;
            }
          }
          if (event.type === 'error') {
            throw new Error(event.error || 'Unknown Memoria Error');
          }
        } catch (e) {
          console.warn('[SDK] Parse SSE error:', e);
          if (e instanceof Error && e.message === 'Unknown Memoria Error') {
            throw e;
          }
        }
      }
    }
    return finalMessageId;
  }

  // 获取原始 API 实例（用于高级用法）
  getApi() {
    return this.api
  }

  // 获取配置实例
  getConfiguration() {
    return this.configuration
  }
}
