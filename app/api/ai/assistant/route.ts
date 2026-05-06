import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `Você é o assistente oficial do MotorGestor, um SaaS B2B para concessionárias e revendas de veículos brasileiras.

FUNCIONALIDADES DO SISTEMA:
- Dashboard: métricas de vendas, leads ativos, veículos em estoque, agenda do dia
- Veículos: cadastro completo com FIPE automática, fotos, status (disponível/reservado/vendido), exportação PDF
- Leads: pipeline Kanban (Novo/Contato/Negociação/Fechado), histórico de atendimento, tarefas
- Agenda: calendário de eventos, test drives, reuniões
- Relatórios: exportação CSV e PDF de leads e veículos
- WhatsApp: configuração do número Business, templates de mensagem, envio para leads
- Integrações: consulta por placa (plano Pro+), exportação de catálogo PDF para marketplaces
- Plano & Cobrança: gerenciamento de assinatura (Starter R$97/mês, Pro R$197/mês, Enterprise R$397/mês)
- Configurações: perfil, empresa, usuários, segurança

REGRAS:
- Responda sempre em português brasileiro
- Seja direto e objetivo — máximo 3 parágrafos
- Se não souber algo específico do sistema, oriente o usuário a contatar o suporte
- Nunca invente funcionalidades que não existem
- Seja amigável mas profissional
- Para dúvidas técnicas complexas, sugira contato: motorgestor@gmail.com`

type HistoryMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] }: { message: string; history?: HistoryMessage[] } = await req.json()

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        ...history.slice(-10),
        { role: 'user', content: message }
      ]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ response: text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
