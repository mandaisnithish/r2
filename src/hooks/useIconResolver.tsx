import React from "react";
import * as Icons from "lucide-react";

export function useIconResolver() {
  /**
   * Resolves a raw text string from the backend into a live, styled Lucide component.
   * * @param iconName - The string name of the icon (e.g., "Cpu", "shield-alert")
   * @param size - Explicit layout pixel box sizing
   * @param className - Brand color utility classes matching the design token matrix
   */
  const resolveIcon = (
    iconName?: string, 
    size = 20, 
    className = "text-[#00B4D8]"
  ): React.ReactNode => {
    // Fallback block case if the database entry string is missing
    if (!iconName) {
      return <Icons.Cpu size={size} className={className} />;
    }

    // Convert potential kebab-case or snake_case names to standard PascalCase
    const normalizedKey = iconName
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/[-_]([a-z])/g, (_, match) => match.toUpperCase());

    // Verify if the calculated key exists inside the current Lucide map
    const IconComponent = (Icons as any)[normalizedKey];

    if (!IconComponent) {
      // Return alert icon placeholder if data contains broken reference tags
      return <Icons.HelpCircle size={size} className="text-amber-500 animate-pulse" />;
    }

    return <IconComponent size={size} className={className} />;
  };

  return { resolveIcon };
}