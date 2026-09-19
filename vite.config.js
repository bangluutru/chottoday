import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { chottoStudio } from './scripts/studio/vite-plugin-studio.mjs';

export default defineConfig({
  // chottoStudio chỉ áp dụng ở dev (apply: 'serve' trong chính plugin), nên
  // các endpoint ghi file không bao giờ có mặt trong bản build production.
  plugins: [react(), chottoStudio()],
  server: {
    port: 5173,
    host: true,
  },
});
