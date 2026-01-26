"use client";

export default function EmeraldWave() {
  return (
    <div className="relative w-full h-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-400 animate-wave"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      <svg
        className="absolute bottom-0 w-full h-8"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6">
              <animate
                attributeName="stop-color"
                values="#10b981;#059669;#10b981"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#059669" stopOpacity="0.8">
              <animate
                attributeName="stop-color"
                values="#059669;#10b981;#059669"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6">
              <animate
                attributeName="stop-color"
                values="#10b981;#059669;#10b981"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient)"
          d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z;
              M0,60 C150,0 350,120 600,60 C850,0 1050,120 1200,60 L1200,120 L0,120 Z;
              M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z
            "
          />
        </path>
        <path
          fill="url(#waveGradient)"
          opacity="0.5"
          d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z"
        >
          <animate
            attributeName="d"
            dur="2.5s"
            repeatCount="indefinite"
            values="
              M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z;
              M0,80 C200,100 400,40 600,80 C800,100 1000,60 1200,80 L1200,120 L0,120 Z;
              M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}
