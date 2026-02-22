import { describe, expect, it } from 'vitest'

import { cn } from '@booknest/utils'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('btn', undefined, 'primary', false, null, 'active')).toBe(
      'btn primary active'
    )
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(undefined, false, null)).toBe('')
  })
})
