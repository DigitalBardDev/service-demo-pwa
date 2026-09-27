/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

export default function CompatibilityChecker() {
  const [data, setData] = useState([]);
  
  // Selected options
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!APP_CONFIG.features.enableCompatibilityChecker) return;
    
    const saved = localStorage.getItem('car_selector_data');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const defaultData = [
        { year: '2024', make: 'Toyota', model: 'Camry', trim: 'LE', status: 'yes', message: 'We provide full mechanical service for this vehicle.', fee: 0 },
        { year: '2024', make: 'Toyota', model: 'Camry', trim: 'XLE', status: 'yes', message: 'We provide full mechanical service for this vehicle.', fee: 0 },
        { year: '2023', make: 'Honda', model: 'Civic', trim: 'Sport', status: 'yes', message: 'We provide full mechanical service for this vehicle.', fee: 0 },
        { year: '2023', make: 'Honda', model: 'Civic', trim: 'Touring', status: 'yes', message: 'We provide full mechanical service for this vehicle.', fee: 0 },
        { year: '2022', make: 'Ford', model: 'F-150', trim: 'XLT', status: 'yes', message: 'We service this truck (Note: requires heavy duty lift).', fee: 50 },
        { year: '2022', make: 'Ford', model: 'Mustang', trim: 'GT', status: 'yes', message: 'We provide full mechanical service for this vehicle.', fee: 0 },
        { year: '2021', make: 'Tesla', model: 'Model 3', trim: 'Long Range', status: 'no', message: 'Sorry, we do not service electric vehicles at this time.', fee: 0 }
      ];
      setData(defaultData);
      localStorage.setItem('car_selector_data', JSON.stringify(defaultData));
    }
  }, []);

  // Compute available options based on selections
  const availableYears = useMemo(() => [...new Set(data.map(c => c.year))].sort().reverse(), [data]);
  const availableMakes = useMemo(() => [...new Set(data.filter(c => !year || c.year === year).map(c => c.make))].sort(), [data, year]);
  const availableModels = useMemo(() => [...new Set(data.filter(c => (!year || c.year === year) && (!make || c.make === make)).map(c => c.model))].sort(), [data, year, make]);
  const availableTrims = useMemo(() => [...new Set(data.filter(c => (!year || c.year === year) && (!make || c.make === make) && (!model || c.model === model)).map(c => c.trim))].sort(), [data, year, make, model]);

  if (!APP_CONFIG.features.enableCompatibilityChecker) return null;

  const handleCheck = (e) => {
    e.preventDefault();
    if (!year || !make || !model || !trim) return;

    const match = data.find(c => c.year === year && c.make === make && c.model === model && c.trim === trim);
    
    if (match) {
      setResult(match);
    } else {
      setResult({
        status: 'unknown',
        message: 'We could not verify this vehicle automatically. Please contact us for details.'
      });
    }
  };

  // Handlers to cascade resets
  const handleYearChange = (e) => { setYear(e.target.value); setMake(''); setModel(''); setTrim(''); setResult(null); };
  const handleMakeChange = (e) => { setMake(e.target.value); setModel(''); setTrim(''); setResult(null); };
  const handleModelChange = (e) => { setModel(e.target.value); setTrim(''); setResult(null); };
  const handleTrimChange = (e) => { setTrim(e.target.value); setResult(null); };

  return (
    <div className="w-full py-10 bg-[var(--theme-bg)] flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-[var(--theme-primary)] mb-2">Vehicle Service Checker</h2>
        <p className="text-gray-600 mb-6">Select your vehicle's Year, Make, Model, and Trim to see if we service it.</p>

        <form onSubmit={handleCheck} className="flex flex-col gap-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] bg-white" value={year} onChange={handleYearChange} required>
              <option value="">-- Select Year --</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            
            <select className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] bg-white" value={make} onChange={handleMakeChange} disabled={!year} required>
              <option value="">-- Select Make --</option>
              {availableMakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <select className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] bg-white" value={model} onChange={handleModelChange} disabled={!make} required>
              <option value="">-- Select Model --</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <select className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] bg-white" value={trim} onChange={handleTrimChange} disabled={!model} required>
              <option value="">-- Select Trim --</option>
              {availableTrims.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <button type="submit" disabled={!year || !make || !model || !trim} className="mt-2 bg-[var(--theme-primary)] text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity">
            Check Compatibility
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-xl border-l-4 shadow-sm flex items-start gap-4 ${
            result.status === 'yes' ? 'bg-green-50 border-green-500' :
            result.status === 'no' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
          }`}>
            <div className={`text-2xl ${
              result.status === 'yes' ? 'text-green-500' :
              result.status === 'no' ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {result.status === 'yes' ? '✅' : result.status === 'no' ? '❌' : '⚠️'}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{result.message}</p>
              {result.fee > 0 && <p className="text-sm text-gray-600 mt-1">Note: A surcharge of ${result.fee} applies for this vehicle.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
