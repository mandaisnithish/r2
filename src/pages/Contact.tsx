// src/pages/Contact.tsx
import { useEffect, useState } from "react";
import { getActiveContactInfo } from "../api/contactApi";
import { DEFAULT_CONTACT_INFO } from "../constants/contactFallback";
import type { ContactInfo } from "../types/contact";

import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import ContactDetails from "../components/contact/ContactDetails";

export default function ContactPage() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getActiveContactInfo();
        setInfo(data);
      } catch (err) {
        console.error("Active contact info fetch failed, using fallback", err);
        setInfo(DEFAULT_CONTACT_INFO);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <div className="w-10 h-10 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="bg-[#0A0F1E] min-h-screen">
      <ContactHero heroTitle={info.heroTitle} heroSubtitle={info.heroSubtitle} />

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <ContactForm />
          <ContactDetails info={info} />
        </div>
      </section>
    </div>
  );
}