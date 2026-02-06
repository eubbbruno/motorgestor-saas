import { notFound } from "next/navigation";
import Link from "next/link";

import { getPostBySlug, posts } from "@/content/blog";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("pt-BR")} · {post.readingTime} ·{" "}
              {post.author}
            </div>
          </div>

          <Card className="bg-background/60 p-8">
            <div className="space-y-4 text-sm text-muted-foreground">
              {post.content.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </Card>

          <div className="text-sm text-muted-foreground">
            <Link href="/blog" className="underline underline-offset-4">
              ← Voltar para o blog
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

