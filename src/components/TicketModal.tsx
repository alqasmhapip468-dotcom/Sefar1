import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, CheckCircle2, Bus, Calendar, MapPin, Printer } from 'lucide-react';
import { Booking } from '../types';
import { formatCurrencyMRU, formatVehicleTypeArabic, formatPaymentMethodArabic, generateBookingPDF } from '../lib/utils';

interface TicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  const handleDownloadPDF = () => {
    generateBookingPDF(booking);
  };

  const handleShareWhatsApp = () => {
    const text = `تذكرة حجز سفر موريتانيا (Safar MR)\nرقم الحجز: ${booking.bookingCode}\nالاسم: ${booking.passengerName}\nالخط: ${booking.tripDetails.originAr} إلى ${booking.tripDetails.destinationAr}\nالمقاعد: ${booking.seats.join(', ')}\nالتاريخ: ${booking.tripDetails.departureDate} الساعة ${booking.tripDetails.departureTime}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden text-right">
        
        {/* Top Success Banner */}
        <div className="bg-emerald-500 text-slate-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            <div>
              <h2 className="text-base font-black">تم تأكيد حجزك بنجاح!</h2>
              <p className="text-xs font-semibold opacity-90">تذكرتك جاهزة للعرض والاستخدام بالمحطة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-950 hover:bg-emerald-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* E-Ticket Card Frame */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Simulated Ticket Visual */}
          <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-5 relative space-y-4 shadow-xl">
            
            {/* Header / Company */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={booking.tripDetails.companyLogo}
                  alt={booking.tripDetails.companyName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-white">{booking.tripDetails.companyName}</h3>
                  <span className="text-[10px] text-slate-400">{formatVehicleTypeArabic(booking.tripDetails.vehicleType)}</span>
                </div>
              </div>

              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">رمز الحجز</span>
                <span className="text-sm font-mono font-black text-emerald-400">{booking.bookingCode}</span>
              </div>
            </div>

            {/* Route & Times */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-center">
              <div>
                <span className="text-lg font-black text-emerald-400 block">{booking.tripDetails.departureTime}</span>
                <span className="text-xs font-bold text-white">{booking.tripDetails.originAr}</span>
              </div>

              <div className="px-3">
                <Bus className="w-5 h-5 text-emerald-400 mx-auto" />
                <span className="text-[10px] text-slate-400">{booking.tripDetails.departureDate}</span>
              </div>

              <div>
                <span className="text-lg font-black text-blue-400 block">{booking.tripDetails.arrivalTime}</span>
                <span className="text-xs font-bold text-white">{booking.tripDetails.destinationAr}</span>
              </div>
            </div>

            {/* Passenger & Seats Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">اسم المسافر</span>
                <span className="font-bold text-white">{booking.passengerName}</span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">المقاعد المحجوزة</span>
                <span className="font-bold text-emerald-400 font-mono">{booking.seats.join(', ')}</span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">إجمالي السعر</span>
                <span className="font-bold text-white">{formatCurrencyMRU(booking.totalPriceMRU)}</span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">وسيلة الدفع</span>
                <span className="font-bold text-slate-300">{formatPaymentMethodArabic(booking.paymentMethod)}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="pt-3 border-t border-slate-800 flex flex-col items-center justify-center space-y-2">
              <div className="bg-white p-3 rounded-2xl shadow-md">
                <QRCodeSVG
                  value={booking.qrData}
                  size={130}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                امسح الرمز أعلاه لدى موظف المحطة عند الصعود للحافلة
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPDF}
              className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل التذكرة (PDF)</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>مشاركة عبر واتساب</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
