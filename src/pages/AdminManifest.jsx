import { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from '../supabaseClient';
import { getLocalTodayString } from '../utils/helpers';
import { APP_CONFIG, updateAppConfig } from '../agencyConfig';

import AdminInboxTab from '../components/Admin/AdminInboxTab';
import AdminScheduleTab from '../components/Admin/AdminScheduleTab';
import AdminServicesTab from '../components/Admin/AdminServicesTab';
import AdminExtrasTab from '../components/Admin/AdminExtrasTab';
import AdminClientsTab from '../components/Admin/AdminClientsTab';
import AdminReviewsTab from '../components/Admin/AdminReviewsTab';

export default function AdminManifest() {
  const [config, setConfig] = useState(APP_CONFIG);
  const toggleFeature = (feature) => {
    const newConfig = updateAppConfig({ features: { [feature]: !config.features[feature] } });
    setConfig(newConfig);
    window.location.reload();
  };
  const handleConfigChange = (key, value) => {
    const newConfig = updateAppConfig({ [key]: value });
    setConfig(newConfig);
  };
  const saveAndReload = () => {
    window.location.reload();
  };

  const [activeTab, setActiveTab] = useState('inbox'); 
  const [scheduleItemsByDate, setScheduleItemsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [blockDate, setBlockDate] = useState(getLocalTodayString());
  const [blockTime, setBlockTime] = useState('12:00');
  const [blockDuration, setBlockDuration] = useState(60);
  const [blockReason, setBlockReason] = useState('Maintenance');

  const [clients, setClients] = useState([]);
  const [bannedPhones, setBannedPhones] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState('');

  const fetchAdminData = async () => {
    if (isPlaceholder) {
      setLoading(false);
      return;
    }
    setTimeout(() => setLoading(true), 0);
    const now = new Date();
    
    const [apptResponse, blockResponse, clientResponse, banResponse] = await Promise.all([
      supabase.from('appointments').select(`id, appointment_time, service_address, services, group_notes, clients (first_name, last_name, phone_number)`).gte('appointment_time', now.toISOString()),
      supabase.from('schedule_blocks').select('*').gte('block_time', now.toISOString()),
      supabase.from('clients').select('*').order('last_name', { ascending: true }),
      supabase.from('blacklist').select('ban_value') 
    ]);
    
    let allItems = [];
    if (apptResponse.data) allItems = [...allItems, ...apptResponse.data.map(a => ({ ...a, type: 'appointment' }))];
    if (blockResponse.data) allItems = [...allItems, ...blockResponse.data.map(b => ({ ...b, type: 'block', appointment_time: b.block_time }))];

    allItems.sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time));
    const grouped = allItems.reduce((acc, item) => {
      const dateString = new Date(item.appointment_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      if (!acc[dateString]) acc[dateString] = [];
      acc[dateString].push(item);
      return acc;
    }, {});

    setScheduleItemsByDate(grouped);
    if (clientResponse.data) setClients(clientResponse.data);
    if (banResponse.data) setBannedPhones(banResponse.data.map(b => b.ban_value));
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAdminData(); }, []);

  const handleCancelAppointment = async (id, clientName) => {
    if (isPlaceholder) return;
    if (window.confirm(`Cancel appointment for ${clientName}?`)) {
      await supabase.from('appointments').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleRemoveBlock = async (id, reason) => {
    if (isPlaceholder) return;
    if (window.confirm(`Remove block: "${reason}"?`)) {
      await supabase.from('schedule_blocks').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (isPlaceholder) return;
    const [year, month, day] = blockDate.split('-');
    const [hours, minutes] = blockTime.split(':');
    const bDate = new Date(year, month - 1, day, hours, minutes);

    await supabase.from('schedule_blocks').insert({
      block_time: bDate.toISOString(), duration_minutes: parseInt(blockDuration), reason: blockReason
    });
    fetchAdminData();
  };

  const handleToggleBan = async (phone, isBanned) => {
    if (isPlaceholder) return;
    if (window.confirm(isBanned ? `Unban this client?` : `Ban this client permanently?`)) {
      if (isBanned) await supabase.from('blacklist').delete().eq('ban_value', phone);
      else await supabase.from('blacklist').insert({ ban_value: phone, ban_type: 'phone', reason: 'Admin Ban' });
      fetchAdminData();
    }
  };

  const handleSaveNote = async (clientId) => {
    if (isPlaceholder) {
      setEditingNoteId(null);
      return;
    }
    await supabase.from('clients').update({ notes: tempNote }).eq('id', clientId);
    setEditingNoteId(null);
    fetchAdminData(); 
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-2xl font-bold">Loading Vault...</div>;

  const sortedDates = Object.keys(scheduleItemsByDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 pb-20">
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex gap-4">
          <a href="/" className="text-sm font-bold text-[var(--theme-primary)] hover:text-white bg-white hover:bg-[var(--theme-primary)] border border-gray-200 px-4 py-2 rounded transition-colors">
            &larr; View Live Site
          </a>
          <button 
            onClick={() => alert("Authentication is currently disabled for this template.")} 
            className="text-sm font-bold text-gray-400 hover:text-white border border-gray-600 px-4 py-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex border-b border-gray-700 mb-8 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setActiveTab('inbox')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'inbox' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Inbox</button>
        <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'schedule' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Schedule</button>
        <button onClick={() => setActiveTab('services')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'services' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Services</button>
        <button onClick={() => setActiveTab('extras')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'extras' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Extras</button>
        <button onClick={() => setActiveTab('clients')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'clients' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Clients</button>
        <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'reviews' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Reviews</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 px-4 text-xl font-bold ${activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Demo Settings</button>
      </div>

      {activeTab === 'inbox' && <AdminInboxTab />}

      {activeTab === 'schedule' && (
        <AdminScheduleTab 
          sortedDates={sortedDates}
          scheduleItemsByDate={scheduleItemsByDate}
          handleAddBlock={handleAddBlock}
          blockDate={blockDate}
          setBlockDate={setBlockDate}
          blockTime={blockTime}
          setBlockTime={setBlockTime}
          blockDuration={blockDuration}
          setBlockDuration={setBlockDuration}
          blockReason={blockReason}
          setBlockReason={setBlockReason}
          handleRemoveBlock={handleRemoveBlock}
          handleCancelAppointment={handleCancelAppointment}
        />
      )}

      {activeTab === 'services' && <AdminServicesTab />}

      {activeTab === 'extras' && <AdminExtrasTab />}

      {activeTab === 'clients' && (
        <AdminClientsTab 
          clients={clients}
          bannedPhones={bannedPhones}
          handleToggleBan={handleToggleBan}
          editingNoteId={editingNoteId}
          setEditingNoteId={setEditingNoteId}
          tempNote={tempNote}
          setTempNote={setTempNote}
          handleSaveNote={handleSaveNote}
        />
      )}

      {activeTab === 'reviews' && <AdminReviewsTab />}
      
      {activeTab === 'settings' && (
        <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Demo Features Toggle</h2>
          <p className="text-gray-400 mb-6">Enable or disable features for the live demo site.</p>
          <div className="space-y-4">
            {Object.keys(config.features).map(feature => (
              <div key={feature} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-bold">{feature}</h3>
                  <p className="text-sm text-gray-400">Toggle {feature} functionality</p>
                </div>
                <button
                  onClick={() => toggleFeature(feature)}
                  className={`px-6 py-2 rounded-lg font-bold transition-colors ${config.features[feature] ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                >
                  {config.features[feature] ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-12 mb-4">
            <h2 className="text-2xl font-bold">Car Selector Data</h2>
            <button onClick={() => {
              try {
                const parsed = JSON.parse(config.carSelectorData);
                localStorage.setItem('car_selector_data', JSON.stringify(parsed));
                alert('Car selector data saved!');
                window.location.reload();
              } catch (e) {
                alert('Invalid JSON format!');
              }
            }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">Save Data</button>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Edit the raw JSON below to update the cascading vehicle dropdowns.</p>
            <textarea 
              className="w-full p-4 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500 font-mono text-sm" 
              value={config.carSelectorData || localStorage.getItem('car_selector_data') || '[]'} 
              onChange={(e) => setConfig({ ...config, carSelectorData: e.target.value })} 
              rows={8}
            />
          </div>
          
          <div className="flex justify-between items-center mt-12 mb-4">
            <h2 className="text-2xl font-bold">Branding Settings</h2>
            <button onClick={saveAndReload} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">Save Branding</button>
          </div>
          <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-bold mb-2">Business Name</label>
              <input 
                className="w-full p-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500" 
                value={config.businessName} 
                onChange={(e) => handleConfigChange('businessName', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Tagline</label>
              <input 
                className="w-full p-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500" 
                value={config.tagline} 
                onChange={(e) => handleConfigChange('tagline', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Hero Description</label>
              <textarea 
                className="w-full p-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500" 
                value={config.heroDescription} 
                onChange={(e) => handleConfigChange('heroDescription', e.target.value)} 
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
