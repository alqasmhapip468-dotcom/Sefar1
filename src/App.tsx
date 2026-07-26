import React, { useState, useEffect } from 'react';
import { UserRole, City, Company, Trip, Vehicle, Driver, Booking, Coupon, AdminSettings, UserProfile, VehicleType, PartnerApplication, ComplaintReport, CommissionType } from './types';
import {
  INITIAL_CITIES,
  INITIAL_COMPANIES,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_COUPONS,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_PARTNER_APPLICATIONS,
  INITIAL_COMPLAINTS
} from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSearch } from './components/HeroSearch';
import { PopularRoutes } from './components/PopularRoutes';
import { FeaturesSection } from './components/FeaturesSection';
import { SearchResults } from './components/SearchResults';
import { TripDetailsModal } from './components/TripDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketModal } from './components/TicketModal';
import { PassengerAccountModal } from './components/PassengerAccountModal';
import { CompanyDashboard } from './components/CompanyDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { FaqPrivacyModal } from './components/FaqPrivacyModal';
import { testFirebaseConnection, auth, onAuthStateChanged, logoutFirebase } from './lib/firebase';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Firebase Auth State Listener
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const email = fbUser.email || '';
        const isSuperAdmin = email.toLowerCase() === 'alqasmhapip468@gmail.com';
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || (isSuperAdmin ? 'المشرف العام (Super Admin)' : (fbUser.phoneNumber ? `مستخدم (${fbUser.phoneNumber})` : email.split('@')[0] || 'مستخدم مسجل')),
          email: email || (fbUser.phoneNumber ? `${fbUser.phoneNumber.replace(/\+/g, '')}@safar.mr` : 'user@safar.mr'),
          phone: fbUser.phoneNumber || '+222 4525 1010',
          role: isSuperAdmin ? 'super_admin' : 'passenger',
          favorites: [],
          createdAt: new Date().toISOString()
        });
        if (isSuperAdmin) {
          setCurrentRole('super_admin');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Role Context Switcher
  const [currentRole, setCurrentRole] = useState<UserRole>('passenger');

  // Master Data States
  const [cities, setCities] = useState<City[]>(INITIAL_CITIES);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(INITIAL_ADMIN_SETTINGS);
  
  // Applications & Complaints State
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>(INITIAL_PARTNER_APPLICATIONS);
  const [complaints, setComplaints] = useState<ComplaintReport[]>(INITIAL_COMPLAINTS);

  // Active Company Context for Company Dashboard
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  // Passenger Auth State
  const [user, setUser] = useState<UserProfile | null>(null);

  // Search State
  const [originCityId, setOriginCityId] = useState<string>('nkc');
  const [destinationCityId, setDestinationCityId] = useState<string>('ndb');
  const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | 'all'>('all');
  const [searchPerformed, setSearchPerformed] = useState<boolean>(true);

  // Modal & Overlay States
  const [selectedTripForDetails, setSelectedTripForDetails] = useState<Trip | null>(null);
  const [checkoutTrip, setCheckoutTrip] = useState<Trip | null>(null);
  const [checkoutSeats, setCheckoutSeats] = useState<string[]>([]);
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);

  // Actions & Handlers
  const handleSearch = () => {
    setSearchPerformed(true);
    const el = document.getElementById('search-results-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickRouteSelect = (originId: string, destId: string) => {
    setOriginCityId(originId);
    setDestinationCityId(destId);
    setSearchPerformed(true);
    const el = document.getElementById('search-results-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTripForDetails(trip);
  };

  const handleProceedToCheckout = (trip: Trip, selectedSeats: string[]) => {
    setSelectedTripForDetails(null);
    setCheckoutTrip(trip);
    setCheckoutSeats(selectedSeats);
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    setCheckoutTrip(null);
    setCheckoutSeats([]);
    setActiveTicket(newBooking);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في إلغاء هذا الحجز؟')) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b));
    }
  };

  const handleAddNewTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه الرحلة من جدول المواعيد؟')) {
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  const handleToggleVerifyCompany = (companyId: string) => {
    setCompanies(companies.map(c => c.id === companyId ? { ...c, verified: !c.verified } : c));
  };

  const handleAddCity = (newCity: City) => {
    setCities([...cities, newCity]);
  };

  // Partner Application Approval Handler
  const handleApproveApplication = (appId: string, adminNotes: string) => {
    setPartnerApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'approved', adminNotes } : a));

    const targetApp = partnerApplications.find(a => a.id === appId);
    if (!targetApp) return;

    // Check if company already exists
    const compName = targetApp.companyName || targetApp.driverName || 'ناقل جديد';
    const existingComp = companies.find(c => c.nameAr === compName || c.phone === targetApp.phone);

    if (!existingComp) {
      const newCompId = `comp-${Date.now()}`;
      const newComp: Company = {
        id: newCompId,
        name: compName,
        nameAr: compName,
        logo: targetApp.type === 'company'
          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        totalReviews: 1,
        phone: targetApp.phone,
        email: targetApp.email,
        verified: true,
        commissionType: adminSettings.defaultCommissionType,
        commissionValue: adminSettings.defaultCommissionValue,
        vehiclesCount: 1,
        activeTripsCount: 0
      };

      setCompanies([...companies, newComp]);
      setSelectedCompanyId(newCompId);
    }
  };

  // Partner Application Rejection Handler
  const handleRejectApplication = (appId: string, adminNotes: string) => {
    setPartnerApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'rejected', adminNotes } : a));
  };

  // Complaint Resolution Handler
  const handleResolveComplaint = (complaintId: string, response: string) => {
    setComplaints(cmps => cmps.map(c => c.id === complaintId ? { ...c, status: 'resolved', adminResponse: response } : c));
  };

  // Individual Company Commission Update Handler
  const handleUpdateCompanyCommission = (companyId: string, type: CommissionType, value: number) => {
    setCompanies(companies.map(c => c.id === companyId ? { ...c, commissionType: type, commissionValue: value } : c));
  };

  // Submit new application
  const handleSubmitPartnerApplication = (app: PartnerApplication) => {
    setPartnerApplications([app, ...partnerApplications]);
  };

  // Submit new complaint
  const handleSubmitComplaint = (complaint: ComplaintReport) => {
    setComplaints([complaint, ...complaints]);
  };

  // Login Simulation with Role Capability
  const handleLoginSimulate = (name: string, phone: string, email: string, role: UserRole = 'passenger') => {
    setUser({
      id: `usr-${Date.now()}`,
      name,
      phone,
      email,
      role,
      favorites: [],
      createdAt: new Date().toISOString()
    });

    if (role === 'super_admin') {
      setCurrentRole('super_admin');
    }
  };

  // Filtered trips for active search criteria
  const filteredTrips = trips.filter(trip => {
    if (originCityId && trip.originCityId !== originCityId) return false;
    if (destinationCityId && trip.destinationCityId !== destinationCityId) return false;
    if (selectedVehicleType !== 'all' && trip.vehicleType !== selectedVehicleType) return false;
    return true;
  });

  const originCityObj = cities.find(c => c.id === originCityId);
  const destCityObj = cities.find(c => c.id === destinationCityId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans dir-rtl" dir="rtl">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenMyBookings={() => setIsAccountModalOpen(true)}
        onOpenAuth={() => setIsAccountModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        activeBookingsCount={bookings.filter(b => b.bookingStatus === 'confirmed').length}
      />

      {/* Main Body per Role */}
      <main className="flex-1">
        
        {/* ROLE 1: Passenger View */}
        {currentRole === 'passenger' && (
          <div>
            
            {/* Hero Search Box */}
            <HeroSearch
              cities={cities}
              originId={originCityId}
              destinationId={destinationCityId}
              departureDate={departureDate}
              passengers={passengersCount}
              selectedVehicleType={selectedVehicleType}
              onOriginChange={setOriginCityId}
              onDestinationChange={setDestinationCityId}
              onDepartureDateChange={setDepartureDate}
              onPassengersChange={setPassengersCount}
              onVehicleTypeChange={setSelectedVehicleType}
              onSearch={handleSearch}
              onQuickRouteSelect={handleQuickRouteSelect}
            />

            {/* Popular Routes Section */}
            <PopularRoutes onSelectRoute={handleQuickRouteSelect} trips={trips} />

            {/* Platform Features Section */}
            <FeaturesSection />

            {/* Search Results Section */}
            <div id="search-results-section" className="bg-slate-900/60 py-8">
              <SearchResults
                trips={filteredTrips}
                companies={companies}
                originNameAr={originCityObj?.nameAr || 'نواكشوط'}
                destinationNameAr={destCityObj?.nameAr || 'نواذيبو'}
                departureDate={departureDate}
                passengersCount={passengersCount}
                onSelectTrip={handleSelectTrip}
                onModifySearch={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

          </div>
        )}

        {/* ROLE 2: Company Dashboard View */}
        {currentRole === 'company_admin' && (
          <CompanyDashboard
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            bookings={bookings}
            cities={cities}
            onAddNewTrip={handleAddNewTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {/* ROLE 3: Super Admin Panel View */}
        {currentRole === 'super_admin' && (
          <SuperAdminDashboard
            companies={companies}
            cities={cities}
            bookings={bookings}
            adminSettings={adminSettings}
            applications={partnerApplications}
            complaints={complaints}
            onUpdateAdminSettings={setAdminSettings}
            onToggleVerifyCompany={handleToggleVerifyCompany}
            onAddCity={handleAddCity}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onResolveComplaint={handleResolveComplaint}
            onUpdateCompanyCommission={handleUpdateCompanyCommission}
          />
        )}

      </main>

      {/* Footer */}
      <Footer onOpenFaq={() => setIsFaqOpen(true)} />

      {/* MODALS & DRAWERS */}

      {/* 1. Trip Details & Seat Picker Modal */}
      {selectedTripForDetails && (
        <TripDetailsModal
          trip={selectedTripForDetails}
          passengersCount={passengersCount}
          onClose={() => setSelectedTripForDetails(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* 2. Checkout Modal */}
      {checkoutTrip && (
        <CheckoutModal
          trip={checkoutTrip}
          selectedSeats={checkoutSeats}
          coupons={coupons}
          onClose={() => setCheckoutTrip(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* 3. E-Ticket View Modal */}
      {activeTicket && (
        <TicketModal
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

      {/* 4. Passenger Account Modal */}
      {isAccountModalOpen && (
        <PassengerAccountModal
          user={user}
          bookings={bookings}
          applications={partnerApplications}
          complaints={complaints}
          onClose={() => setIsAccountModalOpen(false)}
          onViewBookingTicket={(b) => {
            setIsAccountModalOpen(false);
            setActiveTicket(b);
          }}
          onCancelBooking={handleCancelBooking}
          onLoginSimulate={handleLoginSimulate}
          onLogout={async () => {
            await logoutFirebase();
            setUser(null);
          }}
          onSubmitApplication={handleSubmitPartnerApplication}
          onSubmitComplaint={handleSubmitComplaint}
        />
      )}

      {/* 5. AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        originCityName={originCityObj?.nameAr}
        destCityName={destCityObj?.nameAr}
      />

      {/* 6. FAQ & Privacy Policy Modal */}
      {isFaqOpen && (
        <FaqPrivacyModal onClose={() => setIsFaqOpen(false)} />
      )}

    </div>
  );
}
