import { X } from "lucide-react";

const points = ["No dead groups", "No spam", 'No "planning for next week"', "Everything disappears when it's over"];

export const WhyDifferentSection = () => {
  return (
    <section className="min-h-[70vh] flex items-center px-6 lg:px-16 py-32 bg-muted/20">
      <div className="max-w-4xl mx-auto w-full text-center space-y-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Why it feels different</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {points.map((point, index) => (
            <div key={point} className="flex items-center gap-4 text-left opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg text-foreground">{point}</span>
            </div>
          ))}
        </div>
        <p className="text-xl lg:text-2xl text-muted-foreground pt-8">
          What happens on campus, <span className="text-primary font-medium">stays in the moment</span>.
        </p>
      </div>
    </section>
  );
};
