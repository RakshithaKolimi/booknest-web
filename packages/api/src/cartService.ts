import client from './client'

export type CartItem = {
  book_id: string
  name: string
  author_name: string
  image_url?: string | null
  unit_price: number
  count: number
  line_total: number
}

export type CartView = {
  cart_id: string
  user_id: string
  items: CartItem[]
  subtotal: number
  total_items: number
}

export async function getCart(): Promise<CartView> {
  const response = await client.get<CartView>('/cart')
  return response.data
}

export async function addToCart(book_id: string, count: number): Promise<CartView> {
  const response = await client.post<CartView>('/cart/items', { book_id, count })
  return response.data
}

export async function updateCartItem(
  book_id: string,
  count: number
): Promise<CartView> {
  const response = await client.put<CartView>('/cart/items', { book_id, count })
  return response.data
}

export async function removeCartItem(bookId: string): Promise<CartView> {
  const response = await client.delete<CartView>(`/cart/items/${bookId}`)
  return response.data
}

export async function clearCart(): Promise<void> {
  await client.post('/cart/clear')
}
