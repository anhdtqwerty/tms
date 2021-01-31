module.exports = {
  transpileDependencies: ['vuetify', 'vue-clamp', 'resize-detector'],
  pwa: {
    name: 'TMS',
    manifestOptions: {
      theme_color: '#1E88E5',
      background_color: '#1E88E5',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      description: 'Learning Management System',
      icons: [
        {
          src: '/img/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/img/icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/img/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/img/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
