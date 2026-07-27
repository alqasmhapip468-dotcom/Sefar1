import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr';

export const translations = {
  ar: {
    appName: "سفر موريتانيا",
    subTitle: "حجز رحلات السفر البرية والحافلات",
    heroHeading: "احجز تذكرتك بين المدن الموريتانية بكل أمان وسهولة",
    heroSubheading: "منصة سفر الموحدة لحجز الحافلات ورحلات النقل البري في موريتانيا بأفضل الأسعار وأعلى جودة خدمات",
    originCity: "مدينة الانطلاق",
    destinationCity: "مدينة الوصول",
    travelDate: "تاريخ السفر",
    passengerCount: "عدد المسافرين",
    searchTrips: "البحث عن الرحلات",
    availableTrips: "الرحلات المتاحة",
    allCities: "جميع المدن",
    selectSeats: "اختيار المقاعد والحجز",
    seatMapTitle: "خريطة مقاعد الحافلة",
    selectedSeats: "المقاعد المختارة",
    totalPrice: "السعر الإجمالي",
    confirmBooking: "تأكيد الحجز والدفع",
    passengerName: "اسم المسافر الكامل",
    passengerPhone: "رقم الهاتف الموريتاني",
    paymentMethod: "طريقة الدفع الرقمي",
    bankily: "بنكيلي (Bankily)",
    masrvi: "مصرفي (Masrivi)",
    sedad: "سداد (Sedad)",
    bimbank: "بيم بنك (BimBank)",
    cashOnArrival: "الدفع نقداً في المكتب",
    myBookings: "حجوزاتي وتذاكري",
    account: "الحساب",
    login: "تسجيل الدخول",
    register: "إنشاء حساب جديد",
    logout: "تسجيل الخروج",
    companyDashboard: "لوحة تحكم شركة النقل",
    superAdminDashboard: "لوحة المشرف العام",
    popularRoutes: "أشهر الخطوط والرحلات الموريتانية",
    featuresTitle: "لماذا تختار منصة سفر موريتانيا؟",
    liveSeats: "حجز مقاعد مباشر ولحظي",
    qrTicket: "تذكرة إلكترونية مع رمز QR",
    verifiedCompanies: "شركات نقل معتمدة وموثوقة",
    support24: "خدمة عملاء ودعم مباشر 24/7",
    aiAssistant: "المساعد الذكي",
    footerText: "جميع الحقوق محفوظة © منصة سفر موريتانيا",
    darkMode: "الوضع الليلي",
    lightMode: "الوضع النهاري",
    lastSeatsWarning: "🟢 آخر مقعدين متاحين!",
    seatsRemaining: "مقاعد متبقية",
    seatPrice: "سعر المقعد",
    companyRating: "تقييم الشركة",
    departureTime: "وقت الانطلاق",
    tripStatus: "حالة الرحلة",
    onTime: "في الوقت المحدد",
    delayed: "متأخرة",
    departed: "انطلقت",
    arrived: "وصلت",
    vehicleType: "نوع المركبة",
    busWithAC: "حافلة مكيفة مع WiFi وشاحن",
    minibus: "حافلة صغيرة (ميني باص)",
    downloadPdf: "تحميل التذكرة PDF",
    shareWhatsapp: "مشاركة عبر واتساب",
    enterPhonePassword: "تسجيل الدخول برقم الهاتف وكلمة السر",
    enterEmailPassword: "تسجيل الدخول بالبريد الإلكتروني",
  },
  fr: {
    appName: "Safar Mauritanie",
    subTitle: "Réservation de bus et transports interurbains",
    heroHeading: "Réservez vos billets de bus en Mauritanie en toute sécurité",
    heroSubheading: "Plateforme unifiée pour réserver vos trajets interurbains au meilleur prix avec les meilleures compagnies",
    originCity: "Ville de départ",
    destinationCity: "Ville d'arrivée",
    travelDate: "Date de voyage",
    passengerCount: "Nombre de passagers",
    searchTrips: "Rechercher des trajets",
    availableTrips: "Trajets disponibles",
    allCities: "Toutes les villes",
    selectSeats: "Choisir les sièges et réserver",
    seatMapTitle: "Plan des sièges du bus",
    selectedSeats: "Sièges sélectionnés",
    totalPrice: "Prix Total",
    confirmBooking: "Confirmer la réservation",
    passengerName: "Nom complet du passager",
    passengerPhone: "Numéro de téléphone (+222)",
    paymentMethod: "Moyen de paiement",
    bankily: "Bankily",
    masrvi: "Masrivi",
    sedad: "Sedad",
    bimbank: "BimBank",
    cashOnArrival: "Paiement au guichet",
    myBookings: "Mes Réservations",
    account: "Compte",
    login: "Se connecter",
    register: "S'inscrire",
    logout: "Déconnexion",
    companyDashboard: "Espace Transporteur",
    superAdminDashboard: "Panneau Super Admin",
    popularRoutes: "Lignes populaires en Mauritanie",
    featuresTitle: "Pourquoi choisir Safar MR ?",
    liveSeats: "Sélection de sièges en temps réel",
    qrTicket: "Billet électronique avec QR Code",
    verifiedCompanies: "Compagnies agréées et vérifiées",
    support24: "Support client 24/7",
    aiAssistant: "Assistant IA",
    footerText: "Tous droits réservés © Safar MR Mauritanie",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    lastSeatsWarning: "🟢 Derniers 2 sièges disponibles !",
    seatsRemaining: "sièges restants",
    seatPrice: "Prix par siège",
    companyRating: "Note de la compagnie",
    departureTime: "Heure de départ",
    tripStatus: "Statut du trajet",
    onTime: "A l'heure",
    delayed: "En retard",
    departed: "Parti",
    arrived: "Arrivé",
    vehicleType: "Type de véhicule",
    busWithAC: "Bus climatisé avec WiFi et chargeur",
    minibus: "Mini-bus confort",
    downloadPdf: "Télécharger PDF",
    shareWhatsapp: "Partager sur WhatsApp",
    enterPhonePassword: "Connexion par Téléphone et Mot de passe",
    enterEmailPassword: "Connexion par Email et Mot de passe",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['ar']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => translations.ar[key] || key,
});

export const LanguageProvider: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ language, setLanguage, children }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  const t = (key: keyof typeof translations['ar']) => {
    return translations[language][key] || translations['ar'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
