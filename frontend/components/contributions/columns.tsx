// Column definitions for the contribution table, shared by the participant and administrator views.
"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal, Clipboard, Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import formatBRL from "@/hooks/use-format-currency";
import type { Contribution } from "@/lib/normalize-contributions";

export type { Contribution };

export type ContributionActions = {
  onView?: (c: Contribution) => void;
  onCopied?: (id: number) => void;
  /** Administrator views lead with the team name; participant views never do. */
  showTeamColumn?: boolean;
};

// Sortable header button. Pulled left so the label lines up with the cell text below it.
function SortableHeader({
  column,
  label,
}: {
  column: Column<Contribution, unknown>;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const buildContributionColumns = ({
  onView,
  onCopied,
  showTeamColumn = false,
}: ContributionActions = {}): ColumnDef<Contribution>[] => {
  const columns: ColumnDef<Contribution>[] = [];

  if (showTeamColumn) {
    columns.push({
      accessorKey: "NomeTime",
      header: ({ column }) => (
        <SortableHeader column={column} label="Nome do grupo" />
      ),
      cell: ({ row }) => (
        <span className="font-medium max-w-56 block truncate">
          {row.original.NomeTime ?? "-"}
        </span>
      ),
    });
  }

  columns.push(
    {
      accessorKey: "Fonte",
      header: ({ column }) => (
        <SortableHeader column={column} label="Fonte da doação" />
      ),
      cell: ({ row }) => (
        // The team column already carries the emphasis when it is present.
        <span
          className={`max-w-56 block truncate${
            showTeamColumn ? "" : " font-medium"
          }`}
        >
          {row.original.Fonte ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "DataContribuicao",
      header: ({ column }) => <SortableHeader column={column} label="Data" />,
      cell: ({ row }) => {
        const d = row.original.DataContribuicao;
        const date = d ? new Date(d) : null;
        return <span>{date ? date.toLocaleDateString("pt-BR") : "-"}</span>;
      },
    },
    {
      accessorKey: "TipoDoacao",
      header: ({ column }) => <SortableHeader column={column} label="Tipo" />,
    },
    {
      accessorKey: "Quantidade",
      header: ({ column }) => (
        <SortableHeader column={column} label="Quantidade" />
      ),
      cell: ({ row }) => {
        const q = row.original.Quantidade;
        return (
          <span className="max-w-20 block truncate">
            {Number.isFinite(q)
              ? new Intl.NumberFormat("pt-BR").format(q)
              : "-"}
          </span>
        );
      },
    },
    {
      id: "PesoTotal",
      accessorFn: (row) => {
        if (row.TipoDoacao !== "Alimenticia") return null;
        const q = Number(row.Quantidade);
        const pu = Number(row.PesoUnidade);
        const PesoTotal = q * pu;
        return Number.isFinite(PesoTotal) ? PesoTotal : null;
      },
      header: ({ column }) => (
        <SortableHeader column={column} label="Peso Total" />
      ),
      cell: ({ getValue, row }) => {
        const v = getValue<number | null>();
        return row.original.TipoDoacao === "Alimenticia" && v != null ? (
          <span className="max-w-20 block truncate">
            {new Intl.NumberFormat("pt-BR").format(v)} kg
          </span>
        ) : (
          <span> - </span>
        );
      },
    },
    {
      id: "PontuacaoTotal",
      header: ({ column }) => (
        <SortableHeader column={column} label="Pontuação Total" />
      ),
      cell: ({ row }) => {
        const v = row.original.PontuacaoTotal;
        return row.original.TipoDoacao === "Alimenticia" &&
          Number.isFinite(v) ? (
          <span className="max-w-16 block truncate">
            {new Intl.NumberFormat("pt-BR").format(v!)}
          </span>
        ) : (
          <span> - </span>
        );
      },
    },
    {
      accessorKey: "Gastos",
      header: ({ column }) => <SortableHeader column={column} label="Gastos" />,
      cell: ({ row }) => <span>{formatBRL(row.original.Gastos)}</span>,
    },
    {
      accessorKey: "Meta",
      header: ({ column }) => <SortableHeader column={column} label="Meta" />,
      cell: ({ row }) => {
        const meta = row.original.Meta;
        return (
          <span>
            {typeof meta === "number" && Number.isFinite(meta)
              ? new Intl.NumberFormat("pt-BR").format(meta)
              : "-"}
          </span>
        );
      },
    },
    {
      id: "comprovante",
      header: "Comprovante",
      cell: ({ row }) => {
        const url = row.original.comprovante?.Imagem;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Abrir comprovante
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const c = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    c.IdContribuicao.toString(),
                  );
                  onCopied?.(c.IdContribuicao);
                }}
              >
                <Clipboard className="mr-2 h-4 w-4" /> Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onView?.(c)}>
                <Eye className="mr-2 h-4 w-4" /> Ver detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  );

  return columns;
};
