import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface GenerateFormProps {
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  steps: number;
  setSteps: (value: number) => void;
  batch_size: number;
  setBatchSize: (value: number) => void;
  model: string;
  setModel: (value: string) => void;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  onGenerate: () => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (value: boolean) => void;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  communityWorks: { prompt: string }[];
  isGenerating: boolean;
  uploadedImage: string | null;
  setUploadedImage: (value: string | null) => void;
  denoising_strength: number;
  setDenoisingStrength: (value: number) => void;
  stepsError?: string | null;
  batchSizeError?: string | null;
  sizeError?: string | null;
  stepsRef?: React.RefObject<HTMLInputElement | null>;
  batchSizeRef?: React.RefObject<HTMLInputElement | null>;
  widthRef?: React.RefObject<HTMLInputElement | null>;
  heightRef?: React.RefObject<HTMLInputElement | null>;
  generatedImageToSetAsReference?: string | null;
}

export default function GenerateForm({
  width,
  setWidth,
  height,
  setHeight,
  steps,
  setSteps,
  batch_size,
  setBatchSize,
  model,
  setModel,
  status,
  onGenerate,
  isAdvancedOpen,
  setIsAdvancedOpen,
  isGenerating,
  setUploadedImage,
  denoising_strength,
  setDenoisingStrength,
  stepsError,
  batchSizeError,
  sizeError,
  stepsRef,
  batchSizeRef,
  widthRef,
  heightRef,
  generatedImageToSetAsReference
}: GenerateFormProps) {
  const t = useTranslations('home.generate')
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      // 计算预期时间：基于像素数、步数和模型
      // 基准：1024*1024像素，30步 = 60秒 (HiDream-full-fp8)
      const basePixels = 1024 * 1024;
      const baseSteps = 30;
      const baseTime = 60;
      
      // 模型时间系数
      const modelTimeFactors = {
        'HiDream-full-fp16': 2.0,    // 两倍于 fp8
        'HiDream-full-fp8': 1.0,     // 基准
        'Flux-Dev': 0.67,            // 40s/60s
        'Flux-Kontext': 0.67,         // 40s/60s
        'Stable-Diffusion-3.5': 0.67  // 40s/60s
      };
      
      const currentPixels = width * height;
      const pixelFactor = currentPixels / basePixels;
      const stepsFactor = steps / baseSteps;
      const modelFactor = modelTimeFactors[model as keyof typeof modelTimeFactors] || 1.0;
      
      const totalTime = baseTime * pixelFactor * stepsFactor * modelFactor;
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
          // 前20%时间快速进展到30%
          targetProgress = timeRatio * 2 * 30;
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
  }, [isGenerating, steps, width, height, model]);

  // Add click outside handler for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isGenerating) return
    
    setProgress(0)
    onGenerate()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB')
      return
    }

    try {
      // 读取文件为 base64
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          // 移除 base64 前缀（如 "data:image/jpeg;base64,"）
          const base64String = event.target.result.toString().split(',')[1]
          
          // 创建图片对象以获取尺寸
          const img = new window.Image()
          img.onload = () => {
            // 设置预览图片（使用带前缀的 base64 用于预览）
            setPreviewImage(event.target?.result as string)
            console.log('GenerateForm: Successfully set previewImage')
            
            // 计算合适的尺寸（保持8的倍数）
            const newWidth = Math.round(img.width / 8) * 8
            const newHeight = Math.round(img.height / 8) * 8
            
            // 确保尺寸在允许范围内
            const finalWidth = Math.min(Math.max(newWidth, 64), 1920)
            const finalHeight = Math.min(Math.max(newHeight, 64), 1920)
            
            // 更新宽高状态
            setWidth(finalWidth)
            setHeight(finalHeight)

            // 更新父组件中的图片数据（使用无前缀的 base64）
            setUploadedImage(base64String)
          }
          img.src = event.target.result as string
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('处理图片失败，请重试')
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB')
      return
    }

    // 使用与 handleImageUpload 相同的处理逻辑
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result.toString().split(',')[1]
        const img = new window.Image()
        img.onload = () => {
          setPreviewImage(event.target?.result as string)
          const newWidth = Math.round(img.width / 8) * 8
          const newHeight = Math.round(img.height / 8) * 8
          const finalWidth = Math.min(Math.max(newWidth, 64), 1920)
          const finalHeight = Math.min(Math.max(newHeight, 64), 1920)
          setWidth(finalWidth)
          setHeight(finalHeight)
          setUploadedImage(base64String)
          console.log('GenerateForm: Successfully set uploadedImage to new base64 string')
          console.log('GenerateForm: New image dimensions:', finalWidth, 'x', finalHeight)
        }
        img.src = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }

  const models = [
    {
      id: "HiDream-full-fp8",
      name: "HiDream-full-fp8",
      image: "/models/HiDream-full.jpg",
      use_i2i: false,
      use_t2i: true
    },{
      id: "Flux-Kontext",
      name: "Flux-Kontext",
      image: "/models/Flux-Kontext.jpg",
      use_i2i: true,
      use_t2i: false
    },
    {
      id: "Flux-Dev",
      name: "Flux-Dev",
      image: "/models/Flux-Dev.jpg",
      use_i2i: true,
      use_t2i: true
    },
    {
      id: "Stable-Diffusion-3.5",
      name: "Stable-Diffusion-3.5",
      image: "/models/StableDiffusion-3.5.jpg",
      use_i2i: false,
      use_t2i: true
    }
  ]

  // 根据是否有参考图片过滤模型
  const filteredModels = previewImage
    ? models.filter(m => m.use_i2i)
    : models.filter(m => m.use_t2i)

  // 如果当前选中的模型不在可选模型中，自动切换到第一个可用模型
  useEffect(() => {
    if (filteredModels.length > 0 && !filteredModels.some(m => m.id === model)) {
      setModel(filteredModels[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImage])

  // 处理从 URL 设置参考图片
  useEffect(() => {
    if (generatedImageToSetAsReference) {
      const setImageFromUrl = async () => {
        try {
          let blob;
          
          // 检查是否是 data URL
          if (generatedImageToSetAsReference.startsWith('data:')) {
            // 直接使用 data URL
            const response = await fetch(generatedImageToSetAsReference);
            blob = await response.blob();
          } else {
            // 普通 URL
            const response = await fetch(generatedImageToSetAsReference);
            blob = await response.blob();
          }
          
          return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const base64String = event.target.result.toString().split(',')[1];
                
                // 创建图片对象以获取尺寸
                const img = new window.Image();
                img.onload = () => {
                  // 设置预览图片（使用带前缀的 base64 用于预览）
                  setPreviewImage(event.target?.result as string);
                  
                  // 计算合适的尺寸（保持8的倍数）
                  const newWidth = Math.round(img.width / 8) * 8;
                  const newHeight = Math.round(img.height / 8) * 8;
                  
                  // 确保尺寸在允许范围内
                  const finalWidth = Math.min(Math.max(newWidth, 64), 1920);
                  const finalHeight = Math.min(Math.max(newHeight, 64), 1920);
                  
                  // 更新宽高状态
                  setWidth(finalWidth);
                  setHeight(finalHeight);

                  // 更新父组件中的图片数据（使用无前缀的 base64）
                  setUploadedImage(base64String);
                  
                  // 添加小延迟确保状态更新完成
                  setTimeout(() => {
                    resolve();
                  }, 100);
                };
                img.src = event.target.result as string;
              } else {
                reject(new Error('Failed to read image'));
              }
            };
            reader.onerror = () => reject(new Error('Failed to read image'));
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error setting image from URL:', error);
        }
      };

      setImageFromUrl();
    }
  }, [generatedImageToSetAsReference, setWidth, setHeight, setUploadedImage]);

  return (
    <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-cyan-400/30 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <form onSubmit={handleSubmit} className="space-y-8 relative flex-grow flex flex-col">
        <div className="space-y-8 flex-grow">
          <div className="flex-grow">
            <label className="flex items-center text-sm font-medium text-cyan-50 mb-3">
              <img src="/form/upload.svg" alt="Upload" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
              {t('form.upload.label')}
            </label>
            <div className="relative">
              {previewImage ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-cyan-400/30 bg-slate-700/50">
                  <Image
                    src={previewImage}
                    alt="Uploaded reference"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-slate-800/80 rounded-full text-cyan-200 hover:text-cyan-50 transition-colors"
                    aria-label="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`aspect-[4/3] rounded-2xl border-2 border-dashed ${
                    isDragging ? 'border-cyan-400 bg-slate-600/50' : 'border-cyan-400/30 bg-slate-700/50'
                  } flex flex-col items-center justify-center cursor-pointer hover:bg-slate-600/50 transition-colors`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg className="w-12 h-12 text-cyan-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-cyan-200/80 text-center px-4">
                    点击或拖拽图片到此处上传
                    <br />
                    <span className="text-sm text-cyan-200/60">支持 JPG、PNG 格式，最大 10MB</span>
                  </p>
                </div>
              )}
            </div>
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
                    <label htmlFor="width" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                      <img src="/form/width.svg" alt="Width" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
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
                        ref={widthRef}
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
                    {sizeError && (
                      <p className="mt-1 text-sm text-red-400">{sizeError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="height" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                      <img src="/form/height.svg" alt="Height" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
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
                        ref={heightRef}
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
                    {sizeError && (
                      <p className="mt-1 text-sm text-red-400">{sizeError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="model" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                    <img src="/form/models.svg" alt="Model" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
                    {t('form.model.label')}
                  </label>
                  <div className="relative" ref={modelDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="w-full bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl px-4 py-3 text-left text-cyan-50 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 shadow-inner transition-all duration-300 flex items-center justify-between"
                      disabled={status === 'loading'}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-6 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={filteredModels.find(m => m.id === model)?.image} 
                            alt={model} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{model}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-cyan-200 transform transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isModelDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-cyan-400/30 shadow-xl overflow-hidden">
                        {filteredModels.map((modelOption) => (
                          <button
                            key={modelOption.id}
                            type="button"
                            onClick={() => {
                              setModel(modelOption.id)
                              setIsModelDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-start space-x-3 hover:bg-slate-700/50 ${
                              model === modelOption.id ? 'bg-slate-700/50' : ''
                            }`}
                          >
                            <div className="w-24 h-12 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={modelOption.image} 
                                alt={modelOption.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-cyan-50 font-medium">{modelOption.name}</div>
                              <div className="text-sm text-cyan-200/80 mt-1 line-clamp-2">
                                {t(`form.model.descriptions.${modelOption.id.replace(/\./g, '')}`)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-cyan-200/80">{t('form.model.hint')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="steps" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                      <img src="/form/steps.svg" alt="Steps" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
                      {t('form.steps.label')}
                    </label>
                    <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                      <input
                        type="number"
                        id="steps"
                        value={steps}
                        onChange={(e) => setSteps(Number(e.target.value))}
                        className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="5"
                        max="45"
                        disabled={status === 'loading'}
                        ref={stepsRef}
                      />
                      <div className="flex items-center border-l border-cyan-400/30">
                        <button
                          type="button"
                          onClick={() => setSteps(Math.max(15, steps - 1))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || steps <= 5}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSteps(Math.min(65, steps + 1))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || steps >= 45}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-cyan-200/80">{t('form.steps.hint')}</p>
                    {stepsError && (
                      <p className="mt-1 text-sm text-red-400">{stepsError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="batch_size" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                      <img src="/form/generation-number.svg" alt="Batch Size" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
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
                        ref={batchSizeRef}
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
                    {batchSizeError && (
                      <p className="mt-1 text-sm text-red-400">{batchSizeError}</p>
                    )}
                  </div>
                </div>

                {previewImage && (
                  <div>
                    <label htmlFor="denoising_strength" className="flex items-center text-sm font-medium text-cyan-50 mb-3">
                      <img src="/form/denoise.svg" alt="Denoising Strength" className="w-5 h-5 mr-2 text-cyan-50 [&>path]:fill-current" />
                      {t('form.denoising_strength.label')}
                    </label>
                    <div className="relative flex items-center bg-slate-700/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 shadow-inner transition-all duration-300">
                      <input
                        type="number"
                        id="denoising_strength"
                        value={denoising_strength}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            const clampedValue = Math.min(1, Math.max(0, value));
                            setDenoisingStrength(clampedValue);
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) {
                            setDenoisingStrength(0.5); // 如果输入无效，重置为默认值
                          }
                        }}
                        className="w-full bg-transparent text-center text-cyan-50 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        max="1"
                        step="0.01"
                        disabled={status === 'loading'}
                      />
                      <div className="flex items-center border-l border-cyan-400/30">
                        <button
                          type="button"
                          onClick={() => setDenoisingStrength(Math.max(0, Number((denoising_strength - 0.10).toFixed(2))))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || denoising_strength <= 0}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDenoisingStrength(Math.min(1, Number((denoising_strength + 0.10).toFixed(2))))}
                          className="px-3 text-cyan-200 hover:text-cyan-50 disabled:opacity-50 h-full flex items-center justify-center transition-colors"
                          disabled={status === 'loading' || denoising_strength >= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-cyan-200/80">{t('form.denoising_strength.hint')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          {/* Generate button removed for external placement */}
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