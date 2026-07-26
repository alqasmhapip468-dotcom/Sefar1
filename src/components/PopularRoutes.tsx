import React from 'react';
import { ArrowLeft, Clock, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { formatCurrencyMRU } from '../lib/utils';

interface PopularRoutesProps {
  onSelectRoute: (originId: string, destId: string) => void;
}

export const POPULAR_ROUTES = [
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'ndb',
    destAr: 'نواذيبو',
    duration: '5.5 ساعات',
    startPrice: 500,
    dailyTripsCount: 14,
    badge: 'الأكثر حجزاً',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&auto=format&fit=crop&q=80'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'kfa',
    destAr: 'كيفه',
    duration: '8 ساعات',
    startPrice: 600,
    dailyTripsCount: 8,
    badge: 'طريق الأمل',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'rso',
    destAr: 'روصو',
    duration: '2.5 ساعة',
    startPrice: 350,
    dailyTripsCount: 10,
    badge: 'الخط الجنوبي',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80'
  },
  {
    originId: 'ndb',
    originAr: 'نواذيبو',
    destId: 'atr',
    destAr: 'أطار',
    duration: '5.5 ساعات',
    startPrice: 550,
    dailyTripsCount: 5,
    badge: 'خط الشمال',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80'
  },
  {
    originId: 'kfa',
    originAr: 'كيفه',
    destId: 'ayn',
    destAr: 'لعيون',
    duration: '3.5 ساعات',
    startPrice: 400,
    dailyTripsCount: 6,
    badge: 'خط الشرق',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80'
  }
];

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ onSelectRoute }) => {
  return (
    <section className="py-12 bg-slate-900/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>الوجهات الأكثر طلباً في موريتانيا</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">قسم أشهر الوجهات والمسارات</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            رحلات يومية متواصلة عبر حافلات وسيارات النقل المكيفة مع أسعار تنافسية وجداول زمنية دقيقة.
          </p>
        </div>

        {/* Grid of Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {POPULAR_ROUTES.map((route, idx) => (
            <div
              key={idx}
              onClick={() => onSelectRoute(route.originId, route.destId)}
              className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
            >
              
              {/* Image Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.originAr} إلى ${route.destAr}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-slate-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                  {route.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-white font-extrabold text-base mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {route.originAr}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all" />
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {route.destAr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {route.duration}
                    </span>
                    <span className="text-slate-400">{route.dailyTripsCount} رحلة يومياً</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">تبدأ من</span>
                    <span className="text-sm font-black text-emerald-400">{formatCurrencyMRU(route.startPrice)}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center gap-1">
                    <span>احجز الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
