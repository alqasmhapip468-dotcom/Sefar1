import React, { useState } from 'react';
import { X, User, Ticket, Heart, Clock, Settings, LogIn, Phone, Mail, LogOut, ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { Booking, UserProfile } from '../types';
import { formatCurrencyMRU, formatDateArabic } from '../lib/utils';
import { loginWithGoogle, logoutFirebase } from '../lib/firebase';

interface PassengerAccountModalProps {
  user: UserProfile | null;
  bookings: Booking[];
  onClose: () => void;
  onViewBookingTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onLoginSimulate: (name: string, phone: string, email: string) => void;
  onLogout: () => void;
}

export const PassengerAccountModal: React.FC<PassengerAccountModalProps> = ({
  user,
  bookings,
  onClose,
  onViewBookingTicket,
  onCancelBooking,
  onLoginSimulate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'favorites'>('bookings');

  // Auth Simulation Inputs
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const gUser = await loginWithGoogle();
      if (gUser) {
        onLoginSimulate(gUser.displayName || 'مسافر موريتاني', gUser.phoneNumber || '+222 4600 0000', gUser.email || 'user@safar.mr');
      }
    } catch (err) {
      console.warn("Google login handled in simulation mode:", err);
      onLoginSimulate('المختار ولد أحمد', '+222 4525 1010', 'mokhtar@safar.mr');
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !phoneInput) {
      alert('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }
    onLoginSimulate(nameInput, phoneInput, emailInput);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">حساب المسافر</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* If Not Logged In -> Show Quick Auth Options */}
          {!user ? (
            <div className="max-w-md mx-auto py-6 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">تسجيل الدخول / إنشاء حساب</h3>
                <p className="text-xs text-slate-400">
                  سجل دخولك لمتابعة حجوزاتك، استخراج تذاكرك وإدارة بياناتك الشخصية بسهولة.
                </p>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-3"
              >
                <span className="w-5 h-5 font-black text-blue-400">G</span>
                <span>المتابعة باستخدام حساب Google</span>
              </button>

              <div className="relative flex items-center justify-center text-xs text-slate-500 my-4">
                <div className="w-full h-px bg-slate-800"></div>
                <span className="bg-slate-900 px-3 absolute">أو برقم الهاتف</span>
              </div>

              {/* Phone Login Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: المختار ولد أحمد"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الهاتف (الواتساب) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+222 4525 1010"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all"
                >
                  دخول سريع للحساب
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Profile Top Card */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400">{user.phone} • {user.email || 'مسافر معتمد'}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>

              {/* Account Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'bookings'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>حجوزاتي ({bookings.length})</span>
                </button>
              </div>

              {/* Tab 1: Bookings List */}
              {activeTab === 'bookings' && (
                <div className="space-y-3">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Ticket className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm font-bold">لا توجد حجوزات سابقة حتى الآن</p>
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-emerald-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                              #{b.bookingCode}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {b.tripDetails.originAr} ← {b.tripDetails.destinationAr}
                            </span>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {b.bookingStatus === 'confirmed' ? 'حجز مؤكد' : 'ملغى'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                          <div>
                            <span className="text-[10px] text-slate-400 block">الشركة</span>
                            <span className="font-bold text-white">{b.tripDetails.companyName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">التاريخ والوقت</span>
                            <span className="font-bold text-white">{b.tripDetails.departureDate} ({b.tripDetails.departureTime})</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">المقاعد</span>
                            <span className="font-bold text-emerald-400 font-mono">{b.seats.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">السعر الإجمالي</span>
                            <span className="font-bold text-white">{formatCurrencyMRU(b.totalPriceMRU)}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-2">
                          {b.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all"
                            >
                              إلغاء الحجز
                            </button>
                          )}

                          <button
                            onClick={() => onViewBookingTicket(b)}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>عرض التذكرة وQR</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </>
          )}

        </div>

      </div>
    </div>
  );
};
