# MotorGestor — Roadmap & Checklist

## 🔴 URGENTE
- [x] IA respondendo automaticamente no WhatsApp — destravado: webhook agora é gravado via POST /instance/connect (antes 404)
- [x] Fluxo automático de criação de instância para novos clientes — QR corrigido (lia caminho errado → "Tempo esgotado")
- [ ] Testar pagamento completo (Mercado Pago produção) — código corrigido (ativação de assinatura); falta o teste real com cartão de produção
- [ ] Google Analytics ID configurar no Vercel — código pronto; falta só a env var NEXT_PUBLIC_GA_ID

## 🟡 ESTA SEMANA
- [ ] Social Media post generator (html2canvas)
- [ ] Verificação de acesso Agência Termo no Meta (prazo 16/07/2026)
- [ ] Consulta por placa (APIPlacas — pago ~R$29/mês)
- [ ] Reset de senha — página no app

## 🟢 PRÓXIMAS SEMANAS
- [ ] Dashboard com dados reais (gráficos com dados do Supabase)
- [ ] Relatórios mais completos
- [ ] Login com Facebook
- [ ] Exportação marketplaces API real (Mercado Livre)
- [ ] App mobile PWA

## ✅ CONCLUÍDO
- [x] Site completo no ar (motorgestor.com.br)
- [x] Dashboard dark green
- [x] Login/cadastro + Google OAuth
- [x] Leads funcionando
- [x] Agenda/Eventos funcionando
- [x] Calendário redesenhado
- [x] Assistente IA funcionando
- [x] Exportação PDF veículos e catálogo
- [x] WhatsApp inbox — recebimento ✅
- [x] WhatsApp inbox — envio ✅
- [x] WhatsApp aprovado no Meta ✅
- [x] Evolution GO no Railway ✅
- [x] Webhook Evolution GO → MotorGestor ✅
- [x] Billing estruturado (Mercado Pago)
- [x] Trial 14 dias
- [x] Emails transacionais (Resend)
- [x] Favicon
- [x] Google Tag Manager
- [x] SEO básico
- [x] RLS Supabase corrigido
- [x] Onboarding modal
- [x] Mobile responsivo (site + dashboard)

## 📋 NOTAS
- Evolution GO: https://evolution-api-production-2c646.up.railway.app
- Evolution GO API Key: motorgestor2026secret
- WhatsApp: instância "teste" conectada ao número +5543988110833
- Meta: verificação Agência Termo enviada (prazo 16/07/2026)
- Mercado Pago: chaves teste e produção configuradas no Vercel
- Resend: domínio motorgestor.com.br verificado
- Supabase: projeto iondotsjljrhrawcqmzs
- Evolution GO endpoints reais: criar = POST /instance/create; conectar+webhook = POST /instance/connect (apikey=token, body webhookUrl+subscribe); QR = GET /instance/qr (resposta em data.Qrcode); deletar = DELETE /instance/delete/{uuid}
- Planos (tabela plans alinhada com lib/billing/plans.ts): Free, Starter R$97, Pro R$197, Enterprise R$397
