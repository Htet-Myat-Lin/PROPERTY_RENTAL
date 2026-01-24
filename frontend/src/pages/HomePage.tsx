import { Header } from "@/components/Header/Header";
import { ExplorePropertySection } from "@/components/Home/ExplorePropertySection";
import { HeroSection } from "@/components/Home/HeroSection";
import { PopularProperties } from "@/components/Home/PopularPropertiesSection";

export function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ExplorePropertySection />
      <PopularProperties />
    </>
  );
}

