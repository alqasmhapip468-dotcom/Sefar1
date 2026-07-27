import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Users, 
  Ticket, 
  DollarSign, 
  Bell, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Settings, 
  Car, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  FileText,
  Edit3,
  UserCheck,
  UserX,
  Filter,
  UserCog,
  RefreshCw,
  Lock
} from 'lucide-react';
import { 
  Company, 
  City, 
  Booking, 
  AdminSettings, 
  CommissionType, 
  PartnerApplication, 
  ComplaintReport,
  UserRecord,
  UserRole,
  UserStatus
} from '../types';
import { formatCurrencyMRU } from '../lib/utils';
import { 
  fetchAllUsersFromFirestore, 
  subscribeToUsers,
  updateUserRoleAndStatusInFirestore, 
  approveCompanyPartnerRequest, 
  rejectCompanyPartnerRequest 
} from '../lib/firebase';

interface SuperAdminDashboardProps {
  companies: Company[];
  cities: City[];
  bookings: Booking[];
  adminSettings: AdminSettings;
  applications: PartnerApplication[];
  complaints: ComplaintReport[];
  onUpdateAdminSettings: (newSettings: AdminSettings) => void;
  onToggleVerifyCompany: (companyId: string) => void;
  onAddCity: (newCity: City) => void;
  onApproveApplication: (appId: string, adminNotes: string) => void;
  onRejectApplication: (appId: string, adminNotes: string) => void;
  onResolveComplaint: (complaintId: string, response: string) => void;
  onUpdateCompanyCommission: (companyId: string, type: CommissionType, value: number) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  companies,
  cities,
  bookings,
  adminSettings,
  applications,
  complaints,
  onUpdateAdminSettings,
  onToggleVerifyCompany,
  onAddCity,
  onApproveApplication,
  onRejectApplication,
  onResolveComplaint,
  onUpdateCompanyCommission
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'applications' | 'complaints' | 'kpi' | 'commission' | 'companies' | 'cities' | 'qr_verifier' | 'notifications'>('users');

  // Firestore Users State (User Management)
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('customer');
  const [editStatus, setEditStatus] = useState<UserStatus>('active');
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);

  // Applications Filter & Modal State
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Complaint Action State
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintReport | null>(null);
  const [complaintResponseInput, setComplaintResponseInput] = useState('');

  // Individual Company Commission Edit Modal
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [compCommType, setCompCommType] = useState<CommissionType>('fixed');
  const [compCommVal, setCompCommVal] = useState<number>(30);

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

  // Manual Users Refresh from Firestore
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const fetched = await fetchAllUsersFromFirestore();
      setUsersList(fetched);
    } catch (err) {
      console.warn("Could not load users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Subscribe to Users in Firestore in real-time
  useEffect(() => {
    setIsLoadingUsers(true);
    const unsubscribe = subscribeToUsers(
      (remoteUsers) => {
        setUsersList(remoteUsers);
        setIsLoadingUsers(false);
      },
      (err) => {
        console.warn("Could not load users via real-time subscription:", err);
        setIsLoadingUsers(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle Edit User Submit
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSavingUser(true);
    try {
      await updateUserRoleAndStatusInFirestore(
        editingUser.uid,
        editRole,
        editStatus,
        editRole === 'company' ? editingUser.uid : null
      );

      setUsersList(prev => prev.map(u => u.uid === editingUser.uid ? {
        ...u,
        role: editRole,
        status: editStatus
      } : u));

      setEditingUser(null);
      alert(`تم تعديل صلاحيات وحالة المستخدم (${editingUser.name}) بنجاح في Firestore!`);
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء حفظ التعديلات');
    } finally {
      setIsSavingUser(false);
    }
  };

  // Quick Approve Partner Request from User List or Applications Page
  const handleApprovePartnerUser = async (uid: string, userName: string) => {
    try {
      await approveCompanyPartnerRequest(uid);
      setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, role: 'company', status: 'active', companyId: uid } : u));
      alert(`تم قبول طلب شركة النقل للمستخدم (${userName}) بنجاح وتحويل حسابه إلى شركة!`);
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء تنفيذ القبول');
    }
  };

  const handleRejectPartnerUser = async (uid: string, userName: string) => {
    try {
      await rejectCompanyPartnerRequest(uid);
      setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, role: 'customer', status: 'active' } : u));
      alert(`تم رفض الطلب وإعادة دور المستخدم (${userName}) إلى عميل عادي.`);
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء تنفيذ الرفض');
    }
  };

  // Calculate Today's Real-time Transactions & Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.createdAt.startsWith(todayStr) || b.tripDetails.departureDate === todayStr);
  const todayTransactionsCount = todayBookings.length;
  const todayVolumeMRU = todayBookings.reduce((sum, b) => sum + b.totalPriceMRU, 0);
  const todayCommissionsMRU = todayBookings.reduce((sum, b) => sum + b.commissionMRU, 0);

  const totalVolumeMRU = bookings.reduce((sum, b) => sum + b.totalPriceMRU, 0);
  const pendingAppsCount = applications.filter(a => a.status === 'pending').length + usersList.filter(u => u.role === 'pending_company').length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'pending').length;

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
    alert('تم حفظ إعدادات العمولات الافتراضية بنجاح!');
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

  const filteredApps = applications.filter(a => {
    if (appFilter === 'all') return true;
    return a.status === appFilter;
  });

  // Filter Users
  const filteredUsers = usersList.filter(u => {
    const q = userSearchTerm.toLowerCase();
    const matchesSearch = 
      !q || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.phone.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q);

    const matchesRole = 
      userRoleFilter === 'all' ? true :
      userRoleFilter === 'customer' ? (u.role === 'customer' || u.role === 'passenger') :
      userRoleFilter === 'company' ? (u.role === 'company' || u.role === 'company_admin' || u.role === 'independent_driver') :
      userRoleFilter === 'admin' ? (u.role === 'admin' || u.role === 'super_admin') :
      u.role === userRoleFilter;

    const matchesStatus = 
      userStatusFilter === 'all' ? true : u.status === userStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return (
          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>مشرف عام (Admin)</span>
          </span>
        );
      case 'company':
      case 'company_admin':
      case 'independent_driver':
        return (
          <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <Building2 className="w-3 h-3 text-blue-400" />
            <span>شركة نقل (Company)</span>
          </span>
        );
      case 'pending_company':
        return (
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse w-fit">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>طلب شركة معلق (Pending)</span>
          </span>
        );
      case 'customer':
      case 'passenger':
      default:
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>عميل (Customer)</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    if (status === 'suspended') {
      return (
        <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
          <UserX className="w-3 h-3" />
          <span>معطل (Suspended)</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
        <UserCheck className="w-3 h-3" />
        <span>نشط (Active)</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right font-sans dir-rtl text-slate-100" dir="rtl">
      
      {/* Admin Title Banner */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-lg shadow-purple-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">لوحة الإدارة الرئيسية (Super Admin)</h1>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-full">
                نظام Firebase RBAC المعتمد ⚡
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة مستخدمي Firestore والصلاحيات (Role/Status)، مراجعة طلبات الشركات، والتحكم بالعمولات والخدمات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-700/80 text-xs">
          <div className="text-center border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-400 block font-bold">المستخدمون المسجلون</span>
            <span className="text-base font-black text-purple-400">{usersList.length} مستخدم</span>
          </div>
          <div className="text-center border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-400 block font-bold">معاملات اليوم</span>
            <span className="text-base font-black text-emerald-400">{todayTransactionsCount} حجز</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-bold">أرباح اليوم</span>
            <span className="text-base font-black text-purple-400">{formatCurrencyMRU(todayCommissionsMRU)}</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8 text-xs font-bold">
        
        {/* TAB 1: User Management (إدارة المستخدمين) */}
        <button
          onClick={() => setActiveTab('users')}
          className={`relative px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة المستخدمين ({usersList.length})</span>
        </button>

        {/* TAB 2: Applications (طلبات شركات النقل) */}
        <button
          onClick={() => setActiveTab('applications')}
          className={`relative px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'applications' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>طلبات شركات النقل</span>
          {pendingAppsCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full animate-pulse">
              {pendingAppsCount} معلق
            </span>
          )}
        </button>

        {/* TAB 3: Complaints */}
        <button
          onClick={() => setActiveTab('complaints')}
          className={`relative px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'complaints' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>نظام البلاغات والشكاوى</span>
          {pendingComplaintsCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white font-black text-[10px] rounded-full">
              {pendingComplaintsCount} جديد
            </span>
          )}
        </button>

        {/* TAB 4: KPI Metrics */}
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'kpi' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          معاملات اليوم والأرباح
        </button>

        {/* TAB 5: Companies */}
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'companies' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          شركات النقل والمستقلين ({companies.length})
        </button>

        {/* TAB 6: Commission Global Config */}
        <button
          onClick={() => setActiveTab('commission')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'commission' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          نسبة الربح العامة
        </button>

        {/* TAB 7: QR Code Verification */}
        <button
          onClick={() => setActiveTab('qr_verifier')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'qr_verifier' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg' : 'bg-emerald-500/10 text-emerald-400'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>فحص التذاكر (QR)</span>
        </button>

        {/* TAB 8: Cities */}
        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'cities' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          المدن والمحطات ({cities.length})
        </button>

        {/* TAB 9: Broadcast Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'notifications' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          إرسال إشعارات
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: User Management Page (إدارة المستخدمين) */}
      {/* ========================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6 text-xs">
          
          {/* Header & Search / Filters Bar */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-purple-400" />
                  <span>جدول إدارة جميع مستخدمي Firestore وصلاحيات الأدوار (RBAC)</span>
                </h2>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  تتيح لك هذه الصفحة التحكم الكامل بالحسابات، تغيير الصلاحيات (Role)، وتفعيل أو تعطيل (Status) أي مستخدم.
                </p>
              </div>

              <button
                onClick={loadUsers}
                disabled={isLoadingUsers}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                <span>تحديث القائمة من Firestore</span>
              </button>
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/60">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، رقم الهاتف، أو UID..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="all">تصفية حسب الدور (جميع الأدوار)</option>
                  <option value="customer">عميل (customer)</option>
                  <option value="company">شركة نقل (company)</option>
                  <option value="admin">مدير نظام (admin)</option>
                  <option value="pending_company">طلب شركة معلق (pending_company)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="all">تصفية حسب الحالة (الكل)</option>
                  <option value="active">حسابات نشطة (active)</option>
                  <option value="suspended">حسابات معطلة (suspended)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List Grid / Table */}
          {isLoadingUsers ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 text-slate-400 font-bold flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
              <span>جاري تحميل بيانات المستخدمين مباشرة من Firestore...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 text-slate-400 font-bold">
              لم يتم العثور على أي مستخدمين يطابقون خيارات البحث والتصفية.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((u) => (
                <div
                  key={u.uid}
                  className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-lg hover:border-slate-600 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* User Header */}
                    <div className="flex items-start justify-between border-b border-slate-700/60 pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 select-all">
                          UID: {u.uid}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {getRoleBadge(u.role)}
                        {getStatusBadge(u.status || 'active')}
                      </div>
                    </div>

                    {/* User Info Details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">البريد الإلكتروني:</span>
                        <strong className="text-white font-mono break-all">{u.email || 'غير مسجل'}</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block">رقم الهاتف:</span>
                        <strong className="text-emerald-400 font-mono">{u.phone || 'غير مسجل'}</strong>
                      </div>

                      <div className="col-span-2 pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                        <span>تاريخ إنشاء الحساب:</span>
                        <strong className="text-slate-300 font-mono">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-MA') : 'غير محدد'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setEditRole(u.role || 'customer');
                        setEditStatus(u.status || 'active');
                      }}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل الصلاحيات والحالة</span>
                    </button>

                    {u.role === 'pending_company' && (
                      <button
                        onClick={() => handleApprovePartnerUser(u.uid, u.name)}
                        className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-[11px] transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>قبول الشركة</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Editing Role & Status */}
          {editingUser && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <form onSubmit={handleSaveUserEdit} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 text-white text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">تعديل بيانات وصلاحيات المستخدم</h3>
                    <p className="text-[11px] text-slate-400">{editingUser.name} ({editingUser.email})</p>
                  </div>
                  <button type="button" onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Select Role */}
                <div className="space-y-2">
                  <label className="block text-slate-200 font-bold text-xs">اختر الدور الجديد (Role) *</label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      editRole === 'customer' ? 'bg-emerald-500/10 border-emerald-500/50 text-white font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="roleRadio"
                          value="customer"
                          checked={editRole === 'customer' || editRole === 'passenger'}
                          onChange={() => setEditRole('customer')}
                          className="accent-emerald-500"
                        />
                        <div>
                          <strong className="block text-xs">عميل عادي (customer)</strong>
                          <span className="text-[10px] text-slate-400">حساب مسافر لحجز الرحلات والتذاكر</span>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      editRole === 'company' ? 'bg-blue-500/10 border-blue-500/50 text-white font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="roleRadio"
                          value="company"
                          checked={editRole === 'company' || editRole === 'company_admin'}
                          onChange={() => setEditRole('company')}
                          className="accent-blue-500"
                        />
                        <div>
                          <strong className="block text-xs">شركة نقل (company)</strong>
                          <span className="text-[10px] text-slate-400">حساب شركة لإضافة وتدبير الرحلات والمركبات</span>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      editRole === 'admin' ? 'bg-purple-500/10 border-purple-500/50 text-white font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="roleRadio"
                          value="admin"
                          checked={editRole === 'admin' || editRole === 'super_admin'}
                          onChange={() => setEditRole('admin')}
                          className="accent-purple-500"
                        />
                        <div>
                          <strong className="block text-xs">مدير النظام (admin)</strong>
                          <span className="text-[10px] text-slate-400">صلاحيات كاملة للوحة التحكم الرئيسية والإدارة</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Select Status */}
                <div className="space-y-2">
                  <label className="block text-slate-200 font-bold text-xs">حالة الحساب (Status) *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditStatus('active')}
                      className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-xs flex items-center justify-center gap-1.5 ${
                        editStatus === 'active' ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>نشط (Active)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditStatus('suspended')}
                      className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-xs flex items-center justify-center gap-1.5 ${
                        editStatus === 'suspended' ? 'bg-red-500 text-white border-red-400 font-black' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <UserX className="w-4 h-4" />
                      <span>معطل (Suspended)</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  {isSavingUser ? 'جاري حفظ التغييرات...' : 'حفظ التعديلات في Firestore ✓'}
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: Partner Applications Review Page */}
      {/* ========================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-6 text-xs">
          
          {/* Pending Requests from Firestore users collection */}
          {usersList.filter(u => u.role === 'pending_company').length > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-3xl space-y-3">
              <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>طلبات تسجّيل الشركات المعلّقة فورياً من مستخدمي Firestore</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {usersList.filter(u => u.role === 'pending_company').map(u => (
                  <div key={u.uid} className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <strong className="text-white text-sm block">{u.name}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">{u.email} • {u.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprovePartnerUser(u.uid, u.name)}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-[11px]"
                      >
                        قبول (role=company)
                      </button>
                      <button
                        onClick={() => handleRejectPartnerUser(u.uid, u.name)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl text-[11px]"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* App Filter Pills */}
          <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold px-2">تصفية الطلبات المسجلة:</span>
              <button
                onClick={() => setAppFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  appFilter === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                المعلقة ({applications.filter(a => a.status === 'pending').length})
              </button>

              <button
                onClick={() => setAppFilter('approved')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  appFilter === 'approved' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                المقبولة ({applications.filter(a => a.status === 'approved').length})
              </button>

              <button
                onClick={() => setAppFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  appFilter === 'rejected' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                المرفوضة ({applications.filter(a => a.status === 'rejected').length})
              </button>

              <button
                onClick={() => setAppFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  appFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                الكل ({applications.length})
              </button>
            </div>
          </div>

          {/* Applications Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700 text-slate-400 font-bold">
                لا توجد طلبات انضمام إضافية في هذه الفئة حالياً.
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-lg hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2">
                      {app.type === 'company' ? (
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                          <Car className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          {app.type === 'company' ? app.companyName : `${app.driverName} (ناقل مستقل)`}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          {app.type === 'company' ? `المسؤول: ${app.managerName}` : `السيارة: ${app.vehicleModel} (${app.plateNumber})`}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      app.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {app.status === 'approved' ? 'معتمد ومقبول ✓' : app.status === 'rejected' ? 'مرفوض ✗' : 'معلق قيد المراجعة ⏳'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">رقم الهاتف:</span>
                      <strong className="text-white font-mono">{app.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">البريد الإلكتروني:</span>
                      <strong className="text-white font-mono">{app.email || 'غير متوفر'}</strong>
                    </div>
                    {app.commercialRegisterOrDoc && (
                      <div className="col-span-2 pt-1 border-t border-slate-800">
                        <span className="text-slate-500 block">السجل التجاري / الترخيص / الرخصة:</span>
                        <strong className="text-purple-300">{app.commercialRegisterOrDoc}</strong>
                      </div>
                    )}
                    {app.notes && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block">تفاصيل أسطول العمل والملاحظات:</span>
                        <p className="text-slate-300 mt-0.5">{app.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Admin Note If Provided */}
                  {app.adminNotes && (
                    <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-[11px]">
                      <span className="font-bold text-purple-300 block">ملاحظة المشرف:</span>
                      <p className="text-slate-200 mt-0.5">{app.adminNotes}</p>
                    </div>
                  )}

                  {/* Admin Action Buttons */}
                  {app.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNoteInput('تم مراجعة بيانات الوثائق والاعتماد بنجاح! يسعدنا انضمامكم لمشاريع وسفر موريتانيا.');
                        }}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>قبول الطلب وتفعيل الحساب</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNoteInput('يرجى تقديم بيانات السجل التجاري المعتمد أو توضيح معلومات الترخيص.');
                        }}
                        className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold rounded-xl transition-all"
                      >
                        رفض
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Modal for Writing Admin Notes & Confirmation */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-white text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base">اتخاذ إجراء بشأن طلب الانضمام</h3>
                  <button onClick={() => setSelectedApp(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <p>الجهة الطالبة: <strong className="text-white">{selectedApp.companyName || selectedApp.driverName}</strong></p>
                  <p>رقم الهاتف: <strong className="text-emerald-400 font-mono">{selectedApp.phone}</strong></p>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">ملاحظة ورسالة المشرف لمقدم الطلب *</label>
                  <textarea
                    rows={3}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                    placeholder="يكتب المشرف هنا ملاحظته المباشرة..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={async () => {
                      onApproveApplication(selectedApp.id, adminNoteInput);
                      if (selectedApp.userId) {
                        await approveCompanyPartnerRequest(selectedApp.userId);
                      }
                      setSelectedApp(null);
                      alert('تمت الموافقة على الطلب بنجاح وإنشاء حساب الشركة المعتمدة!');
                    }}
                    className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs"
                  >
                    تأكيد القبول والتفعيل ✓
                  </button>

                  <button
                    onClick={async () => {
                      onRejectApplication(selectedApp.id, adminNoteInput);
                      if (selectedApp.userId) {
                        await rejectCompanyPartnerRequest(selectedApp.userId);
                      }
                      setSelectedApp(null);
                      alert('تم تسجيل رفض الطلب وإرسال الملاحظة لمقدم الطلب.');
                    }}
                    className="py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs"
                  >
                    تأكيد الرفض ✗
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: Complaints & Reports System */}
      {/* ========================================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
            <div>
              <h3 className="font-extrabold text-sm text-white">نظام البلاغات والشكاوى الواردة من المسافرين</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                متابعة البلاغات المتعلقة بالتأخيرات، سلوك السائقين، أو مشاكل التكييف والتذاكر.
              </p>
            </div>

            <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-full text-[11px]">
              إجمالي البلاغات: {complaints.length}
            </span>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700 text-slate-400 font-bold">
                لا توجد بلاغات أو شكاوى مسجلة في الوقت الحالي.
              </div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold text-[10px]">
                        {c.typeAr}
                      </span>
                      <strong className="text-white text-sm">{c.reporterName} ({c.reporterPhone})</strong>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status === 'resolved' ? 'تم الحل والمتابعة ✓' : 'معلق قيد التحقيق ⏳'}
                    </span>
                  </div>

                  <p className="text-slate-200 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                    الشركة المعنية: <strong className="text-purple-300">{c.companyName || 'غير محدد'}</strong>
                    <br />
                    تفاصيل البلاغ: {c.description}
                  </p>

                  {c.adminResponse ? (
                    <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-[11px]">
                      <span className="font-bold text-purple-300 block">إجراء الرد من الإدارة:</span>
                      <p className="text-slate-200 mt-0.5">{c.adminResponse}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setComplaintResponseInput('تم التواصل مع المشرف في محطة الشركة ومعالجة الملاحظة فوراً.');
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>رد ومعالجة البلاغ</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Modal for Resolving Complaint */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-white text-right text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm">معالجة البلاغ والرد على صاحب الشكوى</h3>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">اجراء ومعالجة الإدارة *</label>
                  <textarea
                    rows={3}
                    value={complaintResponseInput}
                    onChange={(e) => setComplaintResponseInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                  ></textarea>
                </div>

                <button
                  onClick={() => {
                    onResolveComplaint(selectedComplaint.id, complaintResponseInput);
                    setSelectedComplaint(null);
                    alert('تم حفظ الرد ومعالجة البلاغ بنجاح!');
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs"
                >
                  حفظ الرد وحل الشكوى ✓
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: Key Metrics & Real-time Transactions */}
      {/* ========================================== */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5">
              <span className="text-xs text-slate-400 font-bold block mb-1">عدد المعاملات التي تمت اليوم</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">{todayTransactionsCount} حجز</span>
              <span className="text-[10px] text-slate-400 block mt-1">تذاكر وحجوزات جديدة اليوم</span>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5">
              <span className="text-xs text-slate-400 font-bold block mb-1">حجم مبيعات اليوم الإجمالي</span>
              <span className="text-2xl font-black text-white">{formatCurrencyMRU(todayVolumeMRU)}</span>
              <span className="text-[10px] text-slate-400 block mt-1">قيمة الحجوزات المصدرة اليوم</span>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5">
              <span className="text-xs text-slate-400 font-bold block mb-1">أرباح عمولة المنصة اليوم</span>
              <span className="text-2xl font-black text-purple-400">{formatCurrencyMRU(todayCommissionsMRU)}</span>
              <span className="text-[10px] text-slate-400 block mt-1">صافي أرباح Safar MR المقتطعة</span>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5">
              <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي التداولات التراكمية</span>
              <span className="text-2xl font-black text-blue-400">{formatCurrencyMRU(totalVolumeMRU)}</span>
              <span className="text-[10px] text-slate-400 block mt-1">إجمالي حجم المبيعات الكلي</span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 text-xs space-y-3">
            <h3 className="font-extrabold text-sm text-white">سجل أحدث المعاملات والحجوزات اليوم</h3>
            <div className="space-y-2">
              {todayBookings.length === 0 ? (
                <div className="text-slate-400 text-center py-6">لا توجد حجوزات جديدة مسجلة اليوم حتى الآن.</div>
              ) : (
                todayBookings.map(b => (
                  <div key={b.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-mono text-emerald-400 font-bold">#{b.bookingCode}</span> - <strong className="text-white">{b.passengerName}</strong> ({b.tripDetails.companyName})
                      <p className="text-[10px] text-slate-400">{b.tripDetails.originAr} ← {b.tripDetails.destinationAr} • المقاعد: {b.seats.join(', ')}</p>
                    </div>

                    <div className="text-left">
                      <span className="font-bold text-white block">{formatCurrencyMRU(b.totalPriceMRU)}</span>
                      <span className="text-[10px] text-purple-400">عمولة: {formatCurrencyMRU(b.commissionMRU)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: Manage Companies & Commissions */}
      {/* ========================================== */}
      {activeTab === 'companies' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">قائمة شركات النقل والناقلين المستقلين المعتمدين</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">يمكن للمشرف تعديل نسبة أو قيمة العمولة لكل شركة على حدة، وتراها الشركات بشفافية.</p>
            </div>
          </div>

          <div className="space-y-3">
            {companies.map(c => (
              <div key={c.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={c.logo} alt={c.name} className="w-12 h-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-sm">{c.nameAr}</h4>
                      {c.verified && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                          موثق ✓
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{c.phone} • {c.email}</p>
                    <p className="text-purple-300 font-bold text-[11px] mt-1">
                      العمولة المعتمدة: {c.commissionType === 'fixed' ? `${c.commissionValue} أوقية (ثابتة)` : `${c.commissionValue}% (نسبة مئوية)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCompany(c);
                      setCompCommType(c.commissionType);
                      setCompCommVal(c.commissionValue);
                    }}
                    className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl font-bold transition-all"
                  >
                    تعديل نسبة الربح ⚙️
                  </button>

                  <button
                    onClick={() => onToggleVerifyCompany(c.id)}
                    className={`px-3 py-2 rounded-xl font-bold transition-all ${
                      c.verified ? 'bg-slate-900 text-slate-400 border border-slate-700' : 'bg-emerald-500 text-slate-950 font-black'
                    }`}
                  >
                    {c.verified ? 'إلغاء التوثيق' : 'توثيق الآن'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Individual Company Commission Modal */}
          {editingCompany && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-white text-right text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm">تعديل نسبة أرباح شركة: {editingCompany.nameAr}</h3>
                  <button onClick={() => setEditingCompany(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-2">نوع العمولة</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCompCommType('fixed')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        compCommType === 'fixed' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      مبلغ ثابت (أوقية)
                    </button>

                    <button
                      type="button"
                      onClick={() => setCompCommType('percentage')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        compCommType === 'percentage' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      نسبة مئوية (%)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {compCommType === 'fixed' ? 'القيمة الثابتة (MRU)' : 'النسبة المئوية (%)'}
                  </label>
                  <input
                    type="number"
                    value={compCommVal}
                    onChange={(e) => setCompCommVal(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  />
                </div>

                <button
                  onClick={() => {
                    onUpdateCompanyCommission(editingCompany.id, compCommType, compCommVal);
                    setEditingCompany(null);
                    alert('تم تعديل نسبة عمولة الشركة بنجاح!');
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs"
                >
                  حفظ العمولة للشركة
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: Global Commission Config */}
      {/* ========================================== */}
      {activeTab === 'commission' && (
        <div className="max-w-xl bg-slate-800 border border-slate-700/80 rounded-3xl p-6 text-xs space-y-4">
          <h2 className="text-base font-bold text-white mb-2">إعدادات ونسب عمولة المنصة العامة</h2>
          <p className="text-slate-300 mb-4">
            تُطبق هذه النسبة تلقائياً على كل شركة جديدة تنضم للمنصة، ما لم يتم تخصيص قيمة فردية لها.
          </p>

          <div>
            <label className="block text-slate-300 font-bold mb-2">طريقة احتساب العمولة الإفتراضية</label>
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

      {/* ========================================== */}
      {/* TAB 7: QR Code Verification */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* TAB 8: Manage Cities */}
      {/* ========================================== */}
      {activeTab === 'cities' && (
        <div className="space-y-6 max-w-2xl text-xs">
          <form onSubmit={handleCreateCity} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-3">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-bold text-white">
            {cities.map(c => (
              <div key={c.id} className="bg-slate-800 border border-slate-700/80 p-3 rounded-xl flex items-center justify-between">
                <span>{c.nameAr}</span>
                <span className="text-[10px] text-slate-400">{c.regionAr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 9: Broadcast Notifications */}
      {/* ========================================== */}
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
