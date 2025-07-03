import { useTranslations } from 'next-intl'

interface GeneratePreviewProps {
  generatedImages: string[];
  imageStatuses: Array<{
    status: 'pending' | 'success' | 'error';
    message: string;
  }>;
  batch_size: number;
  isGenerating: boolean;
  setZoomedImage: (image: string) => void;
}

export default function GeneratePreview({
  generatedImages,
  imageStatuses,
  batch_size,
  isGenerating,
  setZoomedImage
}: GeneratePreviewProps) {
  const t = useTranslations('home.generate')

  return (
    <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 border border-cyan-400/30 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/common/preview.svg" alt="Preview" className="w-8 h-8" />
          <h2 className="text-3xl font-semibold text-cyan-100">{t('preview.title')}</h2>
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
            <span className="relative z-10">{t('preview.download')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}
      </div>
      <div
        className={
          batch_size === 1
            ? 'grid grid-cols-1 grid-rows-1 flex-grow'
            : batch_size === 2
            ? 'grid grid-cols-1 grid-rows-2 gap-4 sm:gap-8 flex-grow'
            : 'grid grid-cols-2 grid-rows-2 gap-4 sm:gap-8 flex-grow'
        }
      >
        {Array.from({ length: batch_size }).map((_, index) => (
          <div
            key={index}
            className={
              batch_size === 1
                ? 'aspect-square relative rounded-2xl overflow-hidden bg-slate-600/50 backdrop-blur-sm border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300 col-span-1 row-span-1'
                : batch_size === 2
                ? 'aspect-[1/0.5] relative rounded-2xl overflow-hidden bg-slate-600/50 backdrop-blur-sm border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300 col-span-1 row-span-1'
                : 'aspect-square relative rounded-2xl overflow-hidden bg-slate-600/50 backdrop-blur-sm border border-cyan-400/30 transform hover:scale-[1.02] transition-transform duration-300'
            }
          >
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
                  <div className="text-cyan-300/50">{t('preview.placeholder')}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-cyan-200/80">
        {t('preview.hint')}
      </div>
      {imageStatuses.length > 0 && (
        <div className="mt-4 text-center text-sm">
          <span className="text-blue-300 font-medium [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {imageStatuses.filter(status => status.status === 'pending').length}
          </span>
          <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {t('preview.status.generating')}
          </span>
          <span className="text-green-300 font-medium mx-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {imageStatuses.filter(status => status.status === 'success').length}
          </span>
          <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {t('preview.status.success')}
          </span>
          <span className="text-red-300 font-medium mx-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {imageStatuses.filter(status => status.status === 'error').length}
          </span>
          <span className="text-cyan-50 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
            {t('preview.status.failed')}
          </span>
        </div>
      )}
    </div>
  )
} 