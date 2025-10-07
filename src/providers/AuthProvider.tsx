// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../api/client';
import { login as apiLogin, LoginResponse } from '../api/auth';
import { useRouter, useSegments } from 'expo-router';

type AuthState = {
  user: LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
};

type AuthContextType = AuthState & {
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userStr = await SecureStore.getItemAsync(USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        if (token) setAuthToken(token);
        setState({ user, token, loading: false });
      } catch {
        setState({ user: null, token: null, loading: false });
      }
    })();
  }, []);

  useEffect(() => {
    if (state.loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!state.token && !inAuth) router.replace('/login');
    else if (state.token && inAuth) router.replace('/');
  }, [segments, state.loading, state.token]);

  const signIn = async (payload: LoginPayload) => {
  const res = await apiLogin(payload); // { data, token }

    if (!res?.token) throw new Error('ไม่พบ token จากระบบ');

        setAuthToken(res.token);

        // ✅ ต้องเก็บเป็น string เสมอ
        await SecureStore.setItemAsync(TOKEN_KEY, String(res.token));
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.data));

        setState(s => ({ ...s, token: res.token, user: res.data }));
        router.replace('/');
    };

  const signOut = async () => {
    setAuthToken(undefined);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setState({ user: null, token: null, loading: false });
    router.replace('/login');
  };

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
