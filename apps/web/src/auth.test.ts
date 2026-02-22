import { afterEach, describe, expect, it } from 'vitest'

import {
  clearAuthSession,
  decodeToken,
  getRole,
  syncAuthSession,
} from '@booknest/utils'

const adminToken =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyX2lkIjoidTEiLCJlbWFpbCI6ImFAYi5jb20iLCJ1c2VyX3JvbGUiOiJBRE1JTiJ9.signature'

const userToken =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyX2lkIjoidTIiLCJlbWFpbCI6InVAYi5jb20iLCJ1c2VyX3JvbGUiOiJVU0VSIn0.signature'

afterEach(() => {
  window.localStorage.clear()
})

describe('auth utils', () => {
  it('decodes valid token payload', () => {
    expect(decodeToken(adminToken)).toEqual({
      user_id: 'u1',
      user_role: 'ADMIN',
      email: 'a@b.com',
    })
  })

  it('returns null for malformed token', () => {
    expect(decodeToken('not-a-token')).toBeNull()
  })

  it('syncs and clears auth session in localStorage', () => {
    syncAuthSession(userToken)

    expect(window.localStorage.getItem('token')).toBe(userToken)
    expect(window.localStorage.getItem('role')).toBe('USER')
    expect(window.localStorage.getItem('user_id')).toBe('u2')
    expect(window.localStorage.getItem('email')).toBe('u@b.com')

    clearAuthSession()

    expect(window.localStorage.getItem('token')).toBeNull()
    expect(window.localStorage.getItem('role')).toBeNull()
    expect(window.localStorage.getItem('user_id')).toBeNull()
    expect(window.localStorage.getItem('email')).toBeNull()
  })

  it('getRole prefers stored role and falls back to token claims', () => {
    window.localStorage.setItem('role', 'ADMIN')
    expect(getRole()).toBe('ADMIN')

    window.localStorage.removeItem('role')
    window.localStorage.setItem('token', userToken)

    expect(getRole()).toBe('USER')
    expect(window.localStorage.getItem('role')).toBe('USER')
  })

  it('getRole returns null for invalid role', () => {
    window.localStorage.setItem('role', 'INVALID')
    window.localStorage.setItem(
      'token',
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyX3JvbGUiOiJJTlZBTElEIn0.signature'
    )

    expect(getRole()).toBeNull()
  })
})
