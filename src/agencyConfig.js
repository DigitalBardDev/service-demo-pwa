// src/agencyConfig.js

export const defaultAppConfig = {
  // Brand Settings
  businessName: "ServiceMaster Demo",
  tagline: "Professional Services on Demand",
  heroDescription: "High-quality, reliable service delivered directly to your location. Book your appointment today.",
  
  // Design Variables
  themePrimary: "#2c3e50", // Dark slate
  themeAccent: "#3498db",  // Bright blue
  themeBackground: "#f8f9fa", // Light gray
  
  // Feature Flags
  features: {
    enableQuoteCalculator: true, // Interactive Service & Add-On Estimator
    enableAppointmentCalendar: true, // Mode A: Open-Window 1-on-1 Booking Request Calendar
    enableSlotRosterCalendar: false, // Mode B: Fixed-Time Class, Workshop & Mini-Session Drop Roster
    enableBeforeAfterGallery: true, // Interactive Before/After Comparison Slider
    enableCompatibilityChecker: true, // Quick Lookup Tool
    enableLiveStatusBanner: true, // 1-Tap Top Banner
    enableReviews: true // Scrolling Review Section
  },
  
  // Operational Settings
  allowedZipCodes: [], // Leave empty [] to allow all zip codes
  travelPaddingMinutes: 45, // Time required between appointments
  
  // NEW: Dynamic Schedule Generation
  operatingHours: {
    start: "08:00", // 8:00 AM
    end: "18:00",   // 6:00 PM
    intervalMinutes: 30 // Slots every 30 mins
  },

  // NEW: Checkout Settings
  requireUpfrontPayment: false, // Set to true to trigger Stripe checkout flow
  
  // The Services Menu
  services: [
    { id: 'service_1', name: 'Home Deep Cleaning', price: 150, tech_time: 120, cleanup: 30, unitName: 'sq ft', ratePerUnit: 0.15 },
    { id: 'service_2', name: 'Lawn Care & Landscaping', price: 80, tech_time: 60, cleanup: 15, unitName: 'sq ft', ratePerUnit: 0.05 },
    { id: 'service_3', name: 'Pressure Washing', price: 90, tech_time: 45, cleanup: 15, unitName: 'sq ft', ratePerUnit: 0.10 },
    { id: 'service_4', name: 'HVAC Inspection', price: 120, tech_time: 60, cleanup: 15, unitName: 'unit', ratePerUnit: 120 },
    { id: 'service_5', name: 'Consulting & Planning', price: 200, tech_time: 90, cleanup: 0, unitName: 'hour', ratePerUnit: 200 }
  ]
};

// Load merged config from localStorage
const getMergedConfig = () => {
  try {
    const saved = localStorage.getItem('demo_app_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...defaultAppConfig, 
        ...parsed, 
        features: { ...defaultAppConfig.features, ...(parsed.features || {}) },
        services: parsed.services || defaultAppConfig.services
      };
    }
  } catch (e) {
    console.error('Failed to parse demo_app_config', e);
  }
  return defaultAppConfig;
};

export const APP_CONFIG = getMergedConfig();

export const updateAppConfig = (newConfig) => {
  const current = getMergedConfig();
  const updated = {
    ...current,
    ...newConfig,
    features: {
      ...current.features,
      ...(newConfig.features || {})
    }
  };
  localStorage.setItem('demo_app_config', JSON.stringify(updated));
  return updated;
};