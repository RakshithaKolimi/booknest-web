// src/Pages/Unauthorized.tsx
import React from 'react'
import { Link } from 'react-router-dom'

import { usePageTitle } from '../../PageTitleProvider'

const UnAuthorized = () => {
  usePageTitle('Unauthorized')

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-3xl font-bold">Access Denied 🚫</h1>
      <p className="mb-4 text-gray-600">
        You don’t have permission to view this page.
      </p>
      <Link to="/" className="text-blue-600 underline">
        Go back to Home
      </Link>
    </div>
  )
}

export default UnAuthorized
