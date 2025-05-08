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
  seed?: number;
  setSeed: (value: number | undefined) => void;
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
  seed,
  setSeed,
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
  const [error, setError] = useState('')

  // 模拟进度条
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isGenerating) return
    
    setError('')
    setProgress(0)
    

    try {

      setProgress(100)
      onGenerate()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('form.error.general'))
    }
  }

  const handleRandomPrompt = () => {
    if (communityWorks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * communityWorks.length);
    setPrompt(communityWorks[randomIndex].prompt);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-cyan-400/30">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <form onSubmit={handleSubmit} className="space-y-8 relative">
        <div className="space-y-8">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-cyan-50 mb-3">
              {t('form.prompt.label')}
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-64 px-5 py-4 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none shadow-inner transition-all duration-300 text-cyan-50 placeholder-cyan-700"
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
                    <div className="relative">
                      <input
                        type="number"
                        id="width"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-5 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-center shadow-inner transition-all duration-300 text-cyan-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="64"
                        max="1920"
                        step="8"
                        disabled={status === 'loading'}
                      />
                      <div className="absolute right-0 top-0 bottom-0 flex items-center">
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
                    <div className="relative">
                      <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-5 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-center shadow-inner transition-all duration-300 text-cyan-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="64"
                        max="1080"
                        step="8"
                        disabled={status === 'loading'}
                      />
                      <div className="absolute right-0 top-0 bottom-0 flex items-center">
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
                  <div className="relative">
                    <input
                      type="number"
                      id="steps"
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="w-full px-5 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-center shadow-inner transition-all duration-300 text-cyan-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="15"
                      max="45"
                      disabled={status === 'loading'}
                    />
                    <div className="absolute right-0 top-0 bottom-0 flex items-center">
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
                  <div className="relative">
                    <input
                      type="number"
                      id="batch_size"
                      value={batch_size}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full px-5 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-center shadow-inner transition-all duration-300 text-cyan-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max="4"
                      disabled={status === 'loading'}
                    />
                    <div className="absolute right-0 top-0 bottom-0 flex items-center">
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

                <div>
                  <label htmlFor="seed" className="block text-sm font-medium text-cyan-50 mb-3">
                    {t('form.seed.label')}
                  </label>
                  <input
                    type="text"
                    id="seed"
                    value={seed?.toString() || ''}
                    onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-5 py-3 bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 shadow-inner transition-all duration-300 text-cyan-50"
                    placeholder={t('form.seed.placeholder')}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
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
        </div>

        {isGenerating && (
          <div className="space-y-3">
            <div className="h-2 bg-slate-700/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-cyan-200/80 text-center">
              {progress < 90 ? t('form.generating') : t('form.finalizing')}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}
      </form>
    </div>
  )
} 