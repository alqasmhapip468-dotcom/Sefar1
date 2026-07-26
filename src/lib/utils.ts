import jsPDF from 'jspdf';
import { Booking } from '../types';

export function formatCurrencyMRU(amount: number): string {
  return `${amount.toLocaleString('ar-MR')} أوقية`;
}

export function formatDateArabic(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('ar-MA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatVehicleTypeArabic(type: string): string {
  switch (type) {
    case 'bus':
      return 'حافلة مكيفة VIP';
    case 'minibus':
      return 'ميني باص سياحي';
    case 'v8':
      return 'سيارة V8 سياحية';
    case 'taxi':
      return 'سيارة أجرة نقل';
    default:
      return type;
  }
}

export function formatPaymentMethodArabic(method: string): string {
  switch (method) {
    case 'bankily':
      return 'تطبيق بنكيلي (Bankily)';
    case 'sedad':
      return 'خدمة السداد (Sedad)';
    case 'masrifi':
      return 'تطبيق مصرفي (Masrifi)';
    case 'cash':
      return 'الدفع نقداً عند الصعود';
    case 'card':
      return 'بطاقة بنكية إلكترونية';
    default:
      return method;
  }
}

export function generateBookingPDF(booking: Booking): void {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a5'
  });

  // Aesthetic Header
  doc.setFillColor(15, 23, 42); // Navy Blue
  doc.rect(0, 0, 148, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Safar MR - سفر موريتانيا', 15, 14);

  doc.setFontSize(10);
  doc.text(`تذكرة حجز إلكترونية | E-Ticket #${booking.bookingCode}`, 15, 22);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Green
  doc.roundedRect(100, 8, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('مؤكد / Confirmed', 103, 15);

  // Content Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, 34, 128, 160, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);

  let y = 44;
  const addLine = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(label, 15, y);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(value, 60, y);
    y += 10;
  };

  addLine('رمز الحجز:', booking.bookingCode);
  addLine('اسم المسافر:', booking.passengerName);
  addLine('رقم الهاتف:', booking.passengerPhone);
  if (booking.passengerIdNum) {
    addLine('رقم الهوية:', booking.passengerIdNum);
  }
  addLine('الشركة الناقلة:', booking.tripDetails.companyName);
  addLine('مسار الرحلة:', `${booking.tripDetails.originAr} ---> ${booking.tripDetails.destinationAr}`);
  addLine('تاريخ الانطلاق:', `${booking.tripDetails.departureDate} (${booking.tripDetails.departureTime})`);
  addLine('نوع المركبة:', formatVehicleTypeArabic(booking.tripDetails.vehicleType));
  addLine('المقاعد المحجوزة:', booking.seats.join(', '));
  addLine('إجمالي المبلغ:', `${booking.totalPriceMRU} أوقية (MRU)`);
  addLine('طريقة الدفع:', formatPaymentMethodArabic(booking.paymentMethod));

  // Footer Note
  doc.setFillColor(241, 245, 249);
  doc.rect(10, 170, 128, 20, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('يرجى إبراز رمز التذكرة أو الـ QR للتحقق عند محطة انطلاق الحافلة.', 15, 178);
  doc.text('شكراً لاختياركم سفر موريتانيا - نتمنى لكم رحلة آمنة ومريحة.', 15, 184);

  doc.save(`SafarMR_Ticket_${booking.bookingCode}.pdf`);
}
