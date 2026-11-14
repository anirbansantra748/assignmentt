import { Routes, Route, Navigate } from 'react-router-dom';
import PhoneContainer from './components/PhoneContainer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

/**
 * App – Root component with responsive PhoneContainer wrapper.
 *
 * Responsive behavior:
 *  - Mobile (< sm): full viewport native mobile presentation
 *  - Desktop & Tablet (>= sm): centered 430px phone container
 *
 * Routes:
 *   /         → Landing / Splash page
 *   /home     → Main dashboard
 *   /search   → Task search page
 *   *         → Redirect to /
 */
function App() {
  return (
    <PhoneContainer>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneContainer>
  );
}

export default App;
