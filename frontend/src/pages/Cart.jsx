import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { FaTrashAlt } from 'react-icons/fa'
import './Cart.css'

function Cart() {
  // user comes from AuthContext; if null, we show a "please log in" state.
  const { user } = useAuth()
  // Everything cart-related (items, totals, mutations) comes from CartContext.
  const { items, subtotal, totalItems, loading, error, updateQuantity, removeItem, clearCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  // Quantity +/- buttons: call backend through the context helper.
  const handleQuantityChange = async (productId, delta, current) => {
    const next = Math.max(1, current + delta)
    if (next === current) return
    try {
      await updateQuantity(productId, next)
    } catch (err) {
      toast.error(err.message || 'Cập nhật thất bại')
    }
  }

  // Manual input box: lets the user type a quantity directly.
  const handleQuantityInput = async (productId, value) => {
    const qty = parseInt(value, 10)
    if (!qty || qty < 1) return
    try {
      await updateQuantity(productId, qty)
    } catch (err) {
      toast.error(err.message || 'Cập nhật thất bại')
    }
  }

  const handleRemove = async (productId, name) => {
    try {
      await removeItem(productId)
      toast.success(`Đã xóa "${name}" khỏi giỏ hàng`)
    } catch (err) {
      toast.error(err.message || 'Xóa thất bại')
    }
  }

  const handleClear = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return
    try {
      await clearCart()
      toast.success('Đã xóa toàn bộ giỏ hàng')
    } catch (err) {
      toast.error(err.message || 'Xóa thất bại')
    }
  }

  const handleCheckout = () => {
    toast.info('Chức năng thanh toán đang được phát triển')
  }

  // ── Render branches ──────────────────────────────────

  // Not logged in -> show a CTA to log in.
  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <p className="cart-breadcrumb">Home &nbsp;› &nbsp;Cart</p>
          <h1 className="cart-title">Shopping Cart</h1>
        </div>
        <div className="cart-empty">
          <p>Bạn cần đăng nhập để xem giỏ hàng.</p>
          <button className="cart-cta-btn" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <p className="cart-breadcrumb">Home &nbsp;› &nbsp;Cart</p>
        <h1 className="cart-title">Shopping Cart</h1>
      </div>

      <div className="cart-body">
        {/* LEFT: list of items */}
        <div className="cart-main">
          {loading && <div className="cart-state">Đang tải...</div>}
          {error && <div className="cart-state error">{error}</div>}

          {/* Empty cart state */}
          {!loading && !error && items.length === 0 && (
            <div className="cart-empty">
              <p>Giỏ hàng trống.</p>
              <Link to="/products" className="cart-cta-btn">Mua sắm ngay</Link>
            </div>
          )}

          {/* Cart has items: render the table */}
          {!loading && !error && items.length > 0 && (
            <>
              <div className="cart-table">
                <div className="cart-row cart-row-header">
                  <div className="cart-col cart-col-product">Sản phẩm</div>
                  <div className="cart-col cart-col-price">Đơn giá</div>
                  <div className="cart-col cart-col-qty">Số lượng</div>
                  <div className="cart-col cart-col-subtotal">Thành tiền</div>
                  <div className="cart-col cart-col-action"></div>
                </div>

                {items.map((item) => {
                  const p = item.product_id
                  // Defensive: if a product was deleted, populated field is null.
                  if (!p) return null
                  const lineTotal = (p.price || 0) * item.quantity
                  return (
                    <div key={p._id} className="cart-row">
                      <div className="cart-col cart-col-product">
                        <div className="cart-thumb" style={{ backgroundImage: p.images?.[0] ? `url(${p.images[0]})` : 'none' }} />
                        <div className="cart-product-info">
                          <Link to={`/products/${p._id}`} className="cart-product-name">{p.name}</Link>
                          <span className="cart-product-meta">{p.category}{p.brand ? ` • ${p.brand}` : ''}</span>
                        </div>
                      </div>
                      <div className="cart-col cart-col-price">
                        ${Number(p.price).toFixed(2)}
                      </div>
                      <div className="cart-col cart-col-qty">
                        <div className="qty-control">
                          <button onClick={() => handleQuantityChange(p._id, -1, item.quantity)} disabled={item.quantity <= 1}>−</button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInput(p._id, e.target.value)}
                          />
                          <button onClick={() => handleQuantityChange(p._id, 1, item.quantity)}>+</button>
                        </div>
                      </div>
                      <div className="cart-col cart-col-subtotal">
                        ${lineTotal.toFixed(2)}
                      </div>
                      <div className="cart-col cart-col-action">
                        <button className="cart-remove-btn" onClick={() => handleRemove(p._id, p.name)} title="Remove">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="cart-actions-row">
                <Link to="/products" className="cart-link-btn">← Tiếp tục mua sắm</Link>
                <button className="cart-link-btn cart-clear-btn" onClick={handleClear}>Xóa toàn bộ</button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: order summary (only when there are items) */}
        {items.length > 0 && (
          <aside className="cart-summary">
            <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>
            <div className="cart-summary-row">
              <span>Số sản phẩm</span>
              <span>{totalItems}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tạm tính</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row cart-summary-total">
              <span>Tổng cộng</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="cart-checkout-btn" onClick={handleCheckout}>Thanh toán</button>
          </aside>
        )}
      </div>
    </div>
  )
}

export default Cart
