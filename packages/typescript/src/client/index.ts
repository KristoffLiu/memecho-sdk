import { Configuration, DefaultApi } from '../lib/api/generated'
import { MemEchoConfig } from '../types'

export class MemEchoClient {
  private api: DefaultApi
  private configuration: Configuration

  constructor(config: MemEchoConfig) {
    this.configuration = new Configuration({
      basePath: config.baseUrl || 'https://api.memecho.com',
      apiKey: config.apiKey,
      timeout: config.timeout || 10000,
    })
    this.api = new DefaultApi(this.configuration)
  }

  // 健康检查
  async healthCheck() {
    return this.api.healthCheckHealthGet()
  }

  // 内存查询
  async queryMemory(queryData: any) {
    return this.api.memoryQueryEndpointApiV1MemoryQueryPost(queryData)
  }

  // 获取内存库信息
  async getMemoryLibrary(request: any) {
    return this.api.getMemoryLibraryApiV1MemoryLibraryGet(request)
  }

  // 创建内存库
  async createMemoryLibrary(data: any) {
    return this.api.createMemoryLibraryApiV1MemoryLibraryPost(data)
  }

  // 列出内存库
  async listMemoryLibraries() {
    return this.api.listMemoryLibrariesApiV1MemoryLibraryListGet()
  }

  // 追加数据到内存库
  async appendToMemoryLibrary(data: any) {
    return this.api.appendToMemoryLibraryApiV1MemoryLibraryAppendPost(data)
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
