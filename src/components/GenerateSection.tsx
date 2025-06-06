import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import GenerateForm from './GenerateForm'
import GeneratePreview from './GeneratePreview'

interface GenerateSectionProps {
  communityWorks: { prompt: string }[];
}

export default function GenerateSection({ communityWorks }: GenerateSectionProps) {
  const t = useTranslations('home.generate')
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [batch_size, setBatchSize] = useState(4);
  const [model, setModel] = useState('HiDream-full-fp8');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageStatuses, setImageStatuses] = useState<Array<{
    status: 'pending' | 'success' | 'error';
    message: string;
    startTime?: number;
    endTime?: number;
  }>>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const generateSectionRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedImages([])
    setImageStatuses(Array(batch_size).fill({ status: 'pending', message: t('preview.generating') }))
    const images: string[] = Array(batch_size).fill('')

    const requests = Array(batch_size).fill(null).map((_, index) => {
      const startTime = Date.now();
      let retryCount = 0;
      const maxRetries = 2;

      const makeRequest = async () => {
        try {
          // 如果有上传的图片，构建完整的URL
          const fullImageUrl = uploadedImage ? `${window.location.origin}${uploadedImage}` : undefined;

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
              image: fullImageUrl,
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
                  message: `${t('preview.completed')} (${duration}s)`,
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
                message: `${t('preview.retrying')} (${retryCount}/${maxRetries})`
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
                message: t('preview.error')
              });
              return newStatuses;
            });
          }
        }
      };

      return makeRequest();
    });
    // 等待所有请求完成
    await Promise.allSettled(requests);
    setIsGenerating(false)
  }

  const handleRandomPrompt = () => {
    if (communityWorks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * communityWorks.length);
    setPrompt(communityWorks[randomIndex].prompt);
  };

  return (
    <section id="generate-section" ref={generateSectionRef} className="py-12 sm:py-20 relative">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
      <div className="w-full max-w-[1400px] mx-auto relative px-4 sm:px-6">
        {/* Prompt Input Section */}
        <div className="mb-8 animate-fadeInUp">
          <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-cyan-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            
            <div className="relative">
              <label htmlFor="prompt" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                <img src="/form/prompt.svg" alt="Prompt" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
                {t('form.prompt.label')}
              </label>
              <div className="flex gap-4">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-grow h-32 px-5 py-4 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none shadow-inner transition-all duration-300 text-cyan-50 placeholder-cyan-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  placeholder={t('form.prompt.placeholder')}
                  ref={promptRef}
                />
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  className="px-6 py-3 h-32 text-lg rounded-xl border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition-all duration-300 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/20 whitespace-nowrap"
                  disabled={isGenerating}
                >
                  {t('form.randomPrompt')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form and Preview Grid */}
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
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
            />
          </div>

          {/* 右侧预览区域 */}
          <div className="order-2 lg:order-2 lg:col-span-3 animate-fadeInUp animation-delay-200">
            <GeneratePreview
              generatedImages={generatedImages}
              imageStatuses={imageStatuses}
              batch_size={batch_size}
              isGenerating={isGenerating}
              setZoomedImage={setZoomedImage}
            />
          </div>
        </div>
      </div>

      {/* 图片放大模态框 */}
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
    </section>
  )
} 