import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const services = [
  { name: "Plataforma Web", uptime: "99.9%" },
  { name: "API", uptime: "99.9%" },
  { name: "Banco de Dados", uptime: "99.9%" },
  { name: "Integrações", uptime: "99.9%" },
  { name: "Email", uptime: "99.9%" },
];

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function StatusPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-2xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Status
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Status do{" "}
              <span className="text-[#4AE54A]">MotorGestor</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Transparência sobre disponibilidade e incidentes em tempo real.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Status panel */}
      <section className="pb-20 bg-[#0A1A0C]">
        <Container className="max-w-2xl">
          <FadeUp>
            {/* Global status */}
            <div className="rounded-2xl border border-[#4AE54A]/30 bg-[#0F2014] p-6 mb-6 flex items-center gap-4">
              <div className="size-3 rounded-full bg-[#4AE54A] shadow-[0_0_8px_rgba(74,229,74,0.6)] animate-pulse shrink-0" />
              <div>
                <div className="text-white font-semibold">Todos os sistemas operacionais</div>
                <div className="text-[#6B9E6B] text-sm">Nenhum incidente reportado nas últimas 24h.</div>
              </div>
            </div>

            {/* Services list */}
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] overflow-hidden mb-6">
              {services.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i < services.length - 1 ? "border-b border-[#4AE54A]/10" : ""
                  }`}
                >
                  <span className="text-sm text-white">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6B9E6B]">{s.uptime}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4AE54A]/10 text-[#4AE54A] border border-[#4AE54A]/20">
                      <span className="size-1.5 rounded-full bg-[#4AE54A]" />
                      Operacional
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Uptime summary */}
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Histórico — últimos 7 dias</span>
                <span className="text-xs text-[#4AE54A] font-semibold">99.9% uptime</span>
              </div>
              <div className="flex gap-1.5">
                {days.map((d) => (
                  <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full h-8 rounded-md bg-[#4AE54A]/20 border border-[#4AE54A]/30 hover:bg-[#4AE54A]/30 transition-colors cursor-default" title="Operacional" />
                    <span className="text-xs text-[#6B9E6B]/60">{d}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-[#6B9E6B]/50">
                <span>7 dias atrás</span>
                <span>Hoje</span>
              </div>
            </div>

            {/* Uptime 90 days */}
            <div className="text-center text-sm text-[#6B9E6B]">
              Uptime de <span className="text-white font-semibold">99.9%</span> nos últimos 90 dias.
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
