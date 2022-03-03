const withAPI =require('next-pwa')


/** @type {import('next').NextConfig} */
const nextConfig = withAPI ({
  reactStrictMode: true,
  pwa:{
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV==='development'
  },
  i18n:{
    locales: ["en", "es"],
    defaultLocale: "es"
  }
})

module.exports = nextConfig