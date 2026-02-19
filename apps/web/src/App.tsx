import {
  ForgotPassword,
  Login,
  Register,
  ResetSuccessful,
  UnAuthorized,
} from '@booknest/pages'
import { Header } from '@booknest/ui'
import React from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import AdminBooks from './Pages/AdminBooks'
import AdminOrders from './Pages/AdminOrders'
import BookDetail from './Pages/BookDetail'
import Books from './Pages/Books'
import Cart from './Pages/Cart'
import Home from './Pages/Home'
import NotFound from './Pages/NotFound'
import Orders from './Pages/Orders'
import Profile from './Pages/Profile'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'
import RoleBasedRoute from './routes/RoleBasedRoutes'
import { Logout } from '@booknest/ui'
import { clearAuthSession, getRole } from './utils/auth'

export default function App() {
  const location = useLocation()
  const role = getRole()
  const isAuthenticated = Boolean(role)
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-successful'

  const navigate = useNavigate()

  const onLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <div className="bn-shell">
      {!isAuthPage && (
        <header className="bn-header sticky top-0 z-20">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Header />
            {isAuthenticated && (
              <nav className="flex items-center gap-4">
                <NavLink to="/" className="app-link">
                  Home
                </NavLink>
                <NavLink to="/books" className="app-link">
                  Books
                </NavLink>
                {role === 'ADMIN' ? (
                  <>
                    <NavLink to="/admin/books" className="app-link">
                      Admin Books
                    </NavLink>
                    <NavLink to="/admin/orders" className="app-link">
                      Admin Orders
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/cart" className="app-link">
                      Cart
                    </NavLink>
                    <NavLink to="/orders" className="app-link">
                      Orders
                    </NavLink>
                  </>
                )}
                <NavLink to="/profile" className="app-link">
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center rounded-full p-1 transition hover:bg-orange-100"
                  aria-label="Logout"
                >
                  <Logout width="2rem" height="2rem" />
                </button>
              </nav>
            )}
          </div>
        </header>
      )}

      <main
        className={isAuthPage ? '' : 'bn-main mx-auto w-full max-w-7xl px-4 py-8'}
      >
        <div className={isAuthPage ? '' : 'space-y-2'}>
          <Routes>
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route
              path="/register"
              element={<PublicRoute element={<Register />} />}
            />
            <Route
              path="/forgot-password"
              element={<PublicRoute element={<ForgotPassword />} />}
            />
            <Route
              path="/reset-successful"
              element={<PublicRoute element={<ResetSuccessful />} />}
            />

            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/books" element={<PrivateRoute element={<Books />} />} />
            <Route
              path="/books/:id"
              element={<PrivateRoute element={<BookDetail />} />}
            />
            <Route
              path="/cart"
              element={
                <RoleBasedRoute element={<Cart />} allowedRoles={['USER']} />
              }
            />
            <Route
              path="/orders"
              element={
                <RoleBasedRoute element={<Orders />} allowedRoles={['USER']} />
              }
            />
            <Route
              path="/admin/books"
              element={
                <RoleBasedRoute
                  element={<AdminBooks />}
                  allowedRoles={['ADMIN']}
                />
              }
            />
            <Route
              path="/admin/orders"
              element={
                <RoleBasedRoute
                  element={<AdminOrders />}
                  allowedRoles={['ADMIN']}
                />
              }
            />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile />} />}
            />
            <Route path="/unauthorized" element={<UnAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
