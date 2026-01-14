import { useState, useEffect } from "react";

export const IdeaSection = () => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const initialDots = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setDots(initialDots);

    const interval = setInterval(() => {
      setDots((prev) =>
        prev.map((dot) =>
          Math.random() > 0.7
            ? { ...dot, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, opacity: 0.3 + Math.random() * 0.7 }
            : dot
        )
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center px-6 lg:px-16 py-32">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative h-[400px] bg-muted/30 rounded-3xl border border-border overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="absolute w-3 h-3 bg-primary rounded-full transition-all duration-1000 animate-pulse-soft"
                style={{ left: `${dot.x}%`, top: `${dot.y}%`, opacity: dot.opacity }}
              />
            ))}
            <svg className="absolute inset-0 w-full h-full">
              {dots.slice(0, 4).map((dot, i) => {
                const nextDot = dots[(i + 1) % 4];
                return (
                  <line
                    key={i}
                    x1={`${dot.x}%`}
                    y1={`${dot.y}%`}
                    x2={`${nextDot.x}%`}
                    y2={`${nextDot.y}%`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    className="transition-all duration-1000"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-8 right-8 bg-card border border-border rounded-xl px-4 py-2 animate-fade-in-scale">
              <span className="text-sm text-primary font-medium">+3 joined</span>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Huddle turns your campus into a <span className="text-primary">live feed</span>
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Not groups. Not posts. <span className="text-foreground font-medium">Moments</span>.
            </p>
            <p className="text-lg text-muted-foreground">
              See what's happening around you right now. Activities appear, people join, and when it's over — it's gone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
