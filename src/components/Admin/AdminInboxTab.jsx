export default function AdminInboxTab() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Inbox Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">The Inbox is where you receive new quote requests, general inquiries, and contact form submissions. It allows you to quickly reply to leads before they cool down.</p>
        </div>
      </div>
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-md text-center">
        <h3 className="text-xl font-bold text-gray-400">Inbox is empty</h3>
        <p className="text-gray-500 mt-2">No new quote requests or sign-ups.</p>
      </div>
    </div>
  );
}
