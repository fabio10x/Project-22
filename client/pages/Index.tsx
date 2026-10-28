import ContentThree from "@/components/ContentThree";
import ContentTwo from "@/components/ContentTwo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Pricing from "@/components/Pricing";
import ProgressTracking from "@/components/ProgressTracking";

export default function Index() {
  return (
    <main>
      <Hero />
      <Logos />
      <Features />
      <ProgressTracking />
      <ContentTwo />
      <ContentThree />
      <Pricing />
      <Footer />
    </main>
  );
}
