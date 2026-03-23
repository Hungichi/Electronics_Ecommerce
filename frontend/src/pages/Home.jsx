import { useState } from 'react'
import './Home.css'

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
    image: 'https://images.unsplash.com/photo-1587825140708-2a0efe4f042d?auto=format&fit=crop&w=300&q=80',
    inStock: true,
    rating: 4,
  },
  {
    id: 2,
    title: 'MSI All-In-One 27″',
    price: '$899.00',
    image: 'https://images.unsplash.com/photo-1555617117-08d0156e25df?auto=format&fit=crop&w=300&q=80',
    inStock: true,
    rating: 5,
  },
  {
    id: 3,
    title: 'Gaming Notebook X15',
    price: '$1299.00',
    image: 'https://images.unsplash.com/photo-1565043466796-95e5f6c9588b?auto=format&fit=crop&w=300&q=80',
    inStock: true,
    rating: 4,
  },
  {
    id: 4,
    title: 'Desktop Workstation Z5',
    price: '$1150.00',
    image: 'https://images.unsplash.com/photo-1573271125619-a66420b41e77?auto=format&fit=crop&w=300&q=80',
    inStock: true,
    rating: 5,
  },
  {
    id: 5,
    title: 'Premium Thursday PC',
    price: '$1030.00',
    image: 'https://images.unsplash.com/photo-1626137428936-c8e05a13c5f6?auto=format&fit=crop&w=300&q=80',
    inStock: true,
    rating: 4,
  },
]

function Home() {
  const [bannerIndex, setBannerIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  const prevBanner = () => setBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % bannerImages.length)

  const slidesToShow = 3
  const totalSlides = Math.max(1, newProducts.length - slidesToShow + 1)

  const prevSlide = () => setSlideIndex((n) => Math.max(0, n - 1))
  const nextSlide = () => setSlideIndex((n) => Math.min(totalSlides - 1, n + 1))

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

      <section className="new-products">
        <h2>New Products</h2>
        <div className="carousel-container">
          <button className="carousel-control" onClick={prevSlide} disabled={slideIndex === 0}>&lt;</button>

          <div className="carousel-window">
            <div className="carousel-track" style={{ transform: `translateX(-${slideIndex * (100 / slidesToShow)}%)` }}>
              {newProducts.map((product) => (
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
      </section>
    </div>
  )
}

export default Home

