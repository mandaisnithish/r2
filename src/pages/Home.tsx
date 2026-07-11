import { useEffect, useState } from "react";
import { getHomeContent, getStats } from "../api/homeApi";
import { getActiveProduct } from "../api/productApi";
import type { HomeContent, Stat } from "../types";

import HeroSection from "../components/home/HeroSection";
import ProblemSection from "../components/home/ProblemSection";
import SolutionSection from "../components/home/SolutionSection";
import DemoVideoSection from "../components/home/DemoVideoSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [homeData, statsData, productData] = await Promise.allSettled([
          getHomeContent(),
          getStats(),
          getActiveProduct(),
        ]);

        if (homeData.status === "fulfilled") {
          const rawData = homeData.value;
          setContent(Array.isArray(rawData) ? rawData[0] : rawData);
        } else {
          console.error("Home content failed:", homeData.reason);
        }

        if (statsData.status === "fulfilled") setStats(statsData.value);
        else console.error("Stats failed:", statsData.reason);

        if (productData.status === "fulfilled") {
          setDemoVideoUrl(productData.value.videoUrl ?? "");
        } else {
          console.error("Product video fetch failed:", productData.reason);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const c = content ?? {
    heroTitle: "Welcome to Aquaholics",
    heroSubtitle: "Reviving rivers and lakes with AI-powered robotics, one waterbody at a time.",
    heroButtonText: "See How It Works",
    problemTitle: "Our Rivers and Lakes Are Drowning in Waste",
    problemText: "Plastic, industrial effluent, agricultural runoff, and untreated sewage are pushing freshwater ecosystems toward collapse. Manual cleanup is slow, costly, and puts workers at health risk — while moving debris simply goes uncollected.",
    problemImageUrl: "https://res.cloudinary.com/dkrya2qyz/image/upload/v1781705601/aquaholics/products/ingcvxvoitaliiyjlitz.jpg",
    solutionTitle: "One Robot. Full Autonomy. Real-Time Insight.",
    solutionText: "Our AWSCR navigates independently using LiDAR and AI vision, collects floating waste with a screw-conveyor system, and continuously monitors water quality — sending live data and pollution alerts to a connected dashboard.",
    solutionImageUrl: "https://res.cloudinary.com/dkrya2qyz/image/upload/v1781705752/aquaholics/products/q9shdbgrrl3srzdvrpmo.jpg",
    ctaTitle: "Ready to See Cleaner Water in Action?",
    ctaButtonText: "Request a Demo",
  } as HomeContent;

  return (
    <div>
      <HeroSection
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        buttonText={c.heroButtonText}
      />
      <ProblemSection
        title={c.problemTitle}
        text={c.problemText}
        stats={stats}
      />
      <SolutionSection
        title={c.solutionTitle}
        text={c.solutionText}
        imageUrl={c.solutionImageUrl}
      />
      <DemoVideoSection
        videoUrl={demoVideoUrl}
        videoTitle="Watch AquaBot Work"
      />
      <CTASection
        title={c.ctaTitle}
        buttonText={c.ctaButtonText}
      />
    </div>
  );
}