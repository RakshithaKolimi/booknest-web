import React, { useEffect, useState } from 'react'

import { usePageTitle } from '../PageTitleProvider'

import {
  cancelOrder,
  confirmPayment,
  listMyOrders,
  type OrderView,
} from '@booknest/services/orderService'

import { formatPrice } from '@booknest/utils'

export default function Orders(): React.ReactElement {
  usePageTitle('Orders')

  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelReasonByOrder, setCancelReasonByOrder] = useState<
    Record<string, string>
  >({})
  const [showCancelBoxByOrder, setShowCancelBoxByOrder] = useState<
    Record<string, boolean>
  >({})

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

  const handleCancelOrder = async (orderId: string) => {
    const cancellationReason = (cancelReasonByOrder[orderId] || '').trim()
    if (!cancellationReason) {
      setError('Please enter a cancellation reason')
      return
    }

    setError('')
    try {
      await cancelOrder(orderId, cancellationReason)
      setCancelReasonByOrder((current) => ({ ...current, [orderId]: '' }))
      setShowCancelBoxByOrder((current) => ({ ...current, [orderId]: false }))
      await loadOrders()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to cancel order')
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">My Orders</h1>
        <p className="text-sm text-zinc-600">
          Track your order and payment status separately.
        </p>
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
          {orders.map((entry) => {
            const canCancel =
              entry.order.status === 'PENDING' || entry.order.status === 'FAILED'

            return (
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

                {entry.order.cancellation_reason && (
                  <p className="mt-1 text-sm text-zinc-600">
                    Cancellation reason:{' '}
                    <strong>{entry.order.cancellation_reason}</strong>
                  </p>
                )}

                <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                  {entry.items.map((item) => (
                    <li key={item.book_id}>
                      {item.name} x {item.count} ({formatPrice(item.line_total)})
                    </li>
                  ))}
                </ul>

                {entry.order.status === 'PENDING' &&
                  entry.order.payment_status !== 'PAID' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
                        onClick={() =>
                          void handleConfirmPayment(entry.order.id, true)
                        }
                      >
                        Confirm Payment
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white"
                        onClick={() =>
                          void handleConfirmPayment(entry.order.id, false)
                        }
                      >
                        Mark Payment Failed
                      </button>
                    </div>
                  )}

                {canCancel && (
                  <div className="mt-4 space-y-2">
                    {!showCancelBoxByOrder[entry.order.id] ? (
                      <button
                        type="button"
                        className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white"
                        onClick={() =>
                          setShowCancelBoxByOrder((current) => ({
                            ...current,
                            [entry.order.id]: true,
                          }))
                        }
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <>
                        <textarea
                          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-500"
                          placeholder="Add cancellation reason"
                          value={cancelReasonByOrder[entry.order.id] || ''}
                          onChange={(event) =>
                            setCancelReasonByOrder((current) => ({
                              ...current,
                              [entry.order.id]: event.target.value,
                            }))
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white"
                            onClick={() => void handleCancelOrder(entry.order.id)}
                          >
                            Confirm Cancel
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700"
                            onClick={() =>
                              setShowCancelBoxByOrder((current) => ({
                                ...current,
                                [entry.order.id]: false,
                              }))
                            }
                          >
                            Close
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
