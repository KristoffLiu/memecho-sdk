// MemEcho SDK 配置类型
export interface MemEchoConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

// 重新导出生成的模型类型
export * from '../lib/api/generated'

// 为了向后兼容，保留一些常用的类型别名
export type {
  QueryData,
  QueryResult,
  MemoryLibraryInformation,
  MemoryLibraryList,
  AppendData,
  AppendResult,
  HealthResponse,
  Message,
  OutboundMessage,
  Content
} from '../lib/api/generated'
