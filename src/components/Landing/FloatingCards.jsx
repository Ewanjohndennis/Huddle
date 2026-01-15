import { useState, useEffect } from "react";

const activities = [
  { id: 1, text: "Debugging Python in Lab 4", emoji: "💻" },
  { id: 2, text: "Football court — need 2 more", emoji: "⚽" },
  { id: 3, text: "Late night study @ library", emoji: "📚" },
  { id: 4, text: "Coffee run to canteen", emoji: "☕" },
  { id: 5, text: "Guitar jam in hostel", emoji: "🎸" },
];
//trial
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

  // Responsive positions: Use higher percentages for mobile to prevent stacking
  const cardPositions = [
    { 
      mobile: { top: "5%", left: "5%", rotate: "-3deg" }, 
      desktop: { top: "10%", left: "10%", rotate: "-3deg" } 
    },
    { 
      mobile: { top: "40%", right: "2%", rotate: "2deg" }, 
      desktop: { top: "35%", right: "5%", rotate: "2deg" } 
    },
    { 
      mobile: { top: "75%", left: "10%", rotate: "-1deg" }, 
      desktop: { top: "60%", left: "20%", rotate: "-1deg" } 
    },
  ];

  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  return (
    <div className="relative w-full h-[500px] lg:h-full">
      {visibleCards.map((cardIndex, i) => {
        const activity = activities[cardIndex];
        const pos = cardPositions[i];
        
        return (
          <div
            key={`${activity.id}-${i}`}
            // Using template literals to switch between mobile and desktop offsets
            className="absolute animate-float-slow transition-all duration-700"
            style={{
              top: window.innerWidth < 1024 ? pos.mobile.top : pos.desktop.top,
              left: window.innerWidth < 1024 ? pos.mobile.left : pos.desktop.left,
              right: window.innerWidth < 1024 ? pos.mobile.right : pos.desktop.right,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <div 
              className="glass-card p-4 sm:p-5 shadow-xl animate-fade-in-scale relative overflow-hidden rounded-2xl"
              style={{
                transform: `rotate(${window.innerWidth < 1024 ? pos.mobile.rotate : pos.desktop.rotate})`,
                animationFillMode: "forwards",
              }}
            >
              <div 
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: noiseSvg }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">{activity.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                    {activity.text}
                  </span>
                </div>

                <div className="mt-2 sm:mt-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse-soft" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wider">
                    Happening Now!
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 bg-primary/20 rounded-full blur-[80px] lg:blur-[100px] -z-10" />
    </div>
  );
};