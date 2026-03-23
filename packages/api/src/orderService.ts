import { getData, postData, putData } from './request'

export type PaymentMethod =
  | 'COD'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'UPI'

export type OrderItem = {
  book_id: string
  name: string
  author_name: string
  image_url?: string | null
  unit_price: number
  count: number
  line_total: number
}

export type OrderCore = {
  id: string
  order_number: string
  total_price: number
  user_id: string
  payment_method?: PaymentMethod
  payment_status?:
    | 'PENDING'
    | 'PAID'
    | 'REFUND_INITIATED'
    | 'REFUNDED'
    | 'FAILED'
  status: 'PENDING' | 'FAILED' | 'CANCELLED' | 'COMPLETED'
  cancellation_reason?: string | null
  created_at: string
  updated_at: string
}

export type OrderView = {
  order: OrderCore
  items: OrderItem[]
}

export async function checkout(
  payment_method: PaymentMethod
): Promise<OrderView> {
  return postData<OrderView, { payment_method: PaymentMethod }>(
    '/orders/checkout',
    {
      payment_method,
    }
  )
}

export async function confirmPayment(
  order_id: string,
  success: boolean
): Promise<OrderView> {
  return postData<OrderView, { order_id: string; success: boolean }>(
    '/orders/confirm',
    {
      order_id,
      success,
    }
  )
}

export async function cancelOrder(
  order_id: string,
  cancellation_reason: string
): Promise<OrderView> {
  return postData<OrderView, { order_id: string; cancellation_reason: string }>(
    '/orders/cancel',
    {
      order_id,
      cancellation_reason,
    }
  )
}

export async function adminUpdateOrderStatus(
  order_id: string,
  payload: {
    status?: 'COMPLETED' | 'CANCELLED'
    payment_status?: 'REFUNDED'
    cancellation_reason?: string
  }
): Promise<OrderView> {
  return putData<
    OrderView,
    {
      order_id: string
      status?: 'COMPLETED' | 'CANCELLED'
      payment_status?: 'REFUNDED'
      cancellation_reason?: string
    }
  >('/admin/orders/status', {
    order_id,
    ...payload,
  })
}

export async function listMyOrders(): Promise<OrderView[]> {
  return getData<OrderView[]>('/orders')
}

export async function listAllOrders(): Promise<OrderView[]> {
  return getData<OrderView[]>('/admin/orders')
}
