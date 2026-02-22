import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

const store = new Map<string, string>()
const localStorageMock = {
  getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
  setItem: (key: string, value: string) => {
    store.set(key, String(value))
  },
  removeItem: (key: string) => {
    store.delete(key)
  },
  clear: () => {
    store.clear()
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})


Object.defineProperty(window, 'atob', {
  value: (input: string) => Buffer.from(input, 'base64').toString('binary'),
  writable: true,
})

vi.mock('lucide-react', () => ({
  Power: (props: Record<string, unknown>) => React.createElement('svg', props),
}))
