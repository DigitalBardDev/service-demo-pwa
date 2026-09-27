import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!APP_CONFIG.features.enableReviews) return;

    const saved = localStorage.getItem('demo_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const initialReviews = [
        { id: '1', author: 'Jane Doe', rating: 5, text: 'Absolutely fantastic service! They arrived on time and did a perfect job.', status: 'approved', reply: 'Thank you Jane!' },
        { id: '2', author: 'Mark Smith', rating: 4, text: 'Very good, just a slight delay in traffic but the work was stellar.', status: 'approved', reply: '' },
        { id: '3', author: 'Sarah Jenkins', rating: 5, text: 'I highly recommend them. Professional, courteous, and very clean.', status: 'approved', reply: '' },
      ];
      setReviews(initialReviews);
      localStorage.setItem('demo_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  if (!APP_CONFIG.features.enableReviews) return null;

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  if (approvedReviews.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
      </div>
      <div className="flex overflow-x-auto gap-6 px-4 pb-8 snap-x snap-mandatory hide-scrollbar">
        {approvedReviews.map(review => (
          <div key={review.id} className="min-w-[300px] sm:min-w-[400px] bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm snap-center flex-shrink-0">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-xl">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">"{review.text}"</p>
            <p className="text-gray-900 font-bold">- {review.author}</p>
            {review.reply && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm font-bold text-[var(--theme-primary)]">Response from owner:</p>
                <p className="text-sm text-gray-600 mt-1">{review.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
