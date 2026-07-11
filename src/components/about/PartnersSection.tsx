import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Partner } from "../../types";

interface Props {
  partners: Partner[];
}

const CATEGORY_COLORS: Record<string, string> = {
  University: "#00B4D8",
  Lab: "#00F5FF",
  Sponsor: "#90E0EF",
  Media: "#0077B6",
  Incubator: "#00B4D8",
};

export default function PartnersSection({ partners }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Sort partners dynamically by display placement order assignments safely
  const sorted = [...partners].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <section ref={ref} className="bg-[#0A0F1E] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Our Network
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Partners & Recognitions
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group no-underline"
                >
                  {/* Passing group state status flags downward dynamically */}
                  <PartnerCard partner={partner} isLinked={true} />
                </a>
              ) : (
                <div className="group">
                  <PartnerCard partner={partner} isLinked={false} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  partner: Partner;
  isLinked: boolean;
}

function PartnerCard({ partner, isLinked }: CardProps) {
  const color = CATEGORY_COLORS[partner.category ?? ""] ?? "#00B4D8";
  
  return (
    <div 
      className={`bg-[#0D1B2A] border border-[#00B4D8]/15 rounded-xl p-4 flex flex-col items-center justify-center gap-3 h-32 relative overflow-hidden transition-all duration-300
        ${isLinked ? "group-hover:border-[#00B4D8]/40 group-hover:bg-[#0D1B2A]/80 shadow-lg" : "group-hover:border-[#00B4D8]/25"}
      `}
    >
      {/* Decorative Top Line Visual Accent */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
      
      {partner.logoUrl ? (
        <img 
          src={partner.logoUrl} 
          alt={partner.name} 
          className="h-10 max-w-full object-contain filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300" 
        />
      ) : (
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center font-heading font-bold text-lg transition-transform duration-300 group-hover:scale-105" 
          style={{ background: `${color}15`, color }}
        >
          {partner.name ? partner.name.charAt(0) : "?"}
        </div>
      )}
      
      <p className="text-slate-400 text-xs text-center font-medium leading-tight line-clamp-1 w-full">
        {partner.name}
      </p>
      
      {partner.category && (
        <span 
          className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mt-auto" 
          style={{ background: `${color}15`, color }}
        >
          {partner.category}
        </span>
      )}
    </div>
  );
}