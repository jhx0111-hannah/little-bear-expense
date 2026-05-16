import { supabase } from '../../config/supabase';
import type { Asset } from '../../types/asset';

export async function fetchAssets(userId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function addAsset(userId: string, input: {
  name: string; type: string; currency: string; balance: number; icon: string; color: string;
}): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAsset(assetId: string, userId: string, input: Partial<{
  name: string; balance: number; is_active: boolean;
}>): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .update(input)
    .eq('id', assetId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAsset(assetId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .update({ is_active: false })
    .eq('id', assetId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deductBalance(assetId: string, userId: string, amount: number): Promise<void> {
  // 先读当前余额
  const { data: asset } = await supabase
    .from('assets')
    .select('balance')
    .eq('id', assetId)
    .eq('user_id', userId)
    .single();

  if (!asset) throw new Error('账户不存在');

  const newBalance = Number(asset.balance) - amount;

  const { error } = await supabase
    .from('assets')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', assetId)
    .eq('user_id', userId);

  if (error) throw error;
}
