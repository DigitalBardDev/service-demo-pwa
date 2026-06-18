import { useState } from 'react';

// --- AGENCY CHAMELEON CONFIGURATION ---
// You can add as many industries as you want here.
const INDUSTRY_PROFILES = {
  salon: {
    id: 'salon',
    name: "Vicki's Mobile Studio",
    subtitle: "In-Home Luxury Styling",
    heroText: "Bespoke hair design, brought directly to your living room.",
    theme: { bg: '#faf8f5', text: '#2c241b', primary: '#b78c44', card: '#ffffff' },
    services: [
      { id: 'cut', name: "Women's Precision Cut", duration: "60 Min", price: 85 },
      { id: 'color', name: "Full Color & Blowout", duration: "120 Min", price: 150 },
      { id: 'trim', name: "Gentleman's Trim", duration: "30 Min", price: 40 }
    ],
    adminPin: "1234"
  },
  lawn: {
    id: 'lawn',
    name: "Precision Turf & Lawn",
    subtitle: "Professional Property Maintenance",
    heroText: "Reliable, high-quality yard care without the hassle.",
    theme: { bg: '#f4f7f4', text: '#1b2c1b', primary: '#2d6a4f', card: '#ffffff' },
    services: [
      { id: 'mow-small', name: "Standard Mow & Edge (1/4 Acre)", duration: "45 Min", price: 50 },
      { id: 'mow-large', name: "Estate Mow & Trimming (1/2 Acre+)", duration: "90 Min", price: 85 },
      { id: 'clean', name: "Seasonal Yard Cleanup", duration: "180 Min", price: 200 }
    ],
    adminPin: "1234"
  },
  mechanic: {
    id: 'mechanic',
    name: "Apex Mobile Mechanics",
    subtitle: "We Bring the Garage to You",
    heroText: "Certified diagnostic and repair services in your driveway.",
    theme: { bg: '#f1f5f9', text: '#0f172a', primary: '#0369a1', card: '#ffffff' },
    services: [
      { id: 'oil', name: "Full Synthetic Oil Change", duration: "45 Min", price: 95 },
      { id: 'diag', name: "Check Engine Diagnostic", duration: "60 Min", price: 120 },
      { id: 'brakes', name: "Front Brake Pad Replacement", duration: "120 Min", price: 250 }
    ],
    adminPin: "1234"
  }
};

// Simulated Database for Appointments
const DEMO_APPOINTMENTS = [
  { id: 1, client: "Sarah Jenkins", service: "Women's Precision Cut", date: "Today", time: "10:00 AM", status: "Confirmed", address: "123 Maple St" },
  { id: 2, client: "Marcus Vance", service: "Gentleman's Trim", date: "Today", time: "1:30 PM", status: "In Transit", address: "404 Oak Ln" }
];

export default function App() {
  const [activeProfileId, setActiveProfileId] = useState('salon');
  const [view, setView] = useState('booking'); // 'booking', 'admin'
  const [step, setStep] = useState('services'); // 'services', 'datetime', 'checkout'
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const profile = INDUSTRY_PROFILES[activeProfileId];

  // Dynamic Styles Injector
  const dynamicStyles = {
    '--theme-bg': profile.theme.bg,
    '--theme-text': profile.theme.text,
    '--theme-primary': profile.theme.primary,
    '--theme-card': profile.theme.card,
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setStep('datetime');
  };

  const handleConfirmBooking = () => {
    alert(`Booking Confirmed for ${selectedService.name} at ${selectedTime}! (In the live app, this locks the slot in Supabase and texts the client.)`);
    setStep('services');
    setSelectedService(null);
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen pb-32 transition-colors duration-500" style={dynamicStyles}>
      
      {/* PUBLIC BOOKING VIEW */}
      {view === 'booking' && (
        <>
          {/* HERO SECTION */}
          <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center border-b border-black/10 shadow-sm" style={{ backgroundColor: 'var(--theme-card)' }}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: 'var(--theme-primary)' }}>
              {profile.name}
            </h1>
            <p className="text-sm font-semibold tracking-widest uppercase opacity-70 mb-6">
              {profile.subtitle}
            </p>
            <div className="w-12 h-1 rounded mb-6" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
            <p className="text-sm max-w-md opacity-80">
              {profile.heroText}
            </p>
          </div>

          {/* BOOKING FLOW */}
          <div className="w-full max-w-2xl mx-auto px-4 mt-8">
            
            {/* Step 1: Services */}
            {step === 'services' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-6 text-center">Select a Service</h2>
                {profile.services.map((svc) => (
                  <div key={svc.id} className="p-6 rounded-xl shadow-sm border border-black/5 flex justify-between items-center cursor-pointer hover:shadow-md transition-all" style={{ backgroundColor: 'var(--theme-card)' }} onClick={() => handleBookService(svc)}>
                    <div>
                      <h3 className="font-bold text-lg">{svc.name}</h3>
                      <p className="text-sm opacity-60">Est. {svc.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: 'var(--theme-primary)' }}>${svc.price}</p>
                      <button className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60 hover:opacity-100 transition-opacity">Book Now →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 'datetime' && (
              <div className="space-y-6">
                <button onClick={() => setStep('services')} className="text-sm font-bold opacity-60 mb-4">← Back to Services</button>
                <div className="p-6 rounded-xl shadow-sm border border-black/5" style={{ backgroundColor: 'var(--theme-card)' }}>
                  <h2 className="text-xl font-bold mb-2">{selectedService.name}</h2>
                  <p className="text-sm opacity-60 mb-6">${selectedService.price} • {selectedService.duration}</p>
                  
                  <h3 className="font-bold mb-4">Available Times (Tomorrow)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'].map(time => (
                      <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded border transition-all font-semibold ${selectedTime === time ? 'text-white border-transparent' : 'border-black/20 hover:border-black/50'}`}
                        style={selectedTime === time ? { backgroundColor: 'var(--theme-primary)' } : {}}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {selectedTime && (
                    <button onClick={() => setStep('checkout')} className="w-full mt-8 py-4 text-white font-bold rounded-lg shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--theme-primary)' }}>
                      Continue to Details
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Checkout Details */}
            {step === 'checkout' && (
              <div className="space-y-6">
                <button onClick={() => setStep('datetime')} className="text-sm font-bold opacity-60 mb-4">← Back to Times</button>
                <div className="p-6 rounded-xl shadow-sm border border-black/5" style={{ backgroundColor: 'var(--theme-card)' }}>
                  <h2 className="text-xl font-bold mb-6">Service Location</h2>
                  <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 rounded border border-black/10 bg-transparent focus:outline-none" />
                  <input type="text" placeholder="Street Address" className="w-full p-3 mb-4 rounded border border-black/10 bg-transparent focus:outline-none" />
                  <input type="tel" placeholder="Phone Number" className="w-full p-3 mb-8 rounded border border-black/10 bg-transparent focus:outline-none" />
                  
                  <button onClick={handleConfirmBooking} className="w-full py-4 text-white font-bold rounded-lg shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--theme-primary)' }}>
                    Confirm Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ADMIN DASHBOARD VIEW */}
      {view === 'admin' && (
        <div className="w-full max-w-3xl mx-auto px-4 mt-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Daily Manifest</h1>
            <button onClick={() => setView('booking')} className="px-4 py-2 text-sm font-bold rounded border border-black/20 hover:bg-black/5">Exit Admin</button>
          </div>
          
          <div className="space-y-4">
            {DEMO_APPOINTMENTS.map(appt => (
              <div key={appt.id} className="p-6 rounded-xl shadow-sm border border-black/5" style={{ backgroundColor: 'var(--theme-card)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{appt.time}</h3>
                    <p className="text-sm opacity-70">{appt.date}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full text-white" style={{ backgroundColor: 'var(--theme-primary)' }}>
                    {appt.status}
                  </span>
                </div>
                <h4 className="font-bold">{appt.client}</h4>
                <p className="text-sm opacity-80">{appt.service}</p>
                <p className="text-sm opacity-60 mt-2">📍 {appt.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- THE STEALTH AGENCY TOOLBAR --- */}
      {/* This is pinned to the bottom of the screen. You tap these right before handing the phone to the client. */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white p-3 flex justify-between items-center text-xs font-mono z-50 overflow-x-auto">
        <div className="flex space-x-4">
          <span className="opacity-50 font-bold uppercase tracking-widest mr-2 mt-1 hidden md:inline">Agency Config:</span>
          {Object.keys(INDUSTRY_PROFILES).map(key => (
            <button 
              key={key} 
              onClick={() => {
                setActiveProfileId(key);
                setStep('services');
              }}
              className={`px-3 py-1 rounded transition-colors ${activeProfileId === key ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setView(view === 'booking' ? 'admin' : 'booking')}
          className="px-3 py-1 border border-gray-600 rounded text-gray-300 hover:text-white ml-4"
        >
          {view === 'booking' ? 'VIEW ADMIN' : 'VIEW BOOKING'}
        </button>
      </div>

    </div>
  );
}