import React, { useState, useMemo } from 'react';
import { Bus, Star, ArrowLeft, Wifi, Zap, Droplets, Wind } from 'lucide-react';
import { Trip, Company } from '../types';
import { formatCurrencyMRU, formatVehicleTypeArabic } from '../lib/utils';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Search Header Summary Bar */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg text-right">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
            <Bus className="w-4 h-4" />
            <span>نتائج رحلات السفر المتاحة</span>
          </div>
          <h2 className="text-xl font-black text-white">
            من {originNameAr} إلى {destinationNameAr}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            تاريخ السفر: <span className="font-bold text-white">{departureDate}</span> • عدد المسافرين: <span className="font-bold text-emerald-400">{passengersCount}</span>
          </p>
        </div>

        <button
          onClick={onModifySearch}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all border border-slate-600 flex items-center gap-1.5"
        >
          <span>تعديل البحث</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Results Container */}
      <div className="max-w-5xl mx-auto space-y-4">
          
        {/* Sorting Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <span>تم العثور على <strong className="text-emerald-400">{sortedTrips.length}</strong> رحلة متطابقة</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="price_asc">السعر الأقل</option>
              <option value="time_asc">وقت الانطلاق الأبكر</option>
              <option value="rating_desc">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Trip Cards Container */}
        {sortedTrips.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-12 text-center space-y-3">
            <Bus className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">لا توجد رحلات منشورة حالياً لهذه الوجهة</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              تظهر الرحلات والصور هنا فور انضمام شركات النقل والناقلين المستقلين وموافقة المشرف العام على طلبات الاعتماد ونشر الجداول الرسمية للرحلات.
            </p>
          </div>
        ) : (
          sortedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-slate-800 hover:bg-slate-800/90 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-md group relative text-right"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Company Logo & Badges */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2 pb-3 md:pb-0 border-b md:border-b-0 md:border-l border-slate-700/60 pl-0 md:pl-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={trip.companyLogo}
                      alt={trip.companyName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{trip.companyName}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{trip.companyRating}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-slate-900 text-slate-300 text-[10px] font-semibold rounded-full border border-slate-700">
                    {formatVehicleTypeArabic(trip.vehicleType)}
                  </span>
                </div>

                {/* Departure / Arrival Timeline */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center justify-between text-base font-extrabold text-white">
                    <div>
                      <span className="text-xl font-black text-emerald-400 block">{trip.departureTime}</span>
                      <span className="text-xs text-slate-300 font-medium">{trip.originCityNameAr}</span>
                    </div>

                    <div className="flex-1 px-4 text-center">
                      <span className="text-[11px] text-amber-400 font-bold block mb-1">{trip.durationHours}</span>
                      <div className="relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-slate-700"></div>
                        <Bus className="w-4 h-4 text-emerald-400 absolute bg-slate-800 px-0.5" />
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-xl font-black text-blue-400 block">{trip.arrivalTime}</span>
                      <span className="text-xs text-slate-300 font-medium">{trip.destinationCityNameAr}</span>
                    </div>
                  </div>

                  {/* Amenities Checklist Icons */}
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] pt-1">
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-emerald-400" /> مكيف</span>
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-blue-400" /> Wi-Fi</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> شاحن</span>
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> مياه</span>
                  </div>
                </div>

                {/* Price & Book Trigger */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 md:border-r border-slate-700/60 pr-0 md:pr-4">
                  <div className="text-right md:text-left">
                    <span className="text-[10px] text-slate-400 block">سعر المقعد</span>
                    <span className="text-xl font-black text-emerald-400">{formatCurrencyMRU(trip.priceMRU)}</span>
                    <span className="text-[10px] text-amber-400 font-semibold block">
                      متبقي {trip.availableSeatsCount} مقاعد
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>احجز الآن</span>
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
