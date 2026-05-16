# 小熊记账 — 数据库表结构（Supabase PostgreSQL）

## 表关系图

```
auth.users (Supabase内置)
    │
    └── profiles (1:1)
            │
            ├── categories (1:N)
            ├── assets (1:N)
            └── expenses (1:N)
                    ├── category_id → categories
                    └── asset_id → assets

exchange_rates (独立，所有人共享)
```

## 表定义

### profiles（用户资料）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | 关联 auth.users.id |
| display_name | TEXT | 显示昵称，默认"小熊用户" |
| base_currency | TEXT | 默认货币，'CNY' 或 'EUR' |
| monthly_budget | DECIMAL(12,2) | 月预算（可选） |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### categories（分类）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → profiles | 所属用户 |
| name | TEXT | 分类名，如"餐饮" |
| icon | TEXT | emoji图标，如"🍜" |
| color | TEXT | 莫兰迪色hex |
| type | TEXT | 'expense' 或 'income' |
| sort_order | INTEGER | 排序 |
| created_at | TIMESTAMPTZ | |

### assets（账户）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → profiles | 所属用户 |
| name | TEXT | 账户名，如"ING" |
| type | TEXT | 'bank'/'cash'/'alipay'/'wechat'/'other' |
| currency | TEXT | 'CNY' 或 'EUR' |
| balance | DECIMAL(12,2) | 当前余额 |
| icon | TEXT | emoji图标 |
| color | TEXT | 莫兰迪色hex |
| is_active | BOOLEAN | 是否启用 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### expenses（流水）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → profiles | 所属用户 |
| category_id | UUID FK → categories | 分类 |
| asset_id | UUID FK → assets | 扣款账户 |
| amount | DECIMAL(12,2) | 金额（>0） |
| currency | TEXT | 'CNY' 或 'EUR' |
| type | TEXT | 'expense' 或 'income' |
| description | TEXT | 备注（可选） |
| merchant | TEXT | 商户名（可选） |
| expense_date | DATE | 日期 |
| screenshot_url | TEXT | 截图URL（可选） |
| ai_recognized | BOOLEAN | 是否AI识别 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### exchange_rates（汇率缓存）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID PK | |
| from_currency | TEXT | 源币种 |
| to_currency | TEXT | 目标币种 |
| rate | DECIMAL(14,6) | 汇率 |
| fetched_at | TIMESTAMPTZ | 获取时间 |

## 默认分类数据

### 支出分类
| name | icon | color |
|------|------|-------|
| 餐饮 | 🍜 | #c4a8a8 |
| 交通 | 🚌 | #b5a9b0 |
| 购物 | 🛒 | #a8b5c4 |
| 娱乐 | 🎮 | #b5c4b1 |
| 学习 | 📚 | #d4c9b8 |
| 医疗 | 🏥 | #c4a8a8 |
| 住房 | 🏠 | #b5a9b0 |
| 其他 | 📦 | #a3b5a6 |

### 收入分类
| name | icon | color |
|------|------|-------|
| 工资 | 💰 | #a3b5a6 |
| 兼职 | 💵 | #b5c4b1 |
| 红包 | 🧧 | #c4a8a8 |
| 其他收入 | 📥 | #b5a9b0 |

## 常见银行预设（前端）

| 名称 | 类型 | 推荐币种 |
|------|------|---------|
| ING | bank | EUR |
| Revolut | bank | EUR |
| Deutsche Bank | bank | EUR |
| 支付宝 | alipay | CNY |
| 微信支付 | wechat | CNY |
| 招商银行 | bank | CNY |
| 工商银行 | bank | CNY |
| 中国银行 | bank | CNY/ EUR |
| 现金 | cash | CNY/EUR |

## RLS策略

所有用户数据表启用行级安全（RLS），只允许用户访问自己的数据：
- profiles: `auth.uid() = id`
- categories: `auth.uid() = user_id`
- assets: `auth.uid() = user_id`
- expenses: `auth.uid() = user_id`
- exchange_rates: 公开读取
