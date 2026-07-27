import React, { useState } from 'react';
import { Company, Trip, Vehicle, Driver, Booking, City, VehicleType } from '../types';
import { formatCurrencyMRU, formatVehicleTypeArabic } from '../lib/utils';
import { Building2, Plus, Bus, Users, DollarSign, TrendingUp, Calendar, FileText, CheckCircle2, Trash2, Edit3, Printer, QrCode, Search, AlertCircle, X } from 'lucide-react';

interface CompanyDashboardProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  bookings: Booking[];
  cities: City[];
  onAddNewTrip: (newTrip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  trips,
  vehicles,
  drivers,
  bookings,
  cities,
  onAddNewTrip,
  onDeleteTrip
}) => {
  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  if (!currentCompany) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-300 font-sans">
        <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">لا توجد شركات نقل معتمدة حتى الآن</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          يمكن للشركات والناقلين تقديم طلب انضمام عبر زر "انضم إلينا كشركة"، وعند موافقة إدارة المنصة عليها في لوحة التحكم، ستظهر لوحة تحكم الشركة وإمكانية إضافة الرحلات والأدوات هنا.
        </p>
      </div>
    );
  }

  const companyTrips = trips.filter(t => t.companyId === currentCompany.id);
  const companyBookings = bookings.filter(b => companyTrips.some(t => t.id === b.tripId));

  // Revenue Calculations
  const totalGrossRevenue = companyBookings.reduce((sum, b) => sum + b.totalPriceMRU, 0);
  const totalCommissionPaid = companyBookings.reduce((sum, b) => sum + b.commissionMRU, 0);
  const netEarnings = totalGrossRevenue - totalCommissionPaid;
  const totalPassengers = companyBookings.reduce((sum, b) => sum + b.seats.length, 0);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'add_trip' | 'bookings' | 'fleet'>('overview');

  // QR Scanner Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [searchTicketCode, setSearchTicketCode] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState<Booking | null>(null);
  const [qrError, setQrError] = useState('');

  // Editing trip price state
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(500);

  // Add Trip Form State
  const [originCityId, setOriginCityId] = useState('nkc');
  const [destCityId, setDestCityId] = useState('ndb');
  const [depTime, setDepTime] = useState('08:00');
  const [arrTime, setArrTime] = useState('13:30');
  const [priceMRU, setPriceMRU] = useState(500);
  const [vehicleType, setVehicleType] = useState<VehicleType>('bus');
  const [driverName, setDriverName] = useState('محمد ولد سيدي');
  const [totalSeats, setTotalSeats] = useState(30);

  // Handle Verify QR / Ticket Code
  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setQrError('');
    setVerifiedBooking(null);

    const cleanCode = searchTicketCode.trim().toUpperCase().replace('#', '');
    const found = companyBookings.find(b => b.bookingCode.toUpperCase() === cleanCode || b.id === cleanCode);

    if (found) {
      setVerifiedBooking(found);
    } else {
      setQrError('لم يتم العثور على حجز مطابق لهذا الرمز في سجل رحلات هذه الشركة.');
    }
  };

  // Print Passenger Manifest
  const handlePrintManifest = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const manifestHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>كشف المسافرين - ${currentCompany.nameAr}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; direction: rtl; text-align: right; }
          h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-size: 13px; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .header-info { margin-bottom: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>كشف المسافرين الرسمي (Passenger Manifest)</h1>
        <div class="header-info">
          <p><strong>الشركة:</strong> ${currentCompany.nameAr}</p>
          <p><strong>تاريخ الكشف:</strong> ${new Date().toLocaleDateString('ar-MA')} | <strong>إجمالي المسافرين:</strong> ${totalPassengers} راكب</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>رمز الحجز</th>
              <th>اسم المسافر</th>
              <th>رقم الهاتف</th>
              <th>المقاعد</th>
              <th>المبلغ المدفوع</th>
              <th>حالة الحضور</th>
            </tr>
          </thead>
          <tbody>
            ${companyBookings.map((b, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${b.bookingCode}</strong></td>
                <td>${b.passengerName}</td>
                <td>${b.passengerPhone}</td>
                <td>${b.seats.join(', ')}</td>
                <td>${b.totalPriceMRU} MRU</td>
                <td>[  ] حاضر</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(manifestHtml);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = cities.find(c => c.id === originCityId);
    const dest = cities.find(c => c.id === destCityId);

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logo,
      companyRating: currentCompany.rating,
      vehicleId: 'v-new',
      vehicleModel: `${formatVehicleTypeArabic(vehicleType)} VIP`,
      vehicleType,
      driverId: 'd-new',
      driverName,
      originCityId,
      originCityNameAr: origin?.nameAr || 'نواكشوط',
      destinationCityId: destCityId,
      destinationCityNameAr: dest?.nameAr || 'نواذيبو',
      departureTime: depTime,
      arrivalTime: arrTime,
      departureDate: new Date().toISOString().split('T')[0],
      durationHours: '5.5 ساعات',
      priceMRU,
      availableSeatsCount: totalSeats,
      totalSeatsCount: totalSeats,
      seats: Array.from({ length: totalSeats }, (_, i) => ({
        id: `S${i+1}`,
        number: `${i+1}`,
        status: 'available',
        type: (i % 2 === 0) ? 'window' : 'aisle'
      })),
      amenities: ['ac', 'wifi', 'charger', 'water'],
      stops: [
        { cityId: originCityId, cityNameAr: origin?.nameAr || '', estimatedTimeFromStart: depTime },
        { cityId: destCityId, cityNameAr: dest?.nameAr || '', estimatedTimeFromStart: arrTime }
      ],
      cancellationPolicyAr: 'إلغاء مجاني حتى 12 ساعة قبل موعد الانطلاق.',
      status: 'scheduled',
      commissionMRU: currentCompany.commissionType === 'fixed' ? currentCompany.commissionValue : Math.round((priceMRU * currentCompany.commissionValue) / 100)
    };

    onAddNewTrip(newTrip);
    setActiveTab('trips');
    alert('تمت إضافة الرحلة بنجاح إلى جدول المواعيد!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right font-sans">
      
      {/* Dashboard Top Header & Switcher */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentCompany.logo}
            alt={currentCompany.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{currentCompany.nameAr}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                شركة نقل معتمدة ✓
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              إدارة الرحلات والأسعار، متابعة حجز الركاب والتقرير المالي للشركة
            </p>
          </div>
        </div>

        {/* Company Context Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-700">
          <span className="text-xs font-bold text-slate-400 mr-2">اختر الشركة:</span>
          <select
            value={selectedCompanyId}
            onChange={(e) => onSelectCompany(e.target.value)}
            className="bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          نظرة عامة والتقرير المالي
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'trips' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          جدول الرحلات ({companyTrips.length})
        </button>

        <button
          onClick={() => setActiveTab('add_trip')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'add_trip' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة رحلة جديدة</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          سجل حجوزات المسافرين ({companyBookings.length})
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5 mr-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>مسح / تأكيد التذكرة (QR)</span>
        </button>

        <button
          onClick={handlePrintManifest}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>طباعة كشف الركاب</span>
        </button>
      </div>

      {/* TAB 1: Financial & Operations Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">إجمالي مبيعات التذاكر</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-white">{formatCurrencyMRU(totalGrossRevenue)}</span>
              <p className="text-[10px] text-slate-400 mt-1">المبلغ المصلح قبل استقطاع العمولة</p>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">عمولة منصة Safar MR</span>
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-2xl font-black text-amber-400">-{formatCurrencyMRU(totalCommissionPaid)}</span>
              <p className="text-[10px] text-slate-400 mt-1">
                نوع العمولة: {currentCompany.commissionType === 'fixed' ? `${currentCompany.commissionValue} أوقية لكل تذكرة` : `${currentCompany.commissionValue}% نسبة مئوية`}
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 ring-2 ring-emerald-500/30">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-emerald-400">صافي أرباح الشركة</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-emerald-400">{formatCurrencyMRU(netEarnings)}</span>
              <p className="text-[10px] text-slate-300 mt-1">المبلغ الصافي المتبقي لحساب الشركة</p>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">إجمالي المسافرين</span>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-black text-white">{totalPassengers} ركاب</span>
              <p className="text-[10px] text-slate-400 mt-1">عبر جميع الرحلات المؤكدة</p>
            </div>

          </div>

          {/* Prompt Formula Example Highlight */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-sm mb-1">نموذج احتساب أرباح التذكرة الواحدة:</h3>
              <p className="text-xs text-slate-300">
                سعر التذكرة: <span className="font-bold text-white">500 أوقية</span> | عمولة المنصة: <span className="font-bold text-amber-400">30 أوقية</span> | تستلم الشركة صافي: <span className="font-bold text-emerald-400">470 أوقية</span>
              </p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">
              حساب تلقائي دقيق 100%
            </span>
          </div>

        </div>
      )}

      {/* TAB 2: Trips List */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          {companyTrips.map((t) => (
            <div key={t.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base">
                    {t.originCityNameAr} ← {t.destinationCityNameAr}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[10px] font-bold rounded-full">
                    {formatVehicleTypeArabic(t.vehicleType)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  الانطلاق: <strong className="text-white">{t.departureTime}</strong> | الوصول: <strong className="text-white">{t.arrivalTime}</strong> | السائق: {t.driverName}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left">
                  <span className="text-xs text-slate-400 block">سعر المقعد</span>
                  <span className="text-lg font-black text-emerald-400">{formatCurrencyMRU(t.priceMRU)}</span>
                </div>

                <button
                  onClick={() => onDeleteTrip(t.id)}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                  title="حذف الرحلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Add New Trip Form */}
      {activeTab === 'add_trip' && (
        <div className="max-w-2xl bg-slate-800 border border-slate-700/80 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">إضافة رحلة جديدة لجدول الشركة</h2>

          <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">مدينة الانطلاق</label>
                <select
                  value={originCityId}
                  onChange={(e) => setOriginCityId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                >
                  {cities.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">مدينة الوصول</label>
                <select
                  value={destCityId}
                  onChange={(e) => setDestCityId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                >
                  {cities.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">وقت الانطلاق</label>
                <input
                  type="time"
                  value={depTime}
                  onChange={(e) => setDepTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وقت الوصول التقديري</label>
                <input
                  type="time"
                  value={arrTime}
                  onChange={(e) => setArrTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">سعر التذكرة (MRU)</label>
                <input
                  type="number"
                  value={priceMRU}
                  onChange={(e) => setPriceMRU(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">نوع المركبة</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                >
                  <option value="bus">حافلة مكيفة VIP</option>
                  <option value="minibus">ميني باص</option>
                  <option value="v8">سيارة V8 سياحية</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">عدد المقاعد الإجمالي</label>
                <input
                  type="number"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">اسم السائق المعتمد</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-4"
            >
              نشر الرحلة وجعلها متاحة للحجز
            </button>

          </form>
        </div>
      )}

      {/* TAB 4: Bookings Manifest */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {companyBookings.length === 0 ? (
            <div className="bg-slate-800 p-8 text-center text-slate-400 rounded-2xl">
              لا توجد حجوزات مسجلة لهذه الشركة حتى الآن.
            </div>
          ) : (
            companyBookings.map((b) => (
              <div key={b.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-400">#{b.bookingCode}</span>
                    <span className="font-bold text-white text-sm">{b.passengerName}</span>
                    <span className="text-xs text-slate-400">({b.passengerPhone})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    المقاعد: <strong className="text-white">{b.seats.join(', ')}</strong> | الإجمالي: <strong className="text-emerald-400">{formatCurrencyMRU(b.totalPriceMRU)}</strong> | صافي الشركة: <strong className="text-blue-400">{formatCurrencyMRU(b.netCompanyMRU)}</strong>
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
                  تأكيد صعود المسافر ✓
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* QR Code Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">التحقق من تذكرة المسافر (QR)</h3>
              </div>
              <button onClick={() => { setShowQrModal(false); setVerifiedBooking(null); setQrError(''); }} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyTicket} className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">أدخل رمز التذكرة أو امسح الرمز:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="مثال: BSK-921405"
                  value={searchTicketCode}
                  onChange={(e) => setSearchTicketCode(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-sm uppercase focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1"
                >
                  <Search className="w-4 h-4" />
                  <span>فحص</span>
                </button>
              </div>
            </form>

            {qrError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{qrError}</span>
              </div>
            )}

            {verifiedBooking && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-extrabold">
                  <span>تذكرة صالحة ومؤكدة ✓</span>
                  <span className="font-mono">#{verifiedBooking.bookingCode}</span>
                </div>
                <div className="text-slate-300 space-y-1 pt-1">
                  <p><strong>اسم المسافر:</strong> {verifiedBooking.passengerName}</p>
                  <p><strong>الهاتف:</strong> {verifiedBooking.passengerPhone}</p>
                  <p><strong>المقاعد:</strong> {verifiedBooking.seats.join(', ')}</p>
                  <p><strong>الخط:</strong> {verifiedBooking.tripDetails.originAr} ← {verifiedBooking.tripDetails.destinationAr}</p>
                  <p><strong>التاريخ والوقت:</strong> {verifiedBooking.tripDetails.departureDate} ({verifiedBooking.tripDetails.departureTime})</p>
                </div>
                <button
                  onClick={() => {
                    alert(`تم تأكيد صعود المسافر ${verifiedBooking.passengerName} بنجاح!`);
                    setShowQrModal(false);
                    setVerifiedBooking(null);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl mt-2"
                >
                  تأكيد صعود الحافلة الآن
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
