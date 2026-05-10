  import { useState } from "react";
  import "./ProductDetail.css";

  // ============================================================
  // PRODUCT DETAILS PAGE
  // Trang chi tiết sản phẩm - không bao gồm Navbar và Footer
  // Cấu trúc sẵn sàng để tích hợp với backend Node.js
  // ============================================================

  // ─── MOCK DATA ───────────────────────────────────────────────
  // Sau này sẽ được thay thế bằng API call từ backend Node.js
  // Ví dụ:
  //   const [product, setProduct] = useState(null);
  //   useEffect(() => {
  //     fetch(`/api/products/${productId}`)
  //       .then(res => res.json())
  //       .then(data => setProduct(data));
  //   }, [productId]);
  const MOCK_PRODUCT = {
    id: "DG05954",
    name: "MSI MPG Trident 3",
    slug: "msi-mpg-trident-3",
    category: "Laptops",
    categorySlug: "laptops",
    series: "MSI MS Series",
    price: 3299.0,
    originalPrice: 3499.0,
    rating: 0,
    reviewCount: 0,
    sku: "DG05954",
    images: [
      "https://asset.msi.com/resize/image/global/product/product_6_20190227092928_5c75e7f85abef.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
      "https://asset.msi.com/resize/image/global/product/product_8_20200728102422_5f1f8c5658234.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
      "https://asset.msi.com/resize/image/global/product/product_1646113180b0bc22b06fb1f947924ec3fcda757839.png62405b38c58fe0f07fcef2367d8a9ba1/380.png",
    ],
    specs: [
      "Intel Core i7-10700F",
      "Intel H480",
      "WHITE",
      "NVIDIA MSI GeForce RTX 2060 SUPER 8GB AERO ITX GDD86",
      "SO-DIMM 16GB (16GB x 1) DDR4 2666MHz",
      "2 total slots (64GB Max)",
      "512GB (1 x 512GB) M.2 NVMe PCle GEN3x4 SSD 2TB (2.5) 5400RPM",
      "Gaming Keyboard GK30 + Gaming Mouse GM5",
      "3.5 HDD (2/0), 2.5 HDD/SSD(1/0), M.2 (1/0)",
      "Intel WGI219/ethernet (10/100/1000M)",
      "AX200 (WiFi 6)+BT5.1",
      "PSU 330W",
      "Fan Cooler",
    ],
    // ── Dữ liệu tab "About Product" ──────────────────────────
    // Sau này sẽ được load từ: GET /api/products/:id/about
    about: {
      description:
        "MSI MPG Trident 3 10SC-005AU Intel i7 10700F, 2060 SUPER, 16GB RAM, 512GB SSD, 2TB HDD, Windows 10 Home, Gaming Keyboard and Mouse 3 Years Warranty Gaming Desktop",
      colors: [
        { id: "black",  label: "Black",  hex: "#1a1a1a" },
        { id: "silver", label: "Silver", hex: "#c0c0c0" },
        { id: "white",  label: "White",  hex: "#e8e8e8" },
      ],
      defaultColor: "black",
    },

    // Phần "Outplay the Competition"
    marketingSection: {
      title: "Outplay the Competittion",
      subtitle:
        "Experience a 40% boost in computing from last generation. MSI Desktop equips the 10th Gen. Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.",
      footnote: "*Performance compared to i7-9700. Specs varies by model.",
      image: "/images/intel-core-i7.png",
    },
    // Tính năng nổi bật
    features: {
      title: "Features",
      description:
        "The MPG series brings out the best in gamers by allowing full expression in color with advanced RGB lighting control and synchronization.",
      items: [
        {
          id: "intel",
          icon: "/icons/intel.svg",
          name: "Intel® Core™ i7",
          description:
            "Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.",
        },
        {
          id: "rtx",
          icon: "/icons/rtx.svg",
          name: "GeForce® RTX SUPER™",
          description:
            "The GeForce® RTX SUPER™ series has more cores and higher clocks for superfast performance compared to prev gen GPUs.",
        },
        {
          id: "ssd",
          icon: "/icons/ssd.svg",
          name: "NVMe Gen3 SSD",
          description:
            "Unleash its full potential with the latest SSD technology. The NVMe is 3 times faster than traditional SATA SSD.",
        },
        {
          id: "ddr4",
          icon: "/icons/ddr4.svg",
          name: "DDR4 Memory",
          description:
            "Featuring the latest 10th Gen Intel® Core™ processors, memory can support up to DDR4 3200MHz to delivers an unprecedented gaming experience.",
        },
      ],
    },
    // Lợi ích - iconKey tương ứng với SVG trong BENEFIT_ICONS
    benefits: [
      {
        id: "support",
        iconKey: "support",
        title: "Product Support",
        description: "Up to 3 years on site warranty available for your peace of mind.",
      },
      {
        id: "account",
        iconKey: "account",
        title: "Personal Account",
        description: "With big discounts, free delivery and a dedicated support specialist.",
      },
      {
        id: "savings",
        iconKey: "savings",
        title: "Amazing Savings",
        description: "Up to 70% off new Products, you can be sure of the best price.",
      },
    ],
  };

  // ─── MOCK SPECS TAB DATA ──────────────────────────────────────
  // Dữ liệu tab Specs - sẽ load từ API: GET /api/products/:id/specs
  const MOCK_SPECS_DATA = {
    CPU: "N/A",
    Featured: "N/A",
    "I/O Ports": "N/A",
  };

  // ─── SUPPORT ACCORDION DATA ───────────────────────────────────
  // Sẽ load từ API: GET /api/support/:section
  const SUPPORT_ITEMS = [
    { id: "support", label: "Product Support" },
    { id: "faq",     label: "FAQ" },
    { id: "buyer",   label: "Our Buyer Guide" },
  ];

  // ─── SVG ICONS CHO BENEFITS ──────────────────────────────────
  // Dùng đúng icon giống trang Login (headphones, person, tag)
  const BENEFIT_ICONS = {
    support: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 1C7.03 1 3 5.03 3 10v1H1v4a2 2 0 0 0 2 2h1v-6a8 8 0 0 1 16 0v6h1a2 2 0 0 0 2-2v-4h-2v-1c0-4.97-4.03-9-9-9zm-3 9a1 1 0 1 0 0 2v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-2zm6 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z" />
      </svg>
    ),
    account: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
    savings: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8z" />
      </svg>
    ),
  };

  // ============================================================
  // COMPONENT CHÍNH
  // ============================================================
  export default function ProductDetails() {

    // ─── STATE ───────────────────────────────────────────────
    // Tab đang active: "details" | "about" | "specs"
    const [activeTab, setActiveTab] = useState("details");

    // Index ảnh đang hiển thị trong carousel sản phẩm
    const [activeImage, setActiveImage] = useState(0);

    // Số lượng sản phẩm muốn mua
    const [quantity, setQuantity] = useState(1);

    // Trạng thái mở/đóng accordion "More Information"
    const [moreInfoOpen, setMoreInfoOpen] = useState(false);

    // Accordion support item đang mở (null = tất cả đóng)
    const [openSupport, setOpenSupport] = useState(null);

    // Màu sản phẩm đang chọn trong tab About Product
    const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.about.defaultColor);

    // Carousel slide index cho section "Outplay the Competition"
    const [marketingSlide, setMarketingSlide] = useState(0);

    // Dữ liệu sản phẩm (hiện dùng mock, sau thay bằng state + fetch)
    const product = MOCK_PRODUCT;

    // ─── HANDLERS ────────────────────────────────────────────

    // Tăng/giảm số lượng, không cho xuống dưới 1
    const handleQuantityChange = (delta) => {
      setQuantity((prev) => Math.max(1, prev + delta));
    };

    // Thêm vào giỏ hàng - sau này gọi: POST /api/cart
    const handleAddToCart = () => {
      // fetch('/api/cart', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId: product.id, quantity })
      // });
      alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
    };

    // Mua qua PayPal - sau này tích hợp PayPal SDK
    const handlePaypal = () => {
      alert("Chuyển hướng đến PayPal...");
    };

    // Mở/đóng từng accordion support
    const handleSupportToggle = (id) => {
      setOpenSupport((prev) => (prev === id ? null : id));
    };

    // ─── RENDER ──────────────────────────────────────────────
    return (
      <div className="pd-page">

        {/* ════════════════════════════════════════════════
            STICKY SUB-NAVIGATION
            Thanh điều hướng dính bên dưới navbar chính
            ════════════════════════════════════════════════ */}
        <div className="pd-sub-nav">

          {/* Tabs: About Product / Details / Specs */}
          <div className="pd-sub-nav-left">
            {["about", "details", "specs"].map((tab) => (
              <button
                key={tab}
                className={`pd-tab-btn${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "about"
                  ? "About Product"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Cart bar: giá + số lượng + Add to Cart + PayPal */}
          <div className="pd-sub-nav-right">
            <span className="pd-sale-label">
              On Sale from{" "}
              <strong className="pd-sale-price">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
            </span>

            {/* Bộ điều chỉnh số lượng */}
            <div className="pd-qty-box">
              <button className="pd-qty-btn" onClick={() => handleQuantityChange(-1)}>−</button>
              <span className="pd-qty-value">{quantity}</span>
              <button className="pd-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <button className="pd-add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>

            {/* Nút thanh toán PayPal */}
            <button className="pd-paypal-btn" onClick={handlePaypal}>
              <span className="pd-paypal-text">
                <strong>PayPal</strong>
              </span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            NỘI DUNG CÁC TAB
            ════════════════════════════════════════════════ */}

        {/* ── TAB: DETAILS ── */}
        {activeTab === "details" && (
          <div className="pd-details-section">

            {/* Breadcrumb điều hướng */}
            <nav className="pd-breadcrumb">
              <span className="pd-breadcrumb-link">Home</span>
              <span className="pd-breadcrumb-sep"> › </span>
              <span className="pd-breadcrumb-link">{product.category}</span>
              <span className="pd-breadcrumb-sep"> › </span>
              <span className="pd-breadcrumb-current">{product.series}</span>
            </nav>

            <div className="pd-details-grid">

              {/* ── CỘT TRÁI: Thông tin sản phẩm ── */}
              <div className="pd-details-left">

                {/* Tên sản phẩm */}
                <h1 className="pd-product-title">{product.name}</h1>

                {/* Link viết đánh giá */}
                <p className="pd-review-prompt">
                  <a href="#reviews" className="pd-review-link">
                    Be the first to review this product
                  </a>
                </p>

                {/* Danh sách thông số kỹ thuật */}
                <ul className="pd-spec-list">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="pd-spec-item">{spec}</li>
                  ))}
                </ul>

                {/* Hàng contact & SKU */}
                <div className="pd-contact-row">
                  <span className="pd-contact-text">
                    Have a Question?{" "}
                    <a href="/contact" className="pd-contact-link">Contact Us</a>
                  </span>
                  <span className="pd-sku-text">SKU {product.sku}</span>
                </div>

                {/* Nút mở/đóng thêm thông tin */}
                <button
                  className="pd-more-info-btn"
                  onClick={() => setMoreInfoOpen((prev) => !prev)}
                >
                  + MORE INFORMATION
                </button>

                {/* Nội dung More Information - sau này load từ API */}
                {moreInfoOpen && (
                  <div className="pd-more-info-content">
                    Thông tin bổ sung sẽ được tải từ backend.
                    {/* Sau này: fetch(`/api/products/${product.id}/more-info`) */}
                  </div>
                )}
              </div>

              {/* ── CỘT PHẢI: Ảnh sản phẩm ── */}
              <div className="pd-details-right">

                {/* Nút social actions */}
                <div className="pd-social-actions">
                  <button className="pd-social-btn" title="Yêu thích">♡</button>
                  <button className="pd-social-btn" title="So sánh">⇄</button>
                  <button className="pd-social-btn" title="Chia sẻ">↗</button>
                </div>

                {/* Khung ảnh - thay bằng <img src={product.images[activeImage]} /> khi có backend */}
                <div className="pd-image-wrapper">
                  {/* <div className="pd-image-placeholder">
                    <span className="pd-image-placeholder-text">
                    {product.name}
                    </span>
                  </div> */}
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="pd-product-image"/>

                  {/* Dots carousel ảnh */}
                  <div className="pd-carousel-dots">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        className={`pd-dot${activeImage === i ? " active" : ""}`}
                        onClick={() => setActiveImage(i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Thanh Zip payment */}
                <div className="pd-zip-bar">
                  <div className="pd-zip-logo">
                    <span className="pd-zip-icon">⚡</span>
                    <strong className="pd-zip-text">zip</strong>
                  </div>
                  <span className="pd-zip-desc">
                    own it now, up to 6 months interest free{" "}
                    <a href="#zip" className="pd-zip-learn-more">learn more</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ABOUT PRODUCT ── */}
        {activeTab === "about" && (
          <div className="pd-details-section">

            {/* Breadcrumb điều hướng */}
            <nav className="pd-breadcrumb">
              <span className="pd-breadcrumb-link">Home</span>
              <span className="pd-breadcrumb-sep"> › </span>
              <span className="pd-breadcrumb-link">{product.category}</span>
              <span className="pd-breadcrumb-sep"> › </span>
              <span className="pd-breadcrumb-current">{product.series}</span>
            </nav>

            <div className="pd-details-grid">

              {/* ── CỘT TRÁI: Thông tin About ── */}
              <div className="pd-details-left">

                {/* Tên sản phẩm */}
                <h1 className="pd-product-title">{product.name}</h1>

                {/* Link viết đánh giá */}
                <p className="pd-review-prompt">
                  <a href="#reviews" className="pd-review-link">
                    Be the first to review this product
                  </a>
                </p>

                {/* Mô tả sản phẩm - load từ product.about.description */}
                {/* Sau này thay bằng: fetch(`/api/products/${product.id}/about`) */}
                <p className="pd-about-description">
                  {product.about.description}
                </p>

                {/* Bộ chọn màu sắc */}
                {/* Sau này danh sách màu load từ: GET /api/products/:id/variants */}
                <div className="pd-color-picker">
                  {product.about.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`pd-color-swatch${selectedColor === color.id ? " active" : ""}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                      onClick={() => setSelectedColor(color.id)}
                    />
                  ))}
                </div>

                {/* Hàng contact & SKU */}
                <div className="pd-contact-row">
                  <span className="pd-contact-text">
                    Have a Question?{" "}
                    <a href="/contact" className="pd-contact-link">Contact Us</a>
                  </span>
                  <span className="pd-sku-text">SKU {product.sku}</span>
                </div>

                {/* Nút mở/đóng thêm thông tin */}
                <button
                  className="pd-more-info-btn"
                  onClick={() => setMoreInfoOpen((prev) => !prev)}
                >
                  + MORE INFORMATION
                </button>

                {moreInfoOpen && (
                  <div className="pd-more-info-content">
                    Thông tin bổ sung sẽ được tải từ backend.
                  </div>
                )}
              </div>

              {/* ── CỘT PHẢI: Ảnh sản phẩm ── */}
              <div className="pd-details-right">

                {/* Nút social actions */}
                <div className="pd-social-actions">
                  <button className="pd-social-btn" title="Yêu thích">♡</button>
                  <button className="pd-social-btn" title="So sánh">⇄</button>
                  <button className="pd-social-btn" title="Chia sẻ">↗</button>
                </div>

                {/* Ảnh sản phẩm - thay bằng <img src={product.images[activeImage]} /> khi có backend */}
                <div className="pd-image-wrapper">
                  {/* <div className="pd-image-placeholder">
                    <span className="pd-image-placeholder-text">
                        {product.name}
                    </span>
                  </div> */}

                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="pd-product-image"/>

                  {/* Dots carousel */}
                  <div className="pd-carousel-dots">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        className={`pd-dot${activeImage === i ? " active" : ""}`}
                        onClick={() => setActiveImage(i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Zip payment */}
                <div className="pd-zip-bar">
                  <div className="pd-zip-logo">
                    <span className="pd-zip-icon">⚡</span>
                    <strong className="pd-zip-text">zip</strong>
                  </div>
                  <span className="pd-zip-desc">
                    own it now, up to 6 months interest free{" "}
                    <a href="#zip" className="pd-zip-learn-more">learn more</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SPECS ── */}
        {activeTab === "specs" && (
          <div className="pd-details-section">
            <h2 className="pd-section-heading">Technical Specifications</h2>
            {/* Sau này load từ: GET /api/products/:id/specs */}
            <table className="pd-specs-table">
              <tbody>
                {Object.entries(MOCK_SPECS_DATA).map(([key, val]) => (
                  <tr key={key} className="pd-specs-row">
                    <td className="pd-spec-key">{key}</td>
                    <td className="pd-spec-val">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pd-contact-row">
              Have a Question?{" "}
              <a href="/contact" className="pd-contact-link">Contact Us</a>
            </div>
            <button className="pd-more-info-btn">+ MORE INFORMATION</button>
          </div>
        )}
      

        {/* ════════════════════════════════════════════════
            FEATURES SECTION
            Nền tối, 4 badge công nghệ
            ════════════════════════════════════════════════ */}
        <section className="pd-features-section">
          <div className="pd-features-meta">
            <h2 className="pd-features-title">{product.features.title}</h2>
            <p className="pd-features-desc">{product.features.description}</p>
          </div>

          <div className="pd-features-grid">
            {product.features.items.map((feat) => (
              <div key={feat.id} className="pd-feature-card">
                {/* Icon tròn đen - thay bằng <img src={feat.icon} /> khi có backend */}
                <div className="pd-feature-icon-circle">
                  <span className="pd-feature-icon-text">
                    {feat.id === "intel" ? "intel"
                    : feat.id === "rtx"  ? "RTX"
                    : feat.id === "ssd"  ? "SSD"
                    : "DDR4"}
                  </span>
                </div>
                <p className="pd-feature-card-desc">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            BENEFITS SECTION
            3 lợi ích với icon SVG tròn xanh (giống trang Login)
            ════════════════════════════════════════════════ */}
        <section className="pd-benefits-section">
          <div className="pd-benefits-grid">
            {product.benefits.map((benefit) => (
              <div key={benefit.id} className="pd-benefit-card">
                {/* Icon SVG giống trang Login */}
                <div className="pd-benefit-icon-circle">
                  {BENEFIT_ICONS[benefit.iconKey]}
                </div>
                <h3 className="pd-benefit-title">{benefit.title}</h3>
                <p className="pd-benefit-desc">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    );
  }
