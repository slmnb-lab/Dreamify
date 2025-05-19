'use client'

import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitch from './LanguageSwitch'
import { useParams } from 'next/navigation'
import { transferUrl } from '@/utils/locale'

export default function Navbar() {
  const { locale } = useParams()

  return (
    <div className="fixed left-0 top-0 bottom-0 w-24 bg-slate-800/80 backdrop-blur-xl border-r border-cyan-400/20 z-40">
      <div className="flex flex-col items-center h-full py-8">
        <Link 
          href={transferUrl('/', locale)} 
          className="relative mb-12 transform transition-all duration-300 hover:scale-110"
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
        <nav className="flex-1 flex flex-col items-center space-y-8">
          <button
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              setTimeout(() => {
                document.getElementById('generate-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }, 500)
            }}
            className="group p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              setTimeout(() => {
                document.getElementById('community-showcase')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }, 500)
            }}
            className="group p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              setTimeout(() => {
                document.getElementById('faq-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }, 500)
            }}
            className="group p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-cyan-300 group-hover:text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </nav>
        <div className="mt-auto">
          <LanguageSwitch />
        </div>
      </div>
    </div>
  )
} 