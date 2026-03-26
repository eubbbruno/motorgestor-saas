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
    h: "h-7",
    fallbackColor: "text-[#E8392A]",
  },
  {
    name: "Webmotors",
    src: "/images/logos/webmotors-logo-8.png",
    h: "h-7",
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
    fallbackColor: "text-gray-500",
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
      <span className={`font-goldman text-xl select-none ${fallbackColor}`}>
        {name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${h} w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}
      onError={() => setFailed(true)}
    />
  );
}

export function PartnerLogos() {
  return (
    <>
      {partners.map((p) => (
        <PartnerLogo key={p.name} {...p} />
      ))}
    </>
  );
}
