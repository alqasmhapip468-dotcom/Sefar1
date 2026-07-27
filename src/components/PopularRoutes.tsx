import React from 'react';
import { ArrowLeft, Clock, TrendingUp, Bus } from 'lucide-react';
import { formatCurrencyMRU } from '../lib/utils';
import { Trip } from '../types';
import { useTranslation } from '../lib/i18n';

interface PopularRoutesProps {
  onSelectRoute: (originId: string, destId: string) => void;
  trips?: Trip[];
}

export const MAIN_CITY_ROUTES = [
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    originFr: 'Nouakchott',
    destId: 'ndb',
    destAr: 'نواذيبو',
    destFr: 'Nouadhibou',
    durationAr: '5.5 ساعات',
    durationFr: '5.5h',
    badgeAr: 'خط الشمال الرئيسي',
    badgeFr: 'Axe Nord'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    originFr: 'Nouakchott',
    destId: 'kfa',
    destAr: 'كيفه',
    destFr: 'Kiffa',
    durationAr: '8 ساعات',
    durationFr: '8h',
    badgeAr: 'طريق الأمل',
    badgeFr: 'Route de l\'Espoir'
  },
  {
    originId: 'nkc',
    originAr: 'نواكشوط',
    originFr: 'Nouakchott',
    destId: 'rso',
    destAr: 'روصو',
    destFr: 'Rosso',
    durationAr: '2.5 ساعة',
    durationFr: '2.5h',
    badgeAr: 'الخط الجنوبي',
    badgeFr: 'Axe Sud'
  },
  {
    originId: 'ndb',
    originAr: 'نواذيبو',
    originFr: 'Nouadhibou',
    destId: 'atr',
    destAr: 'أطار',
    destFr: 'Atar',
    durationAr: '5.5 ساعات',
    durationFr: '5.5h',
    badgeAr: 'مسار آدرار',
    badgeFr: 'Route Adrar'
  },
  {
    originId: 'kfa',
    originAr: 'كيفه',
    originFr: 'Kiffa',
    destId: 'ayn',
    destAr: 'لعيون',
    destFr: 'Aioun',
    durationAr: '3.5 ساعات',
    durationFr: '3.5h',
    badgeAr: 'خط الشرق',
    badgeFr: 'Axe Est'
  }
];

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ onSelectRoute, trips = [] }) => {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <section className="py-12 bg-slate-50/80 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-start">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>{isAr ? "الوجهات والمسارات الرئيسية بين المدن" : "Lignes populaires"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('popularRoutes')}</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            {isAr ? "اختر وجهتك المفضلة للاطلاع على الرحلات اليومية المعتمدة فور نشرها." : "Choisissez votre destination pour voir les départs disponibles."}
          </p>
        </div>

        {/* Grid of Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {MAIN_CITY_ROUTES.map((route, idx) => {
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
                className="group relative bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between text-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-lg">
                      {isAr ? route.badgeAr : route.badgeFr}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      {isAr ? route.durationAr : route.durationFr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 my-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">{isAr ? route.originAr : route.originFr}</span>
                    <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">{isAr ? route.destAr : route.destFr}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
                  {lowestPrice ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {isAr ? "من " : "Dès "} {formatCurrencyMRU(lowestPrice)}
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {isAr ? "رحلات يومية" : "Trajets quotidiens"}
                    </span>
                  )}

                  <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                    <span>{isAr ? "احجز الآن" : "Réserver"}</span>
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


