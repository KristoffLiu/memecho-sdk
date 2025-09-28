import React, { useState } from 'react'
import { useMemEchoClient, useMemoryQuery, useMemoryLibraries, useCreateMemoryLibrary, useAppendToMemoryLibrary } from 'memecho-sdk'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [queryText, setQueryText] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [appendText, setAppendText] = useState('')
  
  const client = useMemEchoClient(apiKey)
  const { result, loading: queryLoading, queryMemory } = useMemoryQuery(client)
  const { libraries, loading: librariesLoading, refetch: refetchLibraries } = useMemoryLibraries(client)
  const { createLibrary, loading: createLoading } = useCreateMemoryLibrary(client)
  const { appendData, loading: appendLoading } = useAppendToMemoryLibrary(client)

  const handleQuery = () => {
    if (queryText.trim()) {
      queryMemory({
        query: queryText,
        library_id: libraries?.libraries?.[0]?.id || ''
      })
    }
  }

  const handleCreateLibrary = async () => {
    if (libraryName.trim()) {
      const result = await createLibrary({
        name: libraryName,
        description: 'Created from React example'
      })
      if (result) {
        setLibraryName('')
        alert('内存库创建成功！')
        refetchLibraries()
      }
    }
  }

  const handleAppendData = async () => {
    if (appendText.trim() && libraries?.libraries?.[0]?.id) {
      const result = await appendData({
        library_id: libraries.libraries[0].id,
        content: appendText
      })
      if (result) {
        setAppendText('')
        alert('数据追加成功！')
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
          <h2>创建内存库</h2>
          <div className="create-form">
            <input
              type="text"
              placeholder="输入内存库名称..."
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              className="library-input"
            />
            <button
              onClick={handleCreateLibrary}
              disabled={!libraryName.trim() || createLoading}
              className="create-button"
            >
              {createLoading ? '创建中...' : '创建内存库'}
            </button>
          </div>
        </div>

        <div className="append-section">
          <h2>追加数据</h2>
          <div className="append-form">
            <textarea
              placeholder="输入要追加的内容..."
              value={appendText}
              onChange={(e) => setAppendText(e.target.value)}
              className="append-input"
            />
            <button
              onClick={handleAppendData}
              disabled={!appendText.trim() || appendLoading || !libraries?.libraries?.[0]?.id}
              className="append-button"
            >
              {appendLoading ? '追加中...' : '追加数据'}
            </button>
          </div>
        </div>

        <div className="query-section">
          <h2>查询内存</h2>
          <div className="query-form">
            <input
              type="text"
              placeholder="输入查询内容..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="query-input"
            />
            <button
              onClick={handleQuery}
              disabled={!queryText.trim() || queryLoading || !libraries?.libraries?.[0]?.id}
              className="query-button"
            >
              {queryLoading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>

        <div className="libraries-section">
          <h2>内存库列表</h2>
          {librariesLoading ? (
            <p>加载中...</p>
          ) : libraries?.libraries?.length > 0 ? (
            <div className="libraries-list">
              {libraries.libraries.map((library) => (
                <div key={library.id} className="library-item">
                  <div className="library-name">{library.name}</div>
                  <div className="library-description">{library.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">暂无内存库</p>
          )}
        </div>

        <div className="results-section">
          <h2>查询结果</h2>
          {result ? (
            <div className="query-result">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          ) : (
            <p className="no-results">暂无查询结果</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
