export const PLANS = {
  starter: {
    name: "Starter",
    priceMonthly: 97,
    priceAnnual: 77,
    features: [
      "Até 50 veículos no estoque",
      "Até 200 leads/mês",
      "1 usuário",
      "Integração OLX e Webmotors",
      "Suporte por e-mail",
    ],
  },
  pro: {
    name: "Pro",
    priceMonthly: 197,
    priceAnnual: 157,
    features: [
      "Veículos ilimitados",
      "Leads ilimitados",
      "Até 5 usuários",
      "IA para descrições e WhatsApp",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceMonthly: 397,
    priceAnnual: 317,
    features: [
      "Tudo do Pro",
      "Usuários ilimitados",
      "API access",
      "Onboarding dedicado",
      "SLA garantido",
      "Gerente de conta exclusivo",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
