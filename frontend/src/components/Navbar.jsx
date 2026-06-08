import { Link } from 'react-router-dom'
import './Navbar.css'
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useCart } from '../context/CartContext'


function Navbar() {
  // totalItems comes from CartContext and re-renders the badge whenever the cart changes.
  const { totalItems } = useCart()

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
          <button className="deals-btn">Our Deals</button>
          <CiSearch className='search-icon' />
          {/* Link goes to /cart; badge shows the live total quantity. */}
          <Link to="/cart" className="cart-wrapper">
            <IoCartOutline className='cart-icon' />
            <span className="cart-badge">{totalItems}</span>
          </Link>
          <a href='/login' className="profile-avatar">
            <CgProfile className='profile-icon' />
          </a>
        </div>
      </div>
      <div className="nav-divider"></div>
    </nav>
  )
}

export default Navbar
