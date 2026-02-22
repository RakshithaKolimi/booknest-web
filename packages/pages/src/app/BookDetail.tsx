import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { addToCart } from '@booknest/services/cartService'
import { type Book, getBookById } from '@booknest/services/bookService'
import { getRole } from '@booknest/utils'
import { formatPrice } from '@booknest/utils'

export default function BookDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const role = getRole()
  const isAdmin = role === 'ADMIN'

  const [book, setBook] = useState<Book | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('Book id is missing in URL')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await getBookById(id)
        setBook(data)
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Unable to load book details')
      } finally {
        setLoading(false)
      }
    }

    void loadBook()
  }, [id])

  const handleAddToCart = async () => {
    if (!book) return
    setAdding(true)
    setError('')

    try {
      await addToCart(book.id, quantity)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to add selected quantity')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
        Loading book details...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || 'Book not found'}
        </div>
        <Link to="/books" className="text-sm font-semibold text-zinc-900 underline">
          Back to books
        </Link>
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <Link to="/books" className="text-sm font-semibold text-zinc-700 underline">
        Back to books
      </Link>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <article className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 md:grid-cols-[280px_1fr]">
        <div className="h-72 rounded-lg bg-zinc-100 md:h-full">
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-zinc-500">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">{book.name}</h1>
          <p className="mt-1 text-zinc-600">by {book.author_name}</p>
          {book.categories && book.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 ring-1 ring-orange-200"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="rounded-md bg-zinc-100 px-3 py-1 text-zinc-700">
              Price: {formatPrice(book.price)}
            </span>
            <span className="rounded-md bg-zinc-100 px-3 py-1 text-zinc-700">
              Stock: {book.available_stock}
            </span>
            <span className="rounded-md bg-zinc-100 px-3 py-1 text-zinc-700">
              ISBN: {book.isbn || 'N/A'}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-700">
            {book.description || 'No description available for this book.'}
          </p>

          {!isAdmin && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-medium text-zinc-700">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={Math.max(book.available_stock, 1)}
                value={quantity}
                onChange={(event) => {
                  const parsed = Number(event.target.value)
                  if (Number.isNaN(parsed) || parsed < 1) {
                    setQuantity(1)
                    return
                  }

                  setQuantity(Math.min(parsed, Math.max(book.available_stock, 1)))
                }}
                className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm"
              />

              <button
                type="button"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                onClick={() => void handleAddToCart()}
                disabled={adding || book.available_stock < 1}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  )
}
