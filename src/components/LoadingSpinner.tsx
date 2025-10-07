import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  title?: string;
  subtitle?: string;
}

export function LoadingSpinner({ title = 'Loading', subtitle }: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="festival-card text-white text-center max-w-md mx-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-4"
      >
        🎵
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-white/80">{subtitle}</p>}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
