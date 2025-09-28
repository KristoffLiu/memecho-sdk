# MemEcho TypeScript/JavaScript SDK

MemEcho 的 TypeScript/JavaScript SDK，支持 Web 和 Node.js 环境。

## 安装

```bash
npm install memecho-sdk
# 或
pnpm add memecho-sdk
# 或
yarn add memecho-sdk
```

## 快速开始

### 基础使用

```typescript
import { MemEchoClient } from 'memecho-sdk'

// 创建客户端
const client = new MemEchoClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.memecho.com' // 可选
})

// 创建记忆
const memory = await client.createMemory({
  content: '这是一个重要的记忆',
  metadata: { tags: ['重要', '工作'] }
})

// 搜索记忆
const results = await client.searchMemories({
  query: '重要',
  limit: 10
})
```

### React 使用

```typescript
import { useMemEchoClient, useMemory, useSearchMemories } from 'memecho-sdk'

function MyComponent() {
  const client = useMemEchoClient('your-api-key')
  const { memory, loading, error } = useMemory('memory-id', client)
  const { memories, searchMemories } = useSearchMemories(client)

  const handleSearch = () => {
    searchMemories({ query: '搜索关键词', limit: 10 })
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      <h1>我的记忆</h1>
      {memories.map(memory => (
        <div key={memory.id}>{memory.content}</div>
      ))}
    </div>
  )
}
```

## API 参考

### MemEchoClient

主要的客户端类，提供所有 API 方法。

#### 构造函数

```typescript
new MemEchoClient(config: MemEchoConfig)
```

#### 方法

- `createMemory(request: CreateMemoryRequest): Promise<MemEchoResponse<Memory>>`
- `getMemory(id: string): Promise<MemEchoResponse<Memory>>`
- `updateMemory(id: string, request: UpdateMemoryRequest): Promise<MemEchoResponse<Memory>>`
- `deleteMemory(id: string): Promise<MemEchoResponse<void>>`
- `searchMemories(request: SearchMemoryRequest): Promise<MemEchoResponse<SearchMemoryResponse>>`
- `listMemories(limit?: number, offset?: number): Promise<MemEchoResponse<Memory[]>>`

### React Hooks

#### useMemEchoClient

创建 MemEcho 客户端实例。

```typescript
const client = useMemEchoClient(apiKey: string, baseUrl?: string)
```

#### useMemory

获取单个记忆。

```typescript
const { memory, loading, error, refetch } = useMemory(id: string, client: MemEchoClient)
```

#### useCreateMemory

创建记忆。

```typescript
const { createMemory, loading, error } = useCreateMemory(client: MemEchoClient)
```

#### useSearchMemories

搜索记忆。

```typescript
const { memories, total, hasMore, loading, error, searchMemories } = useSearchMemories(client: MemEchoClient)
```

#### useMemoriesList

获取记忆列表。

```typescript
const { memories, loading, error, hasMore, loadMore, refresh } = useMemoriesList(client: MemEchoClient, limit?: number)
```

## 类型定义

### MemEchoConfig

```typescript
interface MemEchoConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}
```

### Memory

```typescript
interface Memory {
  id: string
  content: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

### MemEchoResponse

```typescript
interface MemEchoResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

## 开发

### 构建

```bash
pnpm run build
```

### 开发模式

```bash
pnpm run dev
```

### 类型检查

```bash
pnpm run type-check
```

### 代码检查

```bash
pnpm run lint
```

## 许可证

MIT License
