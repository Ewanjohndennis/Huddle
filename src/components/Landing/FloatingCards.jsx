import { useState, useEffect } from "react";

const activities = [
  { id: 1, text: "Debugging Python in Lab 4", emoji: "💻" },
  { id: 2, text: "Football court — need 2 more", emoji: "⚽" },
  { id: 3, text: "Late night study @ library", emoji: "📚" },
  { id: 4, text: "Coffee run to canteen", emoji: "☕" },
  { id: 5, text: "Guitar jam in hostel", emoji: "🎸" },
];

export const FloatingCards = () => {
  const [visibleCards, setVisibleCards] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        const newCards = [...prev];
        const randomIndex = Math.floor(Math.random() * newCards.length);
        let newCardIndex;
        do {
          newCardIndex = Math.floor(Math.random() * activities.length);
        } while (newCards.includes(newCardIndex));
        newCards[randomIndex] = newCardIndex;
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cardPositions = [
    { top: "10%", left: "10%", rotate: "-3deg", delay: "0s" },
    { top: "35%", right: "5%", rotate: "2deg", delay: "0.2s" },
    { top: "60%", left: "20%", rotate: "-1deg", delay: "0.4s" },
  ];

  // Noise Texture Data URI
  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {visibleCards.map((cardIndex, i) => {
        const activity = activities[cardIndex];
        const position = cardPositions[i];
        return (
          <div
            key={`${activity.id}-${i}`}
            className="absolute animate-float-slow"
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              animationDelay: position.delay,
            }}
          >
            <div 
              className="glass-card p-5 shadow-xl animate-fade-in-scale relative overflow-hidden rounded-2xl"
              style={{
                transform: `rotate(${position.rotate})`,
                animationFillMode: "forwards",
              }}
            >
              {/* Subtle Grain Layer */}
              <div 
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: noiseSvg }}
              />

              {/* Card Content Wrapper */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.emoji}</span>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {activity.text}
                  </span>
                </div>

                {/* Happening Now Status */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                  <span className="text-xs text-muted-foreground font-medium  tracking-wider">
                    Happening Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10" />
    </div>
  );
};