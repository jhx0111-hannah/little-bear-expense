-- 添加自定义货币支持
-- 在 Supabase SQL Editor 中执行

-- 1. profiles 增加 custom_currencies 字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_currencies TEXT[] DEFAULT '{}';

-- 2. 放开 assets 和 expenses 的币种限制
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_currency_check;
ALTER TABLE assets ADD CONSTRAINT assets_currency_check CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_currency_check;
ALTER TABLE expenses ADD CONSTRAINT expenses_currency_check CHECK (currency ~ '^[A-Z]{3}$');
