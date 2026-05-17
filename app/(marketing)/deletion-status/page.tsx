import { Suspense } from "react";

function DeletionStatusContent({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <Suspense>
      <DeletionStatusInner searchParams={searchParams} />
    </Suspense>
  );
}

async function DeletionStatusInner({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  const id = params.id ?? "—";

  return (
    <div className="min-h-screen bg-[#0A1A0C] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-8 text-center space-y-4">
        <div className="text-4xl">🗑️</div>
        <h1 className="text-xl font-bold text-white">Solicitação de exclusão recebida</h1>
        <p className="text-sm text-[#6B9E6B]">
          Recebemos sua solicitação de exclusão de dados vinculados ao Facebook.
          Seus dados foram removidos do MotorGestor.
        </p>
        <div className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[rgba(74,229,74,0.04)] px-4 py-3">
          <p className="text-xs text-[#6B9E6B]/70 mb-1">Código de confirmação</p>
          <p className="font-mono text-sm text-[#4AE54A] break-all">{id}</p>
        </div>
        <p className="text-xs text-[#6B9E6B]/50">
          Se você tiver dúvidas, entre em contato:{" "}
          <a href="mailto:suporte@motorgestor.com.br" className="underline hover:text-[#6B9E6B]">
            suporte@motorgestor.com.br
          </a>
        </p>
      </div>
    </div>
  );
}

export default function DeletionStatusPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return <DeletionStatusContent searchParams={searchParams} />;
}
