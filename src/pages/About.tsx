import { useEffect, useState } from "react";
import { getAboutContent, getMembers, getValues, getPartners } from "../api/aboutApi";
import type { AboutContent, Member, Value, Partner } from "../types";

import AboutHero from "../components/about/AboutHero";
import StorySection from "../components/about/StorySection";
import MissionVision from "../components/about/MissionVision";
import WhyWeExist from "../components/about/WhyWeExist";
import ValuesSection from "../components/about/ValuesSection";
import TeamSection from "../components/about/TeamSection";
import PartnersSection from "../components/about/PartnersSection"; // Matches file system exactly
import AboutCTA from "../components/about/AboutCTA";

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [aboutRes, membersRes, valuesRes, partnersRes] = await Promise.allSettled([
        getAboutContent(),
        getMembers(),
        getValues(),
        getPartners(),
      ]);
      if (aboutRes.status === "fulfilled") setContent(aboutRes.value);
      if (membersRes.status === "fulfilled") setMembers(membersRes.value);
      if (valuesRes.status === "fulfilled") setValues(valuesRes.value);
      if (partnersRes.status === "fulfilled") setPartners(partnersRes.value);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <div className="w-10 h-10 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // FIXED: Added missing 'isActive' key to meet your backend database schema requirements
  const c: AboutContent = content || {
    id: 1,
    heroTitle: "Who We Are",
    heroSubtitle: "Building autonomous robots to clean the world's water bodies.",
    storyTitle: "Our Story",
    storyText: "Aquaholics was born from a deep concern for aquatic ecosystems and a belief that technology can solve what humans alone cannot.",
    missionTitle: "Our Mission",
    missionText: "To clean every water body on the planet using intelligent autonomous systems.",
    visionTitle: "Our Vision",
    visionText: "A world where every water body is clean, thriving, and free of plastic.",
    whyTitle: "Why We Exist",
    whyText: "We exist because the problem is real, urgent, and solvable.",
    ctaTitle: "Want to Work With Us?",
    ctaButtonText: "Get in Touch",
    isActive: true 
  };

  return (
    <div className="bg-[#0A0F1E] overflow-x-hidden">
      <AboutHero title={c.heroTitle} subtitle={c.heroSubtitle} />
      
      <StorySection
        title={c.storyTitle}
        text={c.storyText}
        imageUrl={c.storyImageUrl}
      />
      
      <MissionVision
        missionTitle={c.missionTitle}
        missionText={c.missionText}
        visionTitle={c.visionTitle}
        visionText={c.visionText}
      />
      
      <WhyWeExist title={c.whyTitle} text={c.whyText} />
      
      <ValuesSection values={values} />
      
      <TeamSection members={members} />
      
      {partners && partners.length > 0 && (
        <PartnersSection partners={partners} />
      )}
      
      <AboutCTA title={c.ctaTitle} buttonText={c.ctaButtonText} />
    </div>
  );
}