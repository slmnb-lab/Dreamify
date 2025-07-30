'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import community from './communityWorks'
import SiteStats from '@/components/SiteStats'
import GenerateSection, { GenerateSectionRef } from '@/components/GenerateSection'

interface FAQItem {
  q: string;
  a: string;
}

export default function HomeClient() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('home')
  const generateSectionRef = useRef<GenerateSectionRef>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);


  // 示例图片数组
  const images = [
    '/images/demo-6.png',
    '/images/demo-12.png',
    '/images/demo-3.png',
    '/images/demo-1.png',
    '/images/demo-10.png',
    '/images/demo-8.png',
  ]

  // 自动轮播
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    timerRef.current = timer

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [images.length])

  // 手动切换图片时重置计时器
  const handleImageChange = (index: number) => {
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentImageIndex(index)

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    timerRef.current = timer
  }

  // 模拟社区作品数据
  const communityWorks = community

  const handleGenerateSame = (promptText: string) => {
    if (generateSectionRef.current) {
      generateSectionRef.current.handleGenerateSame(promptText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 overflow-x-hidden">

      {/* 图片放大模态框 - 改进响应式设计 */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          {/* 顶部控制栏 */}
          <div className="w-full max-w-[1400px] flex justify-end mb-4">
            <button
              className="p-2 text-cyan-300 hover:text-cyan-100 transition-colors hover:scale-110 transform duration-300 bg-slate-800/50 rounded-full hover:bg-slate-700/50"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage(null);
              }}
              aria-label={t('banner.closeButton')}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 图片容器 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[1400px] max-h-[calc(100vh-8rem)] flex items-center justify-center">
              <Image
                src={zoomedImage}
                alt="Zoomed preview"
                width={1400}
                height={800}
                className="max-w-full max-h-[calc(100vh-8rem)] w-auto h-auto object-contain rounded-lg shadow-2xl border border-cyan-400/30 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
                priority={false}
              />
            </div>
          </div>

          {/* 底部提示 */}
          <div className="w-full max-w-[1400px] mt-4 text-center text-sm text-cyan-200/60">
            <p>{t('preview.closeHint')}</p>
          </div>
        </div>
      )}

      {/* 主要内容区域 - 使用 Tailwind CSS 控制布局 */}
      <main 
        className="transition-all duration-300 mx-auto lg:pl-40 pt-16 lg:pt-0"
      >
        {/* Hero Section - 改进响应式设计 */}
        <section className="relative min-h-screen flex items-center justify-center py-14 sm:py-20 px-5 sm:px-8 lg:px-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>

          <div className="w-full max-w-[1400px] mx-auto relative px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 xl:gap-8 items-center">
              {/* 左侧文字内容 - 改进移动端间距 */}
              <div className="text-left">
                <div className="flex items-center gap-5 mb-8 sm:mb-12 animate-fadeInUp">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <Image
                      src="/images/dreamify-logo.jpg"
                      alt="Dreamify Logo"
                      width={58}
                      height={58}
                      className="rounded-2xl shadow-xl border border-cyan-400/30 relative z-10"
                      priority={true}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Dreamify
                    </h2>
                    <p className="text-sm text-cyan-100/80 mt-1">
                      {t('hero.description')}
                    </p>
                  </div>
                </div>
                <h1 className="mb-7 sm:mb-9">
                  <span className="block text-xl sm:text-2xl lg:text-4xl font-medium text-cyan-100 mb-3 sm:mb-4 animate-fadeInUp">
                    {t('hero.titlePrefix')}
                  </span>
                  <span className="block text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-fadeInUp animation-delay-200">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-7 sm:mb-9 animate-fadeInUp animation-delay-300">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg">
                    {t('hero.tags.fastGeneration')}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg">
                    {t('hero.tags.multipleModels')}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg">
                    {t('hero.tags.noLogin')}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg">
                    {t('hero.tags.highCustomization')}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg">
                    {t('hero.tags.chineseSupport')}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-cyan-100 mb-7 sm:mb-9 animate-fadeInUp animation-delay-400">
                  {t('hero.subtitle.prefix')}
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent px-1.5">
                    {t('hero.subtitle.highlight')}
                  </span>
                  {t('hero.subtitle.suffix')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
                  <button
                    onClick={() => {
                      document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="group px-9 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 text-base font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{t('hero.startButton')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="group px-9 py-3.5 border-2 border-cyan-400/50 text-cyan-300 rounded-2xl hover:bg-cyan-400/10 transition-all duration-300 text-base font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{t('hero.faqButton')}</span>
                    <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>

              {/* 右侧图片展示 - 改进响应式显示和尺寸控制 */}
              <div className="relative flex justify-end">
                <div className="relative w-full max-w-[350px] lg:max-w-[400px] xl:max-w-[450px]">
                  <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-slate-700/50 border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-500">
                    {images.map((src, index) => (
                      <div
                        key={src}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                          currentImageIndex === index
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`AI生成的图像示例 ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="(max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                        />
                      </div>
                    ))}
                  </div>
                  {/* 轮播图控件 - 进一步缩小尺寸 */}
                  <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-2 sm:gap-2.5 lg:gap-3 bg-slate-700/80 backdrop-blur-xl px-3.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg shadow-xl border border-cyan-400/30 transform hover:scale-105 transition-transform duration-300">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageChange(index)}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 transform hover:scale-125 ${
                            currentImageIndex === index
                              ? 'bg-cyan-400 scale-125'
                              : 'bg-cyan-400/20 hover:bg-cyan-400/40'
                          }`}
                          aria-label={`切换到图片 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - 改进响应式设计 */}
        <section id="site-stats" className="py-8 sm:py-12 px-5 sm:px-8 lg:px-40 bg-slate-700/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1260px] mx-auto relative px-4 sm:px-6">
            <SiteStats />
          </div>
        </section>

        {/* Generate Section */}
        <GenerateSection 
          communityWorks={communityWorks} 
          ref={generateSectionRef}
        />

        {/* Community Showcase Section - 改进响应式设计 */}
        <section id="community-showcase" className="py-14 sm:py-20 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-800/90 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1260px] mx-auto relative px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-15">
              <div className="flex items-center justify-center gap-5 mb-7">
                <Image 
                  src="/common/comunity.svg" 
                  alt="Community" 
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  priority={false}
                />
                <h2 className="text-2xl font-bold text-cyan-100 animate-fadeInUp">{t('community.title')}</h2>
              </div>
              <p className="text-lg text-cyan-200/80 animate-fadeInUp animation-delay-200">{t('community.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {communityWorks.map((work, index) => (
                <div 
                  key={work.id} 
                  className="relative group animate-fadeInUp" 
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={work.image}
                      alt={`Community work ${work.id}`}
                      width={450}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 3}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-800/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-cyan-100 text-sm mb-6 line-clamp-3">{work.prompt}</p>
                      <button
                        onClick={() => handleGenerateSame(work.prompt)}
                        className="group w-full py-2.5 px-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
                      >
                        <span className="relative z-10">{t('community.generateSame')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 添加优雅的描述文本 */}
            <div className="mt-10 text-center">
              <Link 
                href="https://fizuclq6u3i.feishu.cn/share/base/form/shrcnQsyy6dMkoOSa1RjqeBrOQf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-cyan-200/60 hover:text-cyan-200/90 text-base transition-colors duration-300 cursor-pointer group"
              >
                <span className="relative">
                  {t('community.sharePrompt.title')}
                  <span className="block text-cyan-200/50 group-hover:text-cyan-200/70 text-sm mt-1.5">
                    {t('community.sharePrompt.description')}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400/30 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section - 改进响应式设计 */}
        <section id="faq-section" className="py-14 sm:py-24 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-700/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1260px] mx-auto relative px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-8 lg:gap-0">
              {/* 左侧图片 - 改进移动端显示 */}
              <div className="relative lg:col-span-2">
                <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-slate-600/50 border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-500 max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
                  <Image
                    src="/images/demo-12.png"
                    alt="FAQ illustration"
                    fill
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <div className="absolute -top-7 -left-7 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-3xl opacity-20 blur-3xl"></div>
              </div>

              {/* 间距列 */}
              <div className="hidden lg:block lg:col-span-1"></div>

              {/* 右侧FAQ内容 - 改进移动端间距 */}
              <div className="flex flex-col justify-center lg:col-span-2">
                <div className="flex items-center gap-5 mb-10">
                  <Image 
                    src="/common/faq.svg" 
                    alt="FAQ" 
                    width={40}
                    height={40}
                    className="w-10 h-10"
                    priority={false}
                  />
                  <h2 className="text-2xl font-bold text-cyan-100 animate-fadeInUp">
                    {t('faq.title')}
                  </h2>
                </div>
                <div className="space-y-6">
                  {t.raw('faq.questions').map((qa: FAQItem, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-600/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-cyan-400/30 animate-fadeInUp"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <h3 className="text-base font-semibold mb-4 text-cyan-100">Q{index + 1}: {qa.q}</h3>
                      <p className="text-cyan-200/80 pl-4 border-l-2 border-cyan-400">{qa.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section - 改进响应式设计 */}
        <section className="py-12 sm:py-18 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1260px] mx-auto relative px-4 sm:px-6">
            <div className="text-center">
              <p className="text-cyan-200/80 text-sm mb-6 animate-fadeInUp">
                {t('suanleme.title')}
              </p>
              <div className="flex justify-center items-center gap-10 animate-fadeInUp animation-delay-200">
                <Link
                  href="https://gongjiyun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity transform hover:scale-105 duration-300"
                >
                  <Image
                    src="https://gongjiyun.com/logo-dark.png"
                    alt={t('suanleme.gongji')}
                    width={120}
                    height={40}
                    className="h-10"
                    priority={false}
                  />
                </Link>
                <Link
                  href="https://suanleme.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity transform hover:scale-105 duration-300"
                >
                  <Image
                    src="https://suanleme.cn/logo.svg"
                    alt={t('suanleme.suanleme')}
                    width={120}
                    height={40}
                    className="h-10"
                    priority={false}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 