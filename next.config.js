const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');


const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

// 最后应用 next-intl 插件
module.exports = withNextIntl(nextConfig);