import type { AxiosRequestConfig } from 'axios'

import client from './client'

export async function getData<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.get<T>(url, config)
  return response.data
}

export async function postData<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.post<T>(url, body, config)
  return response.data
}

export async function putData<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.put<T>(url, body, config)
  return response.data
}

export async function deleteData<T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.delete<T>(url, config)
  return response.data
}
