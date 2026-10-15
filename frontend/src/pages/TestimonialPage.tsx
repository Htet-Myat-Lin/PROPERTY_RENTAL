import { CTASection } from "@/components/Testimonial/CTASection";
import { HeroSection } from "@/components/Testimonial/HeroSection";
import { StatsSection } from "@/components/Testimonial/StatsSection";
import { TestimonialsSection } from "@/components/Testimonial/TestimonialsSection";
import { Header } from "@/components/Header/Header";

export function TestimonialPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
