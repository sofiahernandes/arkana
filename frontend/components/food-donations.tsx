// Food donation list/presentation component used in contribution history views.
"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type Img = StaticImageData | string;

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
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

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

  // Resets the upload animation state and cancels any pending timeout after file selection finishes.
  const stopGif = () => {
    setPicking(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Opens the hidden file input used to attach the food donation receipt.
  const handlePickClick = () => {
    if (loading) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    fileInputRef.current?.click();
  };

  // Rejects unsupported receipt files before they reach the backend upload endpoint.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      setComprovante(null);
      stopGif();
      return;
    }

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      alert("Formato inválido. Use PNG, JPEG ou PDF.");
      stopGif();
      return;
    }

    if (!isValidSize) {
      alert("Arquivo muito grande (máx. 5MB).");
      stopGif();
      return;
    }

    setPicking(true);
    setComprovante(file);
    e.target.value = "";

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => stopGif(), 1000);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div>
        <label>Nome do Evento</label>
        <input
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-black"
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div>
          <label>Meta</label>
          <input
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3"
            type="number"
            placeholder="100 Kg"
            value={meta === 0 ? "" : meta}
            onChange={(e) => {
              const v = e.target.value;
              setMeta(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>

        <div>
          <label>Gastos</label>
          <input
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3"
            type="number"
            placeholder="Ex: R$100"
            value={gastos === 0 ? "" : gastos}
            onChange={(e) => {
              const v = e.target.value;
              setGastos(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>

        <div>
          <label>Total em Kg</label>
          <input
            type="text"
            readOnly
            value={totais.kgTotal.toLocaleString("pt-BR")}
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3 text-center"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="md:w-[40%]">
          <div>Alimento</div>
          <select
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
            value={idAlimento}
            onChange={(e) => setIdAlimento(parseInt(e.target.value))}
          >
            {ALIMENTOS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="md:w-[25%]">
          <div>Unidades</div>
          <input
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
            type="number"
            placeholder="Qtd"
            value={quantidade === 0 ? "" : quantidade}
            onChange={(e) => {
              const v = e.target.value;
              setQuantidade(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>

        <div className="md:w-[25%]">
          <div>Kg/Unidade</div>
          <input
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
            type="number"
            step="1"
            placeholder="Kg"
            value={pesoUnidade === 0 ? "" : pesoUnidade}
            onChange={(e) => {
              const v = e.target.value;
              setPesoUnidade(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>
      </div>

      <label className="block mt-9">Imagem (Comprovações)</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center">
        <button
          type="button"
          onClick={handlePickClick}
          className="inline-flex items-center justify-center h-14 w-18 rounded-lg bg-white transition"
          disabled={loading}
        >
          <Image
            src={picking ? (uploadGif as Img) : (uploadStatic as Img)}
            alt="Selecionar comprovante"
            width={35}
            height={35}
            draggable={false}
          />
        </button>
        <span className="ml-3 text-sm text-gray-700">
          {comprovante instanceof File
            ? `Selecionado: ${comprovante.name}`
            : "Nenhum arquivo escolhido"}
        </span>
      </div>
    </div>
  );
}
