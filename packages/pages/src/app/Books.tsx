import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { addToCart } from '@booknest/services/cartService'
import { type Book, listBooks } from '@booknest/services/bookService'
import { getRole } from '@booknest/utils'

import { formatPrice } from '@booknest/utils'

export default function Books(): React.ReactElement {
  const role = getRole()
  const isAdmin = role === 'ADMIN'

  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingId, setAddingId] = useState('')

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

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return books

    return books.filter((book) => {
      const title = (book.name || '').toLowerCase()
      const author = (book.author_name || '').toLowerCase()
      const isbn = (book.isbn || '').toLowerCase()
      return (
        title.includes(keyword) ||
        author.includes(keyword) ||
        isbn.includes(keyword)
      )
    })
  }, [books, search])

  const handleAddToCart = async (bookId: string) => {
    setAddingId(bookId)
    setError('')

    try {
      await addToCart(bookId, 1)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to add book to cart')
    } finally {
      setAddingId('')
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Books</h1>
          <p className="text-sm text-zinc-600">
            {isAdmin
              ? 'Review the catalog and jump into admin book creation.'
              : 'Browse, search, and add books to your cart.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, author, or ISBN"
            className="bn-input w-full px-3 py-2 text-sm md:w-80"
          />
          {isAdmin && (
            <Link
              to="/admin/manage"
              className="bn-button px-4 py-2 text-sm"
            >
              Manage
            </Link>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bn-card-solid rounded-xl p-6 text-sm text-zinc-600">
          Loading books...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bn-card-solid rounded-xl p-6 text-sm text-zinc-600">
          No books found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <article
              key={book.id}
              className="bn-card-solid flex h-full flex-col rounded-xl p-4 transition hover:-translate-y-0.5"
            >
              <div className="mb-4 h-40 rounded-md bg-zinc-100">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-zinc-500">
                    No image
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold text-zinc-900">{book.name || 'Untitled'}</h2>
              <p className="text-sm text-zinc-600">{book.author_name || 'Unknown author'}</p>
              {book.categories && book.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {book.categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 ring-1 ring-orange-200"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-900">
                  {formatPrice(book.price)}
                </span>
                <span className="bn-pill px-2 py-0.5 text-xs">
                  Stock: {book.available_stock}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/books/${book.id}`}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-900 hover:bg-orange-100"
                >
                  Details
                </Link>
                {!isAdmin && (
                  <button
                    type="button"
                    className="bn-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => void handleAddToCart(book.id)}
                    disabled={addingId === book.id || book.available_stock < 1}
                  >
                    {addingId === book.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
