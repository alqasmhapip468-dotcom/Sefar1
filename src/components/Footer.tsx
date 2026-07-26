import React from 'react';
import { Bus, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenFaq: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFaq }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                <Bus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Safar <span className="text-emerald-400">MR</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              منصة سفر موريتانيا الرقمية الرائدة لحجز وتأكيد رحلات الحافلات والسيارات بين جميع الولايات والمقاطعات الموريتانية بكل أمان وسهولة.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>منصة مرخصة ومحميّة بالكامل في موريتانيا</span>
            </div>
          </div>

          {/* Col 2: Popular Routes */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span>أشهر خطوط النقل البري</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">نواكشوط ⇆ نواذيبو (حافلات وسيارة V8)</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">نواكشوط ⇆ كيفه (طريق الأمل)</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">نواكشوط ⇆ روصو (طريق جنوب)</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">نواذيبو ⇆ أطار (المنطقة الشمالية)</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">كيفه ⇆ لعيون ⇆ نعمة</li>
            </ul>
          </div>

          {/* Col 3: Payment Methods & Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">طرق الدفع المحلية</h3>
            <p className="text-xs text-slate-400 mb-3">
              يمكنك الدفع بسهولة وأمان عبر وسائل الدفع الإلكترونية في موريتانيا:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
              <div className="bg-slate-800 border border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>بنكيلي (Bankily)</span>
              </div>
              <div className="bg-slate-800 border border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>السداد (Sedad)</span>
              </div>
              <div className="bg-slate-800 border border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>مصرفي (Masrifi)</span>
              </div>
              <div className="bg-slate-800 border border-slate-700/60 p-2 rounded-lg text-center flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>الدفع عند الصعود</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base mb-4">التواصل والدعم الفني</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>نواكشوط، تفرغ زينه - قرب كارفور مدريد</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span dir="ltr">+222 4525 0000 / +222 2200 1122</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>contact@safar.mr</span>
            </div>
            <button
              onClick={onOpenFaq}
              className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              الأسئلة الشائعة وسياسة الحجز
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Safar MR (سفر موريتانيا). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنع بـ</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>لخدمة المسافرين في موريتانيا</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
