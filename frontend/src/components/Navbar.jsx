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
          <a href="/products?category=laptops" className="nav-link">Laptops</a>
          <a href="/products?category=desktops" className="nav-link">Desktop PCs</a>
          <a href="/products?category=parts" className="nav-link">PC Parts</a>
          <a href="/products?category=other" className="nav-link">All Other Products</a>
        </div>

        {/* Right Section */}
        <div className='user-section'>
          <button className="deals-btn">Our Deals</button>
          <CiSearch className='search-icon' />
          <div className="cart-wrapper">
            <IoCartOutline className='cart-icon' />
            <span className="cart-badge">0</span>
          </div>
          <div className="profile-avatar">
            <CgProfile className='profile-icon' />
          </div>
        </div>
      </div>
      <div className="nav-divider"></div>
    </nav>
  )
}

export default Navbar
