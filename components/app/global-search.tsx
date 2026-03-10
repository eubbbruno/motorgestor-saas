"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, CarIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type SearchLead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
};

type SearchVehicle = {
  id: string;
  title: string;
  make: string | null;
  model: string | null;
  plate?: string | null;
  status: string;
};

type SearchResponse =
  | { ok: true; q: string; leads: SearchLead[]; vehicles: SearchVehicle[] }
  | { ok: false; error: string };

async function fetchSearch(q: string) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { method: "GET" });
  const json = (await res.json().catch(() => null)) as SearchResponse | null;
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao buscar.");
  }
  return json;
}

function subtitle(parts: Array<string | null | undefined>) {
  return parts.filter((p) => p && p.length > 0).join(" · ");
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => fetchSearch(q),
    enabled: open && q.trim().length >= 2,
  });

  const leads = (query.data && "leads" in query.data ? query.data.leads : []) ?? [];
  const vehicles = (query.data && "vehicles" in query.data ? query.data.vehicles : []) ?? [];

  function go(to: string) {
    setOpen(false);
    setQ("");
    router.push(to);
    router.refresh();
  }

  return (
    <>
      <Button
        variant="outline"
        className="hidden w-[380px] justify-start gap-2 bg-background/60 text-muted-foreground md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        <span>Buscar leads e veículos...</span>
        <span className="ml-auto text-xs text-muted-foreground/80">⌘K</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
      >
        <SearchIcon className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setQ("");
        }}
        title="Busca"
        description="Busque por lead, telefone, placa, marca ou modelo."
      >
        <CommandInput
          placeholder="Digite para buscar (mín. 2 caracteres)..."
          value={q}
          onValueChange={setQ}
        />
        <CommandList>
          <CommandEmpty>
            {query.isFetching
              ? "Buscando..."
              : q.trim().length < 2
                ? "Digite pelo menos 2 caracteres."
                : "Nenhum resultado."}
          </CommandEmpty>

          {leads.length ? (
            <CommandGroup heading="Leads">
              {leads.map((l) => (
                <CommandItem
                  key={l.id}
                  value={`lead-${l.id}-${l.name}`}
                  onSelect={() => go(`/app/leads/${l.id}`)}
                >
                  <UsersIcon className="size-4" />
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {subtitle([l.phone, l.email, l.status])}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {leads.length && vehicles.length ? <CommandSeparator /> : null}

          {vehicles.length ? (
            <CommandGroup heading="Veículos">
              {vehicles.map((v) => (
                <CommandItem
                  key={v.id}
                  value={`vehicle-${v.id}-${v.title}`}
                  onSelect={() => go(`/app/veiculos/${v.id}`)}
                >
                  <CarIcon className="size-4" />
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{v.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {subtitle([v.plate ?? null, v.make, v.model, v.status])}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}

