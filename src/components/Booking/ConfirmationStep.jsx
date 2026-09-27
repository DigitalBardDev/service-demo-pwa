export default function ConfirmationStep({ selectedDate, selectedTime, onReset }) {
  const [year, month, day] = selectedDate.split('-');
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg border-t-8 border-[var(--theme-primary)]">
        <h1 className="text-3xl font-bold text-[var(--theme-text)] mb-4">Appointment Confirmed!</h1>
        <p className="text-lg opacity-90 mb-6">We will arrive on <br/><strong>{formattedDate}</strong> at <strong>{selectedTime}</strong>.</p>
        <button onClick={onReset} className="w-full bg-gray-200 text-gray-800 text-lg font-bold py-4 rounded-xl hover:bg-gray-300 transition-all">
          Return Home
        </button>
      </div>
    </div>
  );
}
