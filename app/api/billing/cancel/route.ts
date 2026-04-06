// POST /api/billing/cancel
//
// Responsabilidades:
// - Autenticar o usuário via Supabase (createSupabaseServerClient)
// - Buscar o subscription_id ativo da empresa na tabela `subscriptions`
// - Chamar a API do Mercado Pago para cancelar o preapproval (status: cancelled)
// - Atualizar o status da assinatura no Supabase para 'cancelled'
// - Retornar confirmação ao cliente
//
// Dependências futuras:
// - mercadopago SDK (PreApproval.update)
// - lib/supabase/server.ts
// - features/billing/api.ts

export async function POST() {
  // TODO: implementar cancelamento de assinatura
  return Response.json({ message: 'not implemented' }, { status: 501 })
}
