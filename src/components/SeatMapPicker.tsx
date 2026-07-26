import React from 'react';
import { Bus, Check, User, ShieldAlert } from 'lucide-react';
import { Seat, VehicleType } from '../types';

interface SeatMapPickerProps {
  seats: Seat[];
  selectedSeatNumbers: string[];
  vehicleType: VehicleType;
  maxPassengers: number;
  onSeatToggle: (seatNumber: string) => void;
}

export const SeatMapPicker: React.FC<SeatMapPickerProps> = ({
  seats,
  selectedSeatNumbers,
  vehicleType,
  maxPassengers,
  onSeatToggle
}) => {
  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 text-right">
      
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-400" />
            <span>اختر مقعدك من مخطط المركبة</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            حدد {maxPassengers} {maxPassengers === 1 ? 'مقعد' : 'مقاعد'} بالنقر عليها مباشرة
          </p>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-600"></div>
            <span>متاح</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <div className="w-4 h-4 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>محدد</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="w-4 h-4 rounded-md bg-slate-700/60 border border-slate-700 opacity-60"></div>
            <span>محجوز</span>
          </div>
        </div>
      </div>

      {/* Vehicle Layout Frame */}
      <div className="max-w-md mx-auto bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-5 relative shadow-inner">
        
        {/* Front Bus Indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-800 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            <span>مقصورة السائق</span>
          </div>
          <div className="text-[11px] text-slate-500">مدخل الحافلة 🚪</div>
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-2">
          {seats.map((seat, index) => {
            const isSelected = selectedSeatNumbers.includes(seat.number);
            const isBooked = seat.status === 'booked';
            const isAisleBreak = (index % 4 === 1); // Creating central aisle walk area

            return (
              <React.Fragment key={seat.id}>
                <button
                  type="button"
                  disabled={isBooked}
                  onClick={() => onSeatToggle(seat.number)}
                  className={`relative aspect-square rounded-xl p-2 font-bold text-xs flex flex-col items-center justify-between transition-all transform ${
                    isBooked
                      ? 'bg-slate-800/40 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105 font-black'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500 hover:bg-slate-700'
                  }`}
                  title={`مقعد ${seat.number} - ${seat.type === 'window' ? 'نافذة' : 'ممر'}`}
                >
                  <span className="text-[10px] font-mono opacity-80">{seat.number}</span>
                  
                  {/* Seat Icon / Selection Status */}
                  {isSelected ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="text-[9px] text-slate-400">
                      {seat.type === 'window' ? 'نافذة' : 'ممر'}
                    </span>
                  )}

                  {/* Gender restriction badge if female seat */}
                  {seat.genderRestriction === 'female' && !isBooked && !isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-slate-950" title="مخصص للنساء"></span>
                  )}
                </button>

                {/* Central Aisle Gap */}
                {isAisleBreak && <div className="w-2 sm:w-4 flex items-center justify-center text-[10px] text-slate-700 font-mono">ممر</div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Back of Vehicle */}
        <div className="pt-4 mt-4 border-t border-dashed border-slate-800 text-center text-[10px] text-slate-500 font-medium">
          مؤخرة المركبة / الأمتعة
        </div>

      </div>

      {/* Selected Seats Counter Banner */}
      <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium">
          المقاعد المحددة ({selectedSeatNumbers.length} من {maxPassengers}):
        </span>
        <span className="font-extrabold text-emerald-400 text-sm">
          {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'لم تحدد مقاعد بعد'}
        </span>
      </div>

    </div>
  );
};
