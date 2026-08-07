import React from 'react';

interface AvisameLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'header' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  subtitleColor?: string;
}

export const AvisameLogo: React.FC<AvisameLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  textColor,
  subtitleColor
}) => {
  // Size mapping for Icon
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: { title: 'text-base', sub: 'text-[9px]' },
    md: { title: 'text-xl', sub: 'text-[11px]' },
    lg: { title: 'text-2xl', sub: 'text-xs' },
    xl: { title: 'text-4xl', sub: 'text-sm' }
  };

  return (
    <div className={`flex items-center ${variant === 'full' ? 'space-x-3' : 'space-x-2.5'} ${className}`}>
      {/* 3D Geometric "A" Vector Mark matching official logo */}
      <svg
        className={`${iconSizes[size]} shrink-0 drop-shadow-sm`}
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Front Face Blue Gradient */}
          <linearGradient id="avisameBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00aeef" />
            <stop offset="60%" stopColor="#007bc1" />
            <stop offset="100%" stopColor="#005a9e" />
          </linearGradient>

          {/* Silver/Gray 3D Top Facet Gradient */}
          <linearGradient id="avisameSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Dark Blue Base Accent Gradient */}
          <linearGradient id="avisameDarkBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#005a9e" />
            <stop offset="100%" stopColor="#002b50" />
          </linearGradient>
        </defs>

        {/* 1. Base Ground Accent Triangles */}
        <polygon points="115,152 138,152 126,134" fill="#007bc1" />
        <polygon points="132,152 162,152 147,126" fill="#005a9e" />

        {/* 2. Outer 3D Silver Top Facet */}
        <polygon points="65,10 108,18 135,125 102,125 106,98 88,60" fill="url(#avisameSilverGrad)" />

        {/* 3. Dark Blue Depth Face */}
        <polygon points="102,125 135,125 118,145 88,145" fill="url(#avisameDarkBlueGrad)" />

        {/* 4. Main Front Blue A-Frame Body */}
        <polygon points="65,10 12,128 50,128 65,92 102,92 118,128 92,128 85,110 60,110 52,128 12,128" fill="url(#avisameBlueGrad)" />

        {/* 5. Solid Front Triangular Arch */}
        <polygon points="65,10 12,128 48,128 64,88 100,88 118,128 100,18" fill="url(#avisameBlueGrad)" />

        {/* 6. Inner Counter Triangle Hole */}
        <polygon points="65,34 46,74 84,74" fill="#ffffff" />
      </svg>

      {/* Typography Section */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2">
            <span
              className={`font-black tracking-tight uppercase font-sans ${textSizes[size].title} ${
                textColor || (variant === 'header' ? 'text-white' : 'text-slate-900')
              }`}
            >
              AVISAME
            </span>
            {variant === 'header' && (
              <span className="bg-[#00aeef]/20 text-[#4ae2fe] border border-[#00aeef]/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PAS
              </span>
            )}
          </div>
          {(variant === 'full' || variant === 'horizontal' || variant === 'header') && (
            <p
              className={`font-medium tracking-tight leading-none ${textSizes[size].sub} ${
                subtitleColor || (variant === 'header' ? 'text-[#c7c7c7]' : 'text-slate-600')
              }`}
            >
              Software para Productores Asesores de Seguros
            </p>
          )}
        </div>
      )}
    </div>
  );
};
