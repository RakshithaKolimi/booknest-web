import { deleteData, getData, postData, putData } from './request'

export type BookCategory = {
  id: string
  name: string
}

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
  categories?: BookCategory[]
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
  return getData<Book[]>('/books')
}

export async function getBookById(id: string): Promise<Book> {
  return getData<Book>(`/books/${id}`)
}

export async function createBook(payload: BookInput): Promise<Book> {
  return postData<Book, BookInput>('/books', payload)
}

export async function updateBook(id: string, payload: BookInput): Promise<Book> {
  return putData<Book, BookInput>(`/books/${id}`, payload)
}

export async function deleteBook(id: string): Promise<void> {
  await deleteData(`/books/${id}`)
}
