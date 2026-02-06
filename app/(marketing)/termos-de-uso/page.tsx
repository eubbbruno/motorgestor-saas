import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";

export default function TermosDeUsoPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Termos de Uso"
        subtitle="Regras gerais para uso do MotorGestor."
      />

      <section className="pb-16">
        <Container>
          <Card className="bg-background/60 p-8">
            <div className="space-y-6 text-sm text-muted-foreground">
              <p>
                Ao acessar ou usar o MotorGestor, você concorda com estes Termos.
                Se não concordar, não utilize o serviço.
              </p>

              <div className="space-y-2">
                <div className="font-medium text-foreground">1) Conta e acesso</div>
                <p>
                  Você é responsável pelas credenciais e por manter a segurança da
                  conta. O uso é restrito a usuários autorizados pela sua empresa.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">2) Conteúdo e dados</div>
                <p>
                  Os dados inseridos (veículos, leads, eventos) pertencem à sua
                  empresa. Você garante que possui direito de inserir essas
                  informações.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">3) Uso aceitável</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Não explorar vulnerabilidades nem tentar burlar permissões.</li>
                  <li>Não usar o serviço para atividades ilegais.</li>
                  <li>Não enviar spam via ferramentas internas do produto.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">4) Disponibilidade</div>
                <p>
                  Trabalhamos para manter o serviço disponível, mas podem ocorrer
                  manutenções e instabilidades. Consulte a página de status quando
                  necessário.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">5) Alterações</div>
                <p>
                  Podemos atualizar estes Termos. Mudanças relevantes serão
                  comunicadas por canais apropriados.
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

