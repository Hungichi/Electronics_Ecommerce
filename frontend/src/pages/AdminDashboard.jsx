import { useEffect, useState } from 'react'
import { productApi, adminProductApi } from '../services/api'
import './AdminDashboard.css'

// Shape used when the form is empty (creating a new product).
// Strings are used for numeric fields because <input> values are always strings;
// we convert them with Number(...) right before sending to the API.
const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  category: '',
  brand: '',
  stock: '',
  images: '',         // textarea: one image URL per line
  isFeatured: false,
  isActive: true,
}

function AdminDashboard() {
  // Product list shown in the table.
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Form state, shared between "create" and "edit" mode.
  const [form, setForm] = useState(EMPTY_FORM)
  // null = creating new; a product id = editing that product.
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  // Inline success/error banner shown above the submit button.
  const [message, setMessage] = useState('')

  // Pulls every product from the backend so the table can render them.
  // Called on mount and after every mutation (create / update / delete / toggle).
  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productApi.list({ limit: 100, sortBy: 'createdAt', order: 'desc' })
      setProducts(data.products || [])
    } catch (err) {
      setError(err.message || 'Không tải được danh sách')
    } finally {
      setLoading(false)
    }
  }

  // Empty dependency array means: only fire once, when the component mounts.
  useEffect(() => { loadProducts() }, [])

  // One change handler for every form input.
  // Reads the `name` attribute of the input and updates the corresponding key in `form`.
  // Special-cases checkboxes so we store the `checked` boolean instead of the value string.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Switches the form into "edit" mode by loading the row's data into the form.
  const startEdit = (p) => {
    setEditingId(p._id)
    setForm({
      name: p.name || '',
      price: p.price ?? '',
      description: p.description || '',
      category: p.category || '',
      brand: p.brand || '',
      stock: p.stock ?? '',
      // Convert the images array back into newline-separated text for the textarea.
      images: (p.images || []).join('\n'),
      isFeatured: !!p.isFeatured,
      isActive: p.isActive !== false,
    })
    setMessage('')
    // UX nicety: scroll the form into view so the admin doesn't have to scroll up manually.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Resets the form back to its empty default and exits "edit" mode.
  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setMessage('')
  }

  // Submit handler. Decides whether to POST (create) or PUT (update) based on `editingId`.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      // Build the payload the backend expects:
      //  - convert numeric fields from string to number
      //  - convert the images textarea (one URL per line) into a real array
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      if (editingId) {
        // PUT /admin/products/:id
        await adminProductApi.update(editingId, payload)
        setMessage('Cập nhật sản phẩm thành công.')
      } else {
        // POST /admin/products
        await adminProductApi.create(payload)
        setMessage('Thêm sản phẩm thành công.')
      }
      // Clear the form and refresh the table so the new/updated row shows up.
      cancelEdit()
      await loadProducts()
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  // Confirm dialog -> DELETE /admin/products/:id -> reload list.
  const handleDelete = async (p) => {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return
    try {
      await adminProductApi.remove(p._id)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Xóa thất bại')
    }
  }

  // PATCH endpoint: backend flips the boolean for us, then we re-fetch to update the table.
  const handleToggleFeatured = async (p) => {
    try {
      await adminProductApi.toggleFeatured(p._id)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Thao tác thất bại')
    }
  }

  const handleToggleActive = async (p) => {
    try {
      await adminProductApi.toggleActive(p._id)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Thao tác thất bại')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Quản lý sản phẩm</p>
      </div>

      <div className="admin-body">
        {/* Form */}
        <section className="admin-card">
          <h2 className="admin-card-title">
            {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Giá ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Danh mục *</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="laptops, desktops, parts..."
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Thương hiệu</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label>Tồn kho</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="admin-form-group">
              <label>Hình ảnh (URL, mỗi URL 1 dòng)</label>
              <textarea
                name="images"
                value={form.images}
                onChange={handleChange}
                rows={3}
                placeholder="https://example.com/image1.jpg"
              />
            </div>

            <div className="admin-form-row admin-checkbox-row">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                Featured
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>

            {message && <div className="admin-message">{message}</div>}

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm sản phẩm')}
              </button>
              {editingId && (
                <button type="button" className="admin-btn-secondary" onClick={cancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List */}
        <section className="admin-card">
          <h2 className="admin-card-title">Danh sách sản phẩm</h2>

          {loading && <p className="admin-state">Đang tải...</p>}
          {error && <p className="admin-state error">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="admin-state">Chưa có sản phẩm nào.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Featured</th>
                    <th>Active</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.name} className="admin-thumb" />
                        )}
                      </td>
                      <td className="admin-cell-name">{p.name}</td>
                      <td>{p.category}</td>
                      <td>${Number(p.price).toFixed(2)}</td>
                      <td>{p.stock ?? 0}</td>
                      <td>
                        <button
                          className={`admin-toggle ${p.isFeatured ? 'on' : 'off'}`}
                          onClick={() => handleToggleFeatured(p)}
                        >
                          {p.isFeatured ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td>
                        <button
                          className={`admin-toggle ${p.isActive ? 'on' : 'off'}`}
                          onClick={() => handleToggleActive(p)}
                        >
                          {p.isActive ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-edit" onClick={() => startEdit(p)}>Sửa</button>
                          <button className="admin-btn-delete" onClick={() => handleDelete(p)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
