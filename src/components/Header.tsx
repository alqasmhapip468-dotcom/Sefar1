import React, { useState } from 'react';
import { Bus, Moon, Sun, User, Ticket, Building2, ShieldCheck, Sparkles, HelpCircle, Globe, Languages } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'ar' | 'fr';
  onToggleLanguage: () => void;
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
  language,
  onToggleLanguage,
  onOpenMyBookings,
  onOpenAuth,
  onOpenAiAssistant,
  onOpenFaq,
  activeBookingsCount
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onRoleChange('passenger')}>
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20 transform transition-transform hover:scale-105">
              <Bus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-sans">
                  Safar <span className="text-emerald-500 dark:text-emerald-400">MR</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/30">
                  {isAr ? 'سفر موريتانيا' : 'Voyage MR'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'حجز رحلات السفر البرية والحافلات' : 'Réservation de voyages et bus en Mauritanie'}
              </p>
            </div>
          </div>

          {/* Contextual Navigation Bar */}
          <div className="hidden md:flex items-center gap-2">
            {currentRole === 'super_admin' && (
              <button
                onClick={() => onRoleChange('super_admin')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/20 border border-purple-400/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'لوحة التحكم الرئيسية للمشرف العام' : 'Panneau Super Admin'}</span>
              </button>
            )}

            {(currentRole === 'company_admin' || currentRole === 'independent_driver') && (
              <button
                onClick={() => onRoleChange(currentRole)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 border border-blue-400/30"
              >
                <Building2 className="w-4 h-4" />
                <span>{isAr ? 'لوحة تحكم الشركة / الناقل' : 'Espace Transporteur'}</span>
              </button>
            )}

            {currentRole === 'passenger' && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all hover:scale-105"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? 'الانضمام كشركة نقل أو ناقل مستقل ✦' : 'Rejoindre comme شريك ✦'}</span>
              </button>
            )}
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher (AR / FR) */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-500/30 transition-all shadow-sm"
              title={isAr ? 'Changer en Français' : 'التحويل إلى العربية'}
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-black font-mono tracking-wider">{isAr ? 'FR' : 'عربي'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-800"
              title={darkMode ? (isAr ? 'الوضع النهاري' : 'Mode Jour') : (isAr ? 'الوضع الليلي' : 'Mode Nuit')}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* AI Assistant Drawer Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"
              title={isAr ? 'مساعد سفر ذكي' : 'Assistant IA'}
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>{isAr ? 'مساعد ذكي' : 'Assistant IA'}</span>
            </button>

            {/* My Bookings Quick Access */}
            <button
              onClick={onOpenMyBookings}
              className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-800"
              title={isAr ? 'حجوزاتي' : 'Mes Réservations'}
            >
              <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* FAQs / Help */}
            <button
              onClick={onOpenFaq}
              className="hidden md:flex items-center gap-1 p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-800"
              title={isAr ? 'الأسئلة الشائعة والدعم' : 'FAQ & Aide'}
            >
              <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>

            {/* Account / Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl border border-slate-800 dark:border-slate-700/80 transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isAr ? 'الحساب' : 'Compte'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Quick Action Sub-bar */}
        <div className="flex md:hidden items-center justify-around pb-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => onRoleChange('passenger')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${currentRole === 'passenger' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرئيسية والرحلات' : 'Voyages'}</span>
          </button>
          
          <button
            onClick={onOpenMyBookings}
            className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'تذاكري' : 'Mes Billets'}</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? 'الانضمام كشريك' : 'Devenir Partenaire'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
