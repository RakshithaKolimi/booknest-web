import { describe, expect, it } from 'vitest'

import { formatPrice } from '@booknest/utils'

describe('formatPrice', () => {
  it('formats INR currency with grouping', () => {
    expect(formatPrice(123456.5)).toContain('1,23,456.50')
    expect(formatPrice(123456.5)).toContain('₹')
  })
})
