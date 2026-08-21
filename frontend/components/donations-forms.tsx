// Financial donation form block. Manages numeric inputs and receipt file selection before submission.
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type Img = StaticImageData | string;

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
  RaUsuario,
  setRaUsuario,
  tipoDoacao,
  setTipoDoacao,
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
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [metaInput, setMetaInput] = useState<string>("");
  const [gastosInput, setGastosInput] = useState<string>("");
  const [quantidadeInput, setQuantidadeInput] = useState<string>("");

  // Normalizes decimal input before converting it to a number so form fields accept the local comma format.
  const normalize = (s: string) => s.replace(",", ".").trim();
  const toNumberOrNaN = (s: string) => Number(normalize(s));

  // Mirrors the external numeric state back into the visible input strings after parent resets or prefills.
  useEffect(() => {
    setMetaInput(meta ? String(meta) : "");
    setGastosInput(gastos ? String(gastos) : "");
    setQuantidadeInput(quantidade ? String(quantidade) : "");
  }, [meta, gastos, quantidade]);

  // Injects the small upload animation once and also clears any pending timer when the component unmounts.
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pop { 
        0% { transform: scale(1); } 
        40% { transform: scale(1.12); } 
        100% { transform: scale(1); } 
      }
      .animate-pop { animation: pop 150ms ease-out; }
      @media (prefers-reduced-motion: reduce) {
        .animate-pop { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Stops the temporary upload animation and clears the timer used to return the button to the idle state.
  const stopGif = () => {
    setPicking(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Opens the hidden file input while briefly switching the button to the animated upload state.
  const handlePickClick = () => {
    if (loading) return;
    setPicking(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => stopGif(), 1000);
    fileInputRef.current?.click();
  };

  // Adds a second unmount cleanup for the upload timer so stale callbacks do not run after navigation.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Validates the selected receipt file locally before the submit handler tries to upload it.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;

    if (!file) {
      setComprovante(null);
      stopGif();
      return;
    }

    const okType = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024;

    if (!okType) {
      alert("Formato inválido. Use PNG, JPEG ou PDF.");
      stopGif();
      return;
    }
    if (!okSize) {
      alert("Arquivo muito grande (máx. 5MB).");
      stopGif();
      return;
    }

    setComprovante(file);
    stopGif();
  };

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
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-xl">
        <label className="block mb-1">Nome do Evento / Doador</label>
        <input
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Meta (R$)</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex: R$100"
          value={metaInput}
          onChange={(e) => handleMetaChange(e.currentTarget.value)}
          className="w-full bg-white border border-gray-300 rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Gastos (R$)</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: R$100"
          value={gastosInput}
          onChange={(e) => handleGastosChange(e.currentTarget.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Valor Arrecadado</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: R$100"
          value={quantidadeInput}
          onChange={(e) => handleQuantidadeChange(e.currentTarget.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-8">Comprovante (PNG/JPEG/PDF)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="flex items-center">
          <button
            type="button"
            onClick={handlePickClick}
            onMouseDown={(e) => e.currentTarget.classList.add("animate-pop")}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("animate-pop")
            }
            className="inline-flex items-center justify-center h-14 w-18 rounded-lg bg-white transition"
            disabled={loading}
            aria-label="Selecionar comprovante"
          >
            <Image
              src={picking ? (uploadGif as Img) : (uploadStatic as Img)}
              alt="Selecionar comprovante"
              width={35}
              height={35}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </button>

          <span className="ml-3 text-sm text-gray-700">
            {comprovante
              ? `Selecionado: ${comprovante.name}`
              : "Nenhum arquivo escolhido"}
          </span>
        </div>
      </div>
    </div>
  );
}
