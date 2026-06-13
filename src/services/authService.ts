import * as Keychain from 'react-native-keychain';
import { apiRequest } from './api';

const AUTH_TOKEN_SERVICE = 'com.eie.customer.authToken';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const result = await apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  await Keychain.setGenericPassword(credentials.username, result.token, {
    service: AUTH_TOKEN_SERVICE,
  });

  return result;
}

export async function getStoredAuthToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_TOKEN_SERVICE,
  });

  return credentials ? credentials.password : null;
}

export async function clearStoredAuthToken(): Promise<void> {
  await Keychain.resetGenericPassword({ service: AUTH_TOKEN_SERVICE });
}

export async function getCurrentUser(token: string): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/api/v1/auth/me', {
    method: 'GET',
    token,
  });
}
