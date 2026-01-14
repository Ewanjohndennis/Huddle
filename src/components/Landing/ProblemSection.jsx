export const ProblemSection = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 lg:px-16 py-32">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <p className="text-2xl lg:text-3xl text-foreground/80 opacity-0 animate-fade-in-up">You're surrounded by people.</p>
          <p className="text-2xl lg:text-3xl text-foreground/80 opacity-0 animate-fade-in-up animation-delay-200">Everyone's in their own bubble.</p>
          <p className="text-2xl lg:text-3xl text-foreground opacity-0 animate-fade-in-up animation-delay-400">
            The right group is <span className="text-primary font-semibold">always one room away</span>.
          </p>
        </div>
      </div>
    </section>
  );
};
