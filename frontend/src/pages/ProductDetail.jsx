import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../services/api";
import "./ProductDetail.css";

// ─── STATIC PAGE CONTENT ─────────────────────────────────
// These two sections are the same on every product page,
// so we keep them as module-level constants instead of fetching them.

const FEATURES = {
  title: "Features",
  description:
    "The MPG series brings out the best in gamers by allowing full expression in color with advanced RGB lighting control and synchronization.",
  items: [
    {
      id: "intel",
      label: "intel",
      description:
        "Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.",
    },
    {
      id: "rtx",
      label: "RTX",
      description:
        "The GeForce® RTX SUPER™ series has more cores and higher clocks for superfast performance compared to prev gen GPUs.",
    },
    {
      id: "ssd",
      label: "SSD",
      description:
        "Unleash its full potential with the latest SSD technology. The NVMe is 3 times faster than traditional SATA SSD.",
    },
    {
      id: "ddr4",
      label: "DDR4",
      description:
        "Featuring the latest 10th Gen Intel® Core™ processors, memory can support up to DDR4 3200MHz to deliver an unprecedented gaming experience.",
    },
  ],
};

// SVG icons reused from the Login page so the visual style stays consistent.
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

const BENEFITS = [
  { id: "support", iconKey: "support", title: "Product Support",  description: "Up to 3 years on site warranty available for your peace of mind." },
  { id: "account", iconKey: "account", title: "Personal Account", description: "With big discounts, free delivery and a dedicated support specialist." },
  { id: "savings", iconKey: "savings", title: "Amazing Savings",  description: "Up to 70% off new Products, you can be sure of the best price." },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProductDetails() {

  // Active tab: "details" | "about" | "specs"
  const [activeTab, setActiveTab] = useState("details");
  // Index of the image currently shown in the carousel.
  const [activeImage, setActiveImage] = useState(0);
  // Quantity selector value; clamped to 1+.
  const [quantity, setQuantity] = useState(1);
  // Accordion open/close state for the "More Information" panel.
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);

  // Read the ":id" segment from the URL (e.g. /products/abc123 -> id = "abc123").
  const { id } = useParams();
  // Product data once the API responds; null while loading.
  const [product, setProduct] = useState(null);
  const [loadError, setLoadError] = useState("");

  // Re-fetch whenever the URL id changes.
  useEffect(() => {
    if (!id) return;
    // Abort flag: ignore the response if a newer fetch already started.
    let aborted = false;
    productApi.getById(id)
      .then((data) => { if (!aborted) setProduct(data); })
      .catch((err)  => { if (!aborted) setLoadError(err.message || "Không tải được sản phẩm"); });
    return () => { aborted = true; };
  }, [id]);

  // ─── HANDLERS ──────────────────────────────────────────

  // Increase/decrease quantity, never below 1.
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // TODO: replace with POST /cart once the cart endpoint is implemented.
  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  // TODO: integrate PayPal SDK.
  const handlePaypal = () => {
    alert("Chuyển hướng đến PayPal...");
  };

  // ─── RENDER ────────────────────────────────────────────

  // Early return for the error state.
  if (loadError) {
    return (
      <div className="pd-page" style={{ padding: 60, textAlign: "center", color: "#d22" }}>
        {loadError}
      </div>
    );
  }
  // Early return for the loading state while the API call is in flight.
  if (!product) {
    return (
      <div className="pd-page" style={{ padding: 60, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // Derived values used by the JSX below.
  // Multi-line description -> array of bullet points for the specs list.
  const specs  = product.description ? product.description.split("\n").filter(Boolean) : [];
  const images = (product.images && product.images.length > 0) ? product.images : [];

  return (
    <div className="pd-page">

      {/* ════════════════════════════════════════════════
          STICKY SUB-NAVIGATION (tabs + cart bar)
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
              {tab === "about" ? "About Product" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Cart bar: price + quantity + Add to Cart + PayPal */}
        <div className="pd-sub-nav-right">
          <span className="pd-sale-label">
            On Sale from{" "}
            <strong className="pd-sale-price">
              ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </strong>
          </span>

          <div className="pd-qty-box">
            <button className="pd-qty-btn" onClick={() => handleQuantityChange(-1)}>−</button>
            <span className="pd-qty-value">{quantity}</span>
            <button className="pd-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
          </div>

          <button className="pd-add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button className="pd-paypal-btn" onClick={handlePaypal}>
            <span className="pd-paypal-text"><strong>PayPal</strong></span>
          </button>
        </div>
      </div>

      {/* ── TAB: DETAILS ── */}
      {activeTab === "details" && (
        <div className="pd-details-section">

          <nav className="pd-breadcrumb">
            <span className="pd-breadcrumb-link">Home</span>
            <span className="pd-breadcrumb-sep"> › </span>
            <span className="pd-breadcrumb-current">{product.category}</span>
          </nav>

          <div className="pd-details-grid">

            {/* LEFT: product info */}
            <div className="pd-details-left">
              <h1 className="pd-product-title">{product.name}</h1>

              <p className="pd-review-prompt">
                <a href="#reviews" className="pd-review-link">Be the first to review this product</a>
              </p>

              <ul className="pd-spec-list">
                {specs.map((spec, i) => (
                  <li key={i} className="pd-spec-item">{spec}</li>
                ))}
              </ul>

              <div className="pd-contact-row">
                <span className="pd-contact-text">
                  Have a Question?{" "}
                  <a href="/contact" className="pd-contact-link">Contact Us</a>
                </span>
                <span className="pd-sku-text">SKU {product._id}</span>
              </div>

              <button className="pd-more-info-btn" onClick={() => setMoreInfoOpen((p) => !p)}>
                + MORE INFORMATION
              </button>

              {moreInfoOpen && (
                <div className="pd-more-info-content">
                  Thông tin bổ sung sẽ được tải từ backend.
                </div>
              )}
            </div>

            {/* RIGHT: image carousel */}
            <div className="pd-details-right">
              <div className="pd-social-actions">
                <button className="pd-social-btn" title="Yêu thích">♡</button>
                <button className="pd-social-btn" title="So sánh">⇄</button>
                <button className="pd-social-btn" title="Chia sẻ">↗</button>
              </div>

              <div className="pd-image-wrapper">
                {images.length > 0 && (
                  <img src={images[activeImage]} alt={product.name} className="pd-product-image" />
                )}
                <div className="pd-carousel-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`pd-dot${activeImage === i ? " active" : ""}`}
                      onClick={() => setActiveImage(i)}
                    />
                  ))}
                </div>
              </div>

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

          <nav className="pd-breadcrumb">
            <span className="pd-breadcrumb-link">Home</span>
            <span className="pd-breadcrumb-sep"> › </span>
            <span className="pd-breadcrumb-current">{product.category}</span>
          </nav>

          <div className="pd-details-grid">

            {/* LEFT: about info */}
            <div className="pd-details-left">
              <h1 className="pd-product-title">{product.name}</h1>

              <p className="pd-review-prompt">
                <a href="#reviews" className="pd-review-link">Be the first to review this product</a>
              </p>

              <p className="pd-about-description">{product.description}</p>

              <div className="pd-contact-row">
                <span className="pd-contact-text">
                  Have a Question?{" "}
                  <a href="/contact" className="pd-contact-link">Contact Us</a>
                </span>
                <span className="pd-sku-text">SKU {product._id}</span>
              </div>

              <button className="pd-more-info-btn" onClick={() => setMoreInfoOpen((p) => !p)}>
                + MORE INFORMATION
              </button>

              {moreInfoOpen && (
                <div className="pd-more-info-content">
                  Thông tin bổ sung sẽ được tải từ backend.
                </div>
              )}
            </div>

            {/* RIGHT: image carousel (same as Details tab) */}
            <div className="pd-details-right">
              <div className="pd-social-actions">
                <button className="pd-social-btn" title="Yêu thích">♡</button>
                <button className="pd-social-btn" title="So sánh">⇄</button>
                <button className="pd-social-btn" title="Chia sẻ">↗</button>
              </div>

              <div className="pd-image-wrapper">
                {images.length > 0 && (
                  <img src={images[activeImage]} alt={product.name} className="pd-product-image" />
                )}
                <div className="pd-carousel-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`pd-dot${activeImage === i ? " active" : ""}`}
                      onClick={() => setActiveImage(i)}
                    />
                  ))}
                </div>
              </div>

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

          {/* Show product fields as a simple key/value table. */}
          <table className="pd-specs-table">
            <tbody>
              <tr className="pd-specs-row"><td className="pd-spec-key">Name</td>     <td className="pd-spec-val">{product.name}</td></tr>
              <tr className="pd-specs-row"><td className="pd-spec-key">Category</td> <td className="pd-spec-val">{product.category}</td></tr>
              {product.brand && (
                <tr className="pd-specs-row"><td className="pd-spec-key">Brand</td>  <td className="pd-spec-val">{product.brand}</td></tr>
              )}
              <tr className="pd-specs-row"><td className="pd-spec-key">Price</td>    <td className="pd-spec-val">${Number(product.price).toFixed(2)}</td></tr>
              <tr className="pd-specs-row"><td className="pd-spec-key">Stock</td>    <td className="pd-spec-val">{product.stock ?? 0}</td></tr>
              <tr className="pd-specs-row"><td className="pd-spec-key">Rating</td>   <td className="pd-spec-val">{product.rating || 0} ({product.numReviews || 0} reviews)</td></tr>
            </tbody>
          </table>

          <div className="pd-contact-row">
            Have a Question? <a href="/contact" className="pd-contact-link">Contact Us</a>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          FEATURES SECTION (static content)
          ════════════════════════════════════════════════ */}
      <section className="pd-features-section">
        <div className="pd-features-meta">
          <h2 className="pd-features-title">{FEATURES.title}</h2>
          <p className="pd-features-desc">{FEATURES.description}</p>
        </div>

        <div className="pd-features-grid">
          {FEATURES.items.map((feat) => (
            <div key={feat.id} className="pd-feature-card">
              <div className="pd-feature-icon-circle">
                <span className="pd-feature-icon-text">{feat.label}</span>
              </div>
              <p className="pd-feature-card-desc">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BENEFITS SECTION (static content)
          ════════════════════════════════════════════════ */}
      <section className="pd-benefits-section">
        <div className="pd-benefits-grid">
          {BENEFITS.map((benefit) => (
            <div key={benefit.id} className="pd-benefit-card">
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
