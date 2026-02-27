import React, { useEffect, useMemo, useState } from 'react'

import {
  createAuthor,
  deleteAuthor,
  listAuthors,
  type Author,
  updateAuthor,
} from '@booknest/services/authorService'
import {
  createBook,
  deleteBook,
  listBooks,
  type Book,
  type BookInput,
  updateBook,
} from '@booknest/services/bookService'
import {
  createPublisher,
  deletePublisher,
  listPublishers,
  type Publisher,
  type PublisherInput,
  updatePublisher,
} from '@booknest/services/publisherService'
import {
  createCategory,
  deleteCategory,
  listCategories,
  type Category,
  updateCategory,
} from '@booknest/services/categoryService'
import { formatPrice } from '@booknest/utils'

type Tab = 'books' | 'publishers' | 'authors' | 'categories'

const initialBookForm: BookInput = {
  name: '',
  author_name: '',
  author_id: '',
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

const initialPublisherForm: PublisherInput = {
  legal_name: '',
  trading_name: '',
  email: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipcode: '',
}

export default function AdminBooks(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('books')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [editingBookId, setEditingBookId] = useState('')
  const [editingAuthorId, setEditingAuthorId] = useState('')
  const [editingPublisherId, setEditingPublisherId] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState('')

  const [bookForm, setBookForm] = useState(initialBookForm)
  const [authorName, setAuthorName] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [publisherName, setPublisherName] = useState('')
  const [publisherForm, setPublisherForm] = useState(initialPublisherForm)
  const [categoryName, setCategoryName] = useState('')
  const [authorSearch, setAuthorSearch] = useState('')
  const [publisherSearch, setPublisherSearch] = useState('')

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [bookData, authorData, publisherData, categoryData] = await Promise.all([
        listBooks(),
        listAuthors({
          limit: 500,
        }),
        listPublishers({
          limit: 500,
        }),
        listCategories(),
      ])
      setBooks(bookData)
      setAuthors(authorData)
      setPublishers(publisherData)
      setCategories(categoryData)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load management data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Manage'
    void loadAll()
  }, [])

  const filteredAuthors = useMemo(() => {
    const keyword = authorSearch.trim().toLowerCase()
    if (!keyword) return authors
    return authors.filter((author) => author.name.toLowerCase().includes(keyword))
  }, [authors, authorSearch])

  const filteredPublishers = useMemo(() => {
    const keyword = publisherSearch.trim().toLowerCase()
    if (!keyword) return publishers
    return publishers.filter((publisher) => {
      return (
        publisher.trading_name.toLowerCase().includes(keyword) ||
        publisher.legal_name.toLowerCase().includes(keyword)
      )
    })
  }, [publishers, publisherSearch])

  const authorNameById = useMemo(() => {
    return new Map(authors.map((author) => [author.id, author.name]))
  }, [authors])

  const filteredBooks = useMemo(() => {
    const keyword = bookSearch.trim().toLowerCase()
    if (!keyword) return books
    return books.filter((book) => {
      const authorName = (book.author_name || authorNameById.get(book.author_id) || '').toLowerCase()
      return (
        book.name.toLowerCase().includes(keyword) ||
        authorName.includes(keyword) ||
        (book.isbn || '').toLowerCase().includes(keyword)
      )
    })
  }, [books, bookSearch, authorNameById])

  const resetBookForm = () => {
    setBookForm(initialBookForm)
    setPublisherName('')
    setEditingBookId('')
  }

  const resetAuthorForm = () => {
    setAuthorName('')
    setEditingAuthorId('')
  }

  const resetPublisherForm = () => {
    setPublisherForm(initialPublisherForm)
    setEditingPublisherId('')
  }

  const resetCategoryForm = () => {
    setCategoryName('')
    setEditingCategoryId('')
  }

  const onSubmitBook = async (event: React.FormEvent) => {
    event.preventDefault()
    const selectedAuthor =
      authors.find((author) => author.id === (bookForm.author_id || '')) ||
      authors.find(
        (author) =>
          author.name.trim().toLowerCase() ===
          (bookForm.author_name || '').trim().toLowerCase()
      )
    if (!selectedAuthor) {
      setError('Please select an author')
      return
    }
    const selectedPublisher =
      publishers.find((publisher) => publisher.id === bookForm.publisher_id) ||
      publishers.find(
        (publisher) =>
          publisher.trading_name.trim().toLowerCase() ===
          publisherName.trim().toLowerCase()
      )
    if (!selectedPublisher) {
      setError('Please select a publisher')
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload: BookInput = {
        ...bookForm,
        author_id: selectedAuthor.id,
        author_name: selectedAuthor.name,
        publisher_id: selectedPublisher.id,
        category_ids: bookForm.category_ids || [],
        image_url: bookForm.image_url || undefined,
        isbn: bookForm.isbn || undefined,
      }
      if (editingBookId) {
        await updateBook(editingBookId, payload)
      } else {
        await createBook(payload)
      }
      resetBookForm()
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  const onSubmitAuthor = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingAuthorId) {
        await updateAuthor(editingAuthorId, { name: authorName })
      } else {
        await createAuthor({ name: authorName })
      }
      resetAuthorForm()
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save author')
    } finally {
      setSaving(false)
    }
  }

  const onSubmitPublisher = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingPublisherId) {
        await updatePublisher(editingPublisherId, publisherForm)
      } else {
        await createPublisher(publisherForm)
      }
      resetPublisherForm()
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save publisher')
    } finally {
      setSaving(false)
    }
  }

  const onSubmitCategory = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, { name: categoryName })
      } else {
        await createCategory({ name: categoryName })
      }
      resetCategoryForm()
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const onDeleteBook = async (id: string) => {
    if (!window.confirm('Delete this book?')) return
    setError('')
    try {
      await deleteBook(id)
      await loadAll()
      if (editingBookId === id) resetBookForm()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete book')
    }
  }

  const onDeleteAuthor = async (id: string) => {
    if (!window.confirm('Delete this author?')) return
    setError('')
    try {
      await deleteAuthor(id)
      await loadAll()
      if (editingAuthorId === id) resetAuthorForm()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete author')
    }
  }

  const onDeletePublisher = async (id: string) => {
    if (!window.confirm('Delete this publisher?')) return
    setError('')
    try {
      await deletePublisher(id)
      await loadAll()
      if (editingPublisherId === id) resetPublisherForm()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete publisher')
    }
  }

  const onDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return
    setError('')
    try {
      await deleteCategory(id)
      await loadAll()
      if (editingCategoryId === id) resetCategoryForm()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete category')
    }
  }

  const startEditBook = (book: Book) => {
    const selectedPublisher = publishers.find(
      (publisher) => publisher.id === book.publisher_id
    )
    const resolvedAuthorName = book.author_name || authorNameById.get(book.author_id) || ''
    setTab('books')
    setEditingBookId(book.id)
    setBookForm({
      name: book.name,
      author_name: resolvedAuthorName,
      author_id: book.author_id,
      available_stock: book.available_stock,
      image_url: book.image_url || '',
      is_active: book.is_active,
      description: book.description || '',
      isbn: book.isbn || '',
      price: book.price,
      discount_percentage: book.discount_percentage,
      publisher_id: book.publisher_id,
      category_ids: book.categories?.map((category) => category.id) || [],
    })
    setPublisherName(selectedPublisher?.trading_name || '')
  }

  const startEditAuthor = (author: Author) => {
    setTab('authors')
    setEditingAuthorId(author.id)
    setAuthorName(author.name)
  }

  const startEditPublisher = (publisher: Publisher) => {
    setTab('publishers')
    setEditingPublisherId(publisher.id)
    setPublisherForm({
      legal_name: publisher.legal_name,
      trading_name: publisher.trading_name,
      email: publisher.email,
      mobile: publisher.mobile,
      address: publisher.address,
      city: publisher.city,
      state: publisher.state,
      country: publisher.country,
      zipcode: publisher.zipcode,
    })
  }

  const startEditCategory = (category: Category) => {
    setTab('categories')
    setEditingCategoryId(category.id)
    setCategoryName(category.name)
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Manage Catalog</h1>
        <p className="text-sm text-zinc-600">
          Create, edit, and delete books, publishers, authors, and categories.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === 'books' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}
          onClick={() => setTab('books')}
        >
          Books
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === 'publishers' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}
          onClick={() => setTab('publishers')}
        >
          Publishers
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === 'authors' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}
          onClick={() => setTab('authors')}
        >
          Authors
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === 'categories' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}
          onClick={() => setTab('categories')}
        >
          Categories
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-6 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
          Loading management data...
        </div>
      ) : (
        <>
          {tab === 'books' && (
            <>
              <form
                onSubmit={onSubmitBook}
                className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 md:grid-cols-2"
              >
                <input
                  required
                  value={bookForm.name}
                  onChange={(event) =>
                    setBookForm({ ...bookForm, name: event.target.value })
                  }
                  placeholder="Book name"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  list="author-options"
                  value={bookForm.author_name || ''}
                  onChange={(event) => {
                    const value = event.target.value
                    const selected = authors.find(
                      (author) =>
                        author.name.trim().toLowerCase() ===
                        value.trim().toLowerCase()
                    )
                    setBookForm({
                      ...bookForm,
                      author_id: selected?.id || '',
                      author_name: value,
                    })
                  }}
                  placeholder="Author"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <datalist id="author-options">
                  {authors.map((author) => (
                    <option key={author.id} value={author.name} />
                  ))}
                </datalist>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={bookForm.price}
                    onChange={(event) =>
                      setBookForm({ ...bookForm, price: Number(event.target.value) })
                    }
                    placeholder="Price"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 pr-9 text-sm"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-500">
                    ₹
                  </span>
                </div>
                <input
                  required
                  type="number"
                  min={0}
                  value={bookForm.available_stock}
                  onChange={(event) =>
                    setBookForm({
                      ...bookForm,
                      available_stock: Number(event.target.value),
                    })
                  }
                  placeholder="Stock"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-zinc-700">Categories</p>
                  <div className="flex flex-wrap gap-2 rounded-md border border-zinc-300 p-2">
                    {categories.map((category) => {
                      const isSelected = Boolean(
                        bookForm.category_ids?.includes(category.id)
                      )
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            const currentCategoryIDs = bookForm.category_ids || []
                            const updatedCategoryIDs = isSelected
                              ? currentCategoryIDs.filter(
                                  (categoryID) => categoryID !== category.id
                                )
                              : [...currentCategoryIDs, category.id]
                            setBookForm({
                              ...bookForm,
                              category_ids: updatedCategoryIDs,
                            })
                          }}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition ${
                            isSelected
                              ? 'bg-orange-100 text-orange-800 ring-orange-200'
                              : 'bg-zinc-100 text-zinc-700 ring-zinc-200 hover:bg-zinc-200'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {category.name}
                        </button>
                      )
                    })}
                    {categories.length === 0 && (
                      <span className="text-xs text-zinc-500">
                        Add categories first to assign them to books.
                      </span>
                    )}
                  </div>
                </div>
                <input
                  required
                  list="publisher-options"
                  value={publisherName}
                  onChange={(event) => {
                    const value = event.target.value
                    const selected = publishers.find(
                      (publisher) =>
                        publisher.trading_name.trim().toLowerCase() ===
                        value.trim().toLowerCase()
                    )
                    setPublisherName(value)
                    setBookForm({
                      ...bookForm,
                      publisher_id: selected?.id || '',
                    })
                  }}
                  placeholder="Publisher"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <datalist id="publisher-options">
                  {publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.trading_name} />
                  ))}
                </datalist>
                <input
                  value={bookForm.isbn || ''}
                  onChange={(event) =>
                    setBookForm({ ...bookForm, isbn: event.target.value })
                  }
                  placeholder="ISBN (optional)"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  value={bookForm.image_url || ''}
                  onChange={(event) =>
                    setBookForm({ ...bookForm, image_url: event.target.value })
                  }
                  placeholder="Image URL (optional)"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
                />
                <textarea
                  value={bookForm.description}
                  onChange={(event) =>
                    setBookForm({ ...bookForm, description: event.target.value })
                  }
                  placeholder="Description"
                  rows={4}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
                />
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    id="book-active"
                    type="checkbox"
                    checked={bookForm.is_active}
                    onChange={(event) =>
                      setBookForm({ ...bookForm, is_active: event.target.checked })
                    }
                  />
                  <label htmlFor="book-active" className="text-sm text-zinc-700">
                    Active
                  </label>
                </div>
                <div className="flex gap-2 md:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {saving ? 'Saving...' : editingBookId ? 'Update Book' : 'Create Book'}
                  </button>
                  {editingBookId && (
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
                      onClick={resetBookForm}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-900">Books</h2>
                <input
                  value={bookSearch}
                  onChange={(event) => setBookSearch(event.target.value)}
                  placeholder="Search books by title, author, or ISBN"
                  className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="pb-2 pr-4">Name</th>
                        <th className="pb-2 pr-4">Author</th>
                        <th className="pb-2 pr-4">Categories</th>
                        <th className="pb-2 pr-4">Price</th>
                        <th className="pb-2 pr-4">Stock</th>
                        <th className="pb-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className="border-t border-zinc-100">
                          <td className="py-2 pr-4 font-medium text-zinc-900">
                            {book.name}
                          </td>
                          <td className="py-2 pr-4 text-zinc-700">
                            {book.author_name || authorNameById.get(book.author_id) || '-'}
                          </td>
                          <td className="py-2 pr-4 text-zinc-700">
                            {book.categories && book.categories.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {book.categories.map((category) => (
                                  <span
                                    key={category.id}
                                    className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 ring-1 ring-orange-200"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500">No categories</span>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-zinc-700">
                            {formatPrice(book.price)}
                          </td>
                          <td className="py-2 pr-4 text-zinc-700">
                            {book.available_stock}
                          </td>
                          <td className="py-2 pr-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white"
                                onClick={() => startEditBook(book)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-rose-600 px-2 py-1 text-xs text-white"
                                onClick={() => void onDeleteBook(book.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'authors' && (
            <>
              <form
                onSubmit={onSubmitAuthor}
                className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 md:grid-cols-[1fr_auto_auto]"
              >
                <input
                  required
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
                  placeholder="Author name"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {saving
                    ? 'Saving...'
                    : editingAuthorId
                      ? 'Update Author'
                      : 'Create Author'}
                </button>
                {editingAuthorId && (
                  <button
                    type="button"
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
                    onClick={resetAuthorForm}
                  >
                    Cancel
                  </button>
                )}
              </form>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-900">Authors</h2>
                <input
                  value={authorSearch}
                  onChange={(event) => setAuthorSearch(event.target.value)}
                  placeholder="Search authors by name"
                  className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="mt-3 space-y-2">
                  {filteredAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                    >
                      <span className="text-sm text-zinc-800">{author.name}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white"
                          onClick={() => startEditAuthor(author)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-rose-600 px-2 py-1 text-xs text-white"
                          onClick={() => void onDeleteAuthor(author.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'publishers' && (
            <>
              <form
                onSubmit={onSubmitPublisher}
                className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 md:grid-cols-2"
              >
                <input
                  required
                  value={publisherForm.legal_name}
                  onChange={(event) =>
                    setPublisherForm({
                      ...publisherForm,
                      legal_name: event.target.value,
                    })
                  }
                  placeholder="Legal name"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.trading_name}
                  onChange={(event) =>
                    setPublisherForm({
                      ...publisherForm,
                      trading_name: event.target.value,
                    })
                  }
                  placeholder="Trading name"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  type="email"
                  value={publisherForm.email}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, email: event.target.value })
                  }
                  placeholder="Email"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.mobile}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, mobile: event.target.value })
                  }
                  placeholder="Mobile (+123...)"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.address}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, address: event.target.value })
                  }
                  placeholder="Address"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  required
                  value={publisherForm.city}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, city: event.target.value })
                  }
                  placeholder="City"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.state}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, state: event.target.value })
                  }
                  placeholder="State"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.country}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, country: event.target.value })
                  }
                  placeholder="Country"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={publisherForm.zipcode}
                  onChange={(event) =>
                    setPublisherForm({ ...publisherForm, zipcode: event.target.value })
                  }
                  placeholder="Zipcode"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2 md:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {saving
                      ? 'Saving...'
                      : editingPublisherId
                        ? 'Update Publisher'
                        : 'Create Publisher'}
                  </button>
                  {editingPublisherId && (
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
                      onClick={resetPublisherForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-900">Publishers</h2>
                <input
                  value={publisherSearch}
                  onChange={(event) => setPublisherSearch(event.target.value)}
                  placeholder="Search publishers by name"
                  className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="pb-2 pr-4">Name</th>
                        <th className="pb-2 pr-4">Email</th>
                        <th className="pb-2 pr-4">City</th>
                        <th className="pb-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPublishers.map((publisher) => (
                        <tr key={publisher.id} className="border-t border-zinc-100">
                          <td className="py-2 pr-4 font-medium text-zinc-900">
                            {publisher.trading_name}
                          </td>
                          <td className="py-2 pr-4 text-zinc-700">{publisher.email}</td>
                          <td className="py-2 pr-4 text-zinc-700">{publisher.city}</td>
                          <td className="py-2 pr-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white"
                                onClick={() => startEditPublisher(publisher)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-rose-600 px-2 py-1 text-xs text-white"
                                onClick={() => void onDeletePublisher(publisher.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'categories' && (
            <>
              <form
                onSubmit={onSubmitCategory}
                className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 md:grid-cols-[1fr_auto_auto]"
              >
                <input
                  required
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Category name"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {saving
                    ? 'Saving...'
                    : editingCategoryId
                      ? 'Update Category'
                      : 'Create Category'}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
                    onClick={resetCategoryForm}
                  >
                    Cancel
                  </button>
                )}
              </form>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-900">Categories</h2>
                <div className="mt-3 space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                    >
                      <span className="text-sm text-zinc-800">{category.name}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white"
                          onClick={() => startEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-rose-600 px-2 py-1 text-xs text-white"
                          onClick={() => void onDeleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
