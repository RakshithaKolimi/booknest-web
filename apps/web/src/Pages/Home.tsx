import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { getRole } from '../utils/auth'

export default function Home(): React.ReactElement {
  const role = getRole()

  const cards = useMemo(
    () =>
      role === 'ADMIN'
        ? [
            {
              title: 'Manage Catalog',
              description: 'Create and maintain books, publishers, and authors.',
              path: '/admin/manage',
              cta: 'Open Manage',
            },
            {
              title: 'Track All Orders',
              description: 'View customer orders and their payment status.',
              path: '/admin/orders',
              cta: 'Open Admin Orders',
            },
          ]
        : [
            {
              title: 'Browse Books',
              description: 'Search and explore available titles.',
              path: '/books',
              cta: 'Explore Books',
            },
            {
              title: 'My Cart',
              description: 'Review selected books and proceed to checkout.',
              path: '/cart',
              cta: 'Open Cart',
            },
            {
              title: 'My Orders',
              description: 'Track your placed orders and payment outcome.',
              path: '/orders',
              cta: 'View Orders',
            },
          ],
    [role]
  )

  return (
    <section className="space-y-6">
      <div className="bn-card rounded-2xl bg-linear-to-r from-orange-100/90 via-amber-50 to-rose-100/80 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          BookNest
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
          {role === 'ADMIN' ? 'Admin Workspace' : 'Discover Your Next Book'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          {role === 'ADMIN'
            ? 'Upload books, monitor orders, and keep operations moving from one place.'
            : 'Browse books, build your cart, checkout, and manage your orders like an e-commerce flow.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.path}
            className="bn-card-solid rounded-xl p-5 transition hover:-translate-y-0.5"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{card.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{card.description}</p>
            <Link
              to={card.path}
              className="bn-button mt-4 inline-flex px-3 py-2 text-sm"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
