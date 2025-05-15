'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales } from '@/config'

export default function LanguageSwitch() {
  const currentLocale = useLocale()
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath)
  }

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case 'en':
        return 'English'
      case 'zh':
        return '简体中文'
      case 'zh-TW':
        return '繁體中文'
      default:
        return locale
    }
  }

  return (
    <div className="relative group">
      <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-sm opacity-50"></div>
          <div 
            className="relative z-10 w-6 h-6 bg-[url('/globe.svg')] bg-no-repeat bg-center bg-contain filter brightness-0 opacity-70 group-hover:opacity-100"
            style={{ 
              backgroundImage: "url('/globe.svg')",
              filter: "brightness(0) invert(1)"
            }}
          />
        </div>
      </button>

      <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-700/90 backdrop-blur-xl rounded-2xl shadow-xl border border-cyan-400/20 invisible group-hover:visible transition-all duration-200 hover:visible">
        <div className="py-2">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`flex items-center w-full px-4 py-3 text-sm hover:bg-slate-600/50 transition-colors ${
                currentLocale === locale ? 'text-cyan-300 font-medium' : 'text-cyan-100'
              }`}
            >
              <span className="flex-1">{getLanguageName(locale)}</span>
              {currentLocale === locale && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 