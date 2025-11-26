import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    root: 'src', // 修正root路径，因为源代码直接在src目录下
    base: mode === 'production' ? '/new-statistical-webapp/' : '/', // 生产环境使用GitHub Pages路径，开发环境使用根路径
    build: {
      outDir: 'dist/client',
      emptyOutDir: true
    },
    server: {
      port: process.env.PORT || 3000,  // 从环境变量读取端口，默认3000
      strictPort: false,              // 允许自动切换
      host: true,                     // 允许外部访问
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true
        }
      }
    }
  }
})