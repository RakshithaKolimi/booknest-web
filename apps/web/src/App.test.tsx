import { PageTitleProvider } from '@booknest/pages'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <PageTitleProvider defaultTitle="BookNest">
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </PageTitleProvider>
    )
    expect(container).toBeTruthy()
  })
})
