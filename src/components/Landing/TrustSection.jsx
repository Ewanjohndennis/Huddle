import { Lock, Users, Building } from "lucide-react";

const trustPoints = [
  { icon: Lock, text: "MEC email only" },
  { icon: Users, text: "Real people" },
  { icon: Building, text: "Real campus" },
];

export const TrustSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-3xl p-10 lg:p-16 text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Built for MEC</h2>
            <p className="text-lg text-muted-foreground">Not the internet.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {trustPoints.map((point) => (
              <div key={point.text} className="flex items-center gap-3 bg-muted/50 rounded-full px-5 py-2.5">
                <point.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
