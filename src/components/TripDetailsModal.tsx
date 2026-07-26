import React, { useState } from 'react';
import { X, Star, Bus, Clock, MapPin, Shield, Wifi, Zap, Droplets, Wind, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Trip, Seat } from '../types';
import { formatCurrencyMRU, formatVehicleTypeArabic } from '../lib/utils';
import { SeatMapPicker } from './SeatMapPicker';

interface TripDetailsModalProps {
  trip: Trip;
  passengersCount: number;
  onClose: () => void;
  onProceedToCheckout: (trip: Trip, selectedSeats: string[]) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  passengersCount,
  onClose,
  onProceedToCheckout
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['S1']);

  const handleSeatToggle = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < passengersCount) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        // Replace last seat if limit reached
        setSelectedSeats([...selectedSeats.slice(1), seatNumber]);
      }
    }
  };

  const totalPrice = selectedSeats.length * trip.priceMRU;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={trip.companyLogo}
              alt={trip.companyName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-lg font-bold text-white">{trip.companyName}</h2>
              <p className="text-xs text-slate-400">
                {trip.originCityNameAr} إلى {trip.destinationCityNameAr} • {formatVehicleTypeArabic(trip.vehicleType)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Trip Summary Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Origin -> Destination */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-base font-extrabold text-white">
                <div>
                  <span className="text-2xl font-black text-emerald-400 block">{trip.departureTime}</span>
                  <span className="text-xs font-semibold text-slate-300">{trip.originCityNameAr}</span>
                </div>
                
                <div className="flex-1 px-4 text-center">
                  <span className="text-xs text-amber-400 font-bold block mb-1">{trip.durationHours}</span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-full h-0.5 bg-slate-700"></div>
                    <Bus className="w-4 h-4 text-emerald-400 absolute bg-slate-800 px-0.5" />
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-2xl font-black text-blue-400 block">{trip.arrivalTime}</span>
                  <span className="text-xs font-semibold text-slate-300">{trip.destinationCityNameAr}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                <span>السائق: <strong className="text-white">{trip.driverName}</strong></span>
                <span>•</span>
                <span>المركبة: <strong className="text-white">{trip.vehicleModel}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {trip.companyRating} (تقييم ممتاز)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
              <span className="text-xs text-slate-400">سعر المقعد الواحد</span>
              <span className="text-2xl font-black text-emerald-400 my-1">{formatCurrencyMRU(trip.priceMRU)}</span>
              <span className="text-[11px] text-slate-400">المقاعد المتبقية: {trip.availableSeatsCount}</span>
            </div>

          </div>

          {/* Amenities & Features */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">وسائل الراحة المتاحة في المركبة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-slate-200">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>تكييف هواء فاخر (A/C)</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-slate-200">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span>إنترنت مجاني (Wi-Fi)</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-slate-200">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>منافذ شحن الهواتف</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-slate-200">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>مياه ضيافة باردة</span>
              </div>
            </div>
          </div>

          {/* Route Stops Timeline */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">خريطة ومحطات التوقف بالرحلة</h3>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="space-y-3 relative before:absolute before:right-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {trip.stops.map((stop, idx) => (
                  <div key={idx} className="relative flex items-center justify-between pr-7 text-xs">
                    <div className="absolute right-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900"></div>
                    <div>
                      <span className="font-bold text-white block">{stop.cityNameAr}</span>
                      <span className="text-[10px] text-slate-400">محطة إنزال/استراحة</span>
                    </div>
                    <span className="font-mono text-slate-300 font-bold">{stop.estimatedTimeFromStart}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">سياسة الإلغاء والاسترداد:</span>
            <p>{trip.cancellationPolicyAr}</p>
          </div>

          {/* Seat Map Selector */}
          <div>
            <SeatMapPicker
              seats={trip.seats}
              selectedSeatNumbers={selectedSeats}
              vehicleType={trip.vehicleType}
              maxPassengers={passengersCount}
              onSeatToggle={handleSeatToggle}
            />
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">الإجمالي المبدئي ({selectedSeats.length} مقاعد):</span>
            <span className="text-2xl font-black text-emerald-400">{formatCurrencyMRU(totalPrice)}</span>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => onProceedToCheckout(trip, selectedSeats)}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-base rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>الانتقال لإدخال البيانات والدفع</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
