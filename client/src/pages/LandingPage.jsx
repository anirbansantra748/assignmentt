import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * LandingPage – Splash/welcome screen matching Figma Screen 1.
 *
 * Visual structure:
 *  - Blue hero section (#4C6EF5) with decorative zigzag SVG patterns & circle element
 *  - White bottom section with bold headline, descriptive subtitle, and "Get Started" CTA
 */
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      {/* ─── Blue Hero Section ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex-[1.4] bg-primary overflow-hidden flex items-center justify-center min-h-[460px]"
      >
        {/* Decorative zigzag – top left */}
        <svg
          className="absolute top-16 -left-4 opacity-35"
          width="180" height="120" viewBox="0 0 180 120"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="0,30 30,0 60,30 90,0 120,30 150,0 180,30"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,60 30,30 60,60 90,30 120,60 150,30 180,60"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,90 30,60 60,90 90,60 120,90 150,60 180,90"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,120 30,90 60,120 90,90 120,120 150,90 180,120"
            stroke="white" strokeWidth="3.5" fill="none" />
        </svg>

        {/* Decorative zigzag – bottom right */}
        <svg
          className="absolute bottom-12 -right-4 opacity-35"
          width="180" height="120" viewBox="0 0 180 120"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="0,30 30,0 60,30 90,0 120,30 150,0 180,30"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,60 30,30 60,60 90,30 120,60 150,30 180,60"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,90 30,60 60,90 90,60 120,90 150,60 180,90"
            stroke="white" strokeWidth="3.5" fill="none" />
          <polyline points="0,120 30,90 60,120 90,90 120,120 150,90 180,120"
            stroke="white" strokeWidth="3.5" fill="none" />
        </svg>

        {/* Decorative circle – top right */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white/20" />
      </motion.div>

      {/* ─── White Bottom Section ──────────────────────────────────── */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="px-6 pt-7 pb-10 flex flex-col bg-white"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">
          Manage What To Do
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-9">
          The best way to manage what you have to do, don't forget your plans
        </p>

        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 bg-primary text-white text-base font-semibold rounded-2xl
                     hover:bg-primary-dark active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-primary/30"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
