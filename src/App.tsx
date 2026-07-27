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
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { 
  testFirebaseConnection, 
  auth, 
  onAuthStateChanged, 
  logoutFirebase, 
  fetchUserProfileFromFirestore, 
  subscribeToCompanyRequests,
  submitCompanyRequestInFirestore,
  approveCompanyPartnerRequest,
  rejectCompanyPartnerRequest,
  subscribeToCompanies,
  saveCompanyToFirestore,
  subscribeToCities,
  saveCityToFirestore,
  subscribeToComplaints,
  saveComplaintToFirestore,
  subscribeToAdminSettings,
  saveAdminSettingsToFirestore,
  db 
} from './lib/firebase';
import { LanguageProvider } from './lib/i18n';

export default function App() {
  // Theme & Language State
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'ar' | 'fr'>('ar');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Firebase Auth State Listener
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchUserProfileFromFirestore(fbUser.uid);
          const email = (fbUser.email || profile?.email || '').toLowerCase();
          const isSuperAdminEmail = email === 'alqasmhapip468@gmail.com';
          const rawRole = profile?.role || (isSuperAdminEmail ? 'admin' : 'customer');

          let mappedRole: UserRole = 'passenger';
          if (rawRole === 'admin' || rawRole === 'super_admin' || isSuperAdminEmail) {
            mappedRole = 'super_admin';
          } else if (rawRole === 'company' || rawRole === 'company_admin' || rawRole === 'independent_driver') {
            mappedRole = 'company_admin';
          } else {
            mappedRole = 'passenger';
          }

          const userObj: UserProfile = {
            id: fbUser.uid,
            name: profile?.name || fbUser.displayName || (mappedRole === 'super_admin' ? 'المشرف العام (Super Admin)' : 'مسافر موريتاني'),
            email: email || `${fbUser.phoneNumber?.replace(/\+/g, '')}@safar.mr`,
            phone: profile?.phone || fbUser.phoneNumber || '+222 2779 8492',
            role: mappedRole === 'super_admin' ? 'admin' : (profile?.role || 'customer'),
            status: profile?.status || 'active',
            companyId: profile?.companyId || null,
            favorites: [],
            createdAt: profile?.createdAt || new Date().toISOString()
          };

          setUser(userObj);
          setCurrentRole(mappedRole);
        } catch (err: any) {
          console.warn("Auth state error:", err);
          if (err.message && err.message.includes('معطل')) {
            alert(err.message);
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Listeners for Trips and Bookings
  useEffect(() => {
    // 1. Real-time Trips Snapshot Listener
    const tripsRef = collection(db, 'trips');
    const unsubscribeTrips = onSnapshot(
      tripsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteTrips: Trip[] = [];
          snapshot.forEach((doc) => {
            remoteTrips.push({ id: doc.id, ...doc.data() } as Trip);
          });
          if (remoteTrips.length > 0) {
            setTrips(remoteTrips);
          }
        }
      },
      (err) => {
        console.warn('Firestore trips onSnapshot notice (using local/sync state):', err);
      }
    );

    // 2. Real-time Bookings Snapshot Listener
    const bookingsRef = collection(db, 'bookings');
    const unsubscribeBookings = onSnapshot(
      bookingsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteBookings: Booking[] = [];
          snapshot.forEach((doc) => {
            remoteBookings.push({ id: doc.id, ...doc.data() } as Booking);
          });
          if (remoteBookings.length > 0) {
            setBookings(remoteBookings);
          }
        }
      },
      (err) => {
        console.warn('Firestore bookings onSnapshot notice (using local/sync state):', err);
      }
    );

    // 3. Real-time Company Requests Snapshot Listener
    const unsubscribeCompanyRequests = subscribeToCompanyRequests(
      (remoteApps) => {
        if (remoteApps) {
          setPartnerApplications(remoteApps);
        }
      },
      (err) => {
        console.warn('Firestore companyRequests onSnapshot notice:', err);
      }
    );

    // 4. Real-time Companies Listener
    const unsubscribeCompanies = subscribeToCompanies(
      (remoteCompanies) => {
        if (remoteCompanies && remoteCompanies.length > 0) {
          setCompanies(remoteCompanies);
        }
      }
    );

    // 5. Real-time Cities Listener
    const unsubscribeCities = subscribeToCities(
      (remoteCities) => {
        if (remoteCities && remoteCities.length > 0) {
          setCities(remoteCities);
        }
      }
    );

    // 6. Real-time Complaints Listener
    const unsubscribeComplaints = subscribeToComplaints(
      (remoteComplaints) => {
        if (remoteComplaints) {
          setComplaints(remoteComplaints);
        }
      }
    );

    // 7. Real-time Admin Settings Listener
    const unsubscribeSettings = subscribeToAdminSettings(
      (remoteSettings) => {
        if (remoteSettings) {
          setAdminSettings(remoteSettings);
        }
      }
    );

    return () => {
      unsubscribeTrips();
      unsubscribeBookings();
      unsubscribeCompanyRequests();
      unsubscribeCompanies();
      unsubscribeCities();
      unsubscribeComplaints();
      unsubscribeSettings();
    };
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

  const handleConfirmBooking = async (newBooking: Booking) => {
    // Immediate local state update
    setBookings(prev => [newBooking, ...prev]);

    // Update local seats state immediately
    let updatedTrip: Trip | undefined;
    setTrips(prevTrips => prevTrips.map(t => {
      if (t.id === newBooking.tripId) {
        const updatedBooked = Array.from(new Set([...t.bookedSeats, ...newBooking.seats]));
        const updatedAvail = Math.max(0, t.totalSeats - updatedBooked.length);
        updatedTrip = {
          ...t,
          bookedSeats: updatedBooked,
          availableSeatsCount: updatedAvail
        };
        return updatedTrip;
      }
      return t;
    }));

    // Real-time Firestore sync
    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
      const targetTrip = updatedTrip || trips.find(t => t.id === newBooking.tripId);
      if (targetTrip) {
        const updatedBooked = Array.from(new Set([...targetTrip.bookedSeats, ...newBooking.seats]));
        const updatedAvail = Math.max(0, targetTrip.totalSeats - updatedBooked.length);
        await setDoc(doc(db, 'trips', targetTrip.id), {
          ...targetTrip,
          bookedSeats: updatedBooked,
          availableSeatsCount: updatedAvail
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore real-time booking sync notice:", err);
    }

    setCheckoutTrip(null);
    setCheckoutSeats([]);
    setActiveTicket(newBooking);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في إلغاء هذا الحجز؟')) {
      const updated = bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: 'cancelled' as const } : b);
      setBookings(updated);
      const target = updated.find(b => b.id === bookingId);
      if (target) {
        try {
          await setDoc(doc(db, 'bookings', bookingId), target, { merge: true });
        } catch (err) {
          console.warn("Firestore cancel booking sync notice:", err);
        }
      }
    }
  };

  const handleAddNewTrip = async (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    try {
      await setDoc(doc(db, 'trips', newTrip.id), newTrip);
    } catch (err) {
      console.warn("Firestore new trip sync notice:", err);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه الرحلة من جدول المواعيد؟')) {
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  const handleToggleVerifyCompany = async (companyId: string) => {
    const updated = companies.map(c => c.id === companyId ? { ...c, verified: !c.verified } : c);
    setCompanies(updated);
    const target = updated.find(c => c.id === companyId);
    if (target) {
      try {
        await saveCompanyToFirestore(target);
      } catch (err) {
        console.warn("Notice updating company verification in Firestore:", err);
      }
    }
  };

  const handleAddCity = async (newCity: City) => {
    setCities(prev => [...prev, newCity]);
    try {
      await saveCityToFirestore(newCity);
    } catch (err) {
      console.warn("Notice saving city to Firestore:", err);
    }
  };

  // Partner Application Approval Handler
  const handleApproveApplication = async (appId: string, adminNotes: string) => {
    setPartnerApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'approved', adminNotes } : a));

    const targetApp = partnerApplications.find(a => a.id === appId);
    try {
      await approveCompanyPartnerRequest(appId, targetApp?.userId, adminNotes);
    } catch (err) {
      console.warn("Notice approving company partner request in Firestore:", err);
    }

    if (!targetApp) return;

    // Check if company already exists
    const compName = targetApp.companyName || targetApp.driverName || 'ناقل جديد';
    const existingComp = companies.find(c => c.nameAr === compName || c.phone === targetApp.phone);

    if (!existingComp) {
      const newCompId = targetApp.userId || `comp-${Date.now()}`;
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

      setCompanies(prev => [...prev, newComp]);
      setSelectedCompanyId(newCompId);

      try {
        await saveCompanyToFirestore(newComp);
      } catch (err) {
        console.warn("Notice saving new company to Firestore:", err);
      }
    }
  };

  // Partner Application Rejection Handler
  const handleRejectApplication = async (appId: string, adminNotes: string) => {
    setPartnerApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'rejected', adminNotes } : a));
    const targetApp = partnerApplications.find(a => a.id === appId);
    try {
      await rejectCompanyPartnerRequest(appId, targetApp?.userId, adminNotes);
    } catch (err) {
      console.warn("Notice rejecting company partner request in Firestore:", err);
    }
  };

  // Complaint Resolution Handler
  const handleResolveComplaint = async (complaintId: string, response: string) => {
    const updated = complaints.map(c => c.id === complaintId ? { ...c, status: 'resolved' as const, adminResponse: response } : c);
    setComplaints(updated);
    const target = updated.find(c => c.id === complaintId);
    if (target) {
      try {
        await saveComplaintToFirestore(target);
      } catch (err) {
        console.warn("Notice resolving complaint in Firestore:", err);
      }
    }
  };

  // Individual Company Commission Update Handler
  const handleUpdateCompanyCommission = async (companyId: string, type: CommissionType, value: number) => {
    const updated = companies.map(c => c.id === companyId ? { ...c, commissionType: type, commissionValue: value } : c);
    setCompanies(updated);
    const target = updated.find(c => c.id === companyId);
    if (target) {
      try {
        await saveCompanyToFirestore(target);
      } catch (err) {
        console.warn("Notice updating company commission in Firestore:", err);
      }
    }
  };

  const handleUpdateAdminSettings = async (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    try {
      await saveAdminSettingsToFirestore(newSettings);
    } catch (err) {
      console.warn("Notice updating admin settings in Firestore:", err);
    }
  };

  // Submit new application
  const handleSubmitPartnerApplication = async (app: PartnerApplication) => {
    setPartnerApplications(prev => [app, ...prev]);
    try {
      await submitCompanyRequestInFirestore(app);
    } catch (err) {
      console.warn("Notice submitting company application to Firestore:", err);
    }
  };

  // Submit new complaint
  const handleSubmitComplaint = async (complaint: ComplaintReport) => {
    setComplaints(prev => [complaint, ...prev]);
    try {
      await saveComplaintToFirestore(complaint);
    } catch (err) {
      console.warn("Notice submitting complaint to Firestore:", err);
    }
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
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <div
        className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-200"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <Header
          user={user}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
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
              <div id="search-results-section" className="bg-slate-100 dark:bg-slate-900/60 py-8 transition-colors duration-200">
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
              onUpdateAdminSettings={handleUpdateAdminSettings}
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
    </LanguageProvider>
  );

}
