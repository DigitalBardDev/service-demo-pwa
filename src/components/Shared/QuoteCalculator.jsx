import { useState } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

export default function QuoteCalculator() {
  const [quantities, setQuantities] = useState({});
  const [isRecurring, setIsRecurring] = useState(false);

  if (!APP_CONFIG.features.enableQuoteCalculator) return null;

  const handleQuantityChange = (id, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => ({ ...prev, [id]: num }));
  };

  const baseTotal = APP_CONFIG.services.reduce((total, service) => {
    const qty = quantities[service.id] || 0;
    const rate = service.ratePerUnit || service.price; // fallback to base price if no rate
    return total + (qty * rate);
  }, 0);

  const discountMultiplier = isRecurring ? 0.85 : 1; // 15% discount for subscriptions
  const estimatedTotal = baseTotal * discountMultiplier;

  return (
    <div className="w-full py-12 bg-white flex flex-col items-center border-t border-b border-gray-100">
      <div className="w-full max-w-4xl px-4">
        <h2 className="text-3xl font-bold text-[var(--theme-primary)] mb-4 text-center">Instant Quote Estimator</h2>
        <p className="text-gray-600 text-center mb-8">Enter your project sizes (e.g., Sq Ft) to calculate an estimated total.</p>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {APP_CONFIG.services.map(service => {
            const qty = quantities[service.id] || '';
            const rate = service.ratePerUnit || service.price;
            return (
              <div 
                key={service.id} 
                className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  qty > 0 
                    ? 'border-[var(--theme-primary)] bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{service.name}</h4>
                    <p className="text-sm text-gray-500">${rate.toFixed(2)} per {service.unitName || 'unit'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder={`Enter ${service.unitName || 'qty'}`}
                    value={qty}
                    onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  />
                  <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{service.unitName || 'units'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex justify-center mb-8">
          <label className="flex items-center gap-3 cursor-pointer bg-green-50 px-6 py-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
            <input 
              type="checkbox" 
              checked={isRecurring} 
              onChange={(e) => setIsRecurring(e.target.checked)} 
              className="w-6 h-6 text-green-600 rounded focus:ring-green-500 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-bold text-green-800 text-lg">Subscribe & Save 15%</span>
              <span className="text-sm text-green-700">Set this up as a recurring monthly service</span>
            </div>
          </label>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center border border-gray-200">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <span className="block text-gray-500 font-bold uppercase tracking-wider text-sm">Estimated Total</span>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold text-[var(--theme-primary)]">${estimatedTotal.toFixed(2)}</span>
              {isRecurring && baseTotal > 0 && (
                <span className="text-lg line-through text-gray-400">${baseTotal.toFixed(2)}</span>
              )}
            </div>
            {isRecurring && <span className="block text-green-600 font-bold text-sm mt-1">Billed Monthly</span>}
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="px-8 py-3 bg-[var(--theme-accent)] text-white font-bold rounded-xl shadow hover:opacity-90 transition-opacity"
          >
            Start Booking
          </button>
        </div>
      </div>
    </div>
  );
}
