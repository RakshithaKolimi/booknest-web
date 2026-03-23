import React, { useEffect, useState } from 'react'

import { usePageTitle } from '../PageTitleProvider'

import {
  adminUpdateOrderStatus,
  listAllOrders,
  type OrderView,
} from '@booknest/services/orderService'

import { formatPrice } from '@booknest/utils'

export default function AdminOrders(): React.ReactElement {
  usePageTitle('Admin Orders')

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
      const data = await listAllOrders()
      setOrders(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load admin orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  const handleStatusUpdate = async (
    orderId: string,
    status: 'COMPLETED' | 'CANCELLED'
  ) => {
    const cancellationReason =
      status === 'CANCELLED'
        ? (cancelReasonByOrder[orderId] || '').trim()
        : undefined

    if (status === 'CANCELLED' && !cancellationReason) {
      setError('Please enter a cancellation reason before cancelling')
      return
    }

    setError('')
    try {
      await adminUpdateOrderStatus(orderId, {
        status,
        cancellation_reason: cancellationReason,
      })
      if (status === 'CANCELLED') {
        setCancelReasonByOrder((current) => ({ ...current, [orderId]: '' }))
        setShowCancelBoxByOrder((current) => ({ ...current, [orderId]: false }))
      }
      await loadOrders()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update order status')
    }
  }

  const handleRefundCompleted = async (orderId: string) => {
    setError('')
    try {
      await adminUpdateOrderStatus(orderId, {
        payment_status: 'REFUNDED',
      })
      await loadOrders()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to complete refund')
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Orders</h1>
        <p className="text-sm text-zinc-600">
          Review orders and move them to completed or cancelled.
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
          No orders found.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((entry) => {
            const canManage =
              entry.order.status !== 'COMPLETED' &&
              entry.order.status !== 'CANCELLED'
            const canCompleteRefund =
              entry.order.status === 'CANCELLED' &&
              entry.order.payment_status === 'REFUND_INITIATED'

            return (
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

                {canManage && (
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
                        onClick={() =>
                          void handleStatusUpdate(entry.order.id, 'COMPLETED')
                        }
                      >
                        Mark Completed
                      </button>
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
                    </div>

                    {showCancelBoxByOrder[entry.order.id] && (
                      <>
                        <textarea
                          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-500"
                          placeholder="Cancellation reason if cancelling"
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
                            onClick={() =>
                              void handleStatusUpdate(entry.order.id, 'CANCELLED')
                            }
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

                {canCompleteRefund && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="rounded-md bg-sky-600 px-3 py-1 text-xs font-medium text-white"
                      onClick={() => void handleRefundCompleted(entry.order.id)}
                    >
                      Refund Completed
                    </button>
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
