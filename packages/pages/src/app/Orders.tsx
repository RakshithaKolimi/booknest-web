import React, { useEffect, useState } from 'react'

import {
  confirmPayment,
  listMyOrders,
  type OrderView,
} from '@booknest/services/orderService'

import { formatPrice } from '@booknest/utils'

export default function Orders(): React.ReactElement {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listMyOrders()
      setOrders(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  const handleConfirmPayment = async (orderId: string, success: boolean) => {
    setError('')
    try {
      await confirmPayment(orderId, success)
      await loadOrders()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to update order payment')
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">My Orders</h1>
        <p className="text-sm text-zinc-600">Track your orders and payment status.</p>
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
          No orders yet.
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
                <p className="text-sm text-zinc-600">
                  {formatPrice(entry.order.total_price)}
                </p>
              </div>

              <p className="mt-1 text-sm text-zinc-600">
                Order status: <strong>{entry.order.status}</strong> | Payment:{' '}
                <strong>{entry.order.payment_status || 'PENDING'}</strong>
              </p>

              <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                {entry.items.map((item) => (
                  <li key={item.book_id}>
                    {item.name} x {item.count} ({formatPrice(item.line_total)})
                  </li>
                ))}
              </ul>

              {entry.order.status === 'PENDING' && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
                    onClick={() => void handleConfirmPayment(entry.order.id, true)}
                  >
                    Confirm Payment
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white"
                    onClick={() => void handleConfirmPayment(entry.order.id, false)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
