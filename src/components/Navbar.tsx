'use client'

import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitch from './LanguageSwitch'
import { useParams } from 'next/navigation'
import { transferUrl } from '@/utils/locale'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function Navbar() {
  const { locale } = useParams()
  const t = useTranslations('nav')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 处理点击遮罩层关闭菜单
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false)
  }

  // 处理点击菜单按钮
  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // 处理点击导航项
  const handleNavItemClick = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 500)
  }

  return (
    <>
      {/* 移动端顶部导航栏 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800/80 backdrop-blur-xl border-b border-cyan-400/20 z-40 flex items-center px-4">
        <button
          onClick={handleMenuClick}
          className="p-2 text-cyan-300 hover:text-cyan-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center ml-4">
          <Image
            src="/images/dreamify-logo.jpg"
            alt="HiDreamNow Logo"
            width={32}
            height={32}
            className="rounded-xl shadow-lg border border-cyan-400/30"
          />
          <span className="ml-2 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t('siteName')}
          </span>
        </div>
      </div>

      {/* 遮罩层 */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* 侧边导航栏 */}
      <div 
        id="main-nav"
        className={`fixed left-0 top-0 bottom-0 w-48 bg-slate-800/80 backdrop-blur-xl border-r border-cyan-400/20 z-50 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isMobileMenuOpen ? 'shadow-2xl' : ''}
        `}
      >
        <div className="flex flex-col items-center h-full py-8">
          {/* Logo 部分 - 在移动端隐藏，因为已经在顶部栏显示 */}
          <div className="hidden lg:flex flex-col items-center mb-12">
            <Link 
              href={transferUrl('/', locale)} 
              className="relative transform transition-all duration-300 hover:scale-110 mb-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <Image
                src="/images/dreamify-logo.jpg"
                alt="HiDreamNow Logo"
                width={48}
                height={48}
                className="rounded-2xl shadow-xl border border-cyan-400/30 relative z-10"
              />
            </Link>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t('siteName')}
            </span>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 flex flex-col items-center space-y-8 w-full px-4">
            <button
              onClick={() => handleNavItemClick('generate-section')}
              className="group w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-cyan-100 group-hover:text-cyan-50">{t('quickGenerate')}</span>
            </button>
            <button
              onClick={() => handleNavItemClick('community-showcase')}
              className="group w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm text-cyan-100 group-hover:text-cyan-50">{t('community')}</span>
            </button>
            <button
              onClick={() => handleNavItemClick('faq-section')}
              className="group w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-cyan-100 group-hover:text-cyan-50">{t('faq')}</span>
            </button>
                   <button
         onClick={() => handleNavItemClick('friends-section')}
         className="group w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
       >
         <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100 flex-shrink-0" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
           <path d="M546.9184 665.4976a187.9552 187.9552 0 0 1-133.3248-55.1424 25.6 25.6 0 0 1 36.1984-36.1984 137.472 137.472 0 0 0 194.2016 0l186.1632-186.1632c53.5552-53.5552 53.5552-140.6464 0-194.2016s-140.6464-53.5552-194.2016 0L478.8736 350.8736a25.6 25.6 0 0 1-36.1984-36.1984l157.0816-157.0816c73.5232-73.5232 193.1264-73.5232 266.5984 0s73.5232 193.1264 0 266.5984l-186.1632 186.1632a187.9552 187.9552 0 0 1-133.3248 55.1424z" />
           <path d="M239.7184 972.6976a187.9552 187.9552 0 0 1-133.3248-55.1424 188.672 188.672 0 0 1 0-266.5984l186.1632-186.1632a188.672 188.672 0 0 1 266.5984 0 25.6 25.6 0 0 1-36.1984 36.1984 137.472 137.472 0 0 0-194.2016 0l-186.1632 186.1632c-53.5552 53.5552-53.5552 140.6464 0 194.2016s140.6464 53.5552 194.2016 0l157.0816-157.0816a25.6 25.6 0 0 1 36.1984 36.1984l-157.0816 157.0816a187.9552 187.9552 0 0 1-133.3248 55.1424z" />
         </svg>
         <span className="text-sm text-cyan-100 group-hover:text-cyan-50">{t('friends')}</span>
       </button>
          </nav>

          {/* 语言切换 */}
          <div className="mt-auto px-4 w-full">
            <div className="flex flex-col items-center gap-2 relative">
              <span className="text-sm text-cyan-100/70">{t('switchLanguage')}</span>
              <div className="relative">
                <LanguageSwitch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 