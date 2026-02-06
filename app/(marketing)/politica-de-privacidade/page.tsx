import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Política de Privacidade"
        subtitle="Como coletamos, usamos e protegemos informações no MotorGestor."
      />

      <section className="pb-16">
        <Container>
          <Card className="bg-background/60 p-8">
            <div className="space-y-6 text-sm text-muted-foreground">
              <p>
                Esta política descreve como o MotorGestor trata dados pessoais. Ao
                utilizar o serviço, você concorda com as práticas abaixo.
              </p>

              <div className="space-y-2">
                <div className="font-medium text-foreground">1) Dados coletados</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Dados de conta: nome, e-mail e credenciais de acesso.</li>
                  <li>Dados operacionais: veículos, leads, eventos e notas.</li>
                  <li>
                    Contato: mensagens enviadas pelo formulário público (nome,
                    e-mail, telefone, empresa).
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">2) Finalidades</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Autenticação e acesso ao app.</li>
                  <li>Operação do produto (estoque, leads e agenda).</li>
                  <li>Suporte, melhorias e comunicações essenciais.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">3) Compartilhamento</div>
                <p>
                  Não vendemos dados. Podemos compartilhar com provedores
                  necessários para operar o serviço (ex.: infraestrutura, banco),
                  sempre com o mínimo necessário.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">4) Segurança</div>
                <p>
                  Implementamos isolamento por empresa (multi-tenant) com Row Level
                  Security no Postgres, além de boas práticas de autenticação.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground">5) Seus direitos</div>
                <p>
                  Você pode solicitar acesso, correção e exclusão de dados pessoais,
                  respeitando obrigações legais e contratuais.
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

