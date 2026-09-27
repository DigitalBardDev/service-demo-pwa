import { getAvailableSlots, getLocalTodayString } from '../../utils/helpers';

export default function CalendarStep({ 
  onBack, 
  onNext, 
  cart, 
  liveSchedule, 
  selectedDate, 
  handleDateChange, 
  selectedTime, 
  setSelectedTime 
}) {
  const availableSlots = getAvailableSlots(cart, liveSchedule, selectedDate);
  const todayStr = getLocalTodayString();

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col items-center py-10 px-4">
      <button onClick={onBack} className="mb-8 text-lg font-bold opacity-70 hover:opacity-100">← Back to Services</button>
      <h2 className="text-3xl font-bold text-[var(--theme-primary)] mb-6 text-center">When would you like to book?</h2>

      <div className="w-full max-w-3xl mb-8 flex flex-col items-center">
         <label className="text-xl font-bold mb-2">Select a Date:</label>
         <input type="date" min={todayStr} value={selectedDate} onChange={handleDateChange} className="w-full md:w-1/2 p-4 text-xl rounded-xl border-2 border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] bg-white text-center" />
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {availableSlots.length > 0 ? (
          availableSlots.map(time => (
            <button key={time} onClick={() => setSelectedTime(time)} className={`py-4 text-xl font-bold rounded-xl border-2 transition-all ${selectedTime === time ? 'bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]' : 'bg-white border-gray-300 hover:border-[var(--theme-primary)]'}`}>
              {time}
            </button>
          ))
        ) : (
          <div className="col-span-2 text-center text-lg text-red-600 font-bold p-8 bg-white rounded-xl shadow">
            No times available for this selection on {selectedDate}. Please try another day.
          </div>
        )}
      </div>

      {selectedTime && (
        <div className="w-full max-w-3xl flex justify-center mt-8">
          <button onClick={onNext} className="w-full md:w-1/2 bg-[var(--theme-primary)] text-white text-xl font-bold py-5 rounded-xl shadow-md hover:scale-[1.02] transition-all">
            Next: Enter Address
          </button>
        </div>
      )}
    </div>
  );
}
