import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '../services/api'
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

// Carousel dùng chung cho cả 4 section (New, Desktops, Laptops, PC Parts)
// Hiện `slidesToShow` card cùng lúc, trượt ngang bằng CSS transform
function ProductCarousel({ products, slidesToShow = 3 }) {
  // Vị trí slide hiện tại (0 = trái nhất)
  const [slideIndex, setSlideIndex] = useState(0)
  // Số slide tối đa có thể bắt đầu (để không trượt quá xa)
  const totalSlides = Math.max(1, products.length - slidesToShow + 1)
  const prevSlide = () => setSlideIndex((n) => Math.max(0, n - 1))
  const nextSlide = () => setSlideIndex((n) => Math.min(totalSlides - 1, n + 1))

  return (
    <div className="carousel-container">
      <button className="carousel-control" onClick={prevSlide} disabled={slideIndex === 0}>&lt;</button>
      <div className="carousel-window">
        {/* translateX dịch track sang trái N card-width.
            CSS có transition: transform 0.4s trên .carousel-track → hiệu ứng trượt mượt */}
        <div className="carousel-track" style={{ transform: `translateX(-${slideIndex * (100 / slidesToShow)}%)` }}>
          {products.map((product) => (
            // Bọc card bằng Link để click mở trang chi tiết
            <Link key={product.id} to={product.linkId ? `/products/${product.linkId}` : '/products'} className="product-card-link">
              <article className="product-card">
                <div className="product-image" style={{ backgroundImage: `url(${product.image})` }} />
                <div className="product-status">
                  <span className="in-stock">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <p className="rating">Reviews ({product.rating})</p>
                <h3>{product.title}</h3>
                <p className="price">{product.price}</p>
                <button className="product-btn">Check Availability</button>
              </article>
            </Link>
          ))}
        </div>
      </div>
      <button className="carousel-control" onClick={nextSlide} disabled={slideIndex >= totalSlides - 2}>&gt;</button>
    </div>
  )
}

// Đổi sản phẩm từ format backend sang format carousel cần
// Nếu không có ảnh thì dùng ảnh fallback (ảnh mock) để UI không bị trống
function mapApiProduct(p, fallbackImage) {
  return {
    id: p._id,
    linkId: p._id,
    title: p.name,
    price: `$${Number(p.price).toFixed(2)}`,
    image: p.images?.[0] || fallbackImage,
    inStock: (p.stock ?? 0) > 0,
    rating: p.rating || 0,
  }
}

// Custom hook: fetch sản phẩm 1 category, trả về list đã map
// Nếu API trả rỗng hoặc lỗi thì giữ nguyên fallback (mock data)
// → carousel không bao giờ bị trống, UI vẫn đẹp dù backend chưa có data
function useApiProducts({ category, limit = 6, fallback }) {
  const [items, setItems] = useState(fallback)
  useEffect(() => {
    let aborted = false
    const params = { limit, sortBy: 'createdAt', order: 'desc', isActive: true }
    if (category) params.category = category
    productApi.list(params)
      .then((data) => {
        if (aborted) return
        const list = data.products || []
        // Chỉ thay fallback khi API có data thật
        if (list.length > 0) {
          setItems(list.map((p, i) => mapApiProduct(p, fallback[i % fallback.length].image)))
        }
      })
      .catch(() => { /* lỗi thì giữ fallback */ })
    return () => { aborted = true }
  }, [category, limit])
  return items
}

function Home() {
  // Index banner đang hiển thị trên cùng
  const [bannerIndex, setBannerIndex] = useState(0)

  // Modulo để banner cuối → next sẽ quay về banner đầu (và ngược lại)
  const prevBanner = () => setBannerIndex((prev) =>(prev - 1 + bannerImages.length) % bannerImages.length)
  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % bannerImages.length)

  // Mỗi dòng gọi 1 GET /products với category khác nhau
  // Hook trả về mock data ngay, đến khi API trả về thì tự thay bằng data thật
  const newItems     = useApiProducts({ limit: 8, fallback: newProducts })
  const desktopItems = useApiProducts({ category: 'desktops', limit: 8, fallback: desktopProducts })
  const laptopItems  = useApiProducts({ category: 'laptops', limit: 8, fallback: laptopProducts })
  const partsItems   = useApiProducts({ category: 'parts', limit: 8 , fallback: pcPartsProducts })

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
        <ProductCarousel products={newItems} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>Desktops</h2>
          <Link to="/products?category=desktops" className="see-all-link">See All Desktops</Link>
        </div>
        <ProductCarousel products={desktopItems} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>Laptops</h2>
          <Link to="/products?category=laptops" className="see-all-link">See All Laptops</Link>
        </div>
        <ProductCarousel products={laptopItems} />
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>PC Parts</h2>
          <Link to="/products?category=parts" className="see-all-link">See All PC Parts</Link>
        </div>
        <ProductCarousel products={partsItems} />
      </section>
    </div>
  )
}

export default Home

