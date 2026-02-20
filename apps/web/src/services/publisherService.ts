import client from './client'

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

export async function listPublishers(): Promise<Publisher[]> {
  const response = await client.get<Publisher[]>('/publishers')
  return response.data
}

export async function createPublisher(payload: PublisherInput): Promise<Publisher> {
  const response = await client.post<Publisher>('/publishers', payload)
  return response.data
}

export async function updatePublisher(
  id: string,
  payload: PublisherInput
): Promise<Publisher> {
  const response = await client.put<Publisher>(`/publishers/${id}`, payload)
  return response.data
}

export async function deletePublisher(id: string): Promise<void> {
  await client.delete(`/publishers/${id}`)
}
