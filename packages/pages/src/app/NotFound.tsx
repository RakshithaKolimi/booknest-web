import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(): React.ReactElement {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-600">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Go Home
      </Link>
    </section>
  )
}
