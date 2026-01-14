const steps = [
  { number: "1", title: "Post what you're doing", description: "Share what's happening — study session, game, coffee run.", rotate: "-2deg" },
  { number: "2", title: "People nearby see it", description: "Your campus community gets notified instantly.", rotate: "1deg" },
  { number: "3", title: "Tap → join → done", description: "No forms. No planning. Just show up.", rotate: "-1deg" },
];

export const HowItWorksSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center px-6 lg:px-16 py-32">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-foreground mb-20">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 opacity-0 animate-fade-in-up"
              style={{ transform: `rotate(${step.rotate})`, animationDelay: `${index * 0.2}s`, animationFillMode: "forwards" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
