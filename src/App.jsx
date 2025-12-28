import { memo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import Work from './pages/Work';

// ==============================================
// HELPER: SCROLL TO TOP ON ROUTE CHANGE
// ==============================================
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate reset for architectural precision
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-[#EAE8E4] min-h-screen selection:bg-[#4a0404] selection:text-white">
        
        <Routes>
          {/* THE MAIN HORIZONTAL EXPERIENCE */}
          <Route path="/" element={<HomePage />} />

          {/* THE VERTICAL CINEMATIC FOLIO */}
          <Route path="/work" element={<Work />} />

          {/* FALLBACK: REDIRECT TO HOME */}
          <Route path="*" element={<HomePage />} />
        </Routes>

      </div>
    </Router>
  );
};

export default memo(App);