import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

import product1 from '../assets/products/product1.svg'
import product2 from '../assets/products/product2.svg'
import product3 from '../assets/products/product3.svg'
import product4 from '../assets/products/product4.svg'
import product5 from '../assets/products/product5.svg'
import product6 from '../assets/products/product6.svg'


const bannerImages = [
  'https://blog.withdipp.com/hubfs/BlogFeatureMSi.jpg',
  'https://storage-asset.msi.com/us/picture/event/2021/cnd/us-flat-is-back/msi-us-flate-banner.jpg',
  'https://dlcdnimgs.asus.com/websites/global/productcustomizedTab/1460/images/banner-00.jpg',
]

const newProducts = [
  {
    id: 1,
    title: 'MSI Pro 16 Flex-036AU',
    price: '$499.00',
    image: product1,
    inStock: true,
    rating: 4,
  },
  {
    id: 2,
    title: 'MSI All-In-One 27″',
    price: '$899.00',
    image: product2,
    inStock: true,
    rating: 5,
  },
  {
    id: 3,
    title: 'Gaming Notebook X15',
    price: '$1299.00',
    image: product3,
    inStock: true,
    rating: 4,
  },
  {
    id: 4,
    title: 'Desktop Workstation Z5',
    price: '$1150.00',
    image: product4,
    inStock: true,
    rating: 5,
  },
  {
    id: 5,
    title: 'Premium Thursday PC',
    price: '$1030.00',
    image: product5,
    inStock: true,
    rating: 4,
  },
  {
    id: 6,
    title: 'Ultra Slim Laptop',
    price: '$899.00',
    image: product6,
    inStock: true,
    rating: 5,
  }
]

const desktopProducts = [
  {
    id: 101,
    title: 'MSI MEG Trident X',
    price: '$2499.00',
    image: product4,
    inStock: true,
    rating: 5,
  },
  {
    id: 102,
    title: 'MSI Infinite RS',
    price: '$1899.00',
    image: product1,
    inStock: true,
    rating: 4,
  },
  {
    id: 103,
    title: 'MSI MAG Codex 5',
    price: '$1299.00',
    image: product2,
    inStock: true,
    rating: 4,
  },
  {
    id: 104,
    title: 'MSI Pro DP21',
    price: '$799.00',
    image: product3,
    inStock: true,
    rating: 5,
  },
  {
    id: 105,
    title: 'MSI Nightblade MIB',
    price: '$1150.00',
    image: product5,
    inStock: true,
    rating: 4,
  },
  {
    id: 106,
    title: 'MSI Cubi N JSL',
    price: '$499.00',
    image: product6,
    inStock: true,
    rating: 5,
  },
]

const laptopProducts = [
  {
    id: 201,
    title: 'MSI GS66 Stealth',
    price: '$1799.00',
    image: product3,
    inStock: true,
    rating: 5,
  },
  {
    id: 202,
    title: 'MSI Creator Z16',
    price: '$2199.00',
    image: product6,
    inStock: true,
    rating: 4,
  },
  {
    id: 203,
    title: 'MSI Prestige 14',
    price: '$1299.00',
    image: product1,
    inStock: true,
    rating: 4,
  },
  {
    id: 204,
    title: 'MSI GL65 Leopard',
    price: '$999.00',
    image: product2,
    inStock: true,
    rating: 5,
  },
  {
    id: 205,
    title: 'MSI Summit E15',
    price: '$1499.00',
    image: product4,
    inStock: true,
    rating: 4,
  },
  {
    id: 206,
    title: 'MSI Modern 15',
    price: '$749.00',
    image: product5,
    inStock: true,
    rating: 5,
  },
]

const pcPartsProducts = [
  {
    id: 301,
    title: 'MSI GeForce RTX 4090',
    price: '$1999.00',
    image: product5,
    inStock: true,
    rating: 5,
  },
  {
    id: 302,
    title: 'MSI MAG B650 Tomahawk',
    price: '$249.00',
    image: product2,
    inStock: true,
    rating: 4,
  },
  {
    id: 303,
    title: 'MSI MAG CoreLiquid 360R',
    price: '$139.00',
    image: product4,
    inStock: true,
    rating: 4,
  },
  {
    id: 304,
    title: 'MSI MPG A1000G PSU',
    price: '$179.00',
    image: product1,
    inStock: true,
    rating: 5,
  },
  {
    id: 305,
    title: 'MSI Vigor GK71 Sonic',
    price: '$129.00',
    image: product3,
    inStock: true,
    rating: 4,
  },
  {
    id: 306,
    title: 'MSI Optix MAG274QRF',
    price: '$399.00',
    image: product6,
    inStock: true,
    rating: 5,
  },
]

function ProductCarousel({ products, slidesToShow = 3 }) {
  const [slideIndex, setSlideIndex] = useState(0)
  // count slides base on total product
  const totalSlides = Math.max(1, products.length - slidesToShow + 1)
  const prevSlide = () => setSlideIndex((n) => Math.max(0, n - 1))
  const nextSlide = () => setSlideIndex((n) => Math.min(totalSlides - 1, n + 1))

  return (
    <div className="carousel-container">
      <button className="carousel-control" onClick={prevSlide} disabled={slideIndex === 0}>&lt;</button>
      <div className="carousel-window">
        <div className="carousel-track" style={{ transform: `translateX(-${slideIndex * (60 / slidesToShow)}%)` }}>
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image" style={{ backgroundImage: `url(${product.image})` }} />
              <div className="product-status">
                <span className="in-stock">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <p className="rating">Reviews ({product.rating})</p>
              <h3>{product.title}</h3>
              <p className="price">{product.price}</p>
              <button className="product-btn">Check Availability</button>
            </article>
          ))}
        </div>
      </div>
      <button className="carousel-control" onClick={nextSlide} disabled={slideIndex >= totalSlides - 1}>&gt;</button>
    </div>
  )
}

function Home() {
  const [bannerIndex, setBannerIndex] = useState(0)

  const prevBanner = () => setBannerIndex((prev) =>(prev - 1 + bannerImages.length) % bannerImages.length)
  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % bannerImages.length)

  return (
    <div className="home-page">
      <section className="banner-section">
        <div
          className="banner-image"
          style={{ backgroundImage: `url(${bannerImages[bannerIndex]})` }}
          aria-label="Home promotional banner"
        >
          <div className="banner-overlay" aria-hidden="true"></div>
          <div className="banner-text">
            <h2>Electronics Shop</h2>
            <p>Best deals on the latest devices. Explore now.</p>
          </div>
          <div className="banner-buttons">
            <button onClick={prevBanner} className="banner-btn">&lt;</button>
            <button onClick={nextBanner} className="banner-btn">&gt;</button>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>New Products</h2>
          <Link to="/products" className="see-all-link">See All New Products</Link>
        </div>
        <ProductCarousel products={newProducts} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>Desktops</h2>
          <Link to="/products?category=desktops" className="see-all-link">See All Desktops</Link>
        </div>
        <ProductCarousel products={desktopProducts} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>Laptops</h2>
          <Link to="/products?category=laptops" className="see-all-link">See All Laptops</Link>
        </div>
        <ProductCarousel products={laptopProducts} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>PC Parts</h2>
          <Link to="/products?category=parts" className="see-all-link">See All PC Parts</Link>
        </div>
        <ProductCarousel products={pcPartsProducts} />
      </section>
    </div>
  )
}

export default Home

