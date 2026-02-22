import client from './client'

export type PaymentMethod = 'COD' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'UPI'

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
  payment_status?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'
  status: 'PENDING' | 'CANCELLED' | 'COMPLETED'
  created_at: string
  updated_at: string
}

export type OrderView = {
  order: OrderCore
  items: OrderItem[]
}

export async function checkout(payment_method: PaymentMethod): Promise<OrderView> {
  const response = await client.post<OrderView>('/orders/checkout', { payment_method })
  return response.data
}

export async function confirmPayment(
  order_id: string,
  success: boolean
): Promise<OrderView> {
  const response = await client.post<OrderView>('/orders/confirm', {
    order_id,
    success,
  })
  return response.data
}

export async function listMyOrders(): Promise<OrderView[]> {
  const response = await client.get<OrderView[]>('/orders')
  return response.data
}

export async function listAllOrders(): Promise<OrderView[]> {
  const response = await client.get<OrderView[]>('/admin/orders')
  return response.data
}
