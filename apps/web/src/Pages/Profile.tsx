import { safeLocalStorage } from '@booknest/utils'
import React from 'react'

import { getRole } from '../utils/auth'

export default function Profile(): React.ReactElement {
  const role = getRole()
  const email = safeLocalStorage.get('email') || 'Unavailable'
  const userId = safeLocalStorage.get('user_id') || 'Unavailable'

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Profile</h1>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium text-zinc-500">Role</dt>
            <dd className="text-zinc-900">{role || 'Unknown'}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">Email</dt>
            <dd className="text-zinc-900">{email}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">User ID</dt>
            <dd className="break-all text-zinc-900">{userId}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
