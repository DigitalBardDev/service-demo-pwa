/* eslint-disable react-hooks/set-state-in-effect */
import { useState } from 'react';
import { APP_CONFIG, updateAppConfig } from '../../agencyConfig';

export default function AdminServicesTab() {
  const [services, setServices] = useState(APP_CONFIG.services);

  const handlePriceChange = (id, newPrice) => {
    const updated = services.map(s => s.id === id ? { ...s, price: Number(newPrice), ratePerUnit: Number(newPrice) } : s);
    setServices(updated);
    updateAppConfig({ services: updated });
  };

  const handleUnitNameChange = (id, newUnitName) => {
    const updated = services.map(s => s.id === id ? { ...s, unitName: newUnitName } : s);
    setServices(updated);
    updateAppConfig({ services: updated });
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Services Tab Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">Easily update your pricing and quoting rules on the fly. Adjusting the rates here instantly updates the Quote Calculator and Checkout processes on the live site.</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-white mb-6">Service Menu & Quote Builder Settings</h2>
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-4 rounded-lg">
              <div className="mb-4 md:mb-0 text-center md:text-left flex-1">
                <h3 className="text-lg font-bold text-gray-200">{service.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <span>Duration:</span>
                  <input 
                    type="number" 
                    value={service.tech_time} 
                    onChange={(e) => {
                      const updated = services.map(s => s.id === service.id ? { ...s, tech_time: Number(e.target.value) } : s);
                      setServices(updated);
                      updateAppConfig({ services: updated });
                    }}
                    className="w-16 p-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400 text-center" 
                  />
                  <span>m +</span>
                  <input 
                    type="number" 
                    value={service.cleanup} 
                    onChange={(e) => {
                      const updated = services.map(s => s.id === service.id ? { ...s, cleanup: Number(e.target.value) } : s);
                      setServices(updated);
                      updateAppConfig({ services: updated });
                    }}
                    className="w-16 p-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400 text-center" 
                  />
                  <span>m prep</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={service.ratePerUnit || service.price} 
                    onChange={(e) => handlePriceChange(service.id, e.target.value)}
                    className="w-24 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400 font-bold text-center" 
                  />
                </div>
                <span className="text-gray-400 font-bold">per</span>
                <input 
                  type="text" 
                  value={service.unitName || 'unit'} 
                  onChange={(e) => handleUnitNameChange(service.id, e.target.value)}
                  className="w-24 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400 font-bold text-center" 
                />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => window.location.reload()} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all border border-blue-500">
          Save & Apply Changes to Live Site
        </button>
      </div>
    </div>
  );
}
