import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Política de Cookies"
        subtitle="Como usamos cookies para autenticação e experiência no site/app."
      />

      <section className="pb-16">
        <Container>
          <Card className="bg-background/60 p-8">
            <div className="space-y-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="font-medium text-foreground">O que são cookies?</div>
                <p>
                  Cookies são pequenos arquivos armazenados no seu navegador para
                  lembrar preferências e manter sessões autenticadas.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">Como usamos</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Manter você logado no app (sessão).</li>
                  <li>Lembrar preferências de tema (claro/escuro).</li>
                  <li>Melhorar segurança e prevenir abuso.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">Gerenciamento</div>
                <p>
                  Você pode bloquear cookies nas configurações do navegador. Isso
                  pode afetar recursos como login e navegação no app.
                </p>
              </div>

              <p className="text-xs">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}.
              </p>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

