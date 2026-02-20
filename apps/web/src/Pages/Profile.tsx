import { safeLocalStorage } from '@booknest/utils'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getRole } from '../utils/auth'

export default function Profile(): React.ReactElement {
  useEffect(() => {
    document.title = 'Profile'
  }, [])

  const fullName = safeLocalStorage.get('name') || 'BookNest User'
  const role = getRole() || 'READER'
  const email = safeLocalStorage.get('email') || 'Unavailable'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
  const joinedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <section className="space-y-4">
      <div className="bn-card rounded-2xl bg-linear-to-r from-orange-100/90 via-amber-50 to-rose-100/80 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
          Profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Manage your account details and access your activity faster.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <article className="bn-card-solid rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-600 to-rose-500 text-lg font-semibold text-white">
              {initials || 'BN'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{fullName}</h2>
              <p className="text-sm text-zinc-600">{email}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Role
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">{role}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Member Since
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">
                {joinedDate}
              </dd>
            </div>
          </dl>
        </article>

        <aside className="bn-card-solid rounded-xl p-6">
          <h3 className="text-base font-semibold text-zinc-900">Quick Actions</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Jump directly to the sections you use most.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={role === 'ADMIN' ? '/admin/orders' : '/orders'} className="bn-button inline-flex px-3 py-2 text-sm">
              View Orders
            </Link>
            <Link
              to="/books"
              className="inline-flex rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
            >
              Browse Books
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
