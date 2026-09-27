/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

export default function AdminExtrasTab() {
  const [statusConfig, setStatusConfig] = useState({
    active: false, color: 'green', message: '', actionText: '', actionUrl: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('live_status_banner');
    if (saved) setStatusConfig(JSON.parse(saved));
  }, []);

  const saveStatus = (newConfig) => {
    setStatusConfig(newConfig);
    localStorage.setItem('live_status_banner', JSON.stringify(newConfig));
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Extras Tab Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">Manage interactive widgets here. The Live Status Banner lets you alert site visitors to emergencies, delays, or flash sales. The Before & After Gallery builds trust by showcasing your best transformations.</p>
        </div>
      </div>
      {/* Status Banner Settings */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-xl font-bold text-white">Live Status Banner</h2>
          <button 
            onClick={() => saveStatus({ ...statusConfig, active: !statusConfig.active })}
            className={`px-4 py-2 rounded font-bold text-sm ${statusConfig.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}
          >
            {statusConfig.active ? 'Active (ON)' : 'Disabled (OFF)'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Indicator Color</label>
            <select 
              value={statusConfig.color}
              onChange={(e) => saveStatus({ ...statusConfig, color: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
            >
              <option value="green">Green (Available)</option>
              <option value="amber">Amber (Delayed / Limited)</option>
              <option value="red">Red (Closed / Emergency)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Announcement Message</label>
            <input 
              type="text" 
              value={statusConfig.message}
              onChange={(e) => saveStatus({ ...statusConfig, message: e.target.value })}
              placeholder="e.g. Weather delay today!"
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-400 mb-2">Action Button Text</label>
              <input 
                type="text" 
                value={statusConfig.actionText}
                onChange={(e) => saveStatus({ ...statusConfig, actionText: e.target.value })}
                placeholder="e.g. Call Now"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-400 mb-2">Action URL / Phone</label>
              <input 
                type="text" 
                value={statusConfig.actionUrl}
                onChange={(e) => saveStatus({ ...statusConfig, actionUrl: e.target.value })}
                placeholder="e.g. tel:5551234"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Before / After Gallery */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-white mb-6">Before & After Gallery</h2>
        <p className="text-gray-400 mb-4 text-sm">Upload image pairs to show off your recent work.</p>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-all border border-gray-600 border-dashed">
          + Add New Photo Pair
        </button>
      </div>
    </div>
  );
}
