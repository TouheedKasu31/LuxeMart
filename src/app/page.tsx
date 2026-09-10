import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedSection from "@/components/home/FeaturedSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HomeAllProductsSection from "@/components/home/HomeAllProductsSection";

export const revalidate = 0; // Fresh catalogue data

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedSection />
      <NewArrivalsSection />
      <HomeAllProductsSection />
    </div>
  );
}
