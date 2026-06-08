import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // The cart object returned by the backend (or null when the user isn't logged in).
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const userId = user?._id

  // Whenever the logged-in user changes (login/logout), reload the cart from the server.
  useEffect(() => {
    if (!userId) {
      setCart(null)
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

  // ── Mutations ────────────────────────────────────────
  // Each helper requires a logged-in user (we silently skip if not).

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!userId) throw new Error('Bạn cần đăng nhập để thêm vào giỏ hàng')
    const data = await cartApi.addItem(userId, productId, quantity)
    setCart(data)
    return data
  }, [userId])

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

  // ── Derived values ───────────────────────────────────
  // Total number of physical items in the cart (sum of quantities).
  const totalItems = useMemo(
    () => (cart?.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0),
    [cart]
  )

  // Subtotal of all items priced in USD.
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
