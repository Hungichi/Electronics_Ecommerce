import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Khi deploy lên GitHub Pages tại URL kiểu https://<username>.github.io/<repo-name>/
// Vite cần biết prefix này để đường dẫn asset (css/js/image) sinh ra đúng.
// → ĐỔI 'BTL-JS' thành tên repo GitHub của bạn.
// Khi chạy `npm run dev` ở local, base này không ảnh hưởng.
export default defineConfig({
  base: '/BTL-JS/',
  plugins: [react()],
})
