// src/components/RoleBasedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'

import { getRole } from '@booknest/utils'

interface RoleBasedRouteProps {
  element: React.ReactElement
  allowedRoles: string[]
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const role = getRole()

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return element
}

export default RoleBasedRoute
