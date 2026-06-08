// Base URL of the Express backend. Change this to your deployed URL in production.
const API_URL = 'http://localhost:8000'

// Generic HTTP helper used by every API function below.
// - Adds the JSON content-type header automatically
// - Serializes the body with JSON.stringify
// - Parses the response back into a JS object
// - Throws an Error with the server message when the response is not OK (status >= 400)
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }
  // Only attach a body when one is provided (GET/DELETE usually don't send a body).
  if (body !== undefined) opts.body = JSON.stringify(body)

  // Fire the actual HTTP request using the browser's built-in fetch API.
  const res = await fetch(`${API_URL}${path}`, opts)

  // Read the raw text first so we can still recover when the body is empty
  // or not valid JSON (e.g. plain text error messages from Express).
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  // fetch() does NOT throw on HTTP errors, so we have to check `res.ok` manually.
  if (!res.ok) {
    const message = typeof data === 'string' ? data : (data?.message || `Request failed (${res.status})`)
    const error = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

// ── Auth endpoints ───────────────────────────────────────
// Wrap each backend route in a tiny function so the rest of the app
// never has to know the URL or HTTP method directly.
export const authApi = {
  // POST /auth/register -> creates a new user and returns the user object
  register: ({ username, email, password }) =>
    request('/auth/register', { method: 'POST', body: { username, email, password } }),

  // POST /auth/login -> validates credentials and returns the user object (with `admin` flag)
  login: ({ username, password }) =>
    request('/auth/login', { method: 'POST', body: { username, password } }),
}

// ── Public product endpoints (no auth required) ──────────
export const productApi = {
  // GET /products?page=...&category=...&sortBy=...&order=...
  // Builds a query string from the params object and calls the listing endpoint.
  list: (params = {}) => {
    const qs = new URLSearchParams()
    // Skip empty/null/undefined values so the URL stays clean.
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, v)
    })
    const query = qs.toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },

  // GET /products/:id -> returns a single product
  getById: (id) => request(`/products/${id}`),
}

// ── Cart endpoints (scoped per user) ─────────────────────
// Every endpoint takes the user's _id as the first path segment.
export const cartApi = {
  // GET /cart/:userId -> returns the cart with populated product details
  get: (userId) => request(`/cart/${userId}`),

  // POST /cart/:userId/items -> adds a product (or increments quantity if it's already there)
  addItem: (userId, product_id, quantity = 1) =>
    request(`/cart/${userId}/items`, { method: 'POST', body: { product_id, quantity } }),

  // PUT /cart/:userId/items/:productId -> sets the quantity of an item
  updateItem: (userId, productId, quantity) =>
    request(`/cart/${userId}/items/${productId}`, { method: 'PUT', body: { quantity } }),

  // DELETE /cart/:userId/items/:productId -> removes one item
  removeItem: (userId, productId) =>
    request(`/cart/${userId}/items/${productId}`, { method: 'DELETE' }),

  // DELETE /cart/:userId -> empties the cart
  clear: (userId) => request(`/cart/${userId}`, { method: 'DELETE' }),
}

// ── Admin product endpoints (CRUD + toggles) ─────────────
// Used by the AdminDashboard page only.
export const adminProductApi = {
  // POST /admin/products -> create a new product from the form payload
  create: (product) => request('/admin/products', { method: 'POST', body: product }),

  // PUT /admin/products/:id -> replace the product with the new payload
  update: (id, product) => request(`/admin/products/${id}`, { method: 'PUT', body: product }),

  // DELETE /admin/products/:id -> remove the product
  remove: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),

  // PATCH /admin/products/:id/toggle-featured -> flips the isFeatured boolean
  toggleFeatured: (id) => request(`/admin/products/${id}/toggle-featured`, { method: 'PATCH' }),

  // PATCH /admin/products/:id/toggle-active -> flips the isActive boolean
  toggleActive: (id) => request(`/admin/products/${id}/toggle-active`, { method: 'PATCH' }),
}

export default API_URL
