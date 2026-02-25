import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { PrivateRoute, PublicRoute, RoleBasedRoute } from './index'

afterEach(() => {
  window.localStorage.clear()
})

function renderRoutes(element: ReactElement, path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/login" element={<div>login</div>} />
        <Route path="/unauthorized" element={<div>unauthorized</div>} />
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  )
}

describe('route helpers', () => {
  it('PrivateRoute redirects unauthenticated users to login', () => {
    renderRoutes(<PrivateRoute element={<div>private</div>} />, '/private')
    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('PrivateRoute renders protected element when authenticated', () => {
    window.localStorage.setItem('token', 'token')
    renderRoutes(<PrivateRoute element={<div>private</div>} />, '/private')
    expect(screen.getByText('private')).toBeInTheDocument()
  })

  it('PublicRoute redirects authenticated users to home', () => {
    window.localStorage.setItem('token', 'token')
    renderRoutes(<PublicRoute element={<div>public</div>} />, '/public')
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('RoleBasedRoute redirects to login when no role', () => {
    renderRoutes(
      <RoleBasedRoute element={<div>admin</div>} allowedRoles={['ADMIN']} />,
      '/admin'
    )
    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('RoleBasedRoute redirects unauthorized roles', () => {
    window.localStorage.setItem('role', 'USER')
    renderRoutes(
      <RoleBasedRoute element={<div>admin</div>} allowedRoles={['ADMIN']} />,
      '/admin'
    )
    expect(screen.getByText('unauthorized')).toBeInTheDocument()
  })

  it('RoleBasedRoute renders element for allowed role', () => {
    window.localStorage.setItem('role', 'ADMIN')
    renderRoutes(
      <RoleBasedRoute element={<div>admin</div>} allowedRoles={['ADMIN']} />,
      '/admin'
    )
    expect(screen.getByText('admin')).toBeInTheDocument()
  })
})
