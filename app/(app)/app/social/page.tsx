"use client";

import * as React from "react";
import { SearchIcon, Share2Icon } from "lucide-react";

import { useVehicles } from "@/features/vehicles/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { PostModal } from "@/components/social/post-modal";
import type { PostTemplateProps } from "@/components/social/post-templates";

type VehicleForPost = PostTemplateProps["vehicle"] & { id: string; title: string; photo_paths?: string[] | null }

export default function SocialPage() {
  const vehicles = useVehicles();
  const profile = useMyProfile();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<VehicleForPost | null>(null);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = React.useState(false);

  const companyName = profile.data?.full_name ?? "Concessionária";

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return vehicles.data ?? [];
    return (vehicles.data ?? []).filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.make?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q),
    );
  }, [vehicles.data, search]);

  async function handleSelect(v: (typeof filtered)[0]) {
    const vehicleForPost: VehicleForPost = {
      id: v.id,
      title: v.title,
      make: v.make,
      model: v.model,
      version: v.version ?? null,
      year: v.year,
      color: v.color ?? null,
      mileage: v.mileage,
      fuel: v.fuel ?? null,
      transmission: v.transmission ?? null,
      price: v.price,
      photo_paths: v.photo_paths,
    };
    setSelected(vehicleForPost);
    setPhotoUrl(null);

    const firstPhoto = (v.photo_paths ?? [])[0];
    if (firstPhoto) {
      setLoadingPhoto(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.storage
          .from("vehicle-photos")
          .createSignedUrl(firstPhoto, 60 * 60);
        setPhotoUrl(data?.signedUrl ?? null);
      } catch {
        setPhotoUrl(null);
      } finally {
        setLoadingPhoto(false);
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Ferramentas"
        title="Gerar Posts para Redes Sociais"
        description="Selecione um veículo para criar um post profissional 1080×1080px pronto para Instagram, Facebook e WhatsApp."
        right={
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por marca ou modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        }
      />

      {vehicles.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-mg-surface animate-pulse" />
          ))}
        </div>
      ) : vehicles.isError ? (
        <div className="text-sm text-destructive">Não foi possível carregar os veículos.</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Share2Icon className="size-12 text-muted-foreground/40" />
          <div>
            <div className="font-medium">Nenhum veículo encontrado</div>
            <div className="text-sm text-muted-foreground mt-1">
              {search ? "Tente outro termo de busca." : "Cadastre veículos para gerar posts."}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onClick={() => handleSelect(v)} />
          ))}
        </div>
      )}

      {selected && (
        <PostModal
          open={!!selected}
          onClose={() => {
            setSelected(null);
            setPhotoUrl(null);
          }}
          vehicle={selected}
          company={{ name: companyName }}
          photoUrl={loadingPhoto ? null : photoUrl}
        />
      )}
    </div>
  );
}

function VehicleCard({
  vehicle,
  onClick,
}: {
  vehicle: {
    id: string;
    title: string;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    price?: number | null;
    photo_paths?: string[] | null;
  };
  onClick: () => void;
}) {
  const [thumbUrl, setThumbUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const firstPhoto = (vehicle.photo_paths ?? [])[0];
    if (!firstPhoto) return;

    let cancelled = false;
    async function load() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.storage
          .from("vehicle-photos")
          .createSignedUrl(firstPhoto!, 60 * 60);
        if (!cancelled) setThumbUrl(data?.signedUrl ?? null);
      } catch {
        // ignore
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [vehicle.photo_paths]);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      <Card className="overflow-hidden rounded-xl border-mg-border bg-mg-surface transition-all group-hover:border-[#4AE54A]/50 group-hover:shadow-lg group-hover:shadow-[#4AE54A]/5">
        {/* Thumbnail */}
        <div className="relative h-44 bg-mg-surface-2 overflow-hidden">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbUrl}
              alt={vehicle.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground/30">
              🚗
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#4AE54A]/0 group-hover:bg-[#4AE54A]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-[#4AE54A] text-[#0A1A0C] rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <Share2Icon className="size-4" />
              Gerar Post
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="font-semibold text-sm text-foreground line-clamp-1">{vehicle.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(" · ")}
          </div>
          {vehicle.price != null && (
            <div className="mt-2 text-sm font-bold text-[#4AE54A]">
              R$ {Number(vehicle.price).toLocaleString("pt-BR")}
            </div>
          )}
        </div>
      </Card>
    </button>
  );
}
