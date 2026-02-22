import { deleteData, getData, postData, putData } from './request'

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
  return getData<Category[]>('/categories')
}

export async function createCategory(payload: CategoryInput): Promise<Category> {
  return postData<Category, CategoryInput>('/categories', payload)
}

export async function updateCategory(
  id: string,
  payload: CategoryInput
): Promise<Category> {
  return putData<Category, CategoryInput>(`/categories/${id}`, payload)
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteData(`/categories/${id}`)
}
