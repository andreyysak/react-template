import axios, { type AxiosError } from 'axios';
import { env } from '@/shared/config/env';
import type { ApiError } from '@/shared/types/api';
import { tokenStorage } from '@/shared/utils/tokenStorage';

const AUTH_ENDPOINTS = ['/auth/login'];

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const isAuthRequest = AUTH_ENDPOINTS.some((url) => error.config?.url?.startsWith(url));

    if (error.response?.status === 401 && !isAuthRequest) {
      tokenStorage.clear();
      onUnauthorized?.();
    }

    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? error.message,
    };
    return Promise.reject(apiError);
  },
);
