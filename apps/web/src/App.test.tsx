import { BookNestQueryProvider, PageTitleProvider } from '@booknest/pages'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BookNestQueryProvider>
        <PageTitleProvider defaultTitle="BookNest">
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </PageTitleProvider>
      </BookNestQueryProvider>
    )
    expect(container).toBeTruthy()
  })
})
