import { safeLocalStorage } from '@booknest/utils'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface PublicRouteProps {
  element: React.ReactElement
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const isAuthenticated = safeLocalStorage.get('token')
  return isAuthenticated ? <Navigate to="/" replace /> : element
}

export default PublicRoute
