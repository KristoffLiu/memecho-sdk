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

  // 获取原始 API 实例（用于高级用法）
  getApi() {
    return this.api
  }

  // 获取配置实例
  getConfiguration() {
    return this.configuration
  }
}
