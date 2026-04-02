import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const sections = [
  {
    id: "dados-coletados",
    title: "1. Dados coletados",
    content: (
      <>
        <p>Coletamos apenas o necessário para operar o serviço:</p>
        <ul>
          <li><strong>Dados de conta:</strong> nome, e-mail e credenciais de acesso.</li>
          <li><strong>Dados operacionais:</strong> veículos, leads, eventos e notas inseridos pela sua empresa.</li>
          <li><strong>Contato:</strong> mensagens enviadas pelo formulário público (nome, e-mail, telefone, empresa).</li>
          <li><strong>Dados de uso:</strong> logs de acesso para segurança e diagnóstico de problemas.</li>
        </ul>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "2. Finalidades do tratamento",
    content: (
      <>
        <p>Tratamos seus dados com base nas seguintes finalidades (conforme a LGPD — Lei nº 13.709/2018):</p>
        <ul>
          <li>Execução do contrato: autenticação, acesso ao app e operação do produto.</li>
          <li>Legítimo interesse: segurança, prevenção de fraudes e melhoria contínua.</li>
          <li>Consentimento: comunicações de marketing (newsletter), quando solicitado.</li>
          <li>Obrigação legal: cumprimento de requisitos regulatórios aplicáveis.</li>
        </ul>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "3. Compartilhamento de dados",
    content: (
      <>
        <p>
          Não vendemos dados pessoais. Podemos compartilhar informações com:
        </p>
        <ul>
          <li><strong>Provedores de infraestrutura</strong> (ex.: Supabase/AWS) para hospedar e processar dados.</li>
          <li><strong>Ferramentas de suporte</strong> para gestão de tickets e comunicação com clientes.</li>
        </ul>
        <p>Todos os fornecedores seguem padrões adequados de segurança e privacidade.</p>
      </>
    ),
  },
  {
    id: "seguranca",
    title: "4. Segurança",
    content: (
      <p>
        Implementamos isolamento por empresa (multi-tenant) com Row Level Security no Postgres,
        além de criptografia em trânsito (TLS), autenticação segura via Supabase Auth e
        monitoramento de acessos. Consulte nossa{" "}
        <a href="/seguranca" className="text-[#4AE54A] hover:underline">
          página de segurança
        </a>{" "}
        para mais detalhes técnicos.
      </p>
    ),
  },
  {
    id: "seus-direitos",
    title: "5. Seus direitos (LGPD)",
    content: (
      <>
        <p>De acordo com a LGPD, você tem direito a:</p>
        <ul>
          <li>Confirmar a existência e acessar seus dados pessoais.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>Solicitar a exclusão dos dados pessoais tratados por consentimento.</li>
          <li>Portabilidade dos dados a outro fornecedor de serviço.</li>
          <li>Informação sobre o uso compartilhado de dados.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <a href="mailto:privacidade@motorgestor.com.br" className="text-[#4AE54A] hover:underline">
            privacidade@motorgestor.com.br
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "retencao",
    title: "6. Retenção de dados",
    content: (
      <p>
        Mantemos seus dados enquanto o contrato estiver ativo. Após o cancelamento,
        os dados ficam disponíveis para exportação por 30 dias, após os quais são
        excluídos definitivamente de nossos sistemas.
      </p>
    ),
  },
  {
    id: "atualizacoes",
    title: "7. Atualizações desta política",
    content: (
      <p>
        Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas
        por e-mail ou via notificação dentro do produto. Recomendamos revisar esta página periodicamente.
      </p>
    ),
  },
];

const toc = sections.map((s) => ({ id: s.id, title: s.title }));

export default function PoliticaDePrivacidadePage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidade</h1>
            <p className="text-[#6B9E6B]">
              Como coletamos, usamos e protegemos informações no MotorGestor — em conformidade com a LGPD.
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
                      <div className="prose-custom text-sm text-[#9CA3AF] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white [&_p]:leading-relaxed">
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
