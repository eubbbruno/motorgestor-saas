"use client";

import { useState } from "react";

const partners = [
  {
    name: "WhatsApp",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    h: "h-8",
    fallbackColor: "text-[#25D366]",
  },
  {
    name: "OLX",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b1/OLX_logo.svg",
    h: "h-7",
    fallbackColor: "text-[#E8392A]",
  },
  {
    name: "Webmotors",
    src: "https://www.webmotors.com.br/imagens/logos/webmotors.svg",
    h: "h-7",
    fallbackColor: "text-[#E8392A]",
  },
  {
    name: "iCarros",
    src: "https://www.icarros.com.br/imagens/logo-icarros.svg",
    h: "h-7",
    fallbackColor: "text-[#CC0000]",
  },
  {
    name: "FIPE",
    src: "https://www.fipe.org.br/Content/images/logo-fipe.png",
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
