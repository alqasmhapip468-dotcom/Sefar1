import { City, Company, Vehicle, Driver, Trip, Seat, Coupon, Review, AdminSettings, Booking, VehicleType, PartnerApplication, ComplaintReport } from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'nkc',
    nameAr: 'نواكشوط',
    nameFr: 'Nouakchott',
    regionAr: 'العاصمة',
    code: 'NKC',
    popular: true
  },
  {
    id: 'ndb',
    nameAr: 'نواذيبو',
    nameFr: 'Nouadhibou',
    regionAr: 'داخلت نواذيبو',
    code: 'NDB',
    popular: true
  },
  {
    id: 'kfa',
    nameAr: 'كيفه',
    nameFr: 'Kiffa',
    regionAr: 'لعصابه',
    code: 'KFA',
    popular: true
  },
  {
    id: 'rso',
    nameAr: 'روصو',
    nameFr: 'Rosso',
    regionAr: 'ترارزة',
    code: 'RSO',
    popular: true
  },
  {
    id: 'atr',
    nameAr: 'أطار',
    nameFr: 'Atar',
    regionAr: 'آدرار',
    code: 'ATR',
    popular: true
  },
  {
    id: 'ayn',
    nameAr: 'لعيون',
    nameFr: 'Aioun',
    regionAr: 'الحوض الغربي',
    code: 'AYN',
    popular: true
  },
  {
    id: 'kdi',
    nameAr: 'كيهيدي',
    nameFr: 'Kaédi',
    regionAr: 'كوركول',
    code: 'KDI',
    popular: false
  },
  {
    id: 'zrt',
    nameAr: 'الزويرات',
    nameFr: 'Zouérat',
    regionAr: 'تيرس زمور',
    code: 'ZRT',
    popular: false
  },
  {
    id: 'akj',
    nameAr: 'أكجوجت',
    nameFr: 'Akjoujt',
    regionAr: 'إينشيري',
    code: 'AKJ',
    popular: false
  },
  {
    id: 'tjk',
    nameAr: 'تجكجة',
    nameFr: 'Tidjikja',
    regionAr: 'تكانت',
    code: 'TJK',
    popular: false
  },
  {
    id: 'slb',
    nameAr: 'سيلبابي',
    nameFr: 'Sélibaby',
    regionAr: 'كيدي ماغه',
    code: 'SLB',
    popular: false
  },
  {
    id: 'nma',
    nameAr: 'نعمة',
    nameFr: 'Néma',
    regionAr: 'الحوض الشرقي',
    code: 'NMA',
    popular: false
  }
];

export const INITIAL_COMPANIES: Company[] = [];

export const INITIAL_VEHICLES: Vehicle[] = [];

export const INITIAL_DRIVERS: Driver[] = [];

export function generateSeatsForVehicle(type: VehicleType, totalSeats: number): Seat[] {
  const seats: Seat[] = [];
  for (let i = 1; i <= totalSeats; i++) {
    const seatType = (i % 2 === 1) ? 'window' : 'aisle';
    seats.push({
      id: `S${i}`,
      number: `${i}`,
      status: 'available',
      type: seatType,
      genderRestriction: i <= 4 ? 'female' : 'any'
    });
  }
  return seats;
}

export const INITIAL_TRIPS: Trip[] = [];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'SAFAR2026',
    type: 'percentage',
    value: 10, // 10%
    maxDiscountMRU: 100,
    minBookingMRU: 300,
    usedCount: 0,
    maxUses: 500,
    active: true,
    expiryDate: '2026-12-31'
  }
];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  defaultCommissionType: 'fixed',
  defaultCommissionValue: 30, // 30 MRU per ticket
  platformPhone: '+222 2779 8492',
  platformEmail: '',
  whatsappSupportNumber: '+222 2779 8492',
  enableSmsNotifications: true
};

export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [];

export const INITIAL_COMPLAINTS: ComplaintReport[] = [];

export const FAQS = [
  {
    q: 'كيف يمكنني حجز تذكرة رحلة عبر Safar MR؟',
    a: 'اختر مدينة الانطلاق والوصول وتاريخ السفر، اضغط على بحث، قارن بين شركات النقل المتاحة، اختر مقعدك المفضل من مخطط المقاعد، وأدخل بياناتك وسدد بطريقة الدفع المناسبة لك (بنكيلي، مصرفي، السداد، أو الدفع عند الصعود).'
  },
  {
    q: 'ما هي وسائل الدفع المدعومة على المنصة؟',
    a: 'ندعم الدفع الإلكتروني عبر التطبيقات الموريتانية الرسمية: بنكيلي (Bankily)، السداد (Sedad)، مصرفي (Masrifi)، إضافة إلى خيار الدفع نقداً عند الصعود للحافلة.'
  },
  {
    q: 'هل أحصل على تذكرة إلكترونية؟',
    a: 'نعم، فور تأكيد الحجز تحصل على تذكرة إلكترونية تحتوي على رمز QR ملائم للعرض على هاتفك أو التحميل بصيغة PDF لاستخدامها في محطة الركوب.'
  },
  {
    q: 'كيف يمكنني إلغاء الحجز أو تعديله؟',
    a: 'يمكنك الدخول إلى قسم "حجوزاتي" من القائمة العلوية والضغط على "إلغاء الحجز" وفق سياسة الإلغاء الخاصة بالشركة الناقلة.'
  },
  {
    q: 'هل تدعم المنصة التقديم لشركات النقل؟',
    a: 'نعم، يمكن لجميع شركات ومكاتب النقل المعتمدة في موريتانيا إنشاء حساب شركة وإدارة رحلاتها وأسطولها وحجوزاتها بسهولة.'
  }
];
