// Financial donation form block. Manages numeric inputs and receipt file selection before submission.
"use client";

import React, { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";

import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";

interface Properties {
  RaUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
  tipoDoacao: "Financeira" | "Alimenticia";
  setTipoDoacao: React.Dispatch<
    React.SetStateAction<"Financeira" | "Alimenticia">
  >;
  quantidade: number;
  setQuantidade: (value: number) => void;
  fonte: string;
  setFonte: (value: string) => void;
  meta: number;
  setMeta: (value: number) => void;
  gastos: number;
  setGastos: (value: number) => void;
  comprovante: File | null;
  setComprovante: (value: File | null) => void;
}

export default function DonationsForm({
  quantidade,
  setQuantidade,
  fonte,
  setFonte,
  meta,
  setMeta,
  gastos,
  setGastos,
  comprovante,
  setComprovante,
}: Properties) {
  const [metaInput, setMetaInput] = useState<string>("");
  const [gastosInput, setGastosInput] = useState<string>("");
  const [quantidadeInput, setQuantidadeInput] = useState<string>("");

  const upload = useFileUpload({ onChange: setComprovante });

  // Mirrors the external numeric state back into the visible input strings after parent resets or prefills.
  useEffect(() => {
    setMetaInput(meta ? String(meta) : "");
    setGastosInput(gastos ? String(gastos) : "");
    setQuantidadeInput(quantidade ? String(quantidade) : "");
  }, [meta, gastos, quantidade]);

  // Keeps the text input responsive while also updating the parsed numeric value used by the submit payload.
  const handleQuantidadeChange = (value: string) => {
    setQuantidadeInput(value);
    const num = parseFloat(value.replace(",", "."));
    setQuantidade(isNaN(num) ? 0 : num);
  };

  // Applies the same string-to-number conversion for the target amount field.
  const handleMetaChange = (value: string) => {
    setMetaInput(value);
    const num = parseFloat(value.replace(",", "."));
    setMeta(isNaN(num) ? 0 : num);
  };

  // Applies the same string-to-number conversion for the expense field.
  const handleGastosChange = (value: string) => {
    setGastosInput(value);
    const num = parseFloat(value.replace(",", "."));
    setGastos(isNaN(num) ? 0 : num);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Field
        label="Nome do Evento / Doador"
        name="fonte"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.currentTarget.value)}
      />

      <Field
        label="Meta (R$)"
        name="meta"
        type="text"
        inputMode="decimal"
        placeholder="Ex: R$100"
        value={metaInput}
        onChange={(e) => handleMetaChange(e.currentTarget.value)}
      />

      <Field
        label="Gastos (R$)"
        name="gastos"
        type="number"
        step="0.01"
        placeholder="Ex: R$100"
        value={gastosInput}
        onChange={(e) => handleGastosChange(e.currentTarget.value)}
      />

      <Field
        label="Valor Arrecadado"
        name="quantidade"
        type="number"
        step="0.01"
        placeholder="Ex: R$100"
        value={quantidadeInput}
        onChange={(e) => handleQuantidadeChange(e.currentTarget.value)}
      />

      <div className="mt-4 space-y-1.5">
        <span className="block text-sm font-medium">
          Comprovante (PNG/JPEG/PDF)
        </span>
        <input
          ref={upload.inputRef}
          type="file"
          accept={upload.accept}
          onChange={upload.handleInputChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={upload.pick}
            className={`h-14 w-16 ${upload.pressed ? "animate-selected-pop" : ""}`}
            aria-label="Selecionar comprovante"
          >
            {/* One icon system: lucide strokes, like the nav and every other
                control. The previous raster GIF read as a different language. */}
            <Paperclip className="size-5" strokeWidth={1.75} aria-hidden />
          </Button>

          {upload.previewUrl && (
            <img
              src={upload.previewUrl}
              alt="Pré-visualização do comprovante"
              className="h-14 w-14 rounded-md border border-border object-cover"
            />
          )}

          <span className="text-sm text-muted-foreground">
            {comprovante
              ? `Selecionado: ${comprovante.name}`
              : "Nenhum arquivo escolhido"}
          </span>
        </div>

        {upload.error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {upload.error}
          </p>
        )}
      </div>
    </div>
  );
}
