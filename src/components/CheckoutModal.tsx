import React, { useState } from 'react';
import { X, User, Phone, Mail, IdCard, CreditCard, ShieldCheck, Tag, ArrowLeft, CheckCircle2, Wallet, DollarSign } from 'lucide-react';
import { Trip, PaymentMethod, Booking, Coupon } from '../types';
import { formatCurrencyMRU, formatPaymentMethodArabic } from '../lib/utils';

interface CheckoutModalProps {
  trip: Trip;
  selectedSeats: string[];
  coupons: Coupon[];
  onClose: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  trip,
  selectedSeats,
  coupons,
  onClose,
  onConfirmBooking
}) => {
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerIdNum, setPassengerIdNum] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bankily');

  // Coupon Logic
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const rawSeatsTotal = selectedSeats.length * trip.priceMRU;

  let discountMRU = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      discountMRU = appliedCoupon.value;
    } else if (appliedCoupon.type === 'percentage') {
      discountMRU = Math.round((rawSeatsTotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscountMRU && discountMRU > appliedCoupon.maxDiscountMRU) {
        discountMRU = appliedCoupon.maxDiscountMRU;
      }
    }
  }

  const finalTotalMRU = Math.max(0, rawSeatsTotal - discountMRU);

  // Platform Commission Calculation
  const commissionMRU = trip.commissionMRU * selectedSeats.length;
  const netCompanyMRU = finalTotalMRU - commissionMRU;

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (!found) {
      setCouponError('رمز الكوبون غير صحيح أو غير مفعّل');
      setAppliedCoupon(null);
      return;
    }
    if (found.minBookingMRU && rawSeatsTotal < found.minBookingMRU) {
      setCouponError(`هذا الكوبون يتطلب حجزا بقيمة ${found.minBookingMRU} أوقية على الأقل`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim() || !passengerPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف لإتمام الحجز');
      return;
    }

    const bookingCode = `SFR-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingCode,
      userId: 'user-current',
      tripId: trip.id,
      tripDetails: {
        originAr: trip.originCityNameAr,
        destinationAr: trip.destinationCityNameAr,
        companyName: trip.companyName,
        companyLogo: trip.companyLogo,
        departureDate: trip.departureDate,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        vehicleType: trip.vehicleType,
        vehicleModel: trip.vehicleModel
      },
      passengerName,
      passengerPhone,
      passengerIdNum,
      passengerEmail,
      seats: selectedSeats,
      totalPriceMRU: finalTotalMRU,
      discountMRU,
      commissionMRU,
      netCompanyMRU,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      qrData: `SAFAR-MR-TICKET-${bookingCode}`
    };

    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">إكمال الحجز واختيار طريقة الدفع</h2>
            <p className="text-xs text-slate-400">
              رحلة {trip.originCityNameAr} ← {trip.destinationCityNameAr} ({trip.companyName})
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Passenger Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>بيانات المسافر الرئيسي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المختار ولد سيدي"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم الهاتف (الواتساب) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+222 4600 0000"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم الهوية الوطنية (اختياري)</label>
                <input
                  type="text"
                  placeholder="رقم التعريف الوطني"
                  value={passengerIdNum}
                  onChange={(e) => setPassengerIdNum(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني (لاستلام التذكرة)</label>
                <input
                  type="email"
                  placeholder="example@mail.mr"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Coupon Input */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>هل لديك كوبون خصم؟</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل رمز الكوبون (مثل: SAFAR2026)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
              >
                تطبيق
              </button>
            </div>
            {couponError && <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-[11px] text-emerald-400 mt-1.5 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم تطبيق الكوبون {appliedCoupon.code} بنجاح!
              </p>
            )}
          </div>

          {/* Section 3: Payment Methods Selector */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>اختر وسيلة الدفع المناسبة</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold">
              
              {/* Bankily */}
              <label
                onClick={() => setPaymentMethod('bankily')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'bankily'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <span className="block text-white">تطبيق بنكيلي (Bankily)</span>
                  <span className="text-[10px] text-slate-400 font-normal">دفع إلكتروني مباشر عبر البنك الشعبي</span>
                </div>
              </label>

              {/* Sedad */}
              <label
                onClick={() => setPaymentMethod('sedad')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'sedad'
                    ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                    : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-xs">
                  S
                </div>
                <div>
                  <span className="block text-white">خدمة السداد (Sedad)</span>
                  <span className="text-[10px] text-slate-400 font-normal">تحويل سريع وموثوق في موريتانيا</span>
                </div>
              </label>

              {/* Masrifi */}
              <label
                onClick={() => setPaymentMethod('masrifi')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'masrifi'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  M
                </div>
                <div>
                  <span className="block text-white">تطبيق مصرفي (Masrifi)</span>
                  <span className="text-[10px] text-slate-400 font-normal">خصم مباشر من المحفظة الإلكترونية</span>
                </div>
              </label>

              {/* Cash on Board */}
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                    : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white font-black flex items-center justify-center text-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-white">الدفع نقداً عند الصعود</span>
                  <span className="text-[10px] text-slate-400 font-normal">تسديد ثمن التذكرة للمشرف بالمحطة</span>
                </div>
              </label>

            </div>
          </div>

          {/* Fare Breakdown Box */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>سعر المقاعد ({selectedSeats.length} x {trip.priceMRU} MRU):</span>
              <span className="font-bold">{rawSeatsTotal} أوقية</span>
            </div>

            {discountMRU > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>خصم الكوبون:</span>
                <span>-{discountMRU} أوقية</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white">
              <span>المبلغ الإجمالي النهائي:</span>
              <span className="text-emerald-400">{formatCurrencyMRU(finalTotalMRU)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            <span>تأكيد الحجز وإصدار التذكرة الآن</span>
          </button>

        </form>

      </div>
    </div>
  );
};
