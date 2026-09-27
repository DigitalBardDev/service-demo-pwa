import { getLocalTodayString } from '../../utils/helpers';

export default function AdminScheduleTab({
  sortedDates,
  scheduleItemsByDate,
  handleAddBlock,
  blockDate,
  setBlockDate,
  blockTime,
  setBlockTime,
  blockDuration,
  setBlockDuration,
  blockReason,
  setBlockReason,
  handleRemoveBlock,
  handleCancelAppointment
}) {
  return (
    <div className="w-full max-w-5xl">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3 mb-6">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Schedule Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">This is your centralized calendar. You can view all upcoming booked jobs, launch GPS navigation directly to client addresses, and manually block off times (like lunch or vacations) so clients cannot book those slots.</p>
          <p className="text-gray-300 text-sm mt-2 font-bold">Important Note on Calendar Modes:</p>
          <p className="text-gray-300 text-sm">You can toggle between two modes in Demo Settings: Mode A (Open-Window) allows clients to request 1-on-1 appointments based on your operating hours. Mode B (Fixed-Time Drop Roster) allows you to post specific classes or mini-sessions with limited spots that clients can sign up for.</p>
        </div>
      </div>
      <div className="w-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Block Schedule Time</h2>
        <form onSubmit={handleAddBlock} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold mb-1 text-gray-400">Date</label>
            <input type="date" required min={getLocalTodayString()} value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold mb-1 text-gray-400">Time</label>
            <input type="time" required value={blockTime} onChange={(e) => setBlockTime(e.target.value)} className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:w-24 shrink-0">
            <label className="block text-sm font-bold mb-1 text-gray-400">Mins</label>
            <input type="number" required min="15" step="15" value={blockDuration} onChange={(e) => setBlockDuration(e.target.value)} className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:flex-grow">
            <label className="block text-sm font-bold mb-1 text-gray-400">Reason</label>
            <input type="text" required value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-500 shrink-0">
            Add Block
          </button>
        </form>
      </div>

      <div className="w-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Post Slot Drop (Mode B)</h2>
        <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={(e) => { e.preventDefault(); alert('Slot drop saved! (Demo only)'); }}>
          <div className="w-full md:flex-grow">
            <label className="block text-sm font-bold mb-1 text-gray-400">Event Title</label>
            <input type="text" required placeholder="e.g. HIIT 45" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold mb-1 text-gray-400">Date</label>
            <input type="date" required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold mb-1 text-gray-400">Time</label>
            <input type="time" required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="w-full md:w-20 shrink-0">
            <label className="block text-sm font-bold mb-1 text-gray-400">Spots</label>
            <input type="number" required min="1" defaultValue="10" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-purple-600 text-white font-bold p-3 rounded hover:bg-purple-500 shrink-0">
            Post Drop
          </button>
        </form>
      </div>
      
      <div className="space-y-12">
        {sortedDates.length === 0 ? <p className="text-center text-xl text-gray-500">No upcoming appointments or blocks scheduled.</p> : (
          sortedDates.map(dateGroup => (
            <div key={dateGroup}>
              <div className="border-b border-gray-600 mb-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-300">{dateGroup}</h2>
              </div>
              <div className="space-y-6">
                {scheduleItemsByDate[dateGroup].map(item => {
                  const timeString = new Date(item.appointment_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                  if (item.type === 'block') {
                    return (
                      <div key={item.id} className="bg-gray-800 p-4 rounded-xl border-l-4 border-gray-500 shadow flex justify-between items-center opacity-80">
                        <div>
                          <h3 className="text-xl font-bold text-gray-300">{timeString} - {item.reason}</h3>
                          <p className="text-sm text-gray-400">Duration: {item.duration_minutes} minutes</p>
                        </div>
                        <button onClick={() => handleRemoveBlock(item.id, item.reason)} className="px-4 py-2 bg-gray-700 text-gray-200 rounded text-sm font-bold">Remove Block</button>
                      </div>
                    );
                  }

                  const totalPrice = item.services.reduce((sum, s) => sum + (s.price * s.count), 0);
                  const fullName = `${item.clients?.first_name} ${item.clients?.last_name}`;
                  const mapLink = `https://maps.google.com/?q=${encodeURIComponent(item.service_address)}`;

                  return (
                    <div key={item.id} className="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-lg relative">
                      <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-4">
                        <h3 className="text-2xl font-bold text-white">{timeString}</h3>
                        <span className="text-xl font-bold text-blue-400">${totalPrice}</span>
                      </div>
                      <div className="space-y-2 mb-4 text-gray-300">
                        <p className="text-lg"><span className="font-bold text-gray-500">Client:</span> {fullName}</p>
                        <p className="text-lg"><span className="font-bold text-gray-500">Phone:</span> {item.clients?.phone_number}</p>
                        <p className="text-lg"><span className="font-bold text-gray-500">Address:</span> {item.service_address}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg mb-4">
                        <h4 className="font-bold text-blue-400 mb-2">Services Requested:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {item.services.map((s, idx) => <li key={idx}>{s.count}x {s.name}</li>)}
                        </ul>
                        {item.group_notes && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <span className="font-bold text-sm text-yellow-500 uppercase">Notes:</span>
                            <p className="italic text-gray-300 mt-1">{item.group_notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-6 flex flex-col gap-3">
                        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg text-center hover:bg-blue-500">
                          📍 Navigate
                        </a>
                        <button onClick={() => handleCancelAppointment(item.id, fullName)} className="w-full py-2 bg-transparent text-red-400 font-bold rounded-lg border border-red-900 hover:bg-red-900 text-sm">
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
