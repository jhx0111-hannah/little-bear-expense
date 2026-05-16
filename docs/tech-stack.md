# 小熊记账 — 技术栈说明

## 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具，开发服务器 |
| react-router-dom | 6.x | 路由管理 |
| recharts | 2.x | 图表库（饼状图、柱状图） |
| vite-plugin-pwa | 0.x | PWA支持，Service Worker生成 |
| Web Speech API | 浏览器内置 | 语音识别（中文），无需安装 |

## 后端（Supabase）

| 服务 | 用途 |
|------|------|
| Supabase Auth | 用户认证（邮箱+密码） |
| Supabase PostgreSQL | 数据库 |
| Supabase Storage | 截图图片存储 |
| Supabase Edge Functions | 服务端AI接口调用 |

## AI服务

| 服务 | 用途 |
|------|------|
| Claude API (Anthropic) | 截图识别：提取金额/货币/商户/分类；语音文本解析：从自然语言提取结构化账单 |

## 汇率API

| 服务 | 说明 |
|------|------|
| open.er-api.com | 免费汇率API，无需注册，每日更新 |

## 部署

| 平台 | 说明 |
|------|------|
| Vercel | 前端托管（免费），自动HTTPS |
| Supabase | 后端托管（免费额度500MB数据库） |

## 状态管理

- React Context + useReducer（认证状态、记账数据）
- 不使用Redux/Zustand，保持轻量

## 样式方案

- CSS Variables（莫兰迪色系设计Token）
- CSS Modules（组件级样式隔离）
- 不使用Tailwind（更精确控制莫兰迪风格）

## 环境变量

| 变量名 | 说明 |
|--------|------|
| VITE_SUPABASE_URL | Supabase项目URL |
| VITE_SUPABASE_ANON_KEY | Supabase匿名密钥 |
| ANTHROPIC_API_KEY | Claude API密钥（仅Edge Function使用） |
