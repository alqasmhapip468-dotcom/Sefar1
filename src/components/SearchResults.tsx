import React, { useState, useMemo } from 'react';
import { Bus, Star, ArrowLeft, Wifi, Zap, Droplets, Wind } from 'lucide-react';
import { Trip, Company } from '../types';
import { formatCurrencyMRU, formatVehicleTypeArabic } from '../lib/utils';
import { useTranslation } from '../lib/i18n';

interface SearchResultsProps {
  trips: Trip[];
  companies: Company[];
  originNameAr: string;
  destinationNameAr: string;
  departureDate: string;
  passengersCount: number;
  onSelectTrip: (trip: Trip) => void;
  onModifySearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  trips,
  originNameAr,
  destinationNameAr,
  departureDate,
  passengersCount,
  onSelectTrip,
  onModifySearch
}) => {
  const [sortBy, setSortBy] = useState<'price_asc' | 'time_asc' | 'rating_desc'>('price_asc');
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  // Sorted Trips Logic
  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceMRU - b.priceMRU;
      if (sortBy === 'time_asc') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'rating_desc') return b.companyRating - a.companyRating;
      return 0;
    });
  }, [trips, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans transition-colors duration-200">
      
      {/* Search Header Summary Bar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg text-start transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1">
            <Bus className="w-4 h-4" />
            <span>{t('availableTrips')}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isAr ? `من ${originNameAr} إلى ${destinationNameAr}` : `De ${originNameAr} à ${destinationNameAr}`}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isAr ? "تاريخ السفر:" : "Date:"} <span className="font-bold text-slate-900 dark:text-white">{departureDate}</span> • {isAr ? "عدد المسافرين:" : "Passagers:"} <span className="font-bold text-emerald-600 dark:text-emerald-400">{passengersCount}</span>
          </p>
        </div>

        <button
          onClick={onModifySearch}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-all border border-slate-300 dark:border-slate-600 flex items-center gap-1.5"
        >
          <span>{isAr ? "تعديل البحث" : "Modifier la recherche"}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Results Container */}
      <div className="max-w-5xl mx-auto space-y-4">
          
        {/* Sorting Bar */}
        <div className="bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-3">
          <span>{isAr ? "تم العثور على" : "Trouvé"} <strong className="text-emerald-600 dark:text-emerald-400">{sortedTrips.length}</strong> {isAr ? "رحلة متطابقة" : "trajets trouvés"}</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">{isAr ? "ترتيب حسب:" : "Trier par:"}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="price_asc">{isAr ? "السعر الأقل" : "Moins cher"}</option>
              <option value="time_asc">{isAr ? "وقت الانطلاق الأبكر" : "Départ le plus tôt"}</option>
              <option value="rating_desc">{isAr ? "الأعلى تقييماً" : "Mieux notés"}</option>
            </select>
          </div>
        </div>

        {/* Trip Cards Container */}
        {sortedTrips.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
            <Bus className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isAr ? "لا توجد رحلات منشورة حالياً لهذه الوجهة" : "Aucun trajet trouvé pour cette destination"}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {isAr ? "تظهر الرحلات هنا فور نشر الشركات للجداول الرسمية." : "Les trajets s'afficheront dès qu'ils seront publiés par les compagnies."}
            </p>
          </div>
        ) : (
          sortedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-md group relative text-start"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Company & Vehicle Info */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={trip.companyLogoUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80'}
                      alt={trip.companyNameAr}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{isAr ? trip.companyNameAr : (trip.companyNameFr || trip.companyNameAr)}</span>
                      <span className="flex items-center text-amber-500 dark:text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current ml-0.5" />
                        {trip.companyRating}
                      </span>
                    </h4>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                      {formatVehicleTypeArabic(trip.vehicleType)}
                    </span>
                  </div>
                </div>

                {/* Timing & Stations */}
                <div className="md:col-span-5 flex items-center justify-between border-y md:border-y-0 py-3 md:py-0 border-slate-200 dark:border-slate-700/60 px-2">
                  <div className="text-center">
                    <span className="text-lg font-black text-slate-900 dark:text-white block">{trip.departureTime}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{trip.originStationAr}</span>
                  </div>

                  <div className="flex-1 px-4 text-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">رحلة مباشرة</span>
                    <div className="relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                      <Bus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute bg-white dark:bg-slate-800 px-0.5" />
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-lg font-black text-slate-900 dark:text-white block">{trip.arrivalTime}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{trip.destinationStationAr}</span>
                  </div>
                </div>

                {/* Price & Book Trigger */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-700/60 pr-0 md:pr-4">
                  <div className="text-start md:text-start space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('seatPrice')}</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrencyMRU(trip.priceMRU)}</span>
                    
                    {trip.availableSeatsCount <= 2 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-bold animate-pulse">
                        {t('lastSeatsWarning')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold block">
                        {isAr ? `متبقي ${trip.availableSeatsCount} مقاعد` : `${trip.availableSeatsCount} ${t('seatsRemaining')}`}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>{t('selectSeats')}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

