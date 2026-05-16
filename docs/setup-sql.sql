-- ============================================
-- 小熊记账 — Supabase 数据库初始化 SQL
-- 请在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 1. 用户资料表（扩展 auth.users）
CREATE TABLE IF NOT EXISTS profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name  TEXT NOT NULL DEFAULT '小熊用户',
    base_currency TEXT NOT NULL DEFAULT 'CNY' CHECK (base_currency IN ('CNY','EUR')),
    avatar_url    TEXT,
    monthly_budget DECIMAL(12,2),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 分类表
CREATE TABLE IF NOT EXISTS categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    icon        TEXT NOT NULL DEFAULT '📦',
    color       TEXT NOT NULL DEFAULT '#a3b5a6',
    type        TEXT NOT NULL CHECK (type IN ('expense','income')),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, name, type)
);

-- 3. 账户表
CREATE TABLE IF NOT EXISTS assets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('bank','cash','alipay','wechat','other')),
    currency    TEXT NOT NULL CHECK (currency IN ('CNY','EUR')),
    balance     DECIMAL(12,2) NOT NULL DEFAULT 0,
    icon        TEXT NOT NULL DEFAULT '🏦',
    color       TEXT NOT NULL DEFAULT '#b5a9b0',
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 流水表
CREATE TABLE IF NOT EXISTS expenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    asset_id        UUID REFERENCES assets(id) ON DELETE SET NULL,
    amount          DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency        TEXT NOT NULL CHECK (currency IN ('CNY','EUR')),
    type            TEXT NOT NULL CHECK (type IN ('expense','income')),
    description     TEXT,
    merchant        TEXT,
    expense_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    screenshot_url  TEXT,
    ai_recognized   BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date DESC);

-- 5. 汇率缓存表
CREATE TABLE IF NOT EXISTS exchange_rates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency   TEXT NOT NULL,
    to_currency     TEXT NOT NULL,
    rate            DECIMAL(14,6) NOT NULL,
    fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(from_currency, to_currency)
);

-- ============================================
-- 触发器：新用户自动创建 profile
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, base_currency)
  VALUES (NEW.id, '小熊用户', 'CNY');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Row Level Security（RLS）
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "读自己的资料" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "改自己的资料" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "创建自己的资料" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "管理自己的分类" ON categories FOR ALL USING (auth.uid() = user_id);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "管理自己的账户" ON assets FOR ALL USING (auth.uid() = user_id);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "管理自己的流水" ON expenses FOR ALL USING (auth.uid() = user_id);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "公开读取汇率" ON exchange_rates FOR SELECT USING (true);
