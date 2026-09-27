/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

export default function LiveStatusBanner() {
  const [statusConfig, setStatusConfig] = useState(null);

  useEffect(() => {
    if (!APP_CONFIG.features.enableLiveStatusBanner) return;
    
    // In a real app, this would fetch from Supabase.
    // For demo mode, we'll read from localStorage.
    const saved = localStorage.getItem('live_status_banner');
    if (saved) {
      setStatusConfig(JSON.parse(saved));
    } else {
      setStatusConfig({
        active: true,
        color: 'green',
        message: '🎉 Spring Special: Get 20% off all deep cleaning and landscaping services!',
        actionText: 'Book Now',
        actionUrl: '#'
      });
    }
  }, []);

  if (!APP_CONFIG.features.enableLiveStatusBanner || !statusConfig || !statusConfig.active) {
    return null;
  }

  const dotColor = 
    statusConfig.color === 'green' ? 'bg-green-500' : 
    statusConfig.color === 'amber' ? 'bg-yellow-500' : 'bg-red-500';

  const bannerBg = 
    statusConfig.color === 'green' ? 'bg-green-50 text-green-900 border-green-200' : 
    statusConfig.color === 'amber' ? 'bg-yellow-50 text-yellow-900 border-yellow-200' : 'bg-red-50 text-red-900 border-red-200';

  return (
    <div className={`w-full p-3 border-b flex items-center justify-center text-sm md:text-base font-semibold ${bannerBg}`}>
      <span className={`w-3 h-3 rounded-full mr-3 animate-pulse ${dotColor}`}></span>
      <span className="flex-grow text-center">{statusConfig.message}</span>
      {statusConfig.actionText && statusConfig.actionUrl && (
        <a href={statusConfig.actionUrl} className="ml-4 underline font-bold whitespace-nowrap hover:opacity-80">
          {statusConfig.actionText}
        </a>
      )}
    </div>
  );
}
