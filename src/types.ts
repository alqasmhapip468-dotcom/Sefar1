export type UserRole = 
  | 'customer' 
  | 'company' 
  | 'admin' 
  | 'pending_company' 
  | 'passenger' 
  | 'company_admin' 
  | 'independent_driver' 
  | 'super_admin';

export type UserStatus = 'active' | 'suspended';

export interface UserRecord {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyId?: string | null;
  createdAt: string;
}

export type ApplicationType = 'company' | 'independent_driver';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PartnerApplication {
  id: string;
  userId: string;
  type: ApplicationType;
  typeAr?: string;
  // Company fields
  companyName?: string;
  managerName?: string;
  contactPerson?: string;
  city?: string;
  fleetCount?: number;
  // Independent driver fields
  driverName?: string;
  vehicleModel?: string;
  plateNumber?: string;
  licenseNumber?: string;
  // Common fields
  phone: string;
  email: string;
  commercialRegisterOrDoc?: string;
  notes?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
}

export type ComplaintStatus = 'pending' | 'investigating' | 'resolved';

export interface ComplaintReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  tripId?: string;
  companyName?: string;
  type: 'delay' | 'driver_behavior' | 'payment_issue' | 'vehicle_condition' | 'other';
  typeAr: string;
  description: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  companyId?: string | null;
  favorites: string[]; // trip / route IDs
  createdAt: string;
  applicationStatus?: ApplicationStatus;
  adminNote?: string;
}

export interface City {
  id: string;
  nameAr: string;
  nameFr: string;
  regionAr: string;
  code: string;
  popular?: boolean;
  image?: string;
}

export type CommissionType = 'fixed' | 'percentage';

export interface Company {
  id: string;
  name: string;
  nameAr: string;
  logo: string;
  rating: number;
  totalReviews: number;
  phone: string;
  email: string;
  verified: boolean;
  commissionType: CommissionType;
  commissionValue: number; // e.g., 30 for 30 MRU or 6 for 6%
  vehiclesCount: number;
  activeTripsCount: number;
}

export type VehicleType = 'bus' | 'minibus' | 'v8' | 'taxi' | 'bus_vip' | 'bus_standard' | 'car_7seats';

export interface Vehicle {
  id: string;
  companyId: string;
  model: string; // e.g., "مرسيدس سبرينتر 2023" or "تويوتا لاندكروزر V8"
  plateNumber: string; // e.g., "4590 AA 00"
  type: VehicleType;
  totalSeats: number;
  amenities: Array<'ac' | 'wifi' | 'charger' | 'water' | 'recliners' | 'luggage'>;
  photoUrl?: string;
  typeAr?: string;
  capacity?: number;
  features?: string[];
  featuresAr?: string[];
  status?: 'active' | 'maintenance' | 'inactive';
}

export interface Driver {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  status?: 'active' | 'inactive';
}

export interface Seat {
  id: string; // e.g., "1A", "1B"
  number: string;
  status: 'available' | 'booked' | 'selected' | 'reserved';
  type: 'window' | 'aisle' | 'front';
  genderRestriction?: 'male' | 'female' | 'any';
}

export interface RouteStop {
  cityId: string;
  cityNameAr: string;
  estimatedTimeFromStart: string; // e.g., "بعد ساعتين"
}

export interface Trip {
  id: string;
  companyId: string;
  companyName: string;
  companyNameAr?: string;
  companyLogo: string;
  companyRating: number;
  vehicleId: string;
  vehicleModel: string;
  vehicleType: VehicleType;
  driverId: string;
  driverName: string;
  originCityId: string;
  originCityNameAr: string;
  destinationCityId: string;
  destinationCityNameAr: string;
  departureTime: string; // "07:30"
  arrivalTime: string;   // "13:30"
  departureDate: string;  // "2026-07-26"
  durationHours: string;  // "6 ساعات"
  priceMRU: number;       // e.g. 500
  availableSeatsCount: number;
  totalSeatsCount: number;
  seats: Seat[];
  amenities: Array<'ac' | 'wifi' | 'charger' | 'water' | 'recliners' | 'luggage'>;
  stops: RouteStop[];
  cancellationPolicyAr: string;
  status: 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  commissionMRU: number; // Computed platform fee
}

export type PaymentMethod = 'cash' | 'bankily' | 'masrifi' | 'sedad' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  bookingCode: string; // e.g., "SFR-98214"
  userId: string;
  tripId: string;
  tripDetails: {
    originAr: string;
    destinationAr: string;
    companyName: string;
    companyLogo: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    vehicleType: VehicleType;
    vehicleModel: string;
  };
  passengerName: string;
  passengerPhone: string;
  passengerIdNum?: string;
  passengerEmail?: string;
  seats: string[]; // ["1A", "1B"]
  totalPriceMRU: number;
  discountMRU: number;
  commissionMRU: number;
  netCompanyMRU: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  qrData: string;
}

export interface Review {
  id: string;
  tripId: string;
  companyId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number; // e.g., 50 MRU or 10%
  maxDiscountMRU?: number;
  minBookingMRU?: number;
  usedCount: number;
  maxUses: number;
  active: boolean;
  expiryDate: string;
}

export interface AdminSettings {
  defaultCommissionType: CommissionType;
  defaultCommissionValue: number; // e.g. 30 MRU or 6%
  platformPhone: string;
  platformEmail: string;
  whatsappSupportNumber: string;
  enableSmsNotifications: boolean;
}

export interface SearchQuery {
  originId: string;
  destinationId: string;
  date: string;
  passengers: number;
  vehicleType?: VehicleType | 'all';
  timestamp: string;
}
