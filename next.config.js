/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    developmentUrl: 'http://localhost:5000/api/v1',
    productionUrl: 'https://portal.uryonym.com:5000/api/v1',
    firebaseApiKey: 'AIzaSyDaVj_9rgkspOTMTn9pQxeXwI2X_8Kisgg',
    firebaseAuthDomain: 'ynym-portal-25b29.firebaseapp.com',
    firebaseProjectId: 'ynym-portal-25b29',
    firebaseAppId: '1:1017779990554:web:ac3c0bdef4cdde468f61a3',
  },
}

module.exports = withPWA(nextConfig)
