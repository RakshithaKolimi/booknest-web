import type { AxiosRequestConfig } from 'axios'
import { isAxiosError } from 'axios'

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

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data === 'string' && data.trim() !== '') {
      return data
    }

    if (data && typeof data === 'object') {
      const errorMessage = 'error' in data ? data.error : undefined
      if (typeof errorMessage === 'string' && errorMessage.trim() !== '') {
        return errorMessage
      }

      const message = 'message' in data ? data.message : undefined
      if (typeof message === 'string' && message.trim() !== '') {
        return message
      }
    }

    if (typeof error.message === 'string' && error.message.trim() !== '') {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message
  }

  return fallback
}
