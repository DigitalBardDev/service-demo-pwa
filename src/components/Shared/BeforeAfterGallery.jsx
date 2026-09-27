/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react';
import { APP_CONFIG } from '../../agencyConfig';

function BeforeAfterSlider({ beforeImage, afterImage, caption }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsDragging(false));
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center mb-8">
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl cursor-ew-resize select-none"
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      >
        {/* After Image (Background) */}
        <img src={afterImage} alt="After" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded font-bold text-xs shadow-sm">AFTER</div>
        
        {/* Before Image (Foreground, clipped) */}
        <div 
          className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white pointer-events-none" 
          style={{ width: `${sliderPosition}%` }}
        >
          {/* eslint-disable-next-line react-hooks/refs */}
          <img src={beforeImage} alt="Before" className="absolute top-0 left-0 w-full h-full object-cover max-w-none" style={{ width: containerRef.current?.offsetWidth || '100%' }} />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded font-bold text-xs shadow-sm">BEFORE</div>
        </div>

        {/* Handle */}
        <div 
          className="absolute top-0 bottom-0 flex items-center justify-center w-8 -ml-4 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
        </div>
      </div>
      {caption && <p className="mt-4 text-gray-600 font-medium italic text-center px-4">{caption}</p>}
    </div>
  );
}

export default function BeforeAfterGallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!APP_CONFIG.features.enableBeforeAfterGallery) return;
    
    const saved = localStorage.getItem('before_after_items_v4');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const defaultItems = [
        {
          id: 1,
          beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
          afterImage: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80', // clean bathroom
          caption: 'Complete interior deep cleaning and reorganization.'
        },
        {
          id: 2,
          beforeImage: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80', // Some yard
          afterImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', // House exterior with nice lawn
          caption: 'Landscape overhaul: from overgrown yard to pristine garden.'
        }
      ];
      setItems(defaultItems);
      localStorage.setItem('before_after_items_v4', JSON.stringify(defaultItems));
    }
  }, []);

  if (!APP_CONFIG.features.enableBeforeAfterGallery || items.length === 0) return null;

  return (
    <div className="w-full py-12 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[var(--theme-primary)] mb-8 text-center px-4">See The Difference</h2>
      <div className="w-full max-w-4xl px-4">
        {items.map(item => (
          <BeforeAfterSlider key={item.id} beforeImage={item.beforeImage} afterImage={item.afterImage} caption={item.caption} />
        ))}
      </div>
    </div>
  );
}
