import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import UmamiProvider from 'next-umami'

const inter = Inter({ subsets: ['latin'] })
const umamiWebsiteId = "7fd99628-3822-4bae-a794-b2d1d8926678"
const umamiSrc = "https://umami.suanleme.cn:3000/script.js"

// 可以选择性地设置缓存时间
async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    notFound()
  }
}

export async function generateMetadata({params}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'site'})
  // 获取当前域名
  const siteUrl = process.env.SITE_URL || 'https://dreamify.slmnb.cn ';

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: 'Dreamify - 免费AI绘画工具 | AI画图网站在线生成',
      description: 'Dreamify 是无需注册的AI生图网站，支持动漫、插画、3D风格，提供智能AI绘画服务，让创作更简单。',
      images: [
        {
          url:  `${siteUrl}/images/dreamify-logo.jpg`,
          width: 1200,
          height: 630,
          alt: 'Dreamify Logo',
        },
      ],
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dreamify - 免费AI绘画工具 | AI画图网站在线生成',
      description: 'Dreamify 是无需注册的AI生图网站，支持动漫、插画、3D风格，提供智能AI绘画服务，让创作更简单。',
      images: [ `${siteUrl}/images/dreamify-logo.jpg`],
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }> | undefined
}) {
  const locale = (await Promise.resolve(params))?.locale || 'zh';
  const messages = await getMessages(locale)

  return (
    <html lang={locale}>
      <head>
      <UmamiProvider 
          websiteId={umamiWebsiteId} // 替换为你的实际 ID
          src={umamiSrc}
        />
        <meta name="google-site-verification" content="F_mzKY9JDvflHFEEsBGIiItkpIhVwc0sBPqo_UI5VtQ" />
        <meta name="baidu-site-verification" content="codeva-KBWW4lhtr9" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html >
  )
}