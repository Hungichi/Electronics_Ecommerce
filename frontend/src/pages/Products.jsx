import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productApi } from '../services/api'
import './Products.css'

// Dropdown options. The value is "<field>:<order>" so we can split() it later
// and send it to the backend as `sortBy` + `order`.
const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'price:asc',      label: 'Price: Low to High' },
  { value: 'price:desc',     label: 'Price: High to Low' },
  { value: 'rating:desc',    label: 'Top Rated' },
  { value: 'sold:desc',      label: 'Best Sellers' },
  { value: 'name:asc',       label: 'Name: A-Z' },
]

function Products() {
  // useSearchParams gives us the URL query string as a manageable object.
  // store filter state in the URL so it survives reloads and can be shared.
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Read each filter from the URL (with sensible defaults).
  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort     = searchParams.get('sort')     || 'createdAt:desc'
  const page     = parseInt(searchParams.get('page') || '1', 10)
  const limit    = parseInt(searchParams.get('limit') || '12', 10)

  // Local copies of the input fields. We don't push them to the URL on every keystroke;
  // we only commit them when the user submits the filter form.
  const [searchInput, setSearchInput] = useState(search)
  const [minInput, setMinInput] = useState(minPrice)
  const [maxInput, setMaxInput] = useState(maxPrice)

  // Re-fetch the product list whenever any filter (in the URL) changes.
  useEffect(() => {
    // `aborted` is the classic "abort the previous request" trick.
    // If the user changes filters quickly, an older response could overwrite the newer one.
    // We flip this flag in the cleanup function so stale responses are ignored.
    let aborted = false
    setLoading(true)
    setError('')

    // Split "price:asc" -> { sortBy: 'price', order: 'asc' } for the backend.
    const [sortBy, order] = sort.split(':')
    const params = { page, limit, sortBy, order }
    if (category) params.category = category
    if (search)   params.search = search
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    // GET /products?... -> { pagination, products }
    productApi.list(params)
      .then((data) => {
        if (aborted) return
        setProducts(data.products || [])
        setPagination(data.pagination || null)
      })
      .catch((err) => {
        if (aborted) return
        setError(err.message || 'Không tải được danh sách sản phẩm')
      })
      .finally(() => !aborted && setLoading(false))

    // Cleanup runs before the next effect or when the component unmounts.
    return () => { aborted = true }
  }, [category, search, minPrice, maxPrice, sort, page, limit])

  // Helper to mutate the URL query string.
  // Passing { page: undefined } would delete `page`; numbers and strings are set as-is.
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) next.delete(k)
      else next.set(k, v)
    })
    // Reset to page 1 whenever any non-page filter changes (page 5 may not exist anymore).
    if (!('page' in changes)) next.set('page', '1')
    setSearchParams(next)
  }

  // "Apply" button on the sidebar -> commit local inputs into the URL.
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    updateParams({ search: searchInput, minPrice: minInput, maxPrice: maxInput })
  }

  // "Clear" button -> wipe all filters by replacing the URL with an empty query.
  const clearFilters = () => {
    setSearchInput('')
    setMinInput('')
    setMaxInput('')
    setSearchParams({})
  }

  // Pretty label for the breadcrumb (capitalize the category slug).
  const categoryLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'

  return (
    <div className="products-page">
      <div className="products-header">
        <p className="products-breadcrumb">Home &nbsp;› &nbsp;{categoryLabel}</p>
        <h1 className="products-title">{categoryLabel}</h1>
      </div>

      <div className="products-body">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <h3 className="sidebar-title">Filters</h3>

          <form onSubmit={handleSearchSubmit} className="filter-form">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                value={searchInput}
                placeholder="Search products..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Price Range ($)</label>
              <div className="price-row">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="filter-btn-apply">Apply</button>
              <button type="button" className="filter-btn-clear" onClick={clearFilters}>Clear</button>
            </div>
          </form>

          <div className="filter-group">
            <label>Category</label>
            <ul className="category-list">
              {['', 'laptops', 'desktops', 'parts', 'other'].map((cat) => (
                <li key={cat || 'all'}>
                  <button
                    className={`category-link${category === cat ? ' active' : ''}`}
                    onClick={() => updateParams({ category: cat })}
                  >
                    {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="products-main">
          <div className="products-toolbar">
            <span className="results-count">
              {pagination ? `${pagination.total} products found` : ''}
            </span>
            <div className="sort-control">
              <label>Sort by:</label>
              <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Three exclusive UI states: loading, error, empty result. */}
          {loading && <div className="products-state">Loading...</div>}
          {error && <div className="products-state error">{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div className="products-state">No products found.</div>
          )}

          {/* Happy path: render the product grid. */}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((p) => (
                // Each card is a Link, so clicking anywhere on it navigates to the detail page.
                <Link key={p._id} to={`/products/${p._id}`} className="product-grid-card">
                  <div
                    className="product-grid-image"
                    style={{ backgroundImage: p.images?.[0] ? `url(${p.images[0]})` : 'none' }}
                  />
                  <div className="product-grid-status">
                    <span className={`stock-badge ${p.stock > 0 ? 'in' : 'out'}`}>
                      {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <p className="product-grid-rating">Reviews ({p.numReviews || 0})</p>
                  <h3 className="product-grid-name">{p.name}</h3>
                  <p className="product-grid-price">${Number(p.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination is only rendered when there is more than one page. */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => updateParams({ page: page - 1 })}
              >&lt; Prev</button>
              <span>Page {pagination.page} / {pagination.totalPages}</span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => updateParams({ page: page + 1 })}
              >Next &gt;</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Products
