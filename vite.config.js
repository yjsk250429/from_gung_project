import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "src/styles/index.scss";`,
      },
    },
  },
  build: {
    rollupOptions: {
      treeshake: false, // :흰색_확인_표시: tree-shaking 비활성화 (배열 freeze 관련 최적화 피함)
    },
  },
  optimizeDeps: {
    exclude: ['slick-carousel'], // :흰색_확인_표시: suspect 라이브러리 제외
  },
});