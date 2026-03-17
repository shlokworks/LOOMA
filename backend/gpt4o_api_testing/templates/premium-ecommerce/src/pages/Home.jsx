import React from "react";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import BrandStrip from "../components/BrandStrip";
import CategoryGrid from "../components/CategoryGrid";
import FlashSale from "../components/FlashSale";
import DealBanner from "../components/DealBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import TrendingSlider from "../components/TrendingSlider";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/NewsLetter";
import Footer from "../components/Footer";
import StickyCartButton from "../components/StickyCartButton";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50" data-theme="light">
      <Navbar />
      {/* Dark mode toggle sits near nav for quick access */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex justify-end">
          <DarkModeToggle />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <HeroBanner />
        <BrandStrip />
        <CategoryGrid />
        <FlashSale />
        <DealBanner />
        <FeaturedProducts />
        <TrendingSlider />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />
      <StickyCartButton />
    </div>
  );
}
