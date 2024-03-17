import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ClassMangler from 'vite-plugin-class-mangler';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ClassMangler()]
})
