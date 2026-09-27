/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

export default function SlotRosterCalendar({ onSpotClaimed }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Claim form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!APP_CONFIG.features.enableSlotRosterCalendar) return;
    
    const saved = localStorage.getItem('slot_drops_v2');
    if (saved) {
      setSlots(JSON.parse(saved));
    } else {
      const defaultSlots = [
        { id: 1, title: 'Fall Yard Cleanup Special', date: 'Next Saturday', startTime: '09:00 AM', duration: 120, capacity: 10, booked: 8, price: 50 },
        { id: 2, title: 'HVAC Winter Prep Class', date: 'Next Sunday', startTime: '10:00 AM', duration: 60, capacity: 5, booked: 5, price: 0 }
      ];
      setSlots(defaultSlots);
      localStorage.setItem('slot_drops_v2', JSON.stringify(defaultSlots));
    }
  }, []);

  if (!APP_CONFIG.features.enableSlotRosterCalendar || slots.length === 0) return null;

  const handleClaim = (e) => {
    e.preventDefault();
    const updatedSlots = slots.map(s => {
      if (s.id === selectedSlot.id) {
        return { ...s, booked: s.booked + 1 };
      }
      return s;
    });
    setSlots(updatedSlots);
    localStorage.setItem('slot_drops', JSON.stringify(updatedSlots));
    
    // In a real app, save to Supabase here
    alert(`Success! You have claimed a spot for ${selectedSlot.title}.`);
    setSelectedSlot(null);
    if (onSpotClaimed) onSpotClaimed();
  };

  const handleWaitlist = (e) => {
    e.preventDefault();
    alert(`You've been added to the waitlist for ${selectedSlot.title}! We will text you if a spot opens up.`);
    setSelectedSlot(null);
  };

  return (
    <div className="w-full py-12 px-4 bg-gray-50 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[var(--theme-primary)] mb-8 text-center">Upcoming Classes & Events</h2>
      
      <div className="w-full max-w-4xl grid gap-6 md:grid-cols-2">
        {slots.map(slot => {
          const spotsLeft = slot.capacity - slot.booked;
          const isFull = spotsLeft <= 0;
          
          return (
            <div key={slot.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{slot.title}</h3>
                <span className="font-bold text-[var(--theme-primary)]">${slot.price}</span>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Date:</strong> {slot.date}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Time:</strong> {slot.startTime} ({slot.duration} mins)
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : spotsLeft <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                  {isFull ? 'Full - Waitlist Only' : `${spotsLeft} of ${slot.capacity} spots left`}
                </span>
                
                <button 
                  onClick={() => setSelectedSlot(slot)} 
                  className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${isFull ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[var(--theme-accent)] hover:opacity-90'}`}
                >
                  {isFull ? 'Join Waitlist' : 'Claim Spot'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim / Waitlist Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setSelectedSlot(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl">&times;</button>
            <h3 className="text-2xl font-bold mb-2">{selectedSlot.title}</h3>
            <p className="text-gray-600 mb-6">{selectedSlot.date} at {selectedSlot.startTime}</p>
            
            <form onSubmit={selectedSlot.capacity - selectedSlot.booked <= 0 ? handleWaitlist : handleClaim} className="flex flex-col gap-4">
              <input type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]" />
              <input type="tel" required placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]" />
              <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]" />
              
              <button type="submit" className={`w-full py-4 mt-2 rounded-xl text-white font-bold text-lg ${selectedSlot.capacity - selectedSlot.booked <= 0 ? 'bg-gray-800' : 'bg-[var(--theme-primary)]'}`}>
                {selectedSlot.capacity - selectedSlot.booked <= 0 ? 'Join Waitlist' : 'Confirm & Claim Spot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
