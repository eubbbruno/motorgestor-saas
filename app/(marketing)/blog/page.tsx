import Link from "next/link";

import { posts } from "@/content/blog";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ideias práticas para vender mais e operar melhor"
        subtitle="Processo, atendimento e organização para revendas pequenas e vendedores autônomos."
      />

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            {sorted.map((p) => (
              <Card key={p.slug} className="bg-background/60 p-6">
                <div className="flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-lg font-semibold tracking-tight hover:underline hover:underline-offset-4"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleDateString("pt-BR")} · {p.readingTime} ·{" "}
                  {p.author}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

