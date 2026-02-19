import React, { useEffect, useState } from 'react'

import { listAllOrders, type OrderView } from '../services/orderService'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function AdminOrders(): React.ReactElement {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listAllOrders()
        setOrders(data)
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load admin orders')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Orders</h1>
        <p className="text-sm text-zinc-600">
          Review all customer orders and payment outcomes.
        </p>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Admin order status update endpoint is not currently exposed by backend routes.
        This page shows complete order details; status changes are handled by user payment confirmation flow.
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-6 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
          No orders found.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((entry) => (
            <article
              key={entry.order.id}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-zinc-900">
                  #{entry.order.order_number}
                </h2>
                <p className="text-sm font-semibold text-zinc-900">
                  {formatPrice(entry.order.total_price)}
                </p>
              </div>

              <p className="mt-1 text-sm text-zinc-600">
                Customer: {entry.order.user_id}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Status: <strong>{entry.order.status}</strong> | Payment:{' '}
                <strong>{entry.order.payment_status || 'PENDING'}</strong>
              </p>

              <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                {entry.items.map((item) => (
                  <li key={item.book_id}>
                    {item.name} x {item.count} ({formatPrice(item.line_total)})
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
