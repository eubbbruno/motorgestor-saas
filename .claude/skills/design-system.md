# Design System — MotorGestor

## Cores
- Background principal: #0D1F1A
- Background cards: #0F2014
- Sidebar: #0A1A0C
- Verde neon: #4AE54A
- Verde médio: #22C55E
- Texto principal: #FFFFFF
- Texto secundário: #6B9E6B
- Border padrão: rgba(74,229,74,0.12)

## Fontes
- Títulos (h1, h2, h3): Goldman — Google Fonts, weights 400 e 700
- Textos e parágrafos: Prompt — Google Fonts, weights 400, 500, 600
- Importar ambas via next/font/google em app/layout.tsx
- Aplicar Goldman em font-family: var(--font-goldman) nos headings via tailwind.config
- Aplicar Prompt em font-family: var(--font-prompt) como font-sans base

## Padrões visuais
- Cards: bg-[#0F2014] border border-[#4AE54A]/20 rounded-2xl
- Botão primário: bg-[#4AE54A] text-black font-600 hover:bg-[#4AE54A]/90
- Botão outline: border border-[#4AE54A]/50 text-white hover:bg-[#4AE54A]/10
- Inputs: bg-[#0A1A0C] border border-[#4AE54A]/20 focus:border-[#4AE54A] text-white
- Glow decorativo: bg-[#4AE54A]/8 rounded-full blur-[120px]
- Dot pattern: radial-gradient(rgba(74,229,74,0.15) 1px, transparent 1px) 24px 24px
