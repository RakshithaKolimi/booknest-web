import client from './client'

export type Author = {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export type AuthorInput = {
  name: string
}

export async function listAuthors(): Promise<Author[]> {
  const response = await client.get<Author[]>('/authors')
  return response.data
}

export async function createAuthor(payload: AuthorInput): Promise<Author> {
  const response = await client.post<Author>('/authors', payload)
  return response.data
}

export async function updateAuthor(id: string, payload: AuthorInput): Promise<Author> {
  const response = await client.put<Author>(`/authors/${id}`, payload)
  return response.data
}

export async function deleteAuthor(id: string): Promise<void> {
  await client.delete(`/authors/${id}`)
}
