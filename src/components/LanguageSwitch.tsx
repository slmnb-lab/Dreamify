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
    <div className="relative group z-50">
      <button className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12C2 14.5013 4.73835 15.9228 8.29203 16C15.708 15.9228 19.2616 14.5013 22 12" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span>{getLanguageName(currentLocale)}</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 invisible group-hover:visible transition-all duration-200 hover:visible">
        <div className="py-1">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                currentLocale === locale ? 'text-primary-500 font-medium' : 'text-gray-700'
              }`}
            >
              {getLanguageName(locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 