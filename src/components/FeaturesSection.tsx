import React from 'react';
import { Clock, Tag, Scale, QrCode, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const FEATURES = [
    {
      icon: Clock,
      title: 'حجز خلال دقيقة',
      description: 'واجهة بسيطة تتيح لك اختيار وجهتك ومقعدك وتسديد التذكرة في أقل من 60 ثانية بدون انتظار.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: Tag,
      title: 'أفضل الأسعار التنافسية',
      description: 'نضمن لك الحصول على أسعار الرحلات المعتمدة مباشرة من شركات النقل الموريتانية بدون أي تكاليف خفية.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Scale,
      title: 'مقارنة بين شركات النقل',
      description: 'استعرض قارن المواعيد، الأسعار، أنواع الحافلات وسيارات V8 ووسائل الراحة المتاحة في رحلة واحدة.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: QrCode,
      title: 'تذاكر إلكترونية ورمز QR',
      description: 'احصل على تذكرتك فورياً على هاتفك مع امكانية حفظها بـ PDF ورمز QR للتحقق السريع في المحطة.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: Headphones,
      title: 'دعم العملاء على مدار الساعة',
      description: 'فريق دعم فني متواجد عبر المباشر والواتساب لمساعدتك والإجابة على أي استفسار تخص رحلتك.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      
      {/* Decorative Light Rays */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>لماذا تختار سفر موريتانيا؟</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">مميزات منصة Safar MR</h2>
          <p className="text-sm text-slate-300">
            صُممت المنصة لتوفير تجربة سفر برية راقية وموثوقة لجميع المواطنين والمقيمين في موريتانيا.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-5 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ميزة معتمدة</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
