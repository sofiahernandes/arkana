// Confirmation dialog for destructive contribution removal actions.
"use client";

import React from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteContributionProps = {
  IdContribuicao: number;
  TipoDoacao: string;
  onDeleted?: () => void;
};
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DeleteContribution({
  IdContribuicao,
  TipoDoacao,
  onDeleted,
}: DeleteContributionProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Executes the delete request only after confirmation and reports any backend failure inside the dialog itself.
  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    // Keep the dialog open so a failure is readable instead of vanishing.
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${backend_url}/api/contribution/${TipoDoacao}/${IdContribuicao}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        // A non-JSON body is expected for 5xx/HTML error pages — fall back to
        // the status instead of swallowing the failure.
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ??
            body?.error ??
            `O servidor não conseguiu excluir a contribuição (status ${res.status}). Ela continua no histórico — tente novamente.`,
        );
      }

      setOpen(false);
      onDeleted?.();
    } catch (err) {
      console.error("Erro ao deletar contribuição:", err);
      setError(
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Não foi possível falar com o servidor. Verifique sua conexão — nada foi excluído."
          : err instanceof Error
            ? err.message
            : "Não foi possível excluir a contribuição. Tente novamente em instantes.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="shadow-md hover:shadow-lg"
          >
            <Trash2 aria-hidden />
            Deletar contribuição
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá a contribuição
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <AlertDialogFooter>
            {/* Cancel is the calm option; only the confirm carries the red fill. */}
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                loading={loading}
              >
                {loading ? "Excluindo…" : "Deletar"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
