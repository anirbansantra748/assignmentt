import { memo } from 'react';

/**
 * PhoneContainer – Responsive wrapper enforcing mobile-first presentation.
 *
 * Responsiveness specification:
 *  - Mobile (< sm): Occupies 100% of the viewport, closely matching the Figma design.
 *  - Tablet & Desktop (>= sm): Displays the mobile UI in a centered phone container
 *    with a max-width of 430px, maintaining original mobile proportions, typography,
 *    and visual hierarchy.
 *
 * Props:
 *  - children  : ReactNode
 *  - className : string
 */
const PhoneContainer = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen w-full bg-white sm:bg-[#ECEFF4] sm:py-8 flex flex-col items-center justify-start transition-colors">
      {/* ─── 430px Centered Phone Frame ────────────────────────────── */}
      <div
        className={`w-full max-w-[430px] min-h-screen sm:min-h-[860px] bg-white
          sm:rounded-[40px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
          sm:border sm:border-gray-200/90 overflow-hidden relative flex flex-col ${className}`}
      >
        {/* Subtle phone notch indicator (tablet/desktop only) */}
        <div className="hidden sm:flex justify-center pt-2.5 pb-0.5 select-none pointer-events-none">
          <div className="w-24 h-4 bg-gray-900/10 rounded-full flex items-center justify-end pr-2">
            <div className="w-2 h-2 rounded-full bg-gray-900/20" />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col relative w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(PhoneContainer);
