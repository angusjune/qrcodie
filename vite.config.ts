import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import Icons from 'unplugin-icons/vite'
import manifest from './manifest.json' assert { type: 'json' }

export default defineConfig({
  plugins: [vue(),crx({ manifest }),Icons({ scale: 1, compiler: 'vue3' })],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ]
  }
})
