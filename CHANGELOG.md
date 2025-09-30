# Changelog

## [1.0.2] - 2024-01-XX

### Fixed
- **API Key 验证失败修复**: 修复了 "API Key验证失败: 400" 错误
  - 重写了 API 请求方法以确保认证头正确应用
  - 强制在所有请求中添加 `Authorization: Bearer {apiKey}` 头
  - 解决了 OpenAPI Generator 生成的代码没有自动应用 apiKey 的问题

### Technical Details
- 在 `MemEchoClient` 中添加了 `overrideApiMethods()` 方法
- 重写了 `api.request` 方法以确保认证头始终被正确设置
- 修复了生成的 API 代码中安全配置的问题

### Breaking Changes
- 无破坏性更改

### Migration Guide
- 无需任何代码更改
- 现有代码将自动受益于修复

## [1.0.1] - 2024-01-XX

### Fixed
- **认证问题修复**: 修复了 401 Unauthorized 错误
  - 在 `MemEchoClient` 构造函数中正确配置 Bearer 认证头
  - 添加了 `Authorization: Bearer {apiKey}` 和 `Content-Type: application/json` 头
  - 确保所有 API 请求都包含正确的认证信息

### Technical Details
- 修改了 `packages/typescript/src/client/index.ts` 中的 Configuration 设置
- 现在 SDK 会自动在所有请求中包含必要的认证头
- 与 MemEcho API 的 Python 示例保持一致

### Breaking Changes
- 无破坏性更改

### Migration Guide
- 无需任何代码更改
- 现有代码将自动受益于修复
