'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TwitterCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-[60]"
    >
      <a
        href="https://x.com/lotus_sbc"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group block pointer-events-auto"
      >
        {/* Animated neon ring */}
        <div className="absolute inset-0 rounded-full animate-border-glow"></div>
        
        {/* Main CTA container */}
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-full glass border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 group-hover:neon-glow-cyan">
          {/* Profile image */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-neon-cyan/50 group-hover:border-neon-cyan">
            <Image
              src="https://pbs.twimg.com/profile_images/1797707330248740864/k0AS-rbE_400x400.jpg"
              alt="Miodrag's profile"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          
          {/* CTA text */}
          <span className="text-sm font-medium text-neon-cyan group-hover:text-white transition-colors duration-300 whitespace-nowrap">
            vibe with me
          </span>
          
          {/* Twitter icon */}
          <svg
            className="w-4 h-4 text-neon-cyan group-hover:text-white transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </a>
    </motion.div>
  );
}
