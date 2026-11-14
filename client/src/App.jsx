import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

/**
 * App - Root component with route definitions.
 * Routes:
 *   /         → Landing / Splash page
 *   /home     → Main dashboard
 *   /search   → Task search page
 *   *         → Redirect to /
 */
function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
