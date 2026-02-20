import axios from 'axios';

const client = axios.create({
  baseURL: process.env.BACKEND_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiGet<T>(path: string): Promise<T> {
  const response = await client.get<T>(path);
  return response.data;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await client.post<T>(path, body);
  return response.data;
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const response = await client.put<T>(path, body);
  return response.data;
}

export default client;
