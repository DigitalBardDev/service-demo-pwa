import { useState, useEffect } from 'react';

export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('demo_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, []);

  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem('demo_reviews', JSON.stringify(updated));
  };

  const handleApprove = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    saveReviews(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter(r => r.id !== id);
      saveReviews(updated);
    }
  };

  const handleSaveReply = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, reply: replyText[id] } : r);
    saveReviews(updated);
    setEditingReplyId(null);
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg flex items-start gap-3 mb-6">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-blue-400 font-bold">How the Reviews Tab Helps You</h4>
          <p className="text-gray-300 text-sm mt-1">Manage your online reputation. You can approve new reviews before they go live, delete spam, and write public replies to build trust with future customers.</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-white mb-6">Manage Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews found.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">{review.author}</h3>
                    <div className="text-yellow-400 text-sm mb-2">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {review.status === 'pending' && (
                      <span className="bg-yellow-600/30 text-yellow-500 px-3 py-1 rounded text-xs font-bold uppercase">Pending</span>
                    )}
                    {review.status === 'approved' && (
                      <span className="bg-green-600/30 text-green-500 px-3 py-1 rounded text-xs font-bold uppercase">Published</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 italic mb-6">"{review.text}"</p>
                
                {review.status === 'approved' && (
                  <div className="mb-6 bg-gray-800 p-4 rounded border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-gray-400">Your Public Reply:</h4>
                      <button 
                        onClick={() => {
                          setEditingReplyId(review.id);
                          setReplyText({ ...replyText, [review.id]: review.reply || '' });
                        }}
                        className="text-xs text-blue-400 hover:underline"
                      >
                        {review.reply ? 'Edit Reply' : 'Add Reply'}
                      </button>
                    </div>
                    {editingReplyId === review.id ? (
                      <div className="flex flex-col gap-3">
                        <textarea 
                          className="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500" 
                          rows={3} 
                          value={replyText[review.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                        />
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditingReplyId(null)} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                          <button onClick={() => handleSaveReply(review.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded font-bold text-sm">Save Reply</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm">{review.reply || <span className="text-gray-500 italic">No reply posted yet.</span>}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  {review.status === 'pending' && (
                    <button onClick={() => handleApprove(review.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold text-sm">
                      Approve & Publish
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="bg-red-900 hover:bg-red-800 text-red-200 px-4 py-2 rounded font-bold text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
