import { post } from './http';
import { uWaveAPI } from './types';

export const login = (email: string, password: string) =>
  post<uWaveAPI.LoginBody, uWaveAPI.LoginResponse>('/auth/login', {
    email,
    password,
  });
