/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    developmentUrl: 'http://localhost:5000/api/v1',
    productionUrl: 'http://portal.uryonym.com:5000/api/v1',
  },
}

module.exports = nextConfig
