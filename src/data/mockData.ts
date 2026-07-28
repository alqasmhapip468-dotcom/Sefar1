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

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'شركة المسافر الذهبي',
    nameAr: 'شركة المسافر الذهبي للنقل',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalReviews: 124,
    phone: '+222 4525 0001',
    email: 'info@mousafir-gold.mr',
    verified: true,
    commissionType: 'fixed',
    commissionValue: 30,
    vehiclesCount: 12,
    activeTripsCount: 8
  },
  {
    id: 'comp-2',
    name: 'الساحل للنقل البري',
    nameAr: 'الساحل للنقل البري والمستعجل',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    totalReviews: 89,
    phone: '+222 4525 0002',
    email: 'contact@sahel-transport.mr',
    verified: true,
    commissionType: 'percentage',
    commissionValue: 5,
    vehiclesCount: 8,
    activeTripsCount: 5
  },
  {
    id: 'comp-3',
    name: 'شركة نصر للنقل',
    nameAr: 'شركة نصر للنقل والخدمات',
    logo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    totalReviews: 62,
    phone: '+222 4525 0003',
    email: 'nasr@transport.mr',
    verified: true,
    commissionType: 'fixed',
    commissionValue: 30,
    vehiclesCount: 6,
    activeTripsCount: 4
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    companyId: 'comp-1',
    plateNumber: '4821 AA 00',
    model: 'Mercedes Travego 2023',
    type: 'bus_vip',
    typeAr: 'حافلة فاخرة VIP',
    capacity: 45,
    features: ['wifi', 'ac', 'charger', 'wc', 'water'],
    featuresAr: ['واي فاي مجاني', 'تكييف مركزي', 'شواحن هاتف', 'دورات مياه', 'مياه معدنية'],
    status: 'active'
  },
  {
    id: 'v-2',
    companyId: 'comp-2',
    plateNumber: '9102 AB 00',
    model: 'Toyota Land Cruiser Prado 2024',
    type: 'car_7seats',
    typeAr: 'سيارة 7 مقاعد VIP',
    capacity: 7,
    features: ['ac', 'charger', 'water'],
    featuresAr: ['تكييف فاخر', 'شواحن سريعة', 'مياه مثلجة'],
    status: 'active'
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'd-1',
    companyId: 'comp-1',
    name: 'سيدي ولد المختار',
    phone: '+222 3612 8899',
    licenseNumber: 'MR-LICENSE-9920',
    rating: 4.9,
    status: 'active'
  },
  {
    id: 'd-2',
    companyId: 'comp-2',
    name: 'محمد ولد عالي',
    phone: '+222 2210 5544',
    licenseNumber: 'MR-LICENSE-8812',
    rating: 4.7,
    status: 'active'
  }
];

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

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-101',
    companyId: 'comp-1',
    companyNameAr: 'شركة المسافر الذهبي للنقل',
    companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'ndb',
    destinationCityNameAr: 'نواذيبو',
    departureStationAr: 'محطة لكصر - قرب ملتقى الطرق',
    arrivalStationAr: 'محطة نواذيبو المركزية - الحي الإداري',
    departureTime: '08:00',
    arrivalTime: '13:30',
    departureDate: new Date().toISOString().split('T')[0],
    priceMRU: 800,
    vehicleType: 'bus_vip',
    vehicleTypeAr: 'حافلة فاخرة VIP',
    totalSeats: 45,
    availableSeatsCount: 38,
    seats: generateSeatsForVehicle('bus_vip', 45),
    featuresAr: ['واي فاي مجاني', 'تكييف ممتاز', 'شواحن هواتف', 'مقاعد جلدية مريحة'],
    cancellationPolicyAr: 'إلغاء مجاني حتى 6 ساعات قبل موعد الانطلاق',
    status: 'scheduled'
  },
  {
    id: 'trip-102',
    companyId: 'comp-2',
    companyNameAr: 'الساحل للنقل البري والمستعجل',
    companyLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150&auto=format&fit=crop&q=80',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'kfa',
    destinationCityNameAr: 'كيفه',
    departureStationAr: 'محطة عرفات - طريق الأمل',
    arrivalStationAr: 'محطة كيفه الرئيسية - كراج المدينة',
    departureTime: '07:30',
    arrivalTime: '15:00',
    departureDate: new Date().toISOString().split('T')[0],
    priceMRU: 700,
    vehicleType: 'car_7seats',
    vehicleTypeAr: 'سيارة 7 مقاعد VIP',
    totalSeats: 7,
    availableSeatsCount: 5,
    seats: generateSeatsForVehicle('car_7seats', 7),
    featuresAr: ['تكييف ممتازة', 'انطلاق سريع بدون توقفات كثيرة', 'خدمة الأمتعة مجاناً'],
    cancellationPolicyAr: 'إلغاء مجاني قبل 12 ساعة من الانطلاق',
    status: 'scheduled'
  },
  {
    id: 'trip-103',
    companyId: 'comp-3',
    companyNameAr: 'شركة نصر للنقل والخدمات',
    companyLogo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'rso',
    destinationCityNameAr: 'روصو',
    departureStationAr: 'محطة الميناء - طريق روصو',
    arrivalStationAr: 'محطة روصو المركزية - قرب المعبر',
    departureTime: '09:00',
    arrivalTime: '12:00',
    departureDate: new Date().toISOString().split('T')[0],
    priceMRU: 400,
    vehicleType: 'bus_standard',
    vehicleTypeAr: 'حافلة سفر معيارية',
    totalSeats: 30,
    availableSeatsCount: 22,
    seats: generateSeatsForVehicle('bus_standard', 30),
    featuresAr: ['تكييف هوائي', 'مساحة أمتعة واسعة'],
    cancellationPolicyAr: 'تعديل مجاني قبل السفر',
    status: 'scheduled'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'SAFAR2026',
    type: 'percentage',
    value: 10,
    maxDiscountMRU: 100,
    minBookingMRU: 300,
    usedCount: 5,
    maxUses: 500,
    active: true,
    expiryDate: '2026-12-31'
  }
];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-98214',
    bookingCode: 'SFR-98214',
    userId: 'usr-default',
    tripId: 'trip-101',
    tripDetails: {
      originAr: 'نواكشوط',
      destinationAr: 'نواذيبو',
      companyName: 'شركة المسافر الذهبي للنقل',
      companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '08:00',
      arrivalTime: '13:30',
      vehicleType: 'bus_vip',
      vehicleModel: 'Mercedes Travego 2023'
    },
    passengerName: 'المختار ولد أحمد',
    passengerPhone: '+222 2779 8492',
    passengerEmail: 'mokhtar@safar.mr',
    seats: ['S3', 'S4'],
    totalPriceMRU: 1600,
    discountMRU: 0,
    commissionMRU: 60,
    netCompanyMRU: 1540,
    paymentMethod: 'bankily',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    qrData: 'SAFAR-TICKET-BK-98214-NKC-NDB',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  defaultCommissionType: 'fixed',
  defaultCommissionValue: 30,
  platformPhone: '+222 2779 8492',
  platformEmail: 'admin@safar.mr',
  whatsappSupportNumber: '+222 2779 8492',
  enableSmsNotifications: true
};

export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [
  {
    id: 'app-101',
    type: 'company',
    typeAr: 'شركة نقل رسمية',
    companyName: 'المحيط للنقل السريع',
    contactPerson: 'الحسن ولد الشيخ',
    phone: '+222 4525 1100',
    email: 'contact@ocean-trans.mr',
    city: 'نواكشوط',
    fleetCount: '15 حافلة وسيارات',
    routes: 'نواكشوط - نواذيبو - الزويرات',
    commercialRegister: 'RC-NKC-2024-B8821',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'app-102',
    type: 'independent_driver',
    typeAr: 'ناقل مستقل (سيارة خاصة)',
    driverName: 'السالك ولد محمد',
    phone: '+222 3611 2233',
    email: 'salek@safar.mr',
    city: 'كيفه',
    fleetCount: 'تويوتا لاندكروزر 2022',
    routes: 'كيفه - نواكشوط',
    commercialRegister: 'رخصة سياقة رقم 44091',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const INITIAL_COMPLAINTS: ComplaintReport[] = [
  {
    id: 'cmp-101',
    reporterName: 'سيد أحمد ولد سيدي',
    reporterPhone: '+222 2200 4455',
    companyName: 'الساحل للنقل البري',
    type: 'delay',
    typeAr: 'تأخير انطلاق الرحلة',
    description: 'تأخرت الحافلة عن موعد الانطلاق المحدد بأكثر من ساعة دون إشعار مسبق للركاب.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

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
