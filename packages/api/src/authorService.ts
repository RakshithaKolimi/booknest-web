import { deleteData, getData, postData, putData } from './request'

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
  return getData<Author[]>('/authors')
}

export async function createAuthor(payload: AuthorInput): Promise<Author> {
  return postData<Author, AuthorInput>('/authors', payload)
}

export async function updateAuthor(id: string, payload: AuthorInput): Promise<Author> {
  return putData<Author, AuthorInput>(`/authors/${id}`, payload)
}

export async function deleteAuthor(id: string): Promise<void> {
  await deleteData(`/authors/${id}`)
}
