import { clearAuthSession, safeLocalStorage } from '@booknest/utils'
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

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

// When JWT Token expires, navigate user to login screen
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const sentBearerToken = Boolean(
      (error.config?.headers as Record<string, unknown> | undefined)?.Authorization
    )

    if (status === 401 && sentBearerToken) {
      clearAuthSession()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default client
