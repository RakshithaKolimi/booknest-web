// src/components/RoleBasedRoute.tsx
import { safeLocalStorage } from '@booknest/utils'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface RoleBasedRouteProps {
  element: React.ReactElement
  allowedRoles: string[]
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const token = safeLocalStorage.get('token')
  const role = safeLocalStorage.get('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/unauthorized" replace />
  }

  return element
}

export default RoleBasedRoute
