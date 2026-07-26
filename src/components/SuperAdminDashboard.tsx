import React, { useState } from 'react';
import { ShieldCheck, Building2, MapPin, Users, Ticket, DollarSign, Bell, QrCode, CheckCircle2, AlertCircle, Plus, Search, Settings } from 'lucide-react';
import { Company, City, Booking, AdminSettings, CommissionType } from '../types';
import { formatCurrencyMRU } from '../lib/utils';

interface SuperAdminDashboardProps {
  companies: Company[];
  cities: City[];
  bookings: Booking[];
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (newSettings: AdminSettings) => void;
  onToggleVerifyCompany: (companyId: string) => void;
  onAddCity: (newCity: City) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  companies,
  cities,
  bookings,
  adminSettings,
  onUpdateAdminSettings,
  onToggleVerifyCompany,
  onAddCity
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'commission' | 'companies' | 'cities' | 'qr_verifier' | 'notifications'>('kpi');

  // QR Verifier State
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const [qrError, setQrError] = useState('');

  // Commission Config State
  const [commissionType, setCommissionType] = useState<CommissionType>(adminSettings.defaultCommissionType);
  const [commissionValue, setCommissionValue] = useState<number>(adminSettings.defaultCommissionValue);

  // New City Input State
  const [newCityName, setNewCityName] = useState('');
  const [newCityRegion, setNewCityRegion] = useState('');

  // Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSent, setNotifSent] = useState(false);

  // Calculate System Total Revenues
  const totalVolumeMRU = bookings.reduce((sum, b) => sum + b.totalPriceMRU, 0);
  const totalPlatformCommissionsEarned = bookings.reduce((sum, b) => sum + b.commissionMRU, 0);

  const handleVerifyQR = (e: React.FormEvent) => {
    e.preventDefault();
    setQrError('');
    setScannedBooking(null);

    const cleanInput = qrCodeInput.trim();
    const found = bookings.find(
      b => b.bookingCode.toUpperCase() === cleanInput.toUpperCase() ||
           b.qrData.toUpperCase() === cleanInput.toUpperCase()
    );

    if (found) {
      setScannedBooking(found);
    } else {
      setQrError('رمز التذكرة غير موجود أو ملغى في قاعدة البيانات!');
    }
  };

  const handleSaveCommissionSettings = () => {
    onUpdateAdminSettings({
      ...adminSettings,
      defaultCommissionType: commissionType,
      defaultCommissionValue: commissionValue
    });
    alert('تم حفظ إعدادات العمولات بنجاح!');
  };

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName) return;
    const cityObj: City = {
      id: `city-${Date.now()}`,
      nameAr: newCityName,
      nameFr: newCityName,
      regionAr: newCityRegion || 'ولاية موريتانية',
      code: newCityName.substring(0, 3).toUpperCase(),
      popular: false
    };
    onAddCity(cityObj);
    setNewCityName('');
    setNewCityRegion('');
    alert('تمت إضافة المدينة الجديدة لقائمة المحطات!');
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    setNotifSent(true);
    setTimeout(() => {
      setNotifTitle('');
      setNotifMessage('');
      setNotifSent(false);
      alert('تم إرسال الإشعار الجماعي إلى جميع المستخدمين والشركات!');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right font-sans">
      
      {/* Admin Title Banner */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 mb-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">لوحة تحكم المدير العام (Super Admin)</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة الشركات، ضبط العمولات، والتحقق من التذاكر بـ QR
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-full">
          صلاحيات كاملة ⚡
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'kpi' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          مؤشرات النظام والأرباح
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'commission' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          إدارة العمولات
        </button>

        <button
          onClick={() => setActiveTab('qr_verifier')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'qr_verifier' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg' : 'bg-emerald-500/10 text-emerald-400'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>التحقق من التذاكر (QR)</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'companies' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          شركات النقل ({companies.length})
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'cities' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          المدن والمسارات ({cities.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'notifications' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          إرسال إشعارات جماعية
        </button>
      </div>

      {/* TAB 1: Key Metrics */}
      {activeTab === 'kpi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
            <span className="text-xs text-slate-400 font-bold block mb-1">أرباح عمولات Safar MR</span>
            <span className="text-2xl font-black text-emerald-400">{formatCurrencyMRU(totalPlatformCommissionsEarned)}</span>
            <span className="text-[10px] text-slate-400 block mt-1">صافي أرباح المنصة المباشرة</span>
          </div>

          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
            <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي التداولات النقدية</span>
            <span className="text-2xl font-black text-white">{formatCurrencyMRU(totalVolumeMRU)}</span>
            <span className="text-[10px] text-slate-400 block mt-1">قيمة كافة الحجوزات المصدرة</span>
          </div>

          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
            <span className="text-xs text-slate-400 font-bold block mb-1">عدد شركات النقل المسجلة</span>
            <span className="text-2xl font-black text-blue-400">{companies.length} شركة</span>
            <span className="text-[10px] text-slate-400 block mt-1">شركات النقل المعتمدة في الميدان</span>
          </div>

          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
            <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي الحجوزات</span>
            <span className="text-2xl font-black text-purple-400">{bookings.length} حجز</span>
            <span className="text-[10px] text-slate-400 block mt-1">تذاكر صادرة عبر المنصة</span>
          </div>
        </div>
      )}

      {/* TAB 2: Commission Configurator */}
      {activeTab === 'commission' && (
        <div className="max-w-xl bg-slate-800 border border-slate-700/80 rounded-3xl p-6 text-xs space-y-4">
          <h2 className="text-base font-bold text-white mb-2">إعدادات ونسب عمولة المنصة</h2>
          <p className="text-slate-300 mb-4">
            تتيح هذه الإعدادات تحديد طريقة اقتطاع أرباح Safar MR تلقائياً من كل تذكرة مباعة.
          </p>

          <div>
            <label className="block text-slate-300 font-bold mb-2">طريقة احتساب العمولة الإفراضية</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCommissionType('fixed')}
                className={`py-3 px-4 rounded-xl font-bold border transition-all ${
                  commissionType === 'fixed'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                عمولة ثابتة (مثلاً 30 أوقية)
              </button>

              <button
                type="button"
                onClick={() => setCommissionType('percentage')}
                className={`py-3 px-4 rounded-xl font-bold border transition-all ${
                  commissionType === 'percentage'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                نسبة مئوية (مثلاً 6%)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              {commissionType === 'fixed' ? 'قيمة العمولة الثابتة (أوقية / تذكرة)' : 'النسبة المئوية (%)'}
            </label>
            <input
              type="number"
              value={commissionValue}
              onChange={(e) => setCommissionValue(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
            />
          </div>

          <button
            onClick={handleSaveCommissionSettings}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl transition-all"
          >
            حفظ إعدادات العمولة
          </button>
        </div>
      )}

      {/* TAB 3: QR Code Verification Tool */}
      {activeTab === 'qr_verifier' && (
        <div className="max-w-xl bg-slate-800 border border-slate-700/80 rounded-3xl p-6 text-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <QrCode className="w-5 h-5" />
            <h3>أداة التحقق الفوري من التذاكر وبصمة الـ QR</h3>
          </div>

          <form onSubmit={handleVerifyQR} className="space-y-3">
            <label className="block text-slate-300 font-bold">أدخل رمز الحجز أو بيانات الـ QR للتحقق</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="مثال: SFR-98120"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono uppercase focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all"
              >
                فحص التذكرة
              </button>
            </div>
          </form>

          {qrError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{qrError}</span>
            </div>
          )}

          {scannedBooking && (
            <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-4 space-y-2 text-white">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تذكرة صالحة ومؤكدة</span>
                <span className="font-mono">#{scannedBooking.bookingCode}</span>
              </div>
              <p>اسم المسافر: <strong className="text-white">{scannedBooking.passengerName}</strong> ({scannedBooking.passengerPhone})</p>
              <p>الشركة الناقلة: <strong>{scannedBooking.tripDetails.companyName}</strong></p>
              <p>الخط: <strong>{scannedBooking.tripDetails.originAr} ← {scannedBooking.tripDetails.destinationAr}</strong></p>
              <p>المقاعد: <strong className="text-emerald-400 font-mono">{scannedBooking.seats.join(', ')}</strong></p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Manage Companies */}
      {activeTab === 'companies' && (
        <div className="space-y-3">
          {companies.map(c => (
            <div key={c.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-white text-sm">{c.nameAr}</h4>
                  <p className="text-slate-400">{c.phone} • {c.email}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleVerifyCompany(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  c.verified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {c.verified ? 'شركة موثقة ✓' : 'توثيق الشركة'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Manage Cities */}
      {activeTab === 'cities' && (
        <div className="space-y-6 max-w-2xl">
          <form onSubmit={handleCreateCity} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-3 text-xs">
            <h3 className="font-bold text-white">إضافة مدينة أو مقاطعة جديدة</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="اسم المدينة باللغة العربية (مثلاً: أطار)"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="text"
                placeholder="اسم الولاية (مثلاً: آدرار)"
                value={newCityRegion}
                onChange={(e) => setNewCityRegion(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl">
              إضافة المدينة
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-white">
            {cities.map(c => (
              <div key={c.id} className="bg-slate-800 border border-slate-700/80 p-3 rounded-xl flex items-center justify-between">
                <span>{c.nameAr}</span>
                <span className="text-[10px] text-slate-400">{c.regionAr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Send Broadcast Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSendNotification} className="max-w-md bg-slate-800 border border-slate-700/80 rounded-3xl p-6 text-xs space-y-3">
          <h3 className="font-bold text-white text-sm">إرسال إشعار جماعي لجميع الركاب والشركات</h3>
          <div>
            <label className="block text-slate-300 font-bold mb-1">عنوان الإشعار</label>
            <input
              type="text"
              placeholder="مثال: خصم خاص 20% على رحلات نهاية الأسبوع"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">نص الرسالة</label>
            <textarea
              rows={3}
              placeholder="تفاصيل الإشعار..."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
            ></textarea>
          </div>
          <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl">
            {notifSent ? 'جاري الإرسال...' : 'بث الإشعار الجماعي الآن'}
          </button>
        </form>
      )}

    </div>
  );
};
