import {
  BarChart3Icon,
  BotIcon,
  BrainIcon,
  CalendarIcon,
  CarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  PlugIcon,
  SettingsIcon,
  ShareIcon,
  UsersIcon,
} from "lucide-react";

export type SubItem = { href: string; label: string; icon: React.ElementType };
export type NavItem = { href: string; label: string; icon: React.ElementType; subItems?: SubItem[] };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/app",          label: "Dashboard",   icon: LayoutDashboardIcon },
      { href: "/app/veiculos", label: "Veículos",    icon: CarIcon },
      { href: "/app/leads",    label: "Leads",       icon: UsersIcon },
      { href: "/app/agenda",   label: "Agenda",      icon: CalendarIcon },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { href: "/app/relatorios",    label: "Relatórios",    icon: BarChart3Icon },
      { href: "/app/assistente",    label: "Assistente IA", icon: BotIcon },
      {
        href: "/app/whatsapp",
        label: "WhatsApp",
        icon: MessageCircleIcon,
        subItems: [
          { href: "/app/whatsapp/treinamento", label: "Treinamento IA", icon: BrainIcon },
        ],
      },
      { href: "/app/social-media",  label: "Social Media",  icon: ShareIcon },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/app/integracoes",   label: "Integrações",      icon: PlugIcon },
      { href: "/app/billing",       label: "Plano & Cobrança", icon: CreditCardIcon },
      { href: "/app/configuracoes", label: "Configurações",    icon: SettingsIcon },
    ],
  },
];

export const NAV_FLAT = NAV_GROUPS.flatMap((g) =>
  g.items.flatMap((item) => [item, ...(item.subItems ?? [])])
);
