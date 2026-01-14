import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 lg:px-16 py-32">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <p className="text-2xl lg:text-3xl text-muted-foreground">Your campus is already alive.</p>
          <p className="text-3xl lg:text-4xl font-bold text-foreground">
            You just need to <span className="text-primary">step in</span>.
          </p>
        </div>
        
        <div className="pt-6">
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-xl font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20"
          >
            Join the Huddle
          </Button>
        </div>

        <div className="relative pt-20">
          <div className="absolute left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};