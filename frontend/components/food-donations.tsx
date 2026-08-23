// Food donation list/presentation component used in contribution history views.
"use client";

import React, { useEffect, useMemo } from "react";
import { Paperclip } from "lucide-react";

import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";

interface Properties {
  quantidade: number;
  setQuantidade: (value: number) => void;
  pesoUnidade: number;
  setPesoUnidade: (value: number) => void;
  comprovante: File | null;
  setComprovante: (value: File | null) => void;
  fonte: string;
  setFonte: (value: string) => void;
  meta: number;
  setMeta: (value: number) => void;
  idAlimento: number;
  setIdAlimento: (value: number) => void;
  gastos: number;
  setGastos: (value: number) => void;
  onTotaisChange?: (totais: {
    pontos: number;
    kgTotal: number;
    gastos: number;
  }) => void;
  onAlimentoChange?: (alimentoAtual: {
    id: number;
    quantidade: number;
    pesoUnidade: number;
  }) => void;
}

const ALIMENTOS = [
  { id: 1, nome: "Arroz Polido" },
  { id: 2, nome: "Feijão Preto" },
  { id: 3, nome: "Leite em Pó" },
  { id: 4, nome: "Óleo de Soja" },
  { id: 5, nome: "Açúcar Refinado" },
  { id: 6, nome: "Fubá" },
  { id: 7, nome: "Macarrão" },
  { id: 8, nome: "Outros" },
];

const PONTOS_POR_KG: Record<string, number> = {
  "Arroz Polido": 4,
  "Feijão Preto": 5.5,
  "Açúcar Refinado": 4,
  "Leite em Pó": 15,
  Fubá: 2.5,
  Macarrão: 2.5,
  "Óleo de Soja": 7,
  Outros: 0,
};

export default function FoodDonations({
  fonte,
  setFonte,
  meta,
  setMeta,
  gastos,
  setGastos,
  quantidade,
  setQuantidade,
  pesoUnidade,
  setPesoUnidade,
  idAlimento,
  setIdAlimento,
  comprovante,
  setComprovante,
  onTotaisChange,
  onAlimentoChange,
}: Properties) {
  const upload = useFileUpload({ onChange: setComprovante });

  // Sanitizes the incoming numeric props on mount so the derived food totals start from valid integer values.
  useEffect(() => {
    if (!Number.isInteger(idAlimento)) setIdAlimento(0);
    if (!Number.isInteger(quantidade ?? 0)) setQuantidade(0);
    if (!Number.isInteger(pesoUnidade ?? 0)) setPesoUnidade(0);
    if (!Number.isFinite(gastos)) setGastos(0);
  }, []);

  // Notifies the parent form whenever the selected food item or its quantities change.
  useEffect(() => {
    if (onAlimentoChange) {
      onAlimentoChange({
        id: idAlimento,
        quantidade: quantidade ?? 0,
        pesoUnidade: pesoUnidade ?? 0,
      });
    }
  }, [idAlimento, quantidade, pesoUnidade]);

  // Derives the total kilograms and points locally to avoid duplicating that math in the page component.
  const totais = useMemo(() => {
    const nome = ALIMENTOS.find((a) => a.id === (idAlimento ?? 0))?.nome ?? "";
    const q = Math.floor(quantidade ?? 0);
    const p = Math.floor(pesoUnidade ?? 0);
    const kgTotal = q * p;
    const pontos = kgTotal * (PONTOS_POR_KG[nome] ?? 0);
    return { kgTotal, pontos };
  }, [idAlimento, quantidade, pesoUnidade]);

  // Pushes the recalculated totals back to the parent so the page can show aggregate metrics in real time.
  useEffect(() => {
    onTotaisChange?.({
      pontos: totais.pontos,
      kgTotal: totais.kgTotal,
      gastos: gastos ?? 0,
    });
  }, [totais, gastos]);

  /** Every numeric field here is whole units, so the parse is the same each time. */
  const toInt = (value: string) => (value === "" ? 0 : Math.floor(Number(value)));

  return (
    <div className="flex w-full flex-col gap-3">
      <Field
        label="Nome do Evento"
        name="fonte"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="Meta"
          name="meta"
          type="number"
          placeholder="100 Kg"
          value={meta === 0 ? "" : meta}
          onChange={(e) => setMeta(toInt(e.target.value))}
        />

        <Field
          label="Gastos"
          name="gastos"
          type="number"
          placeholder="Ex: R$100"
          value={gastos === 0 ? "" : gastos}
          onChange={(e) => setGastos(toInt(e.target.value))}
        />

        <Field
          label="Total em Kg"
          name="kgTotal"
          type="text"
          readOnly
          value={totais.kgTotal.toLocaleString("pt-BR")}
          controlClassName="text-center"
          hint="Calculado automaticamente"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Field label="Alimento" name="idAlimento" className="md:col-span-2">
          {/* A native select is keyboard- and mobile-native; it only needed the tokens. */}
          <select
            id="field-idAlimento"
            name="idAlimento"
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[--duration-base] ease-[--ease-out] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
            value={idAlimento}
            onChange={(e) => setIdAlimento(parseInt(e.target.value))}
          >
            {ALIMENTOS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Unidades"
          name="quantidade"
          type="number"
          placeholder="Qtd"
          controlClassName="text-center"
          value={quantidade === 0 ? "" : quantidade}
          onChange={(e) => setQuantidade(toInt(e.target.value))}
        />

        <Field
          label="Kg/Unidade"
          name="pesoUnidade"
          type="number"
          step="1"
          placeholder="Kg"
          controlClassName="text-center"
          value={pesoUnidade === 0 ? "" : pesoUnidade}
          onChange={(e) => setPesoUnidade(toInt(e.target.value))}
        />
      </div>

      <div className="mt-8 space-y-1.5">
        <span className="block text-sm font-medium">Imagem (Comprovações)</span>
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
            {comprovante instanceof File
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
