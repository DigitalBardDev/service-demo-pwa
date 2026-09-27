import { APP_CONFIG } from '../../agencyConfig';

export default function ServiceMenuStep({ onBack, onNext, cart, updateCart, totalItems, groupNotes, setGroupNotes }) {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col items-center py-10 px-4">
      <button onClick={onBack} className="mb-8 text-lg font-bold opacity-70 hover:opacity-100">← Back to Welcome</button>
      <h1 className="text-4xl font-bold text-[var(--theme-primary)] mb-2 text-center drop-shadow-sm">Service Menu</h1>
      <p className="text-xl mb-8 text-center opacity-90">Select the services you need.</p>

      <div className="w-full max-w-4xl grid gap-4 sm:grid-cols-2 mb-8">
        {APP_CONFIG.services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-gray-100 hover:border-[var(--theme-primary)] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xl font-bold">{service.name}</span>
              <span className="text-2xl text-[var(--theme-primary)] font-extrabold">${service.price}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <span className="text-gray-500 font-medium">Quantity</span>
              <div className="flex items-center space-x-4 bg-gray-50 rounded-full p-1">
                <button onClick={() => updateCart(service.id, -1)} className="bg-white hover:bg-gray-200 text-xl font-bold h-10 w-10 rounded-full flex items-center justify-center shadow-sm">-</button>
                <span className="text-xl font-bold w-6 text-center">{cart[service.id] || 0}</span>
                <button onClick={() => updateCart(service.id, 1)} className="bg-[var(--theme-primary)] text-white text-xl font-bold h-10 w-10 rounded-full flex items-center justify-center shadow-sm">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 1 && (
        <div className="w-full max-w-4xl mb-24">
          <label className="block text-xl font-bold mb-3 text-gray-700">Additional Details or Instructions</label>
          <textarea className="w-full p-5 rounded-2xl border border-gray-200 text-lg shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" placeholder="Gate codes, special requests..." rows="4" value={groupNotes} onChange={(e) => setGroupNotes(e.target.value)} />
        </div>
      )}

      {/* Live Sticky Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 flex flex-col md:flex-row justify-between items-center z-50 border-t border-gray-200">
        <div className="flex flex-col mb-3 md:mb-0 text-center md:text-left">
          <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Estimated Total</span>
          <span className="text-2xl font-bold text-[var(--theme-primary)]">
            ${Object.entries(cart).reduce((sum, [id, count]) => {
              const s = APP_CONFIG.services.find(menu => menu.id === id);
              return sum + (s ? s.price * count : 0);
            }, 0)}
          </span>
        </div>
        <button disabled={totalItems === 0} onClick={onNext} className={`w-full md:w-auto px-10 text-xl font-bold py-4 rounded-xl shadow-md transition-all ${totalItems > 0 ? 'bg-[var(--theme-primary)] text-white hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {totalItems > 0 ? 'Lock In Quote & Request Date' : 'Select a Service to Begin'}
        </button>
      </div>
    </div>
  );
}
