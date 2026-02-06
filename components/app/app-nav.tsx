import {
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  CreditCardIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export const appNav = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/app/veiculos", label: "Veículos", icon: CarIcon },
  { href: "/app/leads", label: "Leads", icon: UsersIcon },
  { href: "/app/vendas", label: "Vendas", icon: ShoppingCartIcon },
  { href: "/app/agenda", label: "Agenda", icon: CalendarIcon },
  { href: "/app/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/app/relatorios", label: "Relatórios", icon: BarChart3Icon },
  { href: "/app/assinatura", label: "Assinatura", icon: CreditCardIcon },
  { href: "/app/configuracoes", label: "Configurações", icon: SettingsIcon },
  { href: "/app/ajuda", label: "Ajuda", icon: HelpCircleIcon },
  { href: "/suporte", label: "Suporte", icon: FileTextIcon },
];

