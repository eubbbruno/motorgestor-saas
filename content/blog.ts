export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  readingTime: string;
  tags: string[];
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "como-organizar-leads-de-whatsapp-em-um-funil-simples",
    title: "Como organizar leads do WhatsApp em um funil simples",
    excerpt:
      "Um modelo prático de etapas e rotina diária para não deixar lead esfriar.",
    date: "2026-02-01",
    author: "Equipe MotorGestor",
    readingTime: "6 min",
    tags: ["leads", "processo", "vendas"],
    content: [
      "Se a sua operação vive no WhatsApp, você não está sozinho. O problema não é o canal — é a falta de processo.",
      "A solução mais eficiente para revenda pequena é um funil com poucas etapas e um hábito diário: todo lead precisa ter um próximo passo.",
      "Sugestão de etapas: Novo → Contato → Visita/Test-drive → Proposta → Ganho/Perdido. Evite dezenas de status: você só precisa do que muda sua ação.",
      "Rotina simples: responda os 'Novos' primeiro; depois trate quem está em 'Contato' e precisa de retorno; por fim, avance 'Proposta' com prazos claros.",
      "Dica final: registre sempre o último contato e a próxima ação. Isso vira previsibilidade e aumenta conversão sem aumentar tráfego.",
    ],
  },
  {
    slug: "estoque-sem-planilha-cadastro-rapido-e-consistente",
    title: "Estoque sem planilha: cadastro rápido e consistente",
    excerpt:
      "Padrões de cadastro para economizar tempo e evitar retrabalho ao anunciar e negociar.",
    date: "2026-01-25",
    author: "Equipe MotorGestor",
    readingTime: "5 min",
    tags: ["estoque", "veiculos", "operacao"],
    content: [
      "O estoque é a base de tudo: anúncio, negociação e fechamento. Quando o cadastro é bagunçado, o vendedor perde tempo e a operação trava.",
      "Use um padrão mínimo: Título, Marca/Modelo, Ano, KM, Preço, Câmbio, Combustível e Status. O resto é complementar.",
      "O segredo é consistência. Um campo sempre preenchido permite filtro e comparação (e melhora seu atendimento no WhatsApp).",
      "Status recomendado: Disponível, Reservado, Vendido. O que não está disponível não deveria aparecer como opção para lead.",
    ],
  },
  {
    slug: "agenda-de-test-drive-o-que-agendar-para-fechar-mais",
    title: "Agenda de test-drive: o que agendar para fechar mais",
    excerpt:
      "Compromissos que aumentam conversão: retorno, visita, proposta e follow-up.",
    date: "2026-01-18",
    author: "Equipe MotorGestor",
    readingTime: "4 min",
    tags: ["agenda", "test-drive", "vendas"],
    content: [
      "Agenda não é só 'visita'. Para fechar mais, você precisa agendar o que acelera decisões.",
      "Três tipos de eventos que funcionam bem: (1) retorno pós-primeiro contato, (2) visita/test-drive, (3) retorno de proposta com prazo.",
      "Cada evento deve ter contexto: qual veículo, qual objeção, qual próximo passo. Sem isso, vira só um lembrete sem força.",
    ],
  },
  {
    slug: "rls-e-multi-tenant-por-que-importa-para-sua-revenda",
    title: "RLS e multi-tenant: por que isso importa para sua revenda",
    excerpt:
      "Segurança real não é só senha. É garantir que cada empresa veja apenas seus dados.",
    date: "2026-01-10",
    author: "Equipe MotorGestor",
    readingTime: "7 min",
    tags: ["seguranca", "rls", "b2b"],
    content: [
      "Quando você coloca dados de leads e clientes em um SaaS, você precisa confiar no isolamento entre empresas.",
      "Row Level Security (RLS) é uma camada no Postgres que aplica regras no banco. Mesmo se alguém tentar acessar direto, as políticas bloqueiam.",
      "No MotorGestor, todas as tabelas principais usam company_id e políticas para leitura/escrita apenas dentro do tenant.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

