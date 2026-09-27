import { APP_CONFIG } from '../../agencyConfig';
import LiveStatusBanner from '../Shared/LiveStatusBanner';
import CompatibilityChecker from '../Shared/CompatibilityChecker';
import BeforeAfterGallery from '../Shared/BeforeAfterGallery';
import QuoteCalculator from '../Shared/QuoteCalculator';
import ReviewSection from '../Shared/ReviewSection';
import SlotRosterCalendar from './SlotRosterCalendar';

export default function WelcomeStep({ onNext }) {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col items-center">
      <LiveStatusBanner />
      
      {/* Header / Navbar */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="font-extrabold text-2xl text-[var(--theme-primary)] tracking-tight">
            {APP_CONFIG.businessName}
          </div>
          <div className="hidden md:flex gap-8 font-bold text-gray-600">
            <a href="#services" className="hover:text-[var(--theme-primary)]">Services</a>
            <a href="#how-it-works" className="hover:text-[var(--theme-primary)]">How It Works</a>
            <a href="#contact" className="hover:text-[var(--theme-primary)]">Contact</a>
          </div>
          {APP_CONFIG.features.enableAppointmentCalendar && (
            <button onClick={onNext} className="bg-[var(--theme-primary)] text-white px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
              Book Now
            </button>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              {APP_CONFIG.tagline}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              {APP_CONFIG.heroDescription}
            </p>
            
            {APP_CONFIG.features.enableAppointmentCalendar && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={onNext} className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all bg-[var(--theme-primary)] text-white hover:scale-[1.02] hover:shadow-xl hover:bg-opacity-90">
                  {APP_CONFIG.features.enableQuoteCalculator ? 'Get a Custom Quote & Book' : 'Book an Appointment'}
                </button>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="w-full aspect-[4/3] lg:aspect-[16/9] bg-gray-100 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-gray-400 border-4 border-white overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80" alt="Professional Services" className="absolute top-0 left-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="w-full bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 font-bold text-gray-500 uppercase tracking-widest text-sm text-center">
          <span>✓ Fully Insured</span>
          <span>✓ Licensed Professionals</span>
          <span>✓ 100% Satisfaction Guarantee</span>
          <span>✓ Fast Response Time</span>
        </div>
      </div>

      <ReviewSection />

      {/* Micro-Tools Configuration */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 py-12 px-4 sm:px-6 lg:px-8">
        <CompatibilityChecker />
        <QuoteCalculator />
        <SlotRosterCalendar />
        <BeforeAfterGallery />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Booking our services is simple and stress-free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold mb-2">Request a Quote</h3>
              <p className="text-gray-600">Select the services you need and pick a preferred date using our interactive booking tool.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold mb-2">We Confirm</h3>
              <p className="text-gray-600">We will review your request and confirm the appointment details with you directly.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold mb-2">We Deliver</h3>
              <p className="text-gray-600">Our professionals arrive on time and provide high-quality service guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div id="services" className="w-full py-16 lg:py-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional solutions tailored to your needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {APP_CONFIG.services.slice(0, 3).map(service => (
              <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{service.name}</h3>
                <p className="text-gray-500 mb-6 flex-grow">A professional {service.name.toLowerCase()} tailored to meet your specific requirements.</p>
                <div className="font-extrabold text-2xl text-[var(--theme-primary)]">${service.price}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            {APP_CONFIG.features.enableAppointmentCalendar && (
              <button onClick={onNext} className="text-lg font-bold text-[var(--theme-primary)] hover:underline">
                View All Services & Book &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="w-full bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold mb-2">{APP_CONFIG.businessName}</h3>
            <p className="text-gray-400 max-w-xs">{APP_CONFIG.tagline}</p>
          </div>
          <div className="text-center md:text-right text-gray-400 space-y-2">
            <p><strong>Contact Us</strong></p>
            <p>hello@example.com</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {APP_CONFIG.businessName}. All rights reserved.</p>
          <a href="/admin" className="mt-4 sm:mt-0 font-bold hover:text-white transition-colors">Owner Login</a>
        </div>
      </footer>
    </div>
  );
}
