import { deleteData, getData, postData, putData } from './request'

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
  return getData<CartView>('/cart')
}

export async function addToCart(book_id: string, count: number): Promise<CartView> {
  return postData<CartView, { book_id: string; count: number }>('/cart/items', {
    book_id,
    count,
  })
}

export async function updateCartItem(
  book_id: string,
  count: number
): Promise<CartView> {
  return putData<CartView, { book_id: string; count: number }>('/cart/items', {
    book_id,
    count,
  })
}

export async function removeCartItem(bookId: string): Promise<CartView> {
  return deleteData<CartView>(`/cart/items/${bookId}`)
}

export async function clearCart(): Promise<void> {
  await postData('/cart/clear')
}
