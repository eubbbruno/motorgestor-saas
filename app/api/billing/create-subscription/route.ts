// POST /api/billing/create-subscription
//
// Responsabilidades:
// - Receber plano selecionado pelo usuário (plano, periodicidade)
// - Autenticar o usuário via Supabase (createSupabaseServerClient)
// - Criar um preapproval (assinatura) no Mercado Pago via SDK
// - Salvar o subscription_id e status na tabela `subscriptions` do Supabase
// - Retornar a URL de pagamento (init_point) para redirecionar o usuário
//
// Dependências futuras:
// - mercadopago SDK (PreApproval)
// - lib/supabase/server.ts
// - features/billing/api.ts

export async function POST() {
  // TODO: implementar criação de assinatura
  return Response.json({ message: 'not implemented' }, { status: 501 })
}
