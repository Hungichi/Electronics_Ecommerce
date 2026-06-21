import { useEffect, useState } from 'react'
import { productApi, adminProductApi } from '../services/api'
import './AdminDashboard.css'

// Giá trị mặc định khi form trống (lúc đang tạo mới)
// Dùng string cho price/stock vì <input> luôn trả về string,
// sẽ Number() trước khi gửi cho backend
const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  category: '',
  brand: '',
  stock: '',
  images: '',         // textarea: mỗi URL 1 dòng
  isFeatured: false,
  isActive: true,
}

function AdminDashboard() {
  // Danh sách sản phẩm hiển thị trong bảng
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // State của form — dùng chung cho cả thêm mới lẫn sửa
  const [form, setForm] = useState(EMPTY_FORM)
  // null = đang thêm mới, có id = đang sửa sản phẩm đó
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Lấy hết sản phẩm để render bảng (gọi khi mount + sau mỗi action)
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

  // Mảng dep rỗng [] → chỉ chạy 1 lần khi mount
  useEffect(() => { loadProducts() }, [])

  // 1 handler dùng chung cho mọi input — đọc attribute name của input
  // rồi update đúng key tương ứng trong state form
  // Checkbox xử lý riêng: lấy checked thay vì value
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Click "Sửa" → load data sản phẩm vào form
  const startEdit = (p) => {
    setEditingId(p._id)
    setForm({
      name: p.name || '',
      price: p.price ?? '',
      description: p.description || '',
      category: p.category || '',
      brand: p.brand || '',
      stock: p.stock ?? '',
      // Mảng URL → text textarea (mỗi URL 1 dòng)
      images: (p.images || []).join('\n'),
      isFeatured: !!p.isFeatured,
      isActive: p.isActive !== false,
    })
    setMessage('')
    // Cuộn lên đầu trang để admin không phải tự kéo lên form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset form về trạng thái thêm mới
  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setMessage('')
  }

  // Submit: editingId có giá trị → PUT (sửa), không có → POST (thêm mới)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      // Chuẩn bị payload gửi cho backend:
      //  - Convert số (Number) vì input trả về string
      //  - Tách textarea images theo \n thành mảng URL
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      if (editingId) {
        await adminProductApi.update(editingId, payload)
        setMessage('Cập nhật sản phẩm thành công.')
      } else {
        await adminProductApi.create(payload)
        setMessage('Thêm sản phẩm thành công.')
      }
      // Reset form + reload bảng để hiện sản phẩm vừa thêm/sửa
      cancelEdit()
      await loadProducts()
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  // Hiện dialog xác nhận trước khi xóa
  const handleDelete = async (p) => {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return
    try {
      await adminProductApi.remove(p._id)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Xóa thất bại')
    }
  }

  // PATCH → backend tự lật boolean → reload để cập nhật UI
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
