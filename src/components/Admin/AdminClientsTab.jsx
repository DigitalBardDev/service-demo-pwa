export default function AdminClientsTab({
  clients,
  bannedPhones,
  handleToggleBan,
  editingNoteId,
  setEditingNoteId,
  tempNote,
  setTempNote,
  handleSaveNote
}) {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3 mb-6">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Clients Tab Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">This is your customer database (CRM). You can leave private internal notes on clients (like gate codes or preferences) and easily ban problematic clients from ever booking with you again.</p>
        </div>
      </div>
      {clients.map(client => {
        const isBanned = bannedPhones.includes(client.phone_number);
        return (
          <div key={client.id} className={`p-6 rounded-xl border shadow-md flex flex-col ${isBanned ? 'bg-red-900 border-red-500 opacity-80' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-700">
              <div>
                <h3 className={`text-2xl font-bold flex items-center ${isBanned ? 'text-white' : 'text-blue-400'}`}>
                  {client.first_name} {client.last_name}
                  {isBanned && <span className="ml-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Banned</span>}
                </h3>
                <p className="text-lg text-gray-300 font-mono mt-1">{client.phone_number}</p>
              </div>
              <button onClick={() => handleToggleBan(client.phone_number, isBanned)} className={`mt-4 md:mt-0 px-6 py-2 font-bold rounded-lg ${isBanned ? 'bg-gray-700 text-white' : 'bg-gray-900 text-red-400 border border-red-900'}`}>
                {isBanned ? 'Remove Ban' : 'Ban Client'}
              </button>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm uppercase text-gray-500">Internal Notes:</h4>
                {editingNoteId !== client.id && (
                  <button onClick={() => { setEditingNoteId(client.id); setTempNote(client.notes || ''); }} className="text-xs text-blue-400 hover:underline">
                    Edit Notes
                  </button>
                )}
              </div>
              {editingNoteId === client.id ? (
                <div className="flex flex-col">
                  <textarea 
                    className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400 min-h-[100px]" 
                    value={tempNote} 
                    onChange={(e) => setTempNote(e.target.value)} 
                    placeholder="Add details here..." 
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button onClick={() => setEditingNoteId(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={() => handleSaveNote(client.id)} className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded hover:bg-blue-500">Save</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic bg-gray-900 p-4 rounded-lg min-h-[60px]">
                  {client.notes ? client.notes : "No notes saved for this client."}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
