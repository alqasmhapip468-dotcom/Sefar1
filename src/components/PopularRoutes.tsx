import React from 'react';
import { ArrowLeft, Clock, MapPin, TrendingUp, Bus } from 'lucide-react';
import { formatCurrencyMRU } from '../lib/utils';
import { Trip } from '../types';

interface PopularRoutesProps {
  onSelectRoute: (originId: string, destId: string) => void;
  trips?: Trip[];
}

export const MAIN_CITY_ROUTES = [
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'ndb',
    destAr: 'نواذيبو',
    duration: '5.5 ساعات',
    badge: 'خط الشمال الرئيسي'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'kfa',
    destAr: 'كيفه',
    duration: '8 ساعات',
    badge: 'طريق الأمل'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    destId: 'rso',
    destAr: 'روصو',
    duration: '2.5 ساعة',
    badge: 'الخط الجنوبي'
  },
  {
    originId: 'ndb',
    originAr: 'نواذيبو',
    destId: 'atr',
    destAr: 'أطار',
    duration: '5.5 ساعات',
    badge: 'مسار آدرار'
  },
  {
    originId: 'kfa',
    originAr: 'كيفه',
    destId: 'ayn',
    destAr: 'لعيون',
    duration: '3.5 ساعات',
    badge: 'خط الشرق'
  }
];

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ onSelectRoute, trips = [] }) => {
  return (
    <section className="py-12 bg-slate-900/40 dark:bg-slate-950/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>الوجهات والمسارات الرئيسية بين المدن</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">أشهر خطوط النقل بين المدن الموريتانية</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            اختر وجهتك المفضلة للاطلاع على الرحلات اليومية المعتمدة فور نشرها من قبل الشركات والناقلين المعتمدين.
          </p>
        </div>

        {/* Grid of Route Cards without fake images or fake prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {MAIN_CITY_ROUTES.map((route, idx) => {
            // Find real trips matching this route if any
            const matchingTrips = trips.filter(
              t => t.originCityId === route.originId && t.destinationCityId === route.destId
            );
            const lowestPrice = matchingTrips.length > 0 
              ? Math.min(...matchingTrips.map(t => t.priceMRU)) 
              : null;

            return (
              <div
                key={idx}
                onClick={() => onSelectRoute(route.originId, route.destId)}
                className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-lg">
                      {route.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {route.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-white font-extrabold text-base my-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {route.originAr}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {route.destAr}
                    </span>
                  </div>
                </div>

                {/* Footer status / real price */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between mt-3">
                  {lowestPrice !== null ? (
                    <div>
                      <span className="text-[10px] text-slate-400 block">تبدأ من</span>
                      <span className="text-sm font-black text-emerald-400">{formatCurrencyMRU(lowestPrice)}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-slate-500" />
                      <span>{matchingTrips.length} رحلات منشورة</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                    <span>البحث الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

