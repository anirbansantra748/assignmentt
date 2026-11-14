import { memo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

/**
 * FloatingActionButton – Fixed blue circular "+" button at the bottom center.
 *
 * Props:
 *  - onClick : () => void
 */
const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40
        w-14 h-14 bg-primary rounded-full flex items-center justify-center
        shadow-lg shadow-primary/40 hover:bg-primary-dark
        transition-colors duration-200"
      aria-label="Add new task"
    >
      <Plus size={28} className="text-white" />
    </motion.button>
  );
};

export default memo(FloatingActionButton);
