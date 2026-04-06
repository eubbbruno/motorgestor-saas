// POST /api/billing/webhook
//
// Responsabilidades:
// - Receber notificações do Mercado Pago (IPN / Webhooks)
// - Validar a assinatura do webhook (x-signature header)
// - Tratar eventos relevantes:
//     * authorized   → ativar assinatura da empresa
//     * paused       → bloquear acesso premium
//     * cancelled    → cancelar assinatura
//     * payment_failed → notificar empresa por e-mail
// - Atualizar a tabela `subscriptions` no Supabase com o novo status
// - Retornar 200 rapidamente (processamento assíncrono se necessário)
//
// Dependências futuras:
// - mercadopago SDK (Payment, PreApproval)
// - lib/supabase/server.ts (service role client para escrita sem RLS)
// - features/billing/api.ts

export async function POST() {
  // TODO: implementar handler de webhook
  return Response.json({ received: true }, { status: 200 })
}
