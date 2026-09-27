import { APP_CONFIG } from '../../agencyConfig';

export default function FinalDetailsStep({
  onBack,
  submitBooking,
  clientName,
  setClientName,
  clientPhone,
  handlePhoneChange,
  clientAddress,
  setClientAddress,
  clientZip,
  handleZipChange,
  agreedToPay,
  setAgreedToPay,
  cartTotal,
  serverError,
  isSubmitting
}) {
  const rawPhone = clientPhone.replace(/\D/g, '');
  const isSpamPhone = () => {
    if (rawPhone.length !== 10) return true; 
    if (rawPhone.substring(3, 6) === '555') return true; 
    if (/^(.)\1{9}$/.test(rawPhone)) return true; 
    return false;
  };
  const isZipValid = () => {
    if (clientZip.length !== 5) return false;
    if (APP_CONFIG.allowedZipCodes.length === 0) return true;
    return APP_CONFIG.allowedZipCodes.includes(clientZip);
  };

  const isNameValid = clientName.trim().length >= 2;
  const isAddressValid = clientAddress.trim().length >= 5 && /^\d+\s/.test(clientAddress.trim());
  const isFormValid = isNameValid && isAddressValid && isZipValid() && !isSpamPhone() && agreedToPay && !isSubmitting;

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col items-center py-10 px-4">
      <button onClick={onBack} className="mb-8 text-lg font-bold opacity-70 hover:opacity-100">← Back to Calendar</button>
      <h2 className="text-3xl font-bold text-[var(--theme-primary)] mb-6 text-center">Final Details</h2>

      <form className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); submitBooking(); }}>
        <div className="w-full space-y-4 mb-8">
          <input type="text" required placeholder="Full Name" className="w-full p-4 text-lg rounded-xl border border-gray-300 bg-white" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input type="tel" required placeholder="Mobile Number" className="w-full p-4 text-lg rounded-xl border border-gray-300 bg-white" value={clientPhone} onChange={handlePhoneChange} />
          <div className="flex space-x-4">
            <input type="text" required placeholder="Street Address" className="w-full p-4 text-lg rounded-xl border border-gray-300 bg-white flex-grow" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
            <input type="text" required placeholder="Zip" className="w-32 p-4 text-lg rounded-xl border border-gray-300 bg-white" value={clientZip} onChange={handleZipChange} />
          </div>
        </div>

        <div className="w-full mb-8 flex items-start space-x-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <input type="checkbox" id="agreement" required className="w-6 h-6 mt-1 accent-[var(--theme-primary)]" checked={agreedToPay} onChange={(e) => setAgreedToPay(e.target.checked)} />
          <label htmlFor="agreement" className="text-md opacity-90 cursor-pointer">
            {APP_CONFIG.requireUpfrontPayment 
              ? `I agree to proceed to secure checkout. Total due today: $${cartTotal}.`
              : `I agree to the service terms and will pay $${cartTotal} upon arrival.`}
          </label>
        </div>

        {serverError && <div className="w-full p-4 mb-4 bg-red-100 text-red-700 rounded-xl text-center font-bold">{serverError}</div>}

        <button type="submit" disabled={!isFormValid} className={`w-full text-xl font-bold py-5 rounded-xl shadow-md transition-all ${isFormValid ? 'bg-[var(--theme-primary)] text-white hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {isSubmitting ? 'Processing...' : (APP_CONFIG.requireUpfrontPayment ? 'Continue to Payment' : 'Confirm Appointment')}
        </button>
      </form>
    </div>
  );
}
