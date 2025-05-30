'use client'
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Stats {
  totalGenerations: number;
  dailyGenerations: number;
  uptime: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export default function SiteStats() {
  const t = useTranslations('home.stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-400/30 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { days = 0 } = stats.uptime || {};

  return (
    <div className="relative p-8 md:p-12 rounded-3xl shadow-2xl border border-cyan-400/30 max-w-7xl mx-auto overflow-hidden">
      {/* 背景图片层 */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/demo-6.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.6)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* 磨砂玻璃效果层 */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800/40 to-slate-700/40 backdrop-blur-sm"
      />

      {/* 内容层 */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* 左侧主要数据展示 */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3">
              <p className="text-cyan-100/90 text-xl md:text-2xl pl-4 drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.prefix')}</p>
              <h2 className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent font-bold text-4xl md:text-5xl tracking-wide transform -rotate-1 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">Dreamify</h2>
              <p className="text-cyan-100/90 text-xl md:text-2xl pl-8 drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.suffix')}</p>
            </div>
            
            <div className="space-y-3 pl-6">
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.continuous')}</p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-bold text-5xl md:text-6xl transform -rotate-1 drop-shadow-[0_0_20px_rgba(103,232,249,0.6)]">{days}</span>
                <span className="text-cyan-100/90 text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.days')}</span>
              </div>
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.accompany')}</p>
            </div>

            <div className="space-y-3 pl-12">
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.created')}</p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-bold text-5xl md:text-6xl transform rotate-1 drop-shadow-[0_0_20px_rgba(103,232,249,0.6)]">{stats.totalGenerations}</span>
                <span className="text-cyan-100/90 text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.pieces')}</span>
              </div>
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.works')}</p>
            </div>

            <div className="space-y-3 pl-4">
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.today')}</p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-bold text-5xl md:text-6xl transform -rotate-1 drop-shadow-[0_0_20px_rgba(103,232,249,0.6)]">{stats.dailyGenerations}</span>
                <span className="text-cyan-100/90 text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.pieces')}</span>
              </div>
              <p className="text-cyan-100/90 text-lg md:text-xl drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">{t('intro.newWorks')}</p>
            </div>
          </div>

          {/* 中间 QR Code 部分 */}
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="w-56 h-[358.4px] rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-lg">
              <img 
                src="/common/qrcode_qq.jpg" 
                alt="QR Code" 
                className="w-full h-full object-cover transform scale-[1.4]"
              />
            </div>
            <p className="text-cyan-200/90 text-xl md:text-2xl text-center leading-relaxed max-w-xs drop-shadow-[0_0_10px_rgba(103,232,249,0.4)]">
              每一次交流，也许会点燃下一个灵感的火花。
            </p>
          </div>

          {/* 右侧情感文案 */}
          <div className="flex flex-col justify-center space-y-12 md:space-y-16 relative pr-4">
            <div className="space-y-10">
              <p className="text-cyan-200/90 text-2xl md:text-3xl leading-relaxed pl-6 drop-shadow-[0_0_10px_rgba(103,232,249,0.4)]">
                {t('message.behind')}
              </p>
              <p className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent text-3xl md:text-4xl font-medium transform -rotate-1 leading-relaxed drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">
                {t('message.unique')}
              </p>
              <div className="flex items-center gap-3 pl-8 mt-4">
                <p className="text-cyan-200/90 text-2xl md:text-3xl leading-relaxed drop-shadow-[0_0_10px_rgba(103,232,249,0.4)]">
                  {t('message.inspiration')}
                </p>
                <span className="text-3xl md:text-4xl transform -rotate-6 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">💡</span>
              </div>
            </div>

            <div className="space-y-8 mt-4">
              <div className="space-y-6">
                <p className="text-cyan-200/90 text-2xl md:text-3xl leading-relaxed pl-4 drop-shadow-[0_0_10px_rgba(103,232,249,0.4)]">
                  {t('message.thanks')}
                </p>
                <p className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent text-3xl md:text-4xl font-medium transform rotate-1 leading-relaxed pl-6 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">
                  {t('message.together')}
                </p>
              </div>
              
              <div className="space-y-6 pl-8">
                <p className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent text-4xl md:text-5xl font-bold leading-relaxed drop-shadow-[0_0_20px_rgba(103,232,249,0.6)]">
                  {t('message.explore')}
                </p>
                <p className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent text-5xl md:text-6xl font-bold transform -rotate-2 leading-relaxed drop-shadow-[0_0_25px_rgba(103,232,249,0.7)]">
                  {t('message.possibilities')}
                </p>
              </div>
            </div>
            
            {/* 将绘画板图标移到右下角，调整位置和大小 */}
            <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4">
              <span className="text-5xl md:text-6xl block transform rotate-12 opacity-90">🎨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 