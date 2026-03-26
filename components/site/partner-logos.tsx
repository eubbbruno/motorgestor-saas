"use client";

import { useState } from "react";

const partners = [
  {
    name: "WhatsApp",
    src: "/images/logos/Digital_Inline_Green_RGB_2026.png",
    h: "h-8",
    fallbackColor: "text-[#25D366]",
  },
  {
    name: "OLX",
    src: "/images/logos/olx-logo-png_seeklogo-270798.png",
    h: "h-6",
    fallbackColor: "text-[#E8392A]",
  },
  {
    name: "Webmotors",
    src: "/images/logos/webmotors-logo-8.png",
    h: "h-6",
    fallbackColor: "text-[#E8392A]",
  },
  {
    name: "iCarros",
    src: "/images/logos/novo-logo-icarros.svg",
    h: "h-7",
    fallbackColor: "text-[#CC0000]",
  },
  {
    name: "FIPE",
    src: "/images/logos/logo_oficial_2025.jpg",
    h: "h-7",
    fallbackColor: "text-gray-400",
  },
];

function PartnerLogo({
  name,
  src,
  h,
  fallbackColor,
}: {
  name: string;
  src: string;
  h: string;
  fallbackColor: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`font-goldman text-xl select-none opacity-50 hover:opacity-100 transition-opacity ${fallbackColor}`}
      >
        {name}
      </span>
    );
  }

  return (
    <div className="group relative flex items-center justify-center px-2">
      {/* hover glow */}
      <div className="absolute inset-0 rounded-lg bg-[#4AE54A]/0 group-hover:bg-[#4AE54A]/6 blur-md transition-all duration-300 pointer-events-none" />
      <img
        src={src}
        alt={name}
        className={`relative ${h} w-auto opacity-50 brightness-200 hover:opacity-100 transition-all duration-300`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function PartnerLogos() {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex animate-marquee gap-16 w-max">
        {/* First set */}
        {partners.map((p) => (
          <PartnerLogo key={`a-${p.name}`} {...p} />
        ))}
        {/* Duplicate for seamless loop */}
        {partners.map((p) => (
          <PartnerLogo key={`b-${p.name}`} {...p} />
        ))}
      </div>
    </div>
  );
}
