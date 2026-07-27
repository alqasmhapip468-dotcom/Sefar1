import React, { useState } from 'react';
import { X, User, Ticket, Building2, ShieldCheck, Phone, Mail, LogOut, FileText, CheckCircle2, AlertCircle, Send, Car, Lock, KeyRound, Sparkles, Trash2 } from 'lucide-react';
import { Booking, UserProfile, PartnerApplication, ComplaintReport, UserRole, ApplicationType } from '../types';
import { formatCurrencyMRU } from '../lib/utils';
import { 
  loginWithGoogle, 
  sendSmsOtp, 
  loginAccountInFirebase, 
  registerAccountInFirebase, 
  deleteAccountInFirebase, 
  type ConfirmationResult 
} from '../lib/firebase';

interface PassengerAccountModalProps {
  user: UserProfile | null;
  bookings: Booking[];
  applications: PartnerApplication[];
  complaints: ComplaintReport[];
  onClose: () => void;
  onViewBookingTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onLoginSimulate: (name: string, phone: string, email: string, role?: UserRole) => void;
  onLogout: () => void;
  onSubmitApplication: (app: PartnerApplication) => void;
  onSubmitComplaint: (complaint: ComplaintReport) => void;
}

export const PassengerAccountModal: React.FC<PassengerAccountModalProps> = ({
  user,
  bookings,
  applications,
  complaints,
  onClose,
  onViewBookingTicket,
  onCancelBooking,
  onLoginSimulate,
  onLogout,
  onSubmitApplication,
  onSubmitComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'partner_apply' | 'complaints'>('bookings');

  // Auth Mode: Login vs Register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Method States
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Phone / SMS Auth State
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [smsSuccess, setSmsSuccess] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Email / Password Auth State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Partner Application Form State
  const [appType, setAppType] = useState<ApplicationType>('company');
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [appPhone, setAppPhone] = useState(user?.phone || '');
  const [appEmail, setAppEmail] = useState(user?.email || '');
  const [commercialDoc, setCommercialDoc] = useState('');
  const [appNotes, setAppNotes] = useState('');
  const [appSubmittedMsg, setAppSubmittedMsg] = useState('');

  // Complaint Form State
  const [complaintType, setComplaintType] = useState<'delay' | 'driver_behavior' | 'payment_issue' | 'vehicle_condition' | 'other'>('delay');
  const [complaintCompany, setComplaintCompany] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSuccessMsg, setComplaintSuccessMsg] = useState('');

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsSubmittingAuth(true);
    setAuthError('');
    try {
      const gUser = await loginWithGoogle();
      if (gUser) {
        onLoginSimulate(
          gUser.name,
          gUser.phone,
          gUser.email,
          gUser.role
        );
        onClose();
      }
    } catch (err: any) {
      console.warn("Google login error:", err);
      setAuthError('تعذر تسجيل الدخول بـ Google. يرجى إعادة المحاولة.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Phone + Password Login
  const handlePhonePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanPhone = phoneInput.trim().replace(/\s+/g, '');
    const cleanPass = passwordInput.trim();

    if (!cleanPhone || !cleanPass) {
      setAuthError('يرجى إدخال رقم الهاتف وكلمة السر');
      return;
    }

    if (cleanPass.length < 6) {
      setAuthError('كلمة السر يجب أن تكون مكونة من 6 أحرف أو أرقام على الأقل');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const userRecord = await loginAccountInFirebase(cleanPhone, cleanPass);
      onLoginSimulate(
        userRecord.name,
        userRecord.phone,
        userRecord.email,
        userRecord.role
      );
      onClose();
    } catch (err: any) {
      console.warn("Phone password login error:", err);
      const code = err?.code || '';
      const msg = err?.message || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        msg.includes('user-not-found') ||
        msg.includes('invalid-credential')
      ) {
        setAuthError('هذا الحساب غير موجود أو كلمة السر غير صحيحة! يرجى إنشاء حساب جديد أولاً.');
      } else {
        setAuthError('تعذر تسجيل الدخول. يرجى التأكد من رقم الهاتف وكلمة السر.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Login with Email & Password
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail || !cleanPass) {
      setAuthError('يرجى إدخال البريد الإلكتروني وكلمة السر بشكل صحيح');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const userRecord = await loginAccountInFirebase(cleanEmail, cleanPass);
      onLoginSimulate(
        userRecord.name,
        userRecord.phone,
        userRecord.email,
        userRecord.role
      );
      onClose();
    } catch (err: any) {
      console.warn("Email password login error:", err);
      const code = err?.code || '';
      const msg = err?.message || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        msg.includes('user-not-found') ||
        msg.includes('invalid-credential')
      ) {
        setAuthError('الحساب غير موجود أو كلمة السر غير صحيحة! يرجى الانتقال لتبويب "إنشاء حساب جديد".');
      } else {
        setAuthError('تعذر تسجيل الدخول. يرجى التأكد من البريد الإلكتروني وكلمة السر.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle New Account Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regName.trim()) {
      setAuthError('يرجى إدخال الاسم الكامل');
      return;
    }

    if (!regPhone.trim() && !regEmail.trim()) {
      setAuthError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني');
      return;
    }

    if (!regPassword) {
      setAuthError('يرجى إدخال كلمة السر');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('كلمة السر يجب أن تكون من 6 أحرف أو أرقام على الأقل');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError('كلمات السر غير متطابقة، يرجى التأكد وإعادة المحاولة');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const userRecord = await registerAccountInFirebase(
        regName.trim(),
        regPhone.trim(),
        regEmail.trim(),
        regPassword
      );

      onLoginSimulate(
        userRecord.name,
        userRecord.phone,
        userRecord.email,
        userRecord.role
      );
      onClose();
    } catch (err: any) {
      console.warn("Registration error:", err);
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setAuthError('هذا الحساب (البريد/الهاتف) مسجل بالفعل! يمكنك الانتقال إلى "تسجيل الدخول".');
      } else if (code === 'auth/weak-password') {
        setAuthError('كلمة السر ضعيفة جداً. يرجى استخدام 6 أحرف أو أرقام على الأقل.');
      } else {
        setAuthError(`تعذر إنشاء الحساب: ${err?.message || 'يرجى مراجعة البيانات وإعادة المحاولة'}`);
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm('هل أنت تأكد من أنك تريد حذف حسابك نهائياً من منصة سفر؟ لا يمكن استرجاع الحساب بعد الحذف.')) {
      return;
    }
    try {
      await deleteAccountInFirebase();
      onLogout();
      onClose();
    } catch (err: any) {
      alert('حدث خطأ أثناء حذف الحساب: ' + (err?.message || 'يرجى تسجيل الدخول مجدداً ثم المحاولة.'));
    }
  };

  // Handle Partner Application Submit
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPhone) {
      alert('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }

    const newApp: PartnerApplication = {
      id: `app-${Date.now()}`,
      userId: user?.id || `usr-${Date.now()}`,
      type: appType,
      companyName: appType === 'company' ? companyName : undefined,
      managerName: appType === 'company' ? managerName : undefined,
      driverName: appType === 'independent_driver' ? driverName : undefined,
      vehicleModel: appType === 'independent_driver' ? vehicleModel : undefined,
      plateNumber: appType === 'independent_driver' ? plateNumber : undefined,
      licenseNumber: appType === 'independent_driver' ? licenseNumber : undefined,
      phone: appPhone,
      email: appEmail || user?.email || '',
      commercialRegisterOrDoc: commercialDoc,
      notes: appNotes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitApplication(newApp);
    setAppSubmittedMsg('تم إرسال طلب الانضمام بنجاح إلى لوحة الإدارة المشرفة! ستصلك رسالة حال اعتماد طلبك.');
    setTimeout(() => setAppSubmittedMsg(''), 6000);

    // Reset Form
    setCompanyName('');
    setManagerName('');
    setDriverName('');
    setVehicleModel('');
    setPlateNumber('');
    setLicenseNumber('');
    setCommercialDoc('');
    setAppNotes('');
  };

  // Handle Complaint Submit
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc) return;

    const typeArMap: Record<string, string> = {
      delay: 'تأخير في الانطلاق',
      driver_behavior: 'سلوك أو تعامل السائق',
      payment_issue: 'مشكلة في الدفع والاسترداد',
      vehicle_condition: 'حالة وتكييف السيارة',
      other: 'بلاغ عام'
    };

    const newComplaint: ComplaintReport = {
      id: `cmp-${Date.now()}`,
      reporterName: user?.name || 'مسافر موريتاني',
      reporterPhone: user?.phone || appPhone || '+222 0000 0000',
      companyName: complaintCompany || 'غير محدد',
      type: complaintType,
      typeAr: typeArMap[complaintType] || 'بلاغ',
      description: complaintDesc,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitComplaint(newComplaint);
    setComplaintSuccessMsg('تم تقديم البلاغ بنجاح! سيقوم فريق الإدارة بمراجعته والتواصل معكم.');
    setComplaintDesc('');
    setComplaintCompany('');
    setTimeout(() => setComplaintSuccessMsg(''), 5000);
  };

  const userApps = applications.filter(a => a.userId === user?.id || a.phone === user?.phone);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans dir-rtl text-right" dir="rtl">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {!user ? 'تسجيل الدخول وإدارة الحساب' : `حساب: ${user.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div id="recaptcha-container"></div>
          
          {/* If Not Logged In -> Show Auth Options */}
          {!user ? (
            <div className="max-w-md mx-auto py-2 space-y-5 text-xs">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-white">منصة Safar MR الموحدة</h3>
                <p className="text-slate-400">
                  سجل دخولك أو أنشئ حساباً جديداً لإدارة حجوزاتك ومتابعة رحلاتك بين المدن الموريتانية.
                </p>
              </div>

              {/* Main Auth Mode Tabs: Login vs Register */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    authMode === 'login' 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    authMode === 'register' 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>إنشاء حساب جديد</span>
                </button>
              </div>

              {/* Mode 1: LOGIN (تسجيل الدخول) */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  
                  {/* Method Switcher for Login */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 font-bold text-[11px]">
                    <button
                      type="button"
                      onClick={() => { setAuthMethod('phone'); setAuthError(''); }}
                      className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        authMethod === 'phone' ? 'bg-slate-700 text-emerald-400 border border-emerald-500/30 font-black' : 'text-slate-400'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>برقم الهاتف وكلمة السر</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthMethod('email'); setAuthError(''); }}
                      className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        authMethod === 'email' ? 'bg-slate-700 text-emerald-400 border border-emerald-500/30 font-black' : 'text-slate-400'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>بالبريد الإلكتروني</span>
                    </button>
                  </div>

                  {/* Option A: Phone + Password Login */}
                  {authMethod === 'phone' && (
                    <form onSubmit={handlePhonePasswordLogin} className="space-y-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+222 4525 1010 أو 45251010"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">كلمة السر *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {authError && (
                        <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-[11px]">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingAuth}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                      >
                        {isSubmittingAuth ? 'جاري التحقق...' : 'تسجيل الدخول برقم الهاتف'}
                      </button>

                      <div className="relative flex items-center justify-center text-slate-500 my-2">
                        <div className="w-full h-px bg-slate-800"></div>
                        <span className="bg-slate-900 px-3 absolute text-[10px]">أو الدخول بـ Google</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2"
                      >
                        <span className="font-black text-blue-400">G</span>
                        <span>المتابعة باستخدام Google</span>
                      </button>
                    </form>
                  )}

                  {/* Option B: Email & Password Login */}
                  {authMethod === 'email' && (
                    <form onSubmit={handleEmailPasswordSubmit} className="space-y-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          placeholder="user@example.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white dir-ltr text-right focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">كلمة السر</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {authError && (
                        <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-[11px]">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingAuth}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                      >
                        {isSubmittingAuth ? 'جاري التحقق...' : 'تسجيل الدخول بالحساب'}
                      </button>

                      <div className="relative flex items-center justify-center text-slate-500 my-2">
                        <div className="w-full h-px bg-slate-800"></div>
                        <span className="bg-slate-900 px-3 absolute text-[10px]">أو الدخول بـ Google</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2"
                      >
                        <span className="font-black text-blue-400">G</span>
                        <span>المتابعة باستخدام Google</span>
                      </button>
                    </form>
                  )}

                </div>
              )}

              {/* Mode 2: REGISTER (إنشاء حساب جديد) */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/80">
                  <div className="text-center pb-1">
                    <h4 className="font-bold text-white text-sm">إنشاء حساب مسافر جديد</h4>
                    <p className="text-[11px] text-slate-400">أدخل بياناتك لتسجيل حساب رسمي في منصة سفر الموريتانية</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: المختار ولد أحمد"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+222 4525 1010"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        placeholder="name@example.mr"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white dir-ltr text-right focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">كلمة السر *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">تأكيد كلمة السر *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-[11px]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
                  >
                    إنشاء الحساب والتفعيل الفوري
                  </button>
                </form>
              )}

            </div>
          ) : (
            <>
              {/* Profile Top Bar */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-white">{user.name}</h3>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-[10px] text-emerald-400 font-bold rounded-md">
                        {user.role === 'super_admin' ? 'مشرف عام (Super Admin)' : user.role === 'company_admin' ? 'شركة نقل معتمدة' : user.role === 'independent_driver' ? 'ناقل مستقل' : 'مسافر معتمد'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{user.phone} • {user.email || 'حساب مفعل'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={onLogout}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    title="حذف الحساب بشكل نهائي من القاعدة"
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف الحساب</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'bookings' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>حجوزاتي ({bookings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('partner_apply')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'partner_apply' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>طلب الانضمام كشركة أو ناقل مستقل</span>
                </button>

                <button
                  onClick={() => setActiveTab('complaints')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'complaints' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>تقديم بلاغ أو شكوى</span>
                </button>
              </div>

              {/* TAB 1: Bookings List */}
              {activeTab === 'bookings' && (
                <div className="space-y-3">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Ticket className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm font-bold">لا توجد حجوزات سابقة حتى الآن</p>
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div key={b.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-3 text-xs">
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

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
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
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all"
                            >
                              إلغاء الحجز
                            </button>
                          )}

                          <button
                            onClick={() => onViewBookingTicket(b)}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center gap-1"
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

              {/* TAB 2: Apply to become a Transport Company or Independent Driver */}
              {activeTab === 'partner_apply' && (
                <div className="space-y-6 text-xs">
                  
                  {/* Status Banner for Previous Requests */}
                  {userApps.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-200">حالة طلباتك السابقة للانضمام:</h4>
                      {userApps.map(app => (
                        <div key={app.id} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {app.type === 'company' ? `طلب شركة: ${app.companyName}` : `طلب ناقل مستقل: ${app.driverName} (${app.vehicleModel})`}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              app.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {app.status === 'approved' ? 'مقبول ومعتمد ✓' : app.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة لدى لوحة الإدارة ⏳'}
                            </span>
                          </div>

                          {app.adminNotes && (
                            <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
                              <span className="text-purple-400 font-bold block text-[10px]">ملاحظة المشرف والإدارة:</span>
                              <p className="mt-0.5">{app.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Application Form */}
                  <form onSubmit={handlePartnerSubmit} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-4">
                    <div className="border-b border-slate-700/80 pb-3">
                      <h3 className="font-extrabold text-sm text-white">تقديم طلب انضمام جديد (شركة نقل أو مستقل)</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        قم بتعبئة المعلومات الصحيحة ليتسنى لمشرفي النظام مراجعة طلبك واعتماد حسابك للبدء بنشر رحلاتك.
                      </p>
                    </div>

                    {appSubmittedMsg && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{appSubmittedMsg}</span>
                      </div>
                    )}

                    {/* Partner Type Selection */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-2">نوع الانضمام *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAppType('company')}
                          className={`p-3 rounded-2xl font-bold border transition-all flex items-center justify-center gap-2 ${
                            appType === 'company'
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                          <span>شركة نقل بري أو مكتب رحلات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAppType('independent_driver')}
                          className={`p-3 rounded-2xl font-bold border transition-all flex items-center justify-center gap-2 ${
                            appType === 'independent_driver'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          <Car className="w-4 h-4" />
                          <span>ناقل مستقل (شخص مع سيارة)</span>
                        </button>
                      </div>
                    </div>

                    {/* Company Dynamic Fields */}
                    {appType === 'company' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">اسم الشركة *</label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: شركة المسافر للنقل"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">اسم المسؤول *</label>
                          <input
                            type="text"
                            required
                            placeholder="اسم المدير المسؤول"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Independent Driver Dynamic Fields */}
                    {appType === 'independent_driver' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">اسم السائق الناقل *</label>
                          <input
                            type="text"
                            required
                            placeholder="اسمك الكامل"
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">موديل ونوع السيارة *</label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: تويوتا لاندكروزر V8 2023"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">رقم لوحة السيارة *</label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: 4590 AA 00"
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">رقم رخصة القيادة / الهوية *</label>
                          <input
                            type="text"
                            required
                            placeholder="رقم الرخصة أو بطاقة التعريف"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Shared Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+222 4525 1010"
                          value={appPhone}
                          onChange={(e) => setAppPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني</label>
                        <input
                          type="email"
                          placeholder="company@safar.mr"
                          value={appEmail}
                          onChange={(e) => setAppEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">السجل التجاري أو الترخيص الرسمية (إن وجد)</label>
                      <input
                        type="text"
                        placeholder="أدخل رقم السجل التجاري أو اسم الترخيص أو ملاحظات التوثيق"
                        value={commercialDoc}
                        onChange={(e) => setCommercialDoc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">ملاحظات إضافية للمشرف</label>
                      <textarea
                        rows={2}
                        placeholder="خطوط السير المعتادة، تفاصيل الأسطول أو أي معلومات أخرى..."
                        value={appNotes}
                        onChange={(e) => setAppNotes(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      إرسال الطلب إلى لوحة التحكم والإدارة
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: File a Complaint */}
              {activeTab === 'complaints' && (
                <div className="space-y-6 text-xs">
                  {complaintSuccessMsg && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{complaintSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleComplaintSubmit} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl space-y-4">
                    <h3 className="font-extrabold text-sm text-white border-b border-slate-700 pb-2">تقديم بلاغ أو شكوى جديدة</h3>
                    
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">نوع البلاغ *</label>
                      <select
                        value={complaintType}
                        onChange={(e: any) => setComplaintType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                      >
                        <option value="delay">تأخير في وقت الانطلاق</option>
                        <option value="driver_behavior">سلوك أو معاملة غير لائقة</option>
                        <option value="vehicle_condition">مشكلة في تكييف أو حالة الحافلة/السيارة</option>
                        <option value="payment_issue">مشكلة في اقتطاع المبلغ أو الاسترداد</option>
                        <option value="other">بلاغ عام آخر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">اسم الشركة أو الناقل (إن وجد)</label>
                      <input
                        type="text"
                        placeholder="مثال: سونيف للنقل"
                        value={complaintCompany}
                        onChange={(e) => setComplaintCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">تفاصيل الشكوى أو البلاغ *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="اشرح ما حدث بدقة ليتسنى لفريق المتابعة اتخاذ الإجراء المناسب..."
                        value={complaintDesc}
                        onChange={(e) => setComplaintDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال البلاغ للإدارة</span>
                    </button>
                  </form>
                </div>
              )}

            </>
          )}

        </div>

      </div>
    </div>
  );
};
