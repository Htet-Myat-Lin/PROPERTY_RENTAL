import { CTASection } from "@/components/About/CTASection";
import { HeroSection } from "@/components/About/HeroSection";
import { LeadershipSection } from "@/components/About/LeadershipSection";
import { MissionSection } from "@/components/About/MissionSection";
import { StorySection } from "@/components/About/StorySection";
import { Header } from "@/components/Header/Header";

export function AboutPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <StorySection />
      <MissionSection />
      <LeadershipSection />
      <CTASection />
    </>
  );
}
