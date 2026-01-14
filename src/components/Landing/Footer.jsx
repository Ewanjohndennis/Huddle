export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 Huddle. Made for MEC.</p>
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy</span>
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </footer>
  );
};
