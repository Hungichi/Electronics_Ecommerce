import { useState } from 'react'
import './ContactUs.css'
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope, FaHeadset, FaUserCircle, FaTag } from 'react-icons/fa'

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="contact-page">
      {/* Breadcrumb + Title */}
      <div className="contact-header">
        <p className="contact-breadcrumb">Home &nbsp;› &nbsp;Contact Us</p>
        <h1 className="contact-title">Contact Us</h1>
      </div>

      <div className="contact-body">
        {/* Left: Form */}
        <div className="contact-form-area">
          <p className="contact-intro">
            We love hearing from you, our Shop customers.
            <br />
            Please contact us and we will make sure to get back to you as soon as we possibly can.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group form-group-full">
              <label>What's on your mind? *</label>
              <textarea
                name="message"
                placeholder="Jot us a note and we'll get back to you as quickly as possible"
                value={form.message}
                onChange={handleChange}
                required
                rows={8}
              />
            </div>

            <button type="submit" className="contact-submit-btn">Submit</button>
          </form>
        </div>

        {/* Right: Info Card */}
        <div className="contact-info-card">
          <div className="info-item">
            <div className="info-icon"><FaMapMarkerAlt /></div>
            <div className="info-content">
              <h4>Address:</h4>
              <p>14 Ngoc Khanh Ba Dinh<br />Hanoi</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon"><FaPhoneAlt /></div>
            <div className="info-content">
              <h4>Phone:</h4>
              <p>(+84) 943680468</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon"><FaClock /></div>
            <div className="info-content">
              <h4>We are open:</h4>
              <p>
                Monday - Thursday: 9:00 AM - 5:30 PM
                <br />
                Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 11:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon"><FaEnvelope /></div>
            <div className="info-content">
              <h4>E-mail:</h4>
              <p className="info-email">HVShop@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="contact-features">
        <div className="contact-features-inner">
          <div className="contact-feature-card">
            <div className="contact-feature-icon"><FaHeadset /></div>
            <h3>Product Support</h3>
            <p>Up to 3 years on-site warranty available for your peace of mind.</p>
          </div>
          <div className="contact-feature-card">
            <div className="contact-feature-icon"><FaUserCircle /></div>
            <h3>Personal Account</h3>
            <p>With big discounts, free delivery and a dedicated support specialist.</p>
          </div>
          <div className="contact-feature-card">
            <div className="contact-feature-icon"><FaTag /></div>
            <h3>Amazing Savings</h3>
            <p>Up to 70% off new Products, you can be sure of the best price.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
