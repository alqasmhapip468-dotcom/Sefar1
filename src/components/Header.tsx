import React, { useState } from 'react';
import { Bus, Moon, Sun, User, Ticket, Building2, ShieldCheck, Sparkles, HelpCircle, PhoneCall } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMyBookings: () => void;
  onOpenAuth: () => void;
  onOpenAiAssistant: () => void;
  onOpenFaq: () => void;
  activeBookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onOpenMyBookings,
  onOpenAuth,
  onOpenAiAssistant,
  onOpenFaq,
  activeBookingsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onRoleChange('passenger')}>
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20 transform transition-transform hover:scale-105">
              <Bus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                  Safar <span className="text-emerald-400">MR</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  سفر موريتانيا
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">حجز رحلات السفر البرية والحافلات</p>
            </div>
          </div>

          {/* Mode Selector (Role Switcher Tabs for Easy Testing & Multi-user Context) */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onRoleChange('passenger')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'passenger'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>الركاب المسافرون</span>
            </button>

            <button
              onClick={() => onRoleChange('company_admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'company_admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>لوحة شركة النقل</span>
            </button>

            <button
              onClick={() => onRoleChange('super_admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'super_admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>إدارة النظام Admin</span>
            </button>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Assistant Drawer Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"
              title="مساعد سفر ذكي"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">مساعد سفر الذكي</span>
            </button>

            {/* My Bookings Quick Access */}
            <button
              onClick={onOpenMyBookings}
              className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
              title="حجوزاتي"
            >
              <Ticket className="w-5 h-5 text-emerald-400" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
            </button>

            {/* FAQs / Help */}
            <button
              onClick={onOpenFaq}
              className="hidden sm:flex items-center gap-1 p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
              title="الأسئلة الشائعة والدعم"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
            </button>

            {/* Account / Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700/80 transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">الحساب</span>
            </button>
          </div>

        </div>

        {/* Mobile Role Switcher Sub-bar */}
        <div className="flex md:hidden items-center justify-around pb-3 pt-1 border-t border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => onRoleChange('passenger')}
            className={`px-3 py-1 rounded-lg ${currentRole === 'passenger' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            الركاب
          </button>
          <button
            onClick={() => onRoleChange('company_admin')}
            className={`px-3 py-1 rounded-lg ${currentRole === 'company_admin' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
          >
            شركة النقل
          </button>
          <button
            onClick={() => onRoleChange('super_admin')}
            className={`px-3 py-1 rounded-lg ${currentRole === 'super_admin' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
          >
            إدارة Admin
          </button>
        </div>

      </div>
    </header>
  );
};
