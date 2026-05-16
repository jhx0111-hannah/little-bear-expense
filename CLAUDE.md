# CLAUDE.md — 小熊记账 项目工作指引

## 项目简介

这是一个面向在欧洲留学的中国学生的个人记账App（PWA网页应用），名为"小熊记账"。
核心特点：多币种（CNY/EUR）、莫兰迪色系可爱风格、AI截图识别记账。

## 标准文件索引

开发时请严格遵守以下标准文件：

| 文件 | 内容 | 何时查阅 |
|------|------|---------|
| [docs/requirements.md](docs/requirements.md) | 项目需求文档（功能+非功能需求） | 不确定某个功能该怎么做时 |
| [docs/tech-stack.md](docs/tech-stack.md) | 技术栈说明（依赖、环境变量） | 添加依赖或配置时 |
| [docs/design-spec.md](docs/design-spec.md) | 设计规范（色板、字体、间距、动画） | 写任何CSS/样式时 |
| [docs/database-schema.md](docs/database-schema.md) | 数据库表结构（表、字段、RLS） | 修改数据库或写API时 |
| [docs/implementation-plan.md](docs/implementation-plan.md) | 实施步骤（7个阶段清单） | 规划下一步做什么时 |

## 开发日志

每次开发完成后，在 [dev-logs/](dev-logs/) 下创建当天日期的日志文件（格式：`YYYY-MM-DD.md`），记录：
- 今日完成了什么
- 待办事项
- 遇到的问题和解决方案

已有的日志文件：
- [dev-logs/2026-05-16.md](dev-logs/2026-05-16.md)

## 工作原则

1. **小步推进**：每次只完成一个阶段或一个功能点，验证通过后再继续
2. **先骨架后血肉**：先让页面跑通，再加样式细节和动画
3. **移动端优先**：所有UI以375px宽屏幕为基准设计
4. **参考标准文件**：写代码前先查阅对应的标准文档，不要凭记忆
5. **保持风格一致**：颜色、字体、间距严格使用 design-spec.md 中定义的Token
6. **及时记录**：每完成一个阶段更新 dev-log

## 当前状态

- [x] 文档体系搭建完成（含语音记账需求）
- [x] 阶段1：项目骨架 ✅ TypeScript检查通过 + Vite构建成功
- [ ] 阶段2：登录+数据库（下一步）
- [ ] 阶段3：核心记账功能
- [ ] 阶段4：资产+汇率+账户管理
- [ ] 阶段5：统计图表页
- [ ] 阶段6：AI智能输入（截图识别 + 语音记账）
- [ ] 阶段7：PWA+打磨

## 核心功能一览

| 功能 | 说明 |
|------|------|
| 手动记账 | 填写表单（金额/分类/日期/账户） |
| 截图记账 | 上传支付截图 → AI识别填表 |
| **语音记账** | **按住说话 → AI解析 → 确认草稿 → 自动记账** |
| 多币种 | CNY + EUR，实时汇率换算 |
| 账户管理 | 添加银行/支付账户，余额自动扣减 |
| 统计分析 | 饼状图/柱状图/月度每日明细 |
| PWA | 可安装到手机桌面，离线可用 |

## 技术栈速查

```
前端：React 18 + TypeScript + Vite
路由：react-router-dom v6
图表：recharts
语音：Web Speech API（浏览器内置，中文识别）
后端：Supabase (Auth + PostgreSQL + Storage + Edge Functions)
AI：Claude API（截图识别 + 语音文本解析）
部署：Vercel
样式：CSS Variables + CSS Modules（莫兰迪色系）
```
