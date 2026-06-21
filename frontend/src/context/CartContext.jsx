import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Cart object backend trả về (null khi chưa login)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const userId = user?._id

  // Mỗi khi user đổi (login/logout) thì fetch lại cart
  useEffect(() => {
    if (!userId) {
      setCart(null)   // logout → xóa cart khỏi state
      return
    }
    let aborted = false
    setLoading(true)
    cartApi.get(userId)
      .then((data) => { if (!aborted) setCart(data) })
      .catch((err)  => { if (!aborted) setError(err.message || 'Không tải được giỏ hàng') })
      .finally(()   => { if (!aborted) setLoading(false) })
    return () => { aborted = true }
  }, [userId])

  // Thêm sản phẩm — nếu đã có thì backend tự +qty
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!userId) throw new Error('Bạn cần đăng nhập để thêm vào giỏ hàng')
    const data = await cartApi.addItem(userId, productId, quantity)
    setCart(data)
    return data
  }, [userId])

  // Đổi số lượng — qty <= 0 thì backend tự xóa item
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!userId) return
    const data = await cartApi.updateItem(userId, productId, quantity)
    setCart(data)
    return data
  }, [userId])

  const removeItem = useCallback(async (productId) => {
    if (!userId) return
    const data = await cartApi.removeItem(userId, productId)
    setCart(data)
    return data
  }, [userId])

  const clearCart = useCallback(async () => {
    if (!userId) return
    await cartApi.clear(userId)
    setCart((c) => (c ? { ...c, items: [] } : c))
  }, [userId])

  // Tổng số lượng — để hiện badge trên navbar
  // useMemo: chỉ tính lại khi cart đổi, tránh tính mỗi lần render
  const totalItems = useMemo(
    () => (cart?.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0),
    [cart]
  )

  // Tổng tiền = sum(giá × số lượng)
  const subtotal = useMemo(
    () => (cart?.items || []).reduce(
      (sum, it) => sum + (it.product_id?.price || 0) * (it.quantity || 0),
      0
    ),
    [cart]
  )

  const value = {
    cart,
    items: cart?.items || [],
    loading,
    error,
    totalItems,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
