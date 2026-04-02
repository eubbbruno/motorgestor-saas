import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const sections = [
  {
    id: "conta-acesso",
    title: "1. Conta e acesso",
    content: (
      <p>
        Você é responsável pelas credenciais de acesso e por manter a segurança da conta.
        O uso é restrito a usuários autorizados pela sua empresa. Em caso de suspeita de
        acesso não autorizado, entre em contato imediatamente com o suporte.
      </p>
    ),
  },
  {
    id: "conteudo-dados",
    title: "2. Conteúdo e dados",
    content: (
      <p>
        Os dados inseridos no sistema (veículos, leads, eventos, notas) pertencem à sua empresa.
        Você garante que possui direito de inserir essas informações e que elas não violam
        direitos de terceiros. O MotorGestor não se responsabiliza por dados incorretos ou
        inseridos de forma inadequada.
      </p>
    ),
  },
  {
    id: "uso-aceitavel",
    title: "3. Uso aceitável",
    content: (
      <ul>
        <li>Não explorar vulnerabilidades, tentar burlar permissões ou acessar dados de outros tenants.</li>
        <li>Não usar o serviço para atividades ilegais, fraude ou enganação.</li>
        <li>Não enviar spam, mensagens em massa não solicitadas via ferramentas internas do produto.</li>
        <li>Não fazer engenharia reversa, copiar ou redistribuir o software sem autorização.</li>
      </ul>
    ),
  },
  {
    id: "pagamento",
    title: "4. Pagamento e cancelamento",
    content: (
      <>
        <p>
          O trial de 14 dias é gratuito e não exige cartão de crédito. Após o trial, é necessário
          assinar um plano para continuar utilizando o serviço.
        </p>
        <p>
          O cancelamento pode ser feito a qualquer momento nas configurações da conta.
          Não há multa por cancelamento antecipado. Você terá acesso ao serviço até
          o fim do período pago.
        </p>
      </>
    ),
  },
  {
    id: "disponibilidade",
    title: "5. Disponibilidade",
    content: (
      <p>
        Trabalhamos para manter o serviço disponível e com alta confiabilidade (SLA de 99.9% para
        planos Enterprise). Podem ocorrer manutenções programadas com aviso prévio. Consulte{" "}
        <a href="/status" className="text-[#4AE54A] hover:underline">
          a página de status
        </a>{" "}
        para informações em tempo real.
      </p>
    ),
  },
  {
    id: "responsabilidade",
    title: "6. Limitação de responsabilidade",
    content: (
      <p>
        O MotorGestor não se responsabiliza por perdas de negócio, dados inseridos incorretamente
        pelo usuário ou danos indiretos decorrentes do uso do serviço. Nossa responsabilidade fica
        limitada ao valor pago pelo serviço nos últimos 12 meses.
      </p>
    ),
  },
  {
    id: "alteracoes",
    title: "7. Alterações nos Termos",
    content: (
      <p>
        Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão comunicadas por
        e-mail com no mínimo 15 dias de antecedência. O uso continuado do serviço após as
        alterações implica na aceitação dos novos termos.
      </p>
    ),
  },
  {
    id: "legislacao",
    title: "8. Legislação aplicável",
    content: (
      <p>
        Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
        São Paulo — SP para dirimir quaisquer disputas decorrentes deste instrumento.
      </p>
    ),
  },
];

const toc = sections.map((s) => ({ id: s.id, title: s.title }));

export default function TermosDeUsoPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.06),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Legal
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Termos de Uso</h1>
            <p className="text-[#6B9E6B]">
              Regras gerais para uso do MotorGestor. Ao utilizar o serviço, você concorda com estes termos.
            </p>
            <p className="text-xs text-[#6B9E6B]/50 mt-3">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-24 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* TOC sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-5">
                <div className="text-xs font-bold text-[#6B9E6B] uppercase tracking-wider mb-4">Índice</div>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs text-[#9CA3AF] hover:text-[#4AE54A] transition-colors leading-relaxed"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-8">
                <div className="space-y-10">
                  {sections.map((s) => (
                    <div key={s.id} id={s.id} className="scroll-mt-24">
                      <h2 className="text-base font-bold text-white mb-3">{s.title}</h2>
                      <div className="text-sm text-[#9CA3AF] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_p]:leading-relaxed">
                        {s.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
