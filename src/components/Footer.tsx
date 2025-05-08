'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
} 