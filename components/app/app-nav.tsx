import {
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  CreditCardIcon,
  FileUpIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export const appNav = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/app/veiculos", label: "Veículos", icon: CarIcon },
  { href: "/app/leads", label: "Leads", icon: UsersIcon },
  { href: "/app/importar-leads", label: "Importar Leads", icon: FileUpIcon },
  { href: "/app/pipeline", label: "Pipeline", icon: LayoutGridIcon },
  { href: "/app/vendas", label: "Vendas", icon: ShoppingCartIcon },
  { href: "/app/relatorios", label: "Relatórios", icon: BarChart3Icon },
  { href: "/app/configuracoes", label: "Configurações", icon: SettingsIcon },
  { href: "/app/agenda", label: "Agenda", icon: CalendarIcon },
  { href: "/app/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/app/assinatura", label: "Assinatura", icon: CreditCardIcon },
  { href: "/app/ajuda", label: "Ajuda", icon: HelpCircleIcon },
  { href: "/suporte", label: "Suporte", icon: FileTextIcon },
];

