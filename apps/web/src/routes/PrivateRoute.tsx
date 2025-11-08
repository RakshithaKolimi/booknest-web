import { safeLocalStorage } from '@booknest/utils'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  element: React.ReactElement
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = safeLocalStorage.get('token')
  return !isAuthenticated ? <Navigate to="/login" replace /> : element
}

export default PrivateRoute
