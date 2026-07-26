import { City, Company, Vehicle, Driver, Trip, Seat, Coupon, Review, AdminSettings, Booking, VehicleType } from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'nkc',
    nameAr: 'نواكشوط',
    nameFr: 'Nouakchott',
    regionAr: 'العاصمة',
    code: 'NKC',
    popular: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ndb',
    nameAr: 'نواذيبو',
    nameFr: 'Nouadhibou',
    regionAr: 'داخلت نواذيبو',
    code: 'NDB',
    popular: true,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'kfa',
    nameAr: 'كيفه',
    nameFr: 'Kiffa',
    regionAr: 'لعصابه',
    code: 'KFA',
    popular: true,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'rso',
    nameAr: 'روصو',
    nameFr: 'Rosso',
    regionAr: 'ترارزة',
    code: 'RSO',
    popular: true,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'atr',
    nameAr: 'أطار',
    nameFr: 'Atar',
    regionAr: 'آدرار',
    code: 'ATR',
    popular: true,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ayn',
    nameAr: 'لعيون',
    nameFr: 'Aioun',
    regionAr: 'الحوض الغربي',
    code: 'AYN',
    popular: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
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
    id: 'sonef',
    name: 'سونيف للنقل',
    nameAr: 'شركة سونيف للنقل البري',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalReviews: 342,
    phone: '+222 4525 1010',
    email: 'contact@sonef-transport.mr',
    verified: true,
    commissionType: 'fixed',
    commissionValue: 30, // 30 MRU
    vehiclesCount: 18,
    activeTripsCount: 12
  },
  {
    id: 'moussafir',
    name: 'المسافر للنقل',
    nameAr: 'شركة المسافر رحلات ومقاعد',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    totalReviews: 215,
    phone: '+222 4529 8877',
    email: 'info@moussafir.mr',
    verified: true,
    commissionType: 'percentage',
    commissionValue: 6, // 6%
    vehiclesCount: 12,
    activeTripsCount: 8
  },
  {
    id: 'massar',
    name: 'المسار رحلات',
    nameAr: 'المسار للنقل السريع',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    totalReviews: 189,
    phone: '+222 3636 5500',
    email: 'booking@almassar.mr',
    verified: true,
    commissionType: 'fixed',
    commissionValue: 25,
    vehiclesCount: 9,
    activeTripsCount: 6
  },
  {
    id: 'mauritrans',
    name: 'موري ترانس',
    nameAr: 'شركة موري ترانس للخدمات',
    logo: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=150&auto=format&fit=crop&q=80',
    rating: 4.5,
    totalReviews: 120,
    phone: '+222 2211 4433',
    email: 'service@mauritrans.mr',
    verified: true,
    commissionType: 'fixed',
    commissionValue: 30,
    vehiclesCount: 7,
    activeTripsCount: 5
  },
  {
    id: 'zemzem',
    name: 'زمزم إكسبرس',
    nameAr: 'زمزم للنقل بين المدن',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    rating: 4.4,
    totalReviews: 98,
    phone: '+222 4677 8899',
    email: 'support@zemzem.mr',
    verified: true,
    commissionType: 'percentage',
    commissionValue: 5,
    vehiclesCount: 6,
    activeTripsCount: 4
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    companyId: 'sonef',
    model: 'حافلة مرسيدس توريزمو VIP 2024',
    plateNumber: '3210 AA 00',
    type: 'bus',
    totalSeats: 32,
    amenities: ['ac', 'wifi', 'charger', 'water', 'recliners', 'luggage']
  },
  {
    id: 'v2',
    companyId: 'sonef',
    model: 'تويوتا كوستار ميني باص',
    plateNumber: '8842 AB 00',
    type: 'minibus',
    totalSeats: 18,
    amenities: ['ac', 'charger', 'water', 'luggage']
  },
  {
    id: 'v3',
    companyId: 'moussafir',
    model: 'تويوتا لاندكروزر V8 2023 VIP',
    plateNumber: '9901 AA 00',
    type: 'v8',
    totalSeats: 6,
    amenities: ['ac', 'wifi', 'charger', 'water']
  },
  {
    id: 'v4',
    companyId: 'massar',
    model: 'حافلة هيونداي يونيفرس VIP',
    plateNumber: '1120 AC 00',
    type: 'bus',
    totalSeats: 28,
    amenities: ['ac', 'wifi', 'charger', 'water', 'recliners']
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'd1',
    companyId: 'sonef',
    name: 'محمد ولد سيدي',
    phone: '+222 4600 1122',
    licenseNumber: 'MR-998822',
    rating: 4.9
  },
  {
    id: 'd2',
    companyId: 'moussafir',
    name: 'عبد الله ولد اعلي',
    phone: '+222 2244 5566',
    licenseNumber: 'MR-776655',
    rating: 4.8
  },
  {
    id: 'd3',
    companyId: 'massar',
    name: 'إبراهيم ولد اعمر',
    phone: '+222 3611 2233',
    licenseNumber: 'MR-554433',
    rating: 4.7
  }
];

export function generateSeatsForVehicle(type: VehicleType, totalSeats: number): Seat[] {
  const seats: Seat[] = [];
  const bookedNumbers = [2, 5, 8, 12]; // Default realistic booked seats

  for (let i = 1; i <= totalSeats; i++) {
    const isBooked = bookedNumbers.includes(i);
    const seatType = (i % 2 === 1) ? 'window' : 'aisle';
    seats.push({
      id: `S${i}`,
      number: `${i}`,
      status: isBooked ? 'booked' : 'available',
      type: seatType,
      genderRestriction: i <= 4 ? 'female' : 'any'
    });
  }
  return seats;
}

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    companyId: 'sonef',
    companyName: 'سونيف للنقل',
    companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.8,
    vehicleId: 'v1',
    vehicleModel: 'حافلة مرسيدس توريزمو VIP',
    vehicleType: 'bus',
    driverId: 'd1',
    driverName: 'محمد ولد سيدي',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'ndb',
    destinationCityNameAr: 'نواذيبو',
    departureTime: '07:00',
    arrivalTime: '12:30',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '5.5 ساعات',
    priceMRU: 500,
    availableSeatsCount: 22,
    totalSeatsCount: 32,
    seats: generateSeatsForVehicle('bus', 32),
    amenities: ['ac', 'wifi', 'charger', 'water', 'recliners', 'luggage'],
    stops: [
      { cityId: 'nkc', cityNameAr: 'محطة سونيف المركزية (نواكشوط)', estimatedTimeFromStart: '07:00' },
      { cityId: 'ndb-checkpoint', cityNameAr: 'استراحة الشامي (منتصف الطريق)', estimatedTimeFromStart: '09:45' },
      { cityId: 'ndb', cityNameAr: 'محطة سونيف (نواذيبو)', estimatedTimeFromStart: '12:30' }
    ],
    cancellationPolicyAr: 'إلغاء مجاني حتى 12 ساعة قبل انطلاق الرحلة. يتم خصم 10% عند الإلغاء قبل الرحلة بـ 3 ساعات.',
    status: 'scheduled',
    commissionMRU: 30
  },
  {
    id: 'trip-2',
    companyId: 'moussafir',
    companyName: 'المسافر للنقل',
    companyLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.6,
    vehicleId: 'v3',
    vehicleModel: 'تويوتا لاندكروزر V8 2023 VIP',
    vehicleType: 'v8',
    driverId: 'd2',
    driverName: 'عبد الله ولد اعلي',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'ndb',
    destinationCityNameAr: 'نواذيبو',
    departureTime: '08:30',
    arrivalTime: '13:15',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '4.75 ساعات',
    priceMRU: 700,
    availableSeatsCount: 4,
    totalSeatsCount: 6,
    seats: generateSeatsForVehicle('v8', 6),
    amenities: ['ac', 'wifi', 'charger', 'water'],
    stops: [
      { cityId: 'nkc', cityNameAr: 'محطة المسافر (لكصر)', estimatedTimeFromStart: '08:30' },
      { cityId: 'ndb', cityNameAr: 'محطة المسافر (نواذيبو)', estimatedTimeFromStart: '13:15' }
    ],
    cancellationPolicyAr: 'إلغاء مجاني حتى 24 ساعة قبل الانطلاق.',
    status: 'scheduled',
    commissionMRU: 42 // 6% of 700
  },
  {
    id: 'trip-3',
    companyId: 'sonef',
    companyName: 'سونيف للنقل',
    companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.8,
    vehicleId: 'v1',
    vehicleModel: 'حافلة مرسيدس توريزمو VIP',
    vehicleType: 'bus',
    driverId: 'd1',
    driverName: 'محمد ولد سيدي',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'kfa',
    destinationCityNameAr: 'كيفه',
    departureTime: '06:00',
    arrivalTime: '14:00',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '8 ساعات',
    priceMRU: 600,
    availableSeatsCount: 16,
    totalSeatsCount: 30,
    seats: generateSeatsForVehicle('bus', 30),
    amenities: ['ac', 'wifi', 'charger', 'water', 'recliners', 'luggage'],
    stops: [
      { cityId: 'nkc', cityNameAr: 'نواكشوط - كارفور مدريد', estimatedTimeFromStart: '06:00' },
      { cityId: 'btl', cityNameAr: 'بوتلميت', estimatedTimeFromStart: '08:15' },
      { cityId: 'alaq', cityNameAr: 'ألاق', estimatedTimeFromStart: '10:30' },
      { cityId: 'kfa', cityNameAr: 'كيفه - وسط المدينة', estimatedTimeFromStart: '14:00' }
    ],
    cancellationPolicyAr: 'إلغاء مرن مع استرداد كامل للمبلغ عند الإلغاء المبكر.',
    status: 'scheduled',
    commissionMRU: 30
  },
  {
    id: 'trip-4',
    companyId: 'massar',
    companyName: 'المسار رحلات',
    companyLogo: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.7,
    vehicleId: 'v4',
    vehicleModel: 'حافلة هيونداي يونيفرس VIP',
    vehicleType: 'bus',
    driverId: 'd3',
    driverName: 'إبراهيم ولد اعمر',
    originCityId: 'nkc',
    originCityNameAr: 'نواكشوط',
    destinationCityId: 'rso',
    destinationCityNameAr: 'روصو',
    departureTime: '09:00',
    arrivalTime: '11:30',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '2.5 ساعة',
    priceMRU: 350,
    availableSeatsCount: 20,
    totalSeatsCount: 28,
    seats: generateSeatsForVehicle('bus', 28),
    amenities: ['ac', 'charger', 'water', 'luggage'],
    stops: [
      { cityId: 'nkc', cityNameAr: 'محطة المسار (الميناء)', estimatedTimeFromStart: '09:00' },
      { cityId: 'rso', cityNameAr: 'محطة روصو قرب المعبر', estimatedTimeFromStart: '11:30' }
    ],
    cancellationPolicyAr: 'إلغاء مجاني قبل ساعتين.',
    status: 'scheduled',
    commissionMRU: 25
  },
  {
    id: 'trip-5',
    companyId: 'mauritrans',
    companyName: 'موري ترانس',
    companyLogo: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.5,
    vehicleId: 'v2',
    vehicleModel: 'تويوتا كوستار ميني باص',
    vehicleType: 'minibus',
    driverId: 'd2',
    driverName: 'عبد الله ولد اعلي',
    originCityId: 'ndb',
    originCityNameAr: 'نواذيبو',
    destinationCityId: 'atr',
    destinationCityNameAr: 'أطار',
    departureTime: '07:30',
    arrivalTime: '13:00',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '5.5 ساعات',
    priceMRU: 550,
    availableSeatsCount: 12,
    totalSeatsCount: 18,
    seats: generateSeatsForVehicle('minibus', 18),
    amenities: ['ac', 'charger', 'water', 'luggage'],
    stops: [
      { cityId: 'ndb', cityNameAr: 'نواذيبو - حي كانصادو', estimatedTimeFromStart: '07:30' },
      { cityId: 'akj', cityNameAr: 'أكجوجت', estimatedTimeFromStart: '11:00' },
      { cityId: 'atr', cityNameAr: 'أطار - وسط المدينة', estimatedTimeFromStart: '13:00' }
    ],
    cancellationPolicyAr: 'استرداد 90% عند الإلغاء قبل يوم.',
    status: 'scheduled',
    commissionMRU: 30
  },
  {
    id: 'trip-6',
    companyId: 'zemzem',
    companyName: 'زمزم إكسبرس',
    companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    companyRating: 4.4,
    vehicleId: 'v2',
    vehicleModel: 'ميني باص هيونداي H1',
    vehicleType: 'minibus',
    driverId: 'd3',
    driverName: 'إبراهيم ولد اعمر',
    originCityId: 'kfa',
    originCityNameAr: 'كيفه',
    destinationCityId: 'ayn',
    destinationCityNameAr: 'لعيون',
    departureTime: '10:00',
    arrivalTime: '13:30',
    departureDate: new Date().toISOString().split('T')[0],
    durationHours: '3.5 ساعات',
    priceMRU: 400,
    availableSeatsCount: 10,
    totalSeatsCount: 14,
    seats: generateSeatsForVehicle('minibus', 14),
    amenities: ['ac', 'water'],
    stops: [
      { cityId: 'kfa', cityNameAr: 'كيفه', estimatedTimeFromStart: '10:00' },
      { cityId: 'ayn', cityNameAr: 'لعيون - السوق', estimatedTimeFromStart: '13:30' }
    ],
    cancellationPolicyAr: 'إلغاء مجاني قبل 6 ساعات.',
    status: 'scheduled',
    commissionMRU: 20
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'SAFAR2026',
    type: 'percentage',
    value: 10, // 10%
    maxDiscountMRU: 100,
    minBookingMRU: 300,
    usedCount: 42,
    maxUses: 500,
    active: true,
    expiryDate: '2026-12-31'
  },
  {
    id: 'c2',
    code: 'MAURI50',
    type: 'fixed',
    value: 50, // 50 MRU off
    minBookingMRU: 400,
    usedCount: 19,
    maxUses: 200,
    active: true,
    expiryDate: '2026-10-15'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    tripId: 'trip-1',
    companyId: 'sonef',
    userName: 'المختار ولد أحمد',
    rating: 5,
    comment: 'رحلة ممتازة جداً، الحافلة مكيفة والالتزام بالوقت كان دقيقاً. شكراً لسفر موريتانيا على سهولة الحجز.',
    createdAt: '2026-07-20'
  },
  {
    id: 'r2',
    tripId: 'trip-2',
    companyId: 'moussafir',
    userName: 'فاطمة منت محمد',
    rating: 5,
    comment: 'سيارة V8 مريحة والسائق ماهر ومحترم جداً. وصلت في الوقت المحدد بالضبط.',
    createdAt: '2026-07-22'
  },
  {
    id: 'r3',
    tripId: 'trip-4',
    companyId: 'massar',
    userName: 'شيخنا ولد المصطفى',
    rating: 4,
    comment: 'خدمة طيبة ومعاملة حسنة في محطة روصو.',
    createdAt: '2026-07-24'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    bookingCode: 'SFR-98120',
    userId: 'user-demo',
    tripId: 'trip-1',
    tripDetails: {
      originAr: 'نواكشوط',
      destinationAr: 'نواذيبو',
      companyName: 'سونيف للنقل',
      companyLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '07:00',
      arrivalTime: '12:30',
      vehicleType: 'bus',
      vehicleModel: 'حافلة مرسيدس توريزمو VIP'
    },
    passengerName: 'المختار ولد سيدي',
    passengerPhone: '+222 4611 2233',
    passengerIdNum: '8820192019',
    passengerEmail: 'mokhtar@example.mr',
    seats: ['S3', 'S4'],
    totalPriceMRU: 1000,
    discountMRU: 50,
    commissionMRU: 60,
    netCompanyMRU: 890,
    paymentMethod: 'bankily',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date().toISOString(),
    qrData: 'SAFAR-MR-TICKET-SFR-98120'
  }
];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  defaultCommissionType: 'fixed',
  defaultCommissionValue: 30, // 30 MRU per ticket
  platformPhone: '+222 4525 0000',
  platformEmail: 'support@safar.mr',
  whatsappSupportNumber: '+222 2200 1122',
  enableSmsNotifications: true
};

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
