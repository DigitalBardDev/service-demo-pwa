import { APP_CONFIG } from '../agencyConfig';

export const getLocalTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export function generateTimeSlots(startStr, endStr, interval) {
  const slots = [];
  let current = new Date(`2000-01-01T${startStr}:00`);
  const endTime = new Date(`2000-01-01T${endStr}:00`);
  
  while (current <= endTime) {
    const hh = String(current.getHours()).padStart(2, '0');
    const mm = String(current.getMinutes()).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
}

export function getAvailableSlots(cart, liveSchedule, selectedDate) {
  let totalTechTime = 0;
  let totalCleanup = 0;
  
  Object.keys(cart).forEach(id => {
    const service = APP_CONFIG.services.find(s => s.id === id);
    const count = cart[id];
    totalTechTime += (service.tech_time * count);
    totalCleanup += (service.cleanup * count);
  });

  const totalRequestedMinutes = totalTechTime + totalCleanup + APP_CONFIG.travelPaddingMinutes;
  
  // Generates slots dynamically from config rather than a hardcoded array
  const allPossibleSlots = generateTimeSlots(
    APP_CONFIG.operatingHours.start, 
    APP_CONFIG.operatingHours.end, 
    APP_CONFIG.operatingHours.intervalMinutes
  );

  const timeToMins = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60) + m;
  };

  const now = new Date();
  const isToday = selectedDate === getLocalTodayString();
  const currentMins = (now.getHours() * 60) + now.getMinutes();

  return allPossibleSlots.filter(slot => {
    const requestedStart = timeToMins(slot);
    const requestedEnd = requestedStart + totalRequestedMinutes;

    if (requestedEnd > timeToMins(APP_CONFIG.operatingHours.end) + 60) return false; 
    if (isToday && requestedStart < (currentMins + 120)) return false; // Requires 2 hour lead time for same-day

    const hasConflict = liveSchedule.some(appt => {
      const apptStart = timeToMins(appt.start);
      const apptEnd = apptStart + appt.total_duration;
      return (requestedStart < apptEnd && requestedEnd > apptStart);
    });

    return !hasConflict;
  });
}
