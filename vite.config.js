import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Daara — Coran & Alphabet Arabe',
        short_name: 'Daara',
        description: "Apprentissage du Coran et de l'alphabet arabe pour enfants",
        theme_color: '#1b3a2a',
        background_color: '#fdf7ef',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'fr',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache les fonts Google
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10 } }
          },
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud/,
            handler: 'NetworkFirst',
            options: { cacheName: 'quran-api', expiration: { maxEntries: 50 } }
          },
          {
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio/,
            handler: 'CacheFirst',
            options: { cacheName: 'quran-audio', expiration: { maxEntries: 80 } }
          }
        ]
      }
    })
  ]
})
