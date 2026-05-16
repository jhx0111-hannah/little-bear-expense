import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; isNewUser?: boolean }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string; isNewUser?: boolean }> => {
    // 第一步：尝试登录
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      return {};
    }

    // 第二步：登录失败 → 判断原因
    const errorMsg = signInError.message || '';

    // 邮箱未确认 → 让用户去确认
    if (errorMsg.includes('Email not confirmed') || errorMsg.includes('not confirmed')) {
      return { error: '该邮箱尚未验证，请先检查邮箱中的验证链接完成验证后再登录。' };
    }

    // 登录凭据无效 → 可能是密码错误，也可能邮箱未注册
    // 试一下注册来判断是哪种情况
    if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('invalid')) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        // 注册也失败 → 邮箱已注册但密码错了
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          return { error: '密码错误，请检查后重试 🔐' };
        }
        // 其他注册错误
        return { error: signUpError.message };
      }

      // 注册成功 → 说明是首次使用，自动创建了账户
      return { isNewUser: true };
    }

    // 其他未知错误
    return { error: errorMsg };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
