'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl border-t border-cyan-400/20">
      <div className="container mx-auto px-8 py-6">
        <div className="text-center text-cyan-200/80">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
} 