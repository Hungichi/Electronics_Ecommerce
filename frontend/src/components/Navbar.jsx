import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'


function Navbar() {
  // totalItems từ CartContext → badge tự cập nhật mỗi khi cart đổi
  const { totalItems } = useCart()
  // user null khi chưa login, có data khi đã login
  const { user, logout, isAdmin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  // Đăng xuất → xóa user → CartContext tự reset (vì useEffect phụ thuộc user)
  const handleLogout = () => {
    logout()
    toast.success('Đã đăng xuất')
    navigate('/')
  }

  return (
    <nav>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">Electronics Shop</div>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products?category=laptops" className="nav-link">Laptops</Link>
          <Link to="/products?category=desktops" className="nav-link">Desktop PCs</Link>
          <Link to="/products?category=parts" className="nav-link">PC Parts</Link>
          <Link to="/products?category=other" className="nav-link">All Other Products</Link>
        </div>

        {/* Right Section */}
        <div className='user-section'>
          <CiSearch className='search-icon' />

          {/* Link goes to /cart; badge shows the live total quantity. */}
          <Link to="/cart" className="cart-wrapper">
            <IoCartOutline className='cart-icon' />
            <span className="cart-badge">{totalItems}</span>
          </Link>

          {/* Avatar + dropdown hover. Nội dung dropdown đổi theo trạng thái login */}
          <div className="profile-wrapper">
            <div className="profile-avatar">
              <CgProfile className='profile-icon' />
            </div>
            <div className="profile-dropdown">
              {user ? (
                <>
                  <div className="dropdown-greeting">
                    Xin chào, <strong>{user.username}</strong>
                  </div>
                  <Link to="/profile" className="dropdown-item">My Account</Link>
                  <Link to="/cart" className="dropdown-item">My Cart ({totalItems})</Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                  )}
                  <button className="dropdown-item dropdown-signout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">Sign In</Link>
                  <Link to="/register" className="dropdown-item">Create an Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="nav-divider"></div>
    </nav>
  )
}

export default Navbar
