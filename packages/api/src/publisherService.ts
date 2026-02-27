import { deleteData, getData, postData, putData } from './request'

export type Publisher = {
  id: string
  legal_name: string
  trading_name: string
  email: string
  mobile: string
  address: string
  city: string
  state: string
  country: string
  zipcode: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type PublisherInput = {
  legal_name: string
  trading_name: string
  email: string
  mobile: string
  address: string
  city: string
  state: string
  country: string
  zipcode: string
}

export type ListPublishersParams = {
  limit?: number
  offset?: number
  search?: string
}

export async function listPublishers(params?: ListPublishersParams): Promise<Publisher[]> {
  return getData<Publisher[]>('/publishers', { params })
}

export async function createPublisher(payload: PublisherInput): Promise<Publisher> {
  return postData<Publisher, PublisherInput>('/publishers', payload)
}

export async function updatePublisher(
  id: string,
  payload: PublisherInput
): Promise<Publisher> {
  return putData<Publisher, PublisherInput>(`/publishers/${id}`, payload)
}

export async function deletePublisher(id: string): Promise<void> {
  await deleteData(`/publishers/${id}`)
}
