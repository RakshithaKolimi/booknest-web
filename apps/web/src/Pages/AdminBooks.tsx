import React, { useEffect, useState } from 'react'

import {
  createBook,
  type Book,
  type BookInput,
  listBooks,
} from '../services/bookService'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const initialForm: BookInput = {
  name: '',
  author_name: '',
  available_stock: 1,
  image_url: '',
  is_active: true,
  description: '',
  isbn: '',
  price: 0,
  discount_percentage: 0,
  publisher_id: '',
  category_ids: [],
}

export default function AdminBooks(): React.ReactElement {
  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState<BookInput>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadBooks = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listBooks()
      setBooks(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBooks()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await createBook({
        ...form,
        image_url: form.image_url || undefined,
        isbn: form.isbn || undefined,
      })
      setForm(initialForm)
      await loadBooks()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to create book')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Books</h1>
        <p className="text-sm text-zinc-600">
          Upload new books and monitor the current catalog.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 md:grid-cols-2"
      >
        <input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Book name"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          required
          value={form.author_name}
          onChange={(event) => setForm({ ...form, author_name: event.target.value })}
          placeholder="Author name"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: Number(event.target.value) })
          }
          placeholder="Price"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          min={0}
          value={form.available_stock}
          onChange={(event) =>
            setForm({ ...form, available_stock: Number(event.target.value) })
          }
          placeholder="Stock"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          required
          value={form.publisher_id}
          onChange={(event) => setForm({ ...form, publisher_id: event.target.value })}
          placeholder="Publisher UUID"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          value={form.isbn || ''}
          onChange={(event) => setForm({ ...form, isbn: event.target.value })}
          placeholder="ISBN (optional)"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          value={form.image_url || ''}
          onChange={(event) => setForm({ ...form, image_url: event.target.value })}
          placeholder="Image URL (optional)"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Description"
          rows={4}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
        />

        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="active"
            type="checkbox"
            checked={form.is_active}
            onChange={(event) =>
              setForm({ ...form, is_active: event.target.checked })
            }
          />
          <label htmlFor="active" className="text-sm text-zinc-700">
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 md:col-span-2"
        >
          {saving ? 'Saving...' : 'Create Book'}
        </button>
      </form>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Current Catalog</h2>

        {loading ? (
          <p className="mt-3 text-sm text-zinc-600">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No books found.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Author</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2 pr-4">Stock</th>
                  <th className="pb-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t border-zinc-100">
                    <td className="py-2 pr-4 font-medium text-zinc-900">{book.name}</td>
                    <td className="py-2 pr-4 text-zinc-700">{book.author_name}</td>
                    <td className="py-2 pr-4 text-zinc-700">{formatPrice(book.price)}</td>
                    <td className="py-2 pr-4 text-zinc-700">{book.available_stock}</td>
                    <td className="py-2 pr-4 text-zinc-700">
                      {book.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
