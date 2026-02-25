import { safeLocalStorage } from '@booknest/utils'
import axios, { type InternalAxiosRequestConfig } from 'axios'

const API_VERSION_PREFIX = '/api/v1'
const configuredBaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const normalizedBaseURL = configuredBaseURL.replace(/\/+$/, '')
const baseURL = normalizedBaseURL.endsWith(API_VERSION_PREFIX)
  ? normalizedBaseURL
  : `${normalizedBaseURL}${API_VERSION_PREFIX}`

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = safeLocalStorage.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default client
