import { safeLocalStorage } from '@booknest/utils'
import axios, { type InternalAxiosRequestConfig } from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
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
