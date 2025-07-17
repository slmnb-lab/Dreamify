import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import GenerateForm from './GenerateForm'
import GeneratePreview from './GeneratePreview'

interface GenerateSectionProps {
  communityWorks: { prompt: string }[];
}

export interface GenerateSectionRef {
  handleGenerateSame: (promptText: string) => void;
}

const GenerateSection = forwardRef<GenerateSectionRef, GenerateSectionProps>(({ communityWorks }, ref) => {
  const t = useTranslations('home.generate')
  const tHome = useTranslations('home')
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [batch_size, setBatchSize] = useState(1);
  const [model, setModel] = useState('HiDream-full-fp8');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [denoising_strength, setDenoisingStrength] = useState(0.7);
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
  const [stepsError, setStepsError] = useState<string | null>(null);
  const [batchSizeError, setBatchSizeError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [imageCountError, setImageCountError] = useState<string | null>(null);
  const stepsRef = useRef<HTMLInputElement>(null);
  const batchSizeRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  
  // 要设置为参考图片的生成图片 URL
  const [generatedImageToSetAsReference, setGeneratedImageToSetAsReference] = useState<string | null>(null);

  // 处理画同款功能
  const handleGenerateSame = (promptText: string) => {
    setPrompt(promptText);
    if (generateSectionRef.current) {
      generateSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    handleGenerateSame
  }));

  // 处理设置生成的图片为参考图片
  const handleSetGeneratedImageAsReference = async (imageUrl: string) => {
    setGeneratedImageToSetAsReference(imageUrl);
  };

  // 清除 generatedImageToSetAsReference 状态，避免重复设置
  useEffect(() => {
    if (generatedImageToSetAsReference) {
      // 延迟清除，确保 GenerateForm 组件有时间处理
      const timer = setTimeout(() => {
        setGeneratedImageToSetAsReference(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [generatedImageToSetAsReference]);

  const handleGenerate = async () => {
    let hasError = false;
    setStepsError(null);
    setBatchSizeError(null);
    setSizeError(null);
    setImageCountError(null);
    
    // 验证参考图片数量
    const models = [
      {
        id: "HiDream-full-fp8",
        maxImages: 0
      },{
        id: "Flux-Kontext",
        maxImages: 2
      },
      {
        id: "Flux-Dev",
        maxImages: 1
      },
      {
        id: "Stable-Diffusion-3.5",
        maxImages: 0
      }
    ];
    
    const currentModel = models.find(m => m.id === model);
    const maxImages = currentModel?.maxImages || 1;
    
    if (uploadedImages.length > maxImages) {
      setImageCountError(t('error.validation.imageCountLimit', { model, maxImages }));
      hasError = true;
    }
    
    if (steps < 5 || steps > 45) {
      setStepsError(t('error.validation.stepsRange'));
      stepsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasError = true;
    }
    if (batch_size < 1 || batch_size > 4) {
      setBatchSizeError(t('error.validation.batchSizeRange'));
      batchSizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasError = true;
    }
    if (width < 64 || width > 1920 || height < 64 || height > 1920) {
      setSizeError(t('error.validation.sizeRange'));
      widthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasError = true;
    }
    if (hasError) return;
    
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
              images: uploadedImages, // 使用图片数组
              denoise: uploadedImages.length > 0 ? denoising_strength : undefined, // 只在有参考图片时发送降噪参数
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
    <section id="generate-section" ref={generateSectionRef} className="py-10 sm:py-16 relative">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
      <div className="w-full max-w-[1260px] mx-auto relative px-3 sm:px-5">
        {/* Prompt Input Section */}
        <div className="mb-7 animate-fadeInUp">
          <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl p-7 border border-cyan-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            
            <div className="relative">
              <label htmlFor="prompt" className="flex items-center text-xs font-medium text-cyan-50 mb-2.5">
                <img src="/form/prompt.svg" alt="Prompt" className="w-4 h-4 mr-1.5 text-cyan-50 [&>path]:fill-current" />
                {t('form.prompt.label')}
              </label>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow h-28 px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none shadow-inner transition-all duration-300 text-cyan-50 placeholder-cyan-700 text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    placeholder={t('form.prompt.placeholder')}
                    ref={promptRef}
                  />
                  <button
                    type="button"
                    onClick={handleRandomPrompt}
                    className="px-5 py-2.5 h-28 text-base rounded-xl border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition-all duration-300 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/20 whitespace-nowrap"
                    disabled={isGenerating}
                  >
                    {t('form.randomPrompt')}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:shadow-xl hover:shadow-cyan-400/30 hover:-translate-y-0.5"
                  disabled={isGenerating}
                >
                  {isGenerating ? t('form.generateButton.loading') : t('form.generateButton.default')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form and Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* 左侧表单区域 */}
          <div className="order-1 lg:order-1 lg:col-span-2 animate-fadeInUp h-fit z-10">
            <GenerateForm
              
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
              setUploadedImages={setUploadedImages}
              denoising_strength={denoising_strength}
              setDenoisingStrength={setDenoisingStrength}
              stepsError={stepsError}
              batchSizeError={batchSizeError}
              sizeError={sizeError}
              imageCountError={imageCountError}
              stepsRef={stepsRef}
              batchSizeRef={batchSizeRef}
              widthRef={widthRef}
              heightRef={heightRef}
              generatedImageToSetAsReference={generatedImageToSetAsReference}
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
              onSetAsReference={handleSetGeneratedImageAsReference}
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
              aria-label={tHome('banner.closeButton')}
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
            <p>{tHome('preview.closeHint')}</p>
          </div>
        </div>
      )}
    </section>
  )
})

GenerateSection.displayName = 'GenerateSection';

export default GenerateSection 