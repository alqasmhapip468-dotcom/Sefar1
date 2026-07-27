import React from 'react';
import { Clock, Tag, Scale, QrCode, Headphones, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export const FeaturesSection: React.FC = () => {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  const FEATURES = [
    {
      icon: Clock,
      title: isAr ? 'حجز خلال دقيقة' : 'Réservation en 1 min',
      description: isAr 
        ? 'واجهة بسيطة تتيح لك اختيار وجهتك ومقعدك وتسديد التذكرة في أقل من 60 ثانية بدون انتظار.'
        : 'Sélectionnez votre destination, votre siège et payez votre billet en moins de 60 secondes.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: Tag,
      title: isAr ? 'أفضل الأسعار التنافسية' : 'Meilleurs prix',
      description: isAr 
        ? 'نضمن لك الحصول على أسعار الرحلات المعتمدة مباشرة من شركات النقل الموريتانية بدون أي تكاليف خفية.'
        : 'Prix officiels garantis directement auprès des compagnies mauritaniennes.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Scale,
      title: isAr ? 'مقارنة بين شركات النقل' : 'Comparer les compagnies',
      description: isAr 
        ? 'قارن المواعيد، الأسعار، أنواع الحافلات وسيارات V8 ووسائل الراحة المتاحة في رحلة واحدة.'
        : 'Comparez les horaires, tarifs, bus VIP et V8 disponibles.',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: QrCode,
      title: isAr ? 'تذاكر إلكترونية ورمز QR' : 'Billets QR Code',
      description: isAr 
        ? 'احصل على تذكرتك فورياً على هاتفك مع امكانية حفظها بـ PDF ورمز QR للتحقق السريع في المحطة.'
        : 'Recevez immédiatement votre billet électronique sur mobile avec QR code.',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: Headphones,
      title: isAr ? 'دعم العملاء على مدار الساعة' : 'Support Client 24/7',
      description: isAr 
        ? 'فريق دعم فني متواجد عبر المباشر والواتساب لمساعدتك والإجابة على أي استفسار تخص رحلتك.'
        : 'Assistance client disponible 24/7 par chat et WhatsApp.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('featuresTitle')}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? "مميزات منصة Safar MR" : "Fonctionnalités de Safar MR"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isAr 
              ? "صُممت المنصة لتوفير تجربة سفر برية راقية وموثوقة لجميع المواطنين والمقيمين في موريتانيا."
              : "Conçue pour offrir une expérience de voyage terrestre moderne et fiable en Mauritanie."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-5 transition-all duration-300 shadow-sm flex flex-col justify-between text-start"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/40 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? "ميزة معتمدة" : "Service Vérifié"}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

