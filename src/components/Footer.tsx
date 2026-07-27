import React from 'react';
import { Bus, Phone, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface FooterProps {
  onOpenFaq: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFaq }) => {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 mt-16 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-start">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                <Bus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Safar <span className="text-emerald-600 dark:text-emerald-400">MR</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr 
                ? "منصة سفر موريتانيا الرقمية الرائدة لحجز وتأكيد رحلات الحافلات والسيارات بين جميع الولايات والمقاطعات الموريتانية بكل أمان وسهولة."
                : "Plateforme numérique de réservation de voyages interurbains en Mauritanie."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? "منصة مرخصة ومحميّة بالكامل في موريتانيا" : "Plateforme sécurisée et agréée"}</span>
            </div>
          </div>

          {/* Col 2: Popular Routes */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4 flex items-center gap-2">
              <span>{isAr ? "أشهر خطوط النقل البري" : "Lignes populaires"}</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Nouakchott ⇆ Nouadhibou</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Nouakchott ⇆ Kiffa</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Nouakchott ⇆ Rosso</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Nouadhibou ⇆ Atar</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Kiffa ⇆ Aioun ⇆ Néma</li>
            </ul>
          </div>

          {/* Col 3: Payment Methods & Info */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">{isAr ? "طرق الدفع المحلية" : "Paiements locaux"}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {isAr ? "يمكنك الدفع بسهولة وأمان عبر وسائل الدفع الإلكترونية في موريتانيا:" : "Moyens de paiement acceptés en Mauritanie :"}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Bankily</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Sedad</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Masrifi</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Paiement à bord</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">{isAr ? "التواصل والدعم الفني" : "Contact & Support"}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span dir="ltr">+222 2779 8492</span>
            </div>
            <button
              onClick={onOpenFaq}
              className="mt-2 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            >
              {isAr ? "الأسئلة الشائعة وسياسة الحجز" : "FAQ & Conditions de Réservation"}
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Safar MR ({isAr ? "سفر موريتانيا" : "Voyage MR"}). {isAr ? "جميع الحقوق محفوظة." : "Tous droits réservés."}</p>
        </div>
      </div>
    </footer>
  );
};

