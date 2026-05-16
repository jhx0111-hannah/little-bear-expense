import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { AIRecognitionResult } from '../types/expense';

type Stage = 'idle' | 'uploading' | 'recognizing' | 'done' | 'error';

export function useScreenshotAI() {
  const [stage, setStage] = useState<Stage>('idle');
  const [result, setResult] = useState<AIRecognitionResult | null>(null);
  const [error, setError] = useState('');

  const recognize = useCallback(async (file: File): Promise<AIRecognitionResult | null> => {
    setStage('uploading');
    setError('');

    try {
      // 1. 上传到 Supabase Storage
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/temp_${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('screenshots')
        .upload(path, file, { upsert: true });

      if (uploadErr) throw new Error(`上传失败：${uploadErr.message}`);

      // 2. 获取公开URL
      const { data: urlData } = supabase.storage
        .from('screenshots')
        .getPublicUrl(path);

      const imageUrl = urlData.publicUrl;

      // 3. 调用 Edge Function 进行 AI 识别
      setStage('recognizing');

      const { data: fnData, error: fnErr } = await supabase.functions.invoke('ai-recognize', {
        body: { imageUrl, mode: 'screenshot' },
      });

      if (fnErr) throw new Error(`AI识别失败：${fnErr.message}`);
      if (fnData?.error) throw new Error(fnData.error);

      const recognition: AIRecognitionResult = {
        amount: fnData.amount || null,
        currency: fnData.currency || null,
        merchant: fnData.merchant || null,
        category: fnData.category || null,
        date: fnData.date || null,
        description: fnData.description || null,
        confidence: fnData.confidence || 0.8,
      };

      setResult(recognition);
      setStage('done');
      return recognition;
    } catch (err: any) {
      setError(err.message);
      setStage('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStage('idle');
    setResult(null);
    setError('');
  }, []);

  return { stage, result, error, recognize, reset };
}
