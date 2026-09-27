import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { APP_CONFIG } from '../agencyConfig';
import { getLocalTodayString } from '../utils/helpers';
import WelcomeStep from '../components/Booking/WelcomeStep';
import ServiceMenuStep from '../components/Booking/ServiceMenuStep';
import CalendarStep from '../components/Booking/CalendarStep';
import FinalDetailsStep from '../components/Booking/FinalDetailsStep';
import ConfirmationStep from '../components/Booking/ConfirmationStep';

export default function BookingPage() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('service_cart');
    return saved ? JSON.parse(saved) : {};
  });
  
  useEffect(() => { localStorage.setItem('service_cart', JSON.stringify(cart)); }, [cart]);

  const [groupNotes, setGroupNotes] = useState('');
  const [step, setStep] = useState(1); 
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getLocalTodayString());

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientZip, setClientZip] = useState(''); 
  const [agreedToPay, setAgreedToPay] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [liveSchedule, setLiveSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate) return;
      
      const [year, month, day] = selectedDate.split('-');
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      const [apptResponse, blockResponse] = await Promise.all([
        supabase.from('appointments').select('appointment_time, services').gte('appointment_time', startOfDay.toISOString()).lte('appointment_time', endOfDay.toISOString()),
        supabase.from('schedule_blocks').select('block_time, duration_minutes').gte('block_time', startOfDay.toISOString()).lte('block_time', endOfDay.toISOString())
      ]);

      let combinedSchedule = [];

      if (apptResponse.data) {
        const appts = apptResponse.data.map(appt => {
          const date = new Date(appt.appointment_time);
          const startStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          const totalMins = appt.services.reduce((sum, s) => sum + (s.tech_time * s.count) + (s.cleanup * s.count), 0);
          return { start: startStr, total_duration: totalMins + APP_CONFIG.travelPaddingMinutes };
        });
        combinedSchedule = [...combinedSchedule, ...appts];
      }

      if (blockResponse.data) {
        const blocks = blockResponse.data.map(block => {
          const date = new Date(block.block_time);
          const startStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          return { start: startStr, total_duration: block.duration_minutes };
        });
        combinedSchedule = [...combinedSchedule, ...blocks];
      }

      setLiveSchedule(combinedSchedule);
    };
    fetchSchedule();
  }, [selectedDate]);

  const updateCart = (id, change) => {
    setCart((prev) => {
      const currentCount = prev[id] || 0;
      const newCount = Math.max(0, currentCount + change);
      return { ...prev, [id]: newCount };
    });
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, count]) => {
    const s = APP_CONFIG.services.find(menu => menu.id === id);
    return sum + (s ? s.price * count : 0);
  }, 0);

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 10);
    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 3) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    setClientPhone(formatted);
  };

  const handleZipChange = (e) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 5);
    setClientZip(input);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(null); 
  };

  const processStripeCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Redirecting to secure Stripe Checkout. Slot reserved for 10 minutes.");
      setIsSubmitting(false);
    }, 1500);
  };

  const submitBooking = async () => {
    if (APP_CONFIG.requireUpfrontPayment) {
      processStripeCheckout();
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const { data: banData, error: banError } = await supabase
        .from('blacklist')
        .select('ban_value')
        .eq('ban_value', clientPhone)
        .maybeSingle();

      if (banError && banError.code !== 'PGRST116') console.error("Ban check error:", banError);

      if (banData) {
        setServerError("We're sorry, we are unable to accept bookings from this phone number at this time.");
        setIsSubmitting(false);
        return; 
      }

      const [year, month, day] = selectedDate.split('-');
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(year, month - 1, day, hours, minutes);
      const timestampTZ = appointmentDate.toISOString();

      const selectedServices = Object.entries(cart)
        .filter((entry) => entry[1] > 0)
        .map(([id, count]) => {
          const s = APP_CONFIG.services.find(menu => menu.id === id);
          return { name: s.name, count: count, tech_time: s.tech_time, cleanup: s.cleanup, price: s.price };
        });

      const [firstName, ...lastNameArr] = clientName.trim().split(' ');
      const lastName = lastNameArr.join(' ') || ' ';

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert(
          { phone_number: clientPhone, first_name: firstName, last_name: lastName },
          { onConflict: 'phone_number' }
        )
        .select()
        .single();

      if (clientError) throw clientError;

      const { error: apptError } = await supabase
        .from('appointments')
        .insert({
          client_id: clientData.id,
          appointment_time: timestampTZ,
          service_address: `${clientAddress.trim()}, ${clientZip}`,
          services: selectedServices,
          group_notes: groupNotes
        });

      if (apptError) throw apptError;

      localStorage.removeItem('service_cart');
      setStep(5);

    } catch (error) {
      console.error("Booking Error:", error);
      setServerError("There was an issue saving your appointment. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) return <WelcomeStep onNext={() => setStep(2)} />;
  
  if (step === 2) {
    return (
      <ServiceMenuStep 
        onBack={() => setStep(1)} 
        onNext={() => setStep(3)} 
        cart={cart} 
        updateCart={updateCart} 
        totalItems={totalItems} 
        groupNotes={groupNotes} 
        setGroupNotes={setGroupNotes} 
      />
    );
  }
  
  if (step === 3) {
    return (
      <CalendarStep 
        onBack={() => setStep(2)} 
        onNext={() => setStep(4)} 
        cart={cart} 
        liveSchedule={liveSchedule} 
        selectedDate={selectedDate} 
        handleDateChange={handleDateChange} 
        selectedTime={selectedTime} 
        setSelectedTime={setSelectedTime} 
      />
    );
  }
  
  if (step === 4) {
    return (
      <FinalDetailsStep 
        onBack={() => setStep(3)} 
        submitBooking={submitBooking} 
        clientName={clientName} 
        setClientName={setClientName} 
        clientPhone={clientPhone} 
        handlePhoneChange={handlePhoneChange} 
        clientAddress={clientAddress} 
        setClientAddress={setClientAddress} 
        clientZip={clientZip} 
        handleZipChange={handleZipChange} 
        agreedToPay={agreedToPay} 
        setAgreedToPay={setAgreedToPay} 
        cartTotal={cartTotal} 
        serverError={serverError} 
        isSubmitting={isSubmitting} 
      />
    );
  }
  
  if (step === 5) {
    return (
      <ConfirmationStep 
        selectedDate={selectedDate} 
        selectedTime={selectedTime} 
        onReset={() => { setStep(1); setCart({}); }} 
      />
    );
  }

  return null;
}
