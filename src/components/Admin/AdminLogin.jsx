import { APP_CONFIG } from '../../agencyConfig';

export default function AdminLogin({ email, setEmail, password, setPassword, loginError, handleLogin }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-8">{APP_CONFIG.businessName} Admin</h2>
        <input 
          type="email" 
          placeholder="Admin Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-4 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-[var(--theme-accent)]" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-4 mb-6 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-[var(--theme-accent)]" 
          required 
        />
        {loginError && <p className="text-red-500 font-bold mb-4">{loginError}</p>}
        <button type="submit" className="w-full bg-[var(--theme-accent)] text-white text-xl font-bold py-4 rounded-xl hover:opacity-90">
          Log In
        </button>
      </form>
    </div>
  );
}
