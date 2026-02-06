import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  { name: "Site público", status: "Operacional" },
  { name: "App (dashboard)", status: "Operacional" },
  { name: "Autenticação", status: "Operacional" },
  { name: "Banco de dados", status: "Operacional" },
  { name: "Uploads (futuro)", status: "Planejado" },
];

function statusBadge(status: string) {
  if (status === "Operacional") return <Badge className="bg-emerald-500/15 text-emerald-200">Operacional</Badge>;
  if (status === "Degradado") return <Badge className="bg-amber-500/15 text-amber-200">Degradado</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export default function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Status"
        title="Status do MotorGestor"
        subtitle="Transparência sobre disponibilidade e incidentes."
      />

      <section className="pb-16">
        <Container>
          <Card className="bg-background/60 p-8">
            <div className="grid gap-3">
              {services.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-4 py-3"
                >
                  <div className="text-sm">{s.name}</div>
                  {statusBadge(s.status)}
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              Sem incidentes reportados nas últimas 24h.
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

