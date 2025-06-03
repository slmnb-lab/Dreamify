'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import GenerateForm from '@/components/GenerateForm'
import community from './communityWorks'
import SiteStats from '@/components/SiteStats'
import { useNavWidth } from '@/hooks/useNavWidth'

interface FAQItem {
  q: string;
  a: string;
}

export default function HomeClient() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('home')
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [batch_size, setBatchSize] = useState(4);
  const [model, setModel] = useState('HiDream-full-fp8');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageStatuses, setImageStatuses] = useState<Array<{
    status: 'pending' | 'success' | 'error';
    message: string;
    startTime?: number;
    endTime?: number;
  }>>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const generateSectionRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const navWidth = useNavWidth();

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
    setPrompt(promptText);
    if (promptRef.current) {
      promptRef.current.focus();
    }
    if (generateSectionRef.current) {
      generateSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedImages([])
    setImageStatuses(Array(batch_size).fill({ status: 'pending', message: t('generate.preview.generating') }))
    const images: string[] = Array(batch_size).fill('')

    const requests = Array(batch_size).fill(null).map((_, index) => {
      const startTime = Date.now();
      let retryCount = 0;
      const maxRetries = 2;

      const makeRequest = async () => {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              width,
              height,
              steps,
              seed: Math.floor(Math.random() * 100000000),
              batch_size,
              model,
            }),
          });

          if (res.status !== 200) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          // Create a new promise to track image loading
          const imageLoadPromise = new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              const endTime = Date.now();
              const duration = ((endTime - startTime) / 1000).toFixed(1);
              images[index] = data.imageUrl;
              setGeneratedImages([...images]);
              setImageStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[index] = ({
                  status: 'success',
                  message: `${t('generate.preview.completed')} (${duration}s)`,
                  startTime,
                  endTime
                });
                return newStatuses;
              });
              resolve();
            };
            img.src = data.imageUrl;
          });
          await imageLoadPromise;
        } catch (err) {
          console.error(`生成图片失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, err);

          if (retryCount < maxRetries) {
            retryCount++;
            setImageStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[index] = ({
                status: 'pending',
                message: `${t('generate.preview.retrying')} (${retryCount}/${maxRetries})`
              });
              return newStatuses;
            });
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequest();
          } else {
            setImageStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[index] = ({
                status: 'error',
                message: t('generate.preview.error')
              });
              return newStatuses;
            });
          }
        }
      };

      return makeRequest();
    });
    // 等待所有请求完成（可选，如果你想在全部完成后执行某些操作）
    await Promise.allSettled(requests);
    setIsGenerating(false)
  }

  // 计算内容区域的动态样式
  const getContentStyle = () => {
    // 在移动端使用顶部导航栏，添加顶部padding
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return {
        marginLeft: '0',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '4rem', // 为顶部导航栏留出空间
        width: '100%',
      };
    }
    // 在桌面端使用导航栏宽度作为margin，并计算合适的宽度
    return {
      marginLeft: `${navWidth}px`,
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      width: `calc(100% - ${navWidth}px)`,
    };
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
              aria-label="Close preview"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 图片容器 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[1400px] max-h-[calc(100vh-8rem)] flex items-center justify-center">
              <img
                src={zoomedImage}
                alt="Zoomed preview"
                className="max-w-full max-h-[calc(100vh-8rem)] w-auto h-auto object-contain rounded-lg shadow-2xl border border-cyan-400/30 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* 底部提示 */}
          <div className="w-full max-w-[1400px] mt-4 text-center text-sm text-cyan-200/60">
            <p>点击图片外部区域或关闭按钮退出预览</p>
          </div>
        </div>
      )}

      {/* 主要内容区域 - 使用动态margin和padding */}
      <main 
        className="transition-all duration-300"
        style={getContentStyle()}
      >
        {/* Hero Section - 改进响应式设计 */}
        <section className="relative min-h-screen flex items-center justify-center py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>

          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* 左侧文字内容 - 改进移动端间距 */}
              <div className="text-left">
                <div className="flex items-center gap-4 mb-8 sm:mb-12 animate-fadeInUp">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <Image
                      src="/images/dreamify-logo.jpg"
                      alt="Dreamify Logo"
                      width={64}
                      height={64}
                      className="rounded-2xl shadow-xl border border-cyan-400/30 relative z-10"
                    />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Dreamify
                  </h2>
                </div>
                <h1 className="mb-6 sm:mb-8">
                  <span className="block text-3xl sm:text-4xl lg:text-6xl font-medium text-cyan-100 mb-3 sm:mb-4 animate-fadeInUp">
                    {t('hero.titlePrefix')}
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-fadeInUp animation-delay-200">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 animate-fadeInUp animation-delay-300">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg">
                    {t('hero.tags.fastGeneration')}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg">
                    {t('hero.tags.multipleModels')}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg">
                    {t('hero.tags.noLogin')}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg">
                    {t('hero.tags.highCustomization')}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg">
                    {t('hero.tags.chineseSupport')}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl text-cyan-100 mb-6 sm:mb-8 animate-fadeInUp animation-delay-400">
                  {t('hero.subtitle.prefix')}
                  <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent px-2">
                    {t('hero.subtitle.highlight')}
                  </span>
                  {t('hero.subtitle.suffix')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
                  <button
                    onClick={() => {
                      document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="group px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 text-lg font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{t('hero.startButton')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="group px-10 py-4 border-2 border-cyan-400/50 text-cyan-300 rounded-2xl hover:bg-cyan-400/10 transition-all duration-300 text-lg font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{t('hero.faqButton')}</span>
                    <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>

              {/* 右侧图片展示 - 改进移动端显示 */}
              <div className="relative">
                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-slate-700/50 border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-500">
                  {images.map((src, index) => (
                    <div
                      key={src}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${currentImageIndex === index
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
                        sizes="(max-width: 1536px) 100vw, 1536px"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-4 bg-slate-700/80 backdrop-blur-xl px-8 py-3 rounded-2xl shadow-xl border border-cyan-400/30 transform hover:scale-105 transition-transform duration-300">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${currentImageIndex === index
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
        </section>

        {/* Stats Section - 改进响应式设计 */}
        <section id="site-stats" className="py-8 sm:py-12 bg-slate-700/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <SiteStats />
          </div>
        </section>

        {/* Generate Section - 改进响应式设计 */}
        <section id="generate-section" ref={generateSectionRef} className="py-12 sm:py-20 relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* 左侧表单区域 */}
              <div className="order-1 lg:order-1 lg:col-span-2 animate-fadeInUp">
                <GenerateForm
                  prompt={prompt}
                  setPrompt={setPrompt}
                  width={width}
                  setWidth={setWidth}
                  height={height}
                  setHeight={setHeight}
                  steps={steps}
                  setSteps={setSteps}
                  batch_size={batch_size}
                  setBatchSize={setBatchSize}
                  model={model}
                  setModel={setModel}
                  status="authenticated"
                  onGenerate={handleGenerate}
                  isAdvancedOpen={isAdvancedOpen}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  promptRef={promptRef}
                  communityWorks={communityWorks}
                  isGenerating={isGenerating}
                />
              </div>

              {/* 右侧预览区域 - 改进移动端网格布局 */}
              <div className="order-2 lg:order-2 lg:col-span-3 animate-fadeInUp animation-delay-200">
                <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 border border-cyan-400/30 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <img src="/common/preview.svg" alt="Preview" className="w-8 h-8" />
                      <h2 className="text-3xl font-semibold text-cyan-100">{t('generate.preview.title')}</h2>
                    </div>
                    {generatedImages && generatedImages.length > 0 && (
                      <button
                        onClick={() => {
                          generatedImages.forEach((image, index) => {
                            const link = document.createElement('a');
                            link.href = image;
                            link.download = `generated-image-${index + 1}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          });
                        }}
                        className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 relative overflow-hidden"
                      >
                        <span className="relative z-10">{t('generate.preview.download')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 flex-grow">
                    {Array.from({ length: batch_size }).map((_, index) => (
                      <div key={index} className="aspect-square relative rounded-2xl overflow-hidden bg-slate-600/50 backdrop-blur-sm border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300">
                        {generatedImages[index] && (
                          <img
                            src={generatedImages[index]}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                            onClick={() => setZoomedImage(generatedImages[index])}
                          />
                        )}
                        <div className={`absolute bottom-0 left-0 right-0 p-4 text-center text-sm backdrop-blur-md ${imageStatuses[index]?.status === 'error'
                            ? 'bg-red-500/20 text-red-300'
                            : imageStatuses[index]?.status === 'success'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                          <div className="flex items-center justify-center gap-2">
                            {imageStatuses[index]?.status === 'pending' && (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            )}
                            <span className="font-medium [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                              {imageStatuses[index]?.message}
                            </span>
                          </div>
                        </div>
                        {isGenerating && !imageStatuses[index]?.status && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50 backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent"></div>
                          </div>
                        )}
                        {!isGenerating && !imageStatuses[index]?.status && !generatedImages[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50 backdrop-blur-sm">
                            <div className="text-center">
                              <div className="text-cyan-300/50">{t('generate.preview.placeholder')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-sm text-cyan-200/80">
                    {t('generate.preview.hint')}
                  </div>
                  {imageStatuses.length > 0 && (
                    <div className="mt-4 text-center text-sm">
                      <span className="text-blue-300 font-medium [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {imageStatuses.filter(status => status.status === 'pending').length}
                      </span>
                      <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {t('generate.preview.status.generating')}
                      </span>
                      <span className="text-green-300 font-medium mx-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {imageStatuses.filter(status => status.status === 'success').length}
                      </span>
                      <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {t('generate.preview.status.success')}
                      </span>
                      <span className="text-red-300 font-medium mx-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {imageStatuses.filter(status => status.status === 'error').length}
                      </span>
                      <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {t('generate.preview.status.failed')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Showcase Section - 改进响应式设计 */}
        <section id="community-showcase" className="py-12 sm:py-20 bg-slate-800/90 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src="/common/comunity.svg" alt="Community" className="w-12 h-12" />
                <h2 className="text-4xl font-bold text-cyan-100 animate-fadeInUp">{t('community.title')}</h2>
              </div>
              <p className="text-2xl text-cyan-200/80 animate-fadeInUp animation-delay-200">{t('community.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {communityWorks.map((work, index) => (
                <div key={work.id} className="relative group animate-fadeInUp" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={work.image}
                      alt={`Community work ${work.id}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-800/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-cyan-100 text-base mb-6 line-clamp-3">{work.prompt}</p>
                      <button
                        onClick={() => handleGenerateSame(work.prompt)}
                        className="group w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
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
            <div className="mt-12 text-center">
              <Link 
                href="/#site-stats" 
                className="inline-block text-cyan-200/60 hover:text-cyan-200/90 text-lg transition-colors duration-300 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('site-stats')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative">
                  想分享你的绘画作品和创意提示词？
                  <span className="block text-cyan-200/50 group-hover:text-cyan-200/70 text-base mt-1">
                    欢迎通过QQ联系我们，让更多人看到你的灵感！
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400/30 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section - 改进响应式设计 */}
        <section id="faq-section" className="py-12 sm:py-24 bg-slate-700/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-8 lg:gap-0">
              {/* 左侧图片 - 改进移动端显示 */}
              <div className="relative lg:col-span-2">
                <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-slate-600/50 border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/demo-12.png"
                    alt="FAQ illustration"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-3xl opacity-20 blur-3xl"></div>
              </div>

              {/* 间距列 */}
              <div className="hidden lg:block lg:col-span-1"></div>

              {/* 右侧FAQ内容 - 改进移动端间距 */}
              <div className="flex flex-col justify-center lg:col-span-2">
                <div className="flex items-center gap-4 mb-12">
                  <img src="/common/faq.svg" alt="FAQ" className="w-12 h-12" />
                  <h2 className="text-4xl font-bold text-cyan-100 animate-fadeInUp">
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
                      <h3 className="text-xl font-semibold mb-4 text-cyan-100">Q{index + 1}: {qa.q}</h3>
                      <p className="text-cyan-200/80 pl-6 border-l-2 border-cyan-400">{qa.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section - 改进响应式设计 */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
          <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
            <div className="text-center">
              <p className="text-cyan-200/80 text-base mb-6 animate-fadeInUp">
                {t('suanleme.title')}
              </p>
              <div className="flex justify-center items-center gap-12 animate-fadeInUp animation-delay-200">
                <Link
                  href="https://gongjiyun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 duration-300"
                >
                  <img
                    src="https://gongjiyun.com/logo-dark.png"
                    alt={t('suanleme.gongji')}
                    className="h-12"
                  />
                </Link>
                <Link
                  href="https://suanleme.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 duration-300"
                >
                  <img
                    src="https://suanleme.cn/logo.svg"
                    alt={t('suanleme.suanleme')}
                    className="h-12"
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