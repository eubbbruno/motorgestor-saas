"use client";

import { PrinterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProposalPrintActions() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div className="space-y-0.5">
        <div className="text-base font-medium">Proposta</div>
        <div className="text-sm text-muted-foreground">
          Use “Salvar como PDF” na janela de impressão do navegador.
        </div>
      </div>
      <Button type="button" variant="outline" onClick={() => window.print()}>
        <PrinterIcon className="mr-2 size-4" />
        Imprimir / Salvar em PDF
      </Button>
    </div>
  );
}

