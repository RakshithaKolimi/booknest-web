import client from './client'

export type Category = {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export type CategoryInput = {
  name: string
}

export async function listCategories(): Promise<Category[]> {
  const response = await client.get<Category[]>('/categories')
  return response.data
}

export async function createCategory(payload: CategoryInput): Promise<Category> {
  const response = await client.post<Category>('/categories', payload)
  return response.data
}

export async function updateCategory(
  id: string,
  payload: CategoryInput
): Promise<Category> {
  const response = await client.put<Category>(`/categories/${id}`, payload)
  return response.data
}

export async function deleteCategory(id: string): Promise<void> {
  await client.delete(`/categories/${id}`)
}
