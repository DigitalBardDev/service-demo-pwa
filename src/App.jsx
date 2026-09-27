import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import AdminManifest from './pages/AdminManifest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/admin" element={<AdminManifest />} />
      </Routes>
    </Router>
  );
}

export default App;