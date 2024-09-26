import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    EnvironmentPlugin([
      'CLIENT_ID',
      'CLIENT_SECRET',
      'REDIRECT_URI',
  ]),
  ],
})
