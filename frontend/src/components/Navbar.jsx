import './Navbar.css'
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">Electronics Shop</div>
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/products?category=laptops" className="nav-link">Laptops</a>
          <a href="/products?category=desktops" className="nav-link">Desktop PCs</a>
          <a href="/products?category=parts" className="nav-link">PC Parts</a>
          <a href="/products?category=other" className="nav-link">All Other Products</a>
        </div>

        {/* Right Section */}
        <div className='user-section'>
          <CiSearch className='search-icon' />
          <div className="cart-wrapper">
            <IoCartOutline className='cart-icon' />
            <span className="cart-badge">0</span>
          </div>
          <div className="profile-wrapper">
            <div className="profile-avatar">
              <CgProfile className='profile-icon' />
            </div>
            <div className="profile-dropdown">
              <a href="/account" className="dropdown-item">My Account</a>
              <a href="/wishlist" className="dropdown-item">My Wish List (0)</a>
              <a href="/register" className="dropdown-item">Create an Account</a>
              <a href="/login" className="dropdown-item">Sign In</a>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-divider"></div>
    </nav>
  )
}

export default Navbar
