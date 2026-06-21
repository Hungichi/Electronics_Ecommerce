// URL gốc của backend (port 8000)
const API_URL = 'http://localhost:8000'

// Đọc token đã lưu trong localStorage để đính kèm vào mọi request
function getStoredToken() {
  try {
    const raw = localStorage.getItem('auth.user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch {
    return null
  }
}

// Hàm gọi API dùng chung — bọc lại fetch cho gọn
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getStoredToken()
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Có token thì kèm "Authorization: Bearer ..." để backend biết user là ai
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }
  // Có body thì stringify rồi đính vào (POST/PUT/PATCH)
  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(`${API_URL}${path}`, opts)

  // Đọc text trước, sau đó parse JSON — phòng khi body rỗng hoặc không phải JSON
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  // fetch không tự throw khi status >= 400, phải tự check
  if (!res.ok) {
    const message = typeof data === 'string' ? data : (data?.message || `Request failed (${res.status})`)
    const error = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

// ── Auth ─────────────────────────────────────────────────
export const authApi = {
  // POST /auth/register — tạo user mới, trả về user + token
  register: ({ username, email, password }) =>
    request('/auth/register', { method: 'POST', body: { username, email, password } }),

  // POST /auth/login — kiểm tra mật khẩu, trả về user + token
  login: ({ username, password }) =>
    request('/auth/login', { method: 'POST', body: { username, password } }),
}

// ── User profile (cần JWT) ───────────────────────────────
export const userApi = {
  // Lấy hồ sơ user đang đăng nhập
  getMe: () => request('/users/me'),

  // Cập nhật email/phone/avatar/addresses
  updateMe: (payload) => request('/users/me', { method: 'PUT', body: payload }),

  // Đổi mật khẩu (cần nhập mật khẩu cũ để xác thực)
  changePassword: (currentPassword, newPassword) =>
    request('/users/me/password', { method: 'PUT', body: { currentPassword, newPassword } }),
}

// ── Sản phẩm public ──────────────────────────────────────
export const productApi = {
  // Lấy danh sách sản phẩm — params có thể có category, sort, page, ...
  list: (params = {}) => {
    const qs = new URLSearchParams()
    // Bỏ qua các giá trị rỗng để URL không có ?category=&search=
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, v)
    })
    const query = qs.toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },

  // Lấy chi tiết 1 sản phẩm theo id
  getById: (id) => request(`/products/${id}`),
}

// ── Giỏ hàng (mỗi user 1 cart riêng) ─────────────────────
export const cartApi = {
  get: (userId) => request(`/cart/${userId}`),
  addItem: (userId, product_id, quantity = 1) =>
    request(`/cart/${userId}/items`, { method: 'POST', body: { product_id, quantity } }),
  updateItem: (userId, productId, quantity) =>
    request(`/cart/${userId}/items/${productId}`, { method: 'PUT', body: { quantity } }),
  removeItem: (userId, productId) =>
    request(`/cart/${userId}/items/${productId}`, { method: 'DELETE' }),
  clear: (userId) => request(`/cart/${userId}`, { method: 'DELETE' }),
}

// ── Admin: CRUD sản phẩm ─────────────────────────────────
export const adminProductApi = {
  create: (product) => request('/admin/products', { method: 'POST', body: product }),
  update: (id, product) => request(`/admin/products/${id}`, { method: 'PUT', body: product }),
  remove: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  // PATCH chỉ đổi 1 field — lật giá trị featured/active
  toggleFeatured: (id) => request(`/admin/products/${id}/toggle-featured`, { method: 'PATCH' }),
  toggleActive: (id) => request(`/admin/products/${id}/toggle-active`, { method: 'PATCH' }),
}

export default API_URL
