import { HeroSection } from "../components/Landing/HeroSection";
import { ProblemSection } from "../components/Landing/ProblemSection";
import { IdeaSection } from "../components/Landing/IdeaSection";
import { HowItWorksSection } from "../components/Landing/HowItWorksSection";
import { WhyDifferentSection } from "../components/Landing/WhyDifferentSection";
import { TrustSection } from "../components/Landing/TrustSection";
import { FinalCTASection } from "../components/Landing/FinalCTASection";
import { Footer } from "../components/Landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background grain-overlay">
      <HeroSection />
      <ProblemSection />
      <IdeaSection />
      <HowItWorksSection />
      <WhyDifferentSection />
      <TrustSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
