"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

interface Faq {
  question: string;
  answer: string;
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={faq.question} className="border border-[#4AE54A]/15 bg-[#0F2014] rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-[rgba(74,229,74,0.04)] transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-white text-sm sm:text-base pr-4">
              {faq.question}
            </span>
            <div className="size-7 rounded-full bg-[rgba(74,229,74,0.12)] flex items-center justify-center shrink-0">
              {open === i ? (
                <MinusIcon className="size-3.5 text-[#4AE54A]" />
              ) : (
                <PlusIcon className="size-3.5 text-[#4AE54A]" />
              )}
            </div>
          </button>
          {open === i && (
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[#6B9E6B] leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
