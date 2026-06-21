import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { userApi } from '../services/api'
import './Profile.css'

const TABS = [
  { id: 'info',      label: 'Thông tin tài khoản' },
  { id: 'password',  label: 'Đổi mật khẩu' },
  { id: 'addresses', label: 'Địa chỉ giao hàng' },
]

function Profile() {
  const { user, updateUser, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  // Tab đang active ở sidebar
  const [activeTab, setActiveTab] = useState('info')
  const [loading, setLoading] = useState(true)
  // State của 3 form (3 tab) — tách riêng cho dễ quản lý
  const [info, setInfo] = useState({ email: '', phone: '', avatar: '' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [addresses, setAddresses] = useState([])
  // Khóa nút khi đang gọi API
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [savingAddr, setSavingAddr] = useState(false)

  // Chưa đăng nhập → đẩy về /login
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch profile mới nhất từ server (data trong localStorage có thể bị cũ)
  useEffect(() => {
    if (!user) return
    let aborted = false
    setLoading(true)
    userApi.getMe()
      .then((data) => {
        if (aborted) return
        setInfo({
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
        })
        setAddresses(data.addresses || [])
      })
      .catch((err) => !aborted && toast.error(err.message || 'Không tải được hồ sơ'))
      .finally(() => !aborted && setLoading(false))
    return () => { aborted = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  // ── Tab 1: Account info ─────────────────────────────
  const handleInfoChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setSavingInfo(true)
    try {
      const updated = await userApi.updateMe(info)
      // Đẩy field mới vào AuthContext để các component khác cũng thấy
      updateUser({ email: updated.email, phone: updated.phone, avatar: updated.avatar })
      toast.success('Cập nhật thông tin thành công')
    } catch (err) {
      toast.error(err.message || 'Cập nhật thất bại')
    } finally {
      setSavingInfo(false)
    }
  }

  // ── Tab 2: Change password ──────────────────────────
  const handlePwChange = (e) => {
    setPw({ ...pw, [e.target.name]: e.target.value })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pw.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp')
      return
    }
    setSavingPw(true)
    try {
      await userApi.changePassword(pw.currentPassword, pw.newPassword)
      toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.')
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' })
      // Bắt user login lại để lấy token mới (token cũ vẫn còn dùng được nhưng để an toàn)
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 1500)
    } catch (err) {
      toast.error(err.message || 'Đổi mật khẩu thất bại')
    } finally {
      setSavingPw(false)
    }
  }

  // ── Tab 3: Addresses ────────────────────────────────
  const addNewAddress = () => {
    setAddresses([...addresses, { fullName: '', phone: '', address: '', city: '', isDefault: false }])
  }

  const updateAddress = (idx, field, value) => {
    const next = [...addresses]
    next[idx] = { ...next[idx], [field]: value }
    setAddresses(next)
  }

  const removeAddress = (idx) => {
    setAddresses(addresses.filter((_, i) => i !== idx))
  }

  const handleSaveAddresses = async () => {
    setSavingAddr(true)
    try {
      const updated = await userApi.updateMe({ addresses })
      setAddresses(updated.addresses || [])
      toast.success('Cập nhật địa chỉ thành công')
    } catch (err) {
      toast.error(err.message || 'Cập nhật thất bại')
    } finally {
      setSavingAddr(false)
    }
  }

  if (!user) return null
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state">Đang tải hồ sơ...</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <p className="profile-breadcrumb">Home &nbsp;› &nbsp;My Account</p>
        <h1 className="profile-title">My Account</h1>
      </div>

      <div className="profile-body">
        {/* Sidebar tab navigation */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar-circle">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="profile-user-name">{user.username}</div>
              <div className="profile-user-meta">{info.email}</div>
            </div>
          </div>
          <ul className="profile-tabs">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  className={`profile-tab${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content panel changes with the active tab */}
        <main className="profile-main">

          {activeTab === 'info' && (
            <section className="profile-card">
              <h2 className="profile-card-title">Thông tin tài khoản</h2>
              <p className="profile-card-subtitle">Cập nhật email, số điện thoại và ảnh đại diện của bạn.</p>

              <form className="profile-form" onSubmit={handleSaveInfo}>
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>Username</label>
                    <input type="text" value={user.username} disabled />
                  </div>
                  <div className="profile-form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={info.email}
                      onChange={handleInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={info.phone}
                      onChange={handleInfoChange}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label>Avatar URL</label>
                    <input
                      type="text"
                      name="avatar"
                      placeholder="https://..."
                      value={info.avatar}
                      onChange={handleInfoChange}
                    />
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button type="submit" className="profile-btn-primary" disabled={savingInfo}>
                    {savingInfo ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'password' && (
            <section className="profile-card">
              <h2 className="profile-card-title">Đổi mật khẩu</h2>
              <p className="profile-card-subtitle">Vì lý do bảo mật, bạn sẽ cần đăng nhập lại sau khi đổi mật khẩu.</p>

              <form className="profile-form" onSubmit={handleChangePassword}>
                <div className="profile-form-group">
                  <label>Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={pw.currentPassword}
                    onChange={handlePwChange}
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Mật khẩu mới *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={pw.newPassword}
                    onChange={handlePwChange}
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={pw.confirmPassword}
                    onChange={handlePwChange}
                    required
                  />
                </div>
                <div className="profile-form-actions">
                  <button type="submit" className="profile-btn-primary" disabled={savingPw}>
                    {savingPw ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'addresses' && (
            <section className="profile-card">
              <h2 className="profile-card-title">Địa chỉ giao hàng</h2>
              <p className="profile-card-subtitle">Quản lý các địa chỉ giao hàng của bạn.</p>

              <div className="address-list">
                {addresses.length === 0 && (
                  <p className="address-empty">Chưa có địa chỉ nào.</p>
                )}
                {addresses.map((addr, idx) => (
                  <div key={idx} className="address-item">
                    <div className="profile-form-row">
                      <div className="profile-form-group">
                        <label>Họ và tên</label>
                        <input
                          type="text"
                          value={addr.fullName || ''}
                          onChange={(e) => updateAddress(idx, 'fullName', e.target.value)}
                        />
                      </div>
                      <div className="profile-form-group">
                        <label>Số điện thoại</label>
                        <input
                          type="tel"
                          value={addr.phone || ''}
                          onChange={(e) => updateAddress(idx, 'phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="profile-form-row">
                      <div className="profile-form-group">
                        <label>Địa chỉ</label>
                        <input
                          type="text"
                          value={addr.address || ''}
                          onChange={(e) => updateAddress(idx, 'address', e.target.value)}
                        />
                      </div>
                      <div className="profile-form-group">
                        <label>Thành phố</label>
                        <input
                          type="text"
                          value={addr.city || ''}
                          onChange={(e) => updateAddress(idx, 'city', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="address-actions">
                      <label className="address-default-toggle">
                        <input
                          type="checkbox"
                          checked={!!addr.isDefault}
                          onChange={(e) => updateAddress(idx, 'isDefault', e.target.checked)}
                        />
                        Đặt làm mặc định
                      </label>
                      <button type="button" className="profile-btn-danger" onClick={() => removeAddress(idx)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-form-actions">
                <button type="button" className="profile-btn-secondary" onClick={addNewAddress}>
                  + Thêm địa chỉ mới
                </button>
                <button type="button" className="profile-btn-primary" onClick={handleSaveAddresses} disabled={savingAddr}>
                  {savingAddr ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  )
}

export default Profile
