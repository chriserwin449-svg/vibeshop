import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'primary' | 'white' | 'gold';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", variant = 'primary', showText = false }) => {
  const colors = {
    primary: {
      icon: "url(#vibrantGradient)",
      text: "text-[#FDE047]", // Soft vibrant yellow
      sub: "text-[#FDE047]/70"
    },
    white: {
      icon: "fill-white",
      text: "text-white",
      sub: "text-white/70"
    },
    gold: {
      icon: "url(#vibrantGradient)",
      text: "text-[#FDE047]",
      sub: "text-[#FDE047]/70"
    }
  };

  const current = colors[variant];

  return (
    <div className="flex items-center gap-3">
      <div className={className}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="vibrantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF0080" />
              <stop offset="50%" stopColor="#7928CA" />
              <stop offset="100%" stopColor="#0070F3" />
            </linearGradient>
          </defs>
          {/* Abstract V + Shopping Bag Shape */}
          <path 
            d="M20 35C20 26.7157 26.7157 20 35 20H65C73.2843 20 80 26.7157 80 35V75C80 80.5228 75.5228 85 70 85H30C24.4772 85 20 80.5228 20 75V35Z" 
            className="fill-[#FDE047]/5 stroke-[#FDE047]/20" 
            strokeWidth="2"
          />
          <path 
            d="M35 45L50 60L65 45" 
            stroke={current.icon}
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M35 25C35 16.7157 41.7157 10 50 10C58.2843 10 65 16.7157 65 25" 
            className="stroke-[#FDE047]/30" 
            strokeWidth="5" 
            strokeLinecap="round"
          />
          {/* Subtle AI Sparkle */}
          <circle cx="75" cy="25" r="5" className="fill-neon-yellow animate-pulse shadow-lg" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`text-2xl font-black tracking-tighter ${current.text}`}>VibeShop</span>
          <span className={`text-[8px] font-bold uppercase tracking-[0.1em] ${current.sub}`}>Your online store powered by AI</span>
        </div>
      )}
    </div>
  );
};
