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

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {visibleCards.map((cardIndex, i) => {
        const activity = activities[cardIndex];
        const position = cardPositions[i];
        return (
          /* Wrapper handles the floating and positioning */
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
              className="glass-card p-5 shadow-xl animate-fade-in-scale"
              style={{
                transform: `rotate(${position.rotate})`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activity.emoji}</span>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {activity.text}
                </span>
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