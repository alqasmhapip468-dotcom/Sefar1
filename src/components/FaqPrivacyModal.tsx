import React, { useState } from 'react';
import { X, HelpCircle, Shield, Smartphone, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { FAQS } from '../data/mockData';

interface FaqPrivacyModalProps {
  onClose: () => void;
}

export const FaqPrivacyModal: React.FC<FaqPrivacyModalProps> = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white my-auto overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">الأسئلة الشائعة وسياسة المنصة</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* PWA Mobile App Banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">استخدم الموقع كتطبيق هاتف (PWA)</h3>
              <p className="text-slate-400">
                يمكنك إضافة المنصة مباشرة لشاشة هاتفك الرئيسية عبر خيار "إضافة للشاشة الرئيسية" من متصفحك للحصول على تجربة تطبيق سريعة بدون تحميل.
              </p>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm mb-3">الأسئلة الأكثر تداولاً:</h3>
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-right font-bold text-white flex items-center justify-between hover:bg-slate-800 transition-all"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-slate-300 border-t border-slate-700/40 leading-relaxed bg-slate-900/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy & Terms */}
          <div className="pt-4 border-t border-slate-800 text-slate-400 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>سياسة الخصوصية والشروط:</span>
            </h4>
            <p>
              تلتزم منصة Safar MR بحماية جميع البيانات الشخصية للمسافرين وتشفير بيانات الاتصال ووسائل الدفع الإلكترونية وفق أفضل المعايير الأمنية.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
