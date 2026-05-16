-- 创建截图存储桶（在 Supabase SQL Editor 执行）

-- 注意：Storage bucket 创建需要通过 Supabase Dashboard
-- 路径：Storage → New Bucket → 名称填 "screenshots" → 勾选 "Public bucket"

-- 然后执行以下 RLS 策略（在 SQL Editor）：
CREATE POLICY "认证用户可上传截图"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'screenshots');

CREATE POLICY "公开读取截图"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots');
