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
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-400/30">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { days = 0, hours = 0, minutes = 0 } = stats.uptime || {};

  return (
    <div className="p-4 bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-400/30 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-cyan-50 mb-3">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-700/50 rounded-xl">
          <h3 className="text-xs font-medium text-cyan-200 mb-1">{t('uptime')}</h3>
          <p className="text-xl font-bold text-cyan-50">
            {days}d {hours}h {minutes}m
          </p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-xl">
          <h3 className="text-xs font-medium text-cyan-200 mb-1">{t('totalGenerations')}</h3>
          <p className="text-xl font-bold text-cyan-50">{stats.totalGenerations}</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-xl">
          <h3 className="text-xs font-medium text-cyan-200 mb-1">{t('dailyGenerations')}</h3>
          <p className="text-xl font-bold text-cyan-50">{stats.dailyGenerations}</p>
        </div>
      </div>
    </div>
  );
} 