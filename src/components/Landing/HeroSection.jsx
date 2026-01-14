import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { FloatingCards } from "./FloatingCards";
import Login from "../../Login";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Huddle
            </h1>
            <p className="text-2xl lg:text-3xl text-foreground/90 leading-relaxed">
              The campus is full of people.<br />
              <span className="text-primary">You just don't know what they're doing</span> — yet.
            </p>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-md">
            See what's happening right now.<br />No planning. No noise.
          </p>

          <div className="space-y-3">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105"
            >
              Enter the Huddle
            </Button>
            <p className="text-sm text-muted-foreground">MEC students only</p>
          </div>
        </div>

        {/* Right Content - Floating Cards */}
        <div className="relative h-[400px] lg:h-[500px]">
          <FloatingCards />
        </div>
      </div>
    </section>
  );
};