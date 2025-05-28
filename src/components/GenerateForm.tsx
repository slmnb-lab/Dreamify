import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface GenerateFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  steps: number;
  setSteps: (value: number) => void;
  batch_size: number;
  setBatchSize: (value: number) => void;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  onGenerate: () => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (value: boolean) => void;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  communityWorks: { prompt: string }[];
  isGenerating: boolean;
}

export default function GenerateForm({
  prompt,
  setPrompt,
  width,
  setWidth,
  height,
  setHeight,
  steps,
  setSteps,
  batch_size,
  setBatchSize,
  status,
  onGenerate,
  isAdvancedOpen,
  setIsAdvancedOpen,
  promptRef,
  communityWorks,
  isGenerating
}: GenerateFormProps) {
  const t = useTranslations('home.generate')
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      // 计算预期时间：基于像素数和步数
      // 基准：1024*1024像素，50步 = 90秒
      const basePixels = 1024 * 1024;
      const baseSteps = 50;
      const baseTime = 90;
      
      const currentPixels = width * height;
      const pixelFactor = currentPixels / basePixels;
      const stepsFactor = steps / baseSteps;
      
      const totalTime = baseTime * pixelFactor * stepsFactor;
      setEstimatedTime(totalTime);
      
      // 进度条动画
      let currentProgress = 0;
      const startTime = Date.now();
      
      timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // 转换为秒
        const timeRatio = elapsedTime / totalTime;
        
        // 计算目标进度
        let targetProgress;
        if (timeRatio < 0.2) {
          // 前20%时间快速进展到40%
          targetProgress = timeRatio * 2 * 40;
        } else if (timeRatio < 0.8) {
          // 20%-80%时间进展到80%
          targetProgress = 40 + (timeRatio - 0.2) * (40 / 0.6);
        } else {
          // 最后20%时间进展到95%
          targetProgress = 80 + (timeRatio - 0.8) * (15 / 0.2);
        }
        
        // 平滑过渡到目标进度
        const maxStep = 0.5; // 每帧最大进度变化
        const step = Math.min(maxStep, Math.abs(targetProgress - currentProgress));
        
        if (targetProgress > currentProgress) {
          currentProgress = Math.min(95, currentProgress + step);
        } else {
          currentProgress = Math.max(currentProgress - step, currentProgress);
        }
        
        setProgress(currentProgress);
      }, 50); // 更频繁的更新以获得更平滑的动画
    } else {
      setProgress(0);
      setEstimatedTime(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGenerating, steps, width, height]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isGenerating) return
    
    setProgress(0)
    onGenerate()
  }

  const handleRandomPrompt = () => {
    if (communityWorks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * communityWorks.length);
    setPrompt(communityWorks[randomIndex].prompt);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-cyan-400/30 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <form onSubmit={handleSubmit} className="space-y-8 relative flex-grow flex flex-col">
        <div className="space-y-8 flex-grow">
          <div className="flex-grow">
            <label htmlFor="prompt" className="block text-sm font-medium text-cyan-50 mb-3">
              {t('form.prompt.label')}
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-64 px-5 py-4 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none shadow-inner transition-all duration-300 text-cyan-50 placeholder-cyan-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              placeholder={t('form.prompt.placeholder')}
              disabled={status === 'loading'}
              ref={promptRef}
            />
          </div>

          <div className="border-t border-cyan-400/30 pt-8">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center text-sm text-cyan-200 hover:text-cyan-50 transition-colors"
            >
              {isAdvancedOpen ? t('form.advanced.collapse') : t('form.advanced.expand')}
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isAdvancedOpen && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-cyan-50 mb-3">
                      {t('form.width.label')}
                    </label>
                    <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                      <input
                        type="number"
                        id="width"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="64"
                        max="1920"
                        step="8"
                        disabled={status === 'loading'}
                      />
                      <div className="flex items-center border-l border-cyan-400/30">
                        <button
                          type="button"
                          onClick={() => setWidth(Math.max(64, width - 8))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || width <= 64}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWidth(Math.min(1920, width + 8))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || width >= 1920}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-cyan-200/80">{t('form.width.hint')}</p>
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-cyan-50 mb-3">
                      {t('form.height.label')}
                    </label>
                    <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                      <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="64"
                        max="1920"
                        step="8"
                        disabled={status === 'loading'}
                      />
                      <div className="flex items-center border-l border-cyan-400/30">
                        <button
                          type="button"
                          onClick={() => setHeight(Math.max(64, height - 8))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || height <= 64}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeight(Math.min(1080, height + 8))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || height >= 1080}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-cyan-200/80">{t('form.height.hint')}</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="steps" className="block text-sm font-medium text-cyan-50 mb-3">
                    {t('form.steps.label')}
                  </label>
                  <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                    <input
                      type="number"
                      id="steps"
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="25"
                      max="65"
                      disabled={status === 'loading'}
                    />
                    <div className="flex items-center border-l border-cyan-400/30">
                      <button
                        type="button"
                        onClick={() => setSteps(Math.max(15, steps - 1))}
                        className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                        disabled={status === 'loading' || steps <= 15}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSteps(Math.min(30, steps + 1))}
                        className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                        disabled={status === 'loading' || steps >= 30}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-cyan-200/80">{t('form.steps.hint')}</p>
                </div>

                <div>
                  <label htmlFor="batch_size" className="block text-sm font-medium text-cyan-50 mb-3">
                    {t('form.batch_size.label')}
                  </label>
                  <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                    <input
                      type="number"
                      id="batch_size"
                      value={batch_size}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max="4"
                      disabled={status === 'loading'}
                    />
                    <div className="flex items-center border-l border-cyan-400/30">
                      <button
                        type="button"
                        onClick={() => setBatchSize(Math.max(1, batch_size - 1))}
                        className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                        disabled={status === 'loading' || batch_size <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatchSize(Math.min(4, batch_size + 1))}
                        className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                        disabled={status === 'loading' || batch_size >= 4}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-cyan-200/80">{t('form.batch_size.hint')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="px-8 py-3 text-lg rounded-xl border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition-all duration-300 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/20"
            disabled={status === 'loading' || isGenerating}
          >
            {t('form.randomPrompt')}
          </button>
          <button
            type="submit"
            className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:shadow-xl hover:shadow-cyan-400/30 hover:-translate-y-0.5"
            disabled={status === 'loading' || isGenerating}
          >
            {isGenerating ? t('form.generateButton.loading') : t('form.generateButton.default')}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-cyan-50">{t('form.progress.title')}</span>
              <span className="text-cyan-200">
                {t('form.progress.estimatedTime')}: {Math.ceil(estimatedTime)} {t('form.progress.seconds')}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-cyan-200/80 text-right">
              {progress < 20 ? t('form.progress.status.initializing') :
               progress < 90 ? t('form.progress.status.processing') :
               t('form.progress.status.finalizing')}
            </div>
          </div>
        )}
      </form>
    </div>
  )
} 