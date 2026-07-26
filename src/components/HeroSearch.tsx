import React, { useState } from 'react';
import { MapPin, Calendar, Users, ArrowRightLeft, Search, Bus, Car, Filter } from 'lucide-react';
import { City, VehicleType } from '../types';

interface HeroSearchProps {
  cities: City[];
  originId: string;
  destinationId: string;
  departureDate: string;
  passengers: number;
  selectedVehicleType: VehicleType | 'all';
  onOriginChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onDepartureDateChange: (date: string) => void;
  onPassengersChange: (num: number) => void;
  onVehicleTypeChange: (type: VehicleType | 'all') => void;
  onSearch: () => void;
  onQuickRouteSelect: (origin: string, dest: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  cities,
  originId,
  destinationId,
  departureDate,
  passengers,
  selectedVehicleType,
  onOriginChange,
  onDestinationChange,
  onDepartureDateChange,
  onPassengersChange,
  onVehicleTypeChange,
  onSearch,
  onQuickRouteSelect
}) => {
  const handleSwap = () => {
    const temp = originId;
    onOriginChange(destinationId);
    onDestinationChange(temp);
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
      
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Hero Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
          <Bus className="w-4 h-4 text-emerald-400" />
          <span>منصة حجز رحلات النقل البري الأولى في موريتانيا</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          احجز رحلتك البرية بين المدن <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-wavy">بكل أمان وسهولة</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          قارن بين جميع شركات النقل الحافلات، الميني باص، وسيارات V8، اختر مقعدك المفضل وسدد ببنكيلي أو السداد أو عند الصعود.
        </p>

        {/* Search Widget Container */}
        <div className="bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl text-right">
          
          {/* Top Options Bar (Vehicle Type selector tabs) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/60">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 font-bold ml-1">نوع المركبة:</span>
              <button
                type="button"
                onClick={() => onVehicleTypeChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedVehicleType === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => onVehicleTypeChange('bus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedVehicleType === 'bus'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>حافلات VIP</span>
              </button>
              <button
                type="button"
                onClick={() => onVehicleTypeChange('minibus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedVehicleType === 'minibus'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>ميني باص</span>
              </button>
              <button
                type="button"
                onClick={() => onVehicleTypeChange('v8')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedVehicleType === 'v8'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>سيارات V8</span>
              </button>
            </div>

            <div className="text-xs text-emerald-400 font-medium">
              تحديث مباشر للرحلات اليومية
            </div>
          </div>

          {/* Form Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Origin City */}
            <div className="md:col-span-3 bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-emerald-500 transition-all">
              <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>مدينة الانطلاق</span>
              </label>
              <select
                value={originId}
                onChange={(e) => onOriginChange(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-white">
                    {city.nameAr} ({city.regionAr})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all shadow-md transform active:scale-95"
                title="تبديل الاتجاه"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-3 bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-emerald-500 transition-all">
              <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>مدينة الوصول</span>
              </label>
              <select
                value={destinationId}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-white">
                    {city.nameAr} ({city.regionAr})
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div className="md:col-span-3 bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-emerald-500 transition-all">
              <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ السفر</span>
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => onDepartureDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              />
            </div>

            {/* Passengers count */}
            <div className="md:col-span-2 bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-emerald-500 transition-all">
              <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>عدد المسافرين</span>
              </label>
              <select
                value={passengers}
                onChange={(e) => onPassengersChange(Number(e.target.value))}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-slate-900 text-white">
                    {num} {num === 1 ? 'مسافر' : 'مسافرين'}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Big Search Trigger */}
          <div className="mt-5">
            <button
              type="button"
              onClick={onSearch}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <Search className="w-5 h-5 stroke-[3]" />
              <span>ابحث عن الرحلات المتاحة الآن</span>
            </button>
          </div>

        </div>

        {/* Quick Route Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400 font-semibold">بحث سريع للوجهات الأكثر طلباً:</span>
          <button
            onClick={() => onQuickRouteSelect('nkc', 'ndb')}
            className="px-3 py-1 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 rounded-full transition-all"
          >
            نواكشوط ← نواذيبو
          </button>
          <button
            onClick={() => onQuickRouteSelect('nkc', 'kfa')}
            className="px-3 py-1 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 rounded-full transition-all"
          >
            نواكشوط ← كيفه
          </button>
          <button
            onClick={() => onQuickRouteSelect('nkc', 'rso')}
            className="px-3 py-1 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 rounded-full transition-all"
          >
            نواكشوط ← روصو
          </button>
          <button
            onClick={() => onQuickRouteSelect('ndb', 'atr')}
            className="px-3 py-1 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 rounded-full transition-all"
          >
            نواذيبو ← أطار
          </button>
        </div>

      </div>
    </div>
  );
};
