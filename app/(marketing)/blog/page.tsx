import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Dicas para Concessionárias",
  description:
    "Artigos sobre gestão de revendas, vendas de veículos e mercado automotivo brasileiro.",
};
import { ClockIcon, CalendarIcon, TagIcon } from "lucide-react";

import { posts } from "@/content/blog";
import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Ideias práticas para{" "}
              <span className="text-[#4AE54A]">vender mais e operar melhor</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Processo, atendimento e organização para revendas pequenas e vendedores autônomos.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Posts grid */}
      <section className="pb-24 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <StaggerSection className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <StaggerItem key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block h-full">
                  <article className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/40 hover:shadow-[0_0_30px_rgba(74,229,74,0.08)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(74,229,74,0.1)] border border-[rgba(74,229,74,0.2)] text-[#4AE54A]"
                        >
                          <TagIcon className="size-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-semibold text-white leading-snug mb-3 group-hover:text-[#4AE54A] transition-colors flex-1">
                      {p.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[#6B9E6B] text-sm leading-relaxed mb-5 line-clamp-3">
                      {p.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[#6B9E6B]/70 pt-4 border-t border-[#4AE54A]/10">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        {p.readingTime}
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>
    </div>
  );
}
