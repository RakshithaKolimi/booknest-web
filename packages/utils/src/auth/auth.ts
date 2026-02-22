import { safeLocalStorage } from '../storage/StorageUtil'

export type UserRole = 'USER' | 'ADMIN'

type TokenClaims = {
  user_id?: string
  email?: string
  user_role?: UserRole
  exp?: number
}

function normalizeBase64(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = normalized.length % 4
  if (padLength === 2) return `${normalized}==`
  if (padLength === 3) return `${normalized}=`
  if (padLength === 1) return `${normalized}===`
  return normalized
}

export function decodeToken(token: string): TokenClaims | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const decoded = atob(normalizeBase64(parts[1]))
    return JSON.parse(decoded) as TokenClaims
  } catch {
    return null
  }
}

export function syncAuthSession(token: string): void {
  safeLocalStorage.set('token', token)
  const claims = decodeToken(token)

  if (claims?.user_role) {
    safeLocalStorage.set('role', claims.user_role)
  }

  if (claims?.user_id) {
    safeLocalStorage.set('user_id', claims.user_id)
  }

  if (claims?.email) {
    safeLocalStorage.set('email', claims.email)
  }
}

export function clearAuthSession(): void {
  safeLocalStorage.remove('token')
  safeLocalStorage.remove('role')
  safeLocalStorage.remove('user_id')
  safeLocalStorage.remove('email')
}

export function getRole(): UserRole | null {
  const role = safeLocalStorage.get('role')
  if (role === 'ADMIN' || role === 'USER') return role

  const token = safeLocalStorage.get('token')
  if (!token) return null

  const claims = decodeToken(token)
  if (claims?.user_role === 'ADMIN' || claims?.user_role === 'USER') {
    safeLocalStorage.set('role', claims.user_role)
    return claims.user_role
  }

  return null
}
