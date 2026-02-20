import client from './client'

export type Book = {
  id: string
  name: string
  author_name: string
  author_id: string
  available_stock: number
  image_url?: string | null
  is_active: boolean
  description: string
  isbn?: string | null
  price: number
  discount_percentage: number
  publisher_id: string
  created_at: string
  updated_at: string
}

export type BookInput = {
  name: string
  author_name: string
  author_id?: string
  available_stock: number
  image_url?: string
  is_active: boolean
  description: string
  isbn?: string
  price: number
  discount_percentage: number
  publisher_id: string
  category_ids?: string[]
}

export async function listBooks(): Promise<Book[]> {
  const response = await client.get<Book[]>('/books')
  return response.data
}

export async function getBookById(id: string): Promise<Book> {
  const response = await client.get<Book>(`/books/${id}`)
  return response.data
}

export async function createBook(payload: BookInput): Promise<Book> {
  const response = await client.post<Book>('/books', payload)
  return response.data
}

export async function updateBook(id: string, payload: BookInput): Promise<Book> {
  const response = await client.put<Book>(`/books/${id}`, payload)
  return response.data
}

export async function deleteBook(id: string): Promise<void> {
  await client.delete(`/books/${id}`)
}
