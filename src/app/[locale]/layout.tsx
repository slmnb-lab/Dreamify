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

  return {
    title: t('title'),
    description: t('description'),
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