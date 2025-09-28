import React, { useState } from 'react'
import { useMemEchoClient, useSearchMemories, useCreateMemory } from 'memecho-sdk'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [newMemory, setNewMemory] = useState('')
  
  const client = useMemEchoClient(apiKey)
  const { memories, loading: searchLoading, searchMemories } = useSearchMemories(client)
  const { createMemory, loading: createLoading } = useCreateMemory(client)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMemories({ query: searchQuery, limit: 10 })
    }
  }

  const handleCreateMemory = async () => {
    if (newMemory.trim()) {
      const result = await createMemory({
        content: newMemory,
        metadata: { source: 'react-example' }
      })
      if (result) {
        setNewMemory('')
        alert('记忆创建成功！')
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MemEcho SDK React 示例</h1>
      </header>

      <main className="app-main">
        <div className="config-section">
          <h2>配置</h2>
          <input
            type="password"
            placeholder="输入你的 API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-key-input"
          />
        </div>

        <div className="create-section">
          <h2>创建记忆</h2>
          <div className="create-form">
            <textarea
              placeholder="输入记忆内容..."
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              className="memory-input"
            />
            <button
              onClick={handleCreateMemory}
              disabled={!newMemory.trim() || createLoading}
              className="create-button"
            >
              {createLoading ? '创建中...' : '创建记忆'}
            </button>
          </div>
        </div>

        <div className="search-section">
          <h2>搜索记忆</h2>
          <div className="search-form">
            <input
              type="text"
              placeholder="输入搜索关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || searchLoading}
              className="search-button"
            >
              {searchLoading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </div>

        <div className="results-section">
          <h2>搜索结果</h2>
          {memories.length > 0 ? (
            <div className="memories-list">
              {memories.map((memory) => (
                <div key={memory.id} className="memory-item">
                  <div className="memory-content">{memory.content}</div>
                  <div className="memory-meta">
                    <span className="memory-date">
                      {new Date(memory.createdAt).toLocaleString()}
                    </span>
                    {memory.metadata?.tags && (
                      <div className="memory-tags">
                        {memory.metadata.tags.map((tag: string, index: number) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">暂无搜索结果</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
