// Receipt attachment for both donation forms. Previously hand-rolled twice
// (donations-forms.tsx and food-donations.tsx) with the 5MB limit written out
// in two places, two copies of the pressed/gif animation timer, and an object
// URL that was created and never revoked.
"use client";

import * as React from "react";

const MB = 1024 * 1024;

/** One limit for every receipt upload in the product. */
export const MAX_UPLOAD_BYTES = 5 * MB;

export const ACCEPTED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
] as const;

/** Ready for the `accept` attribute of the hidden input. */
export const ACCEPTED_UPLOAD_ATTR = ACCEPTED_UPLOAD_TYPES.join(",");

const formatMb = (bytes: number) =>
  (bytes / MB).toFixed(bytes % MB === 0 ? 0 : 1).replace(".", ",");

/**
 * Pure on purpose: the receipt is the only proof a contribution happened, so the
 * rejection rules are testable without mounting React. Returns `null` when the
 * file is accepted, otherwise a message that names the problem *and* the fix.
 */
export function validateUpload(
  file: Pick<File, "name" | "type" | "size"> | null,
): string | null {
  if (!file) return null;

  if (!(ACCEPTED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return `"${file.name}" está em um formato que não aceitamos. Envie o comprovante em PNG, JPEG ou PDF — se for um documento, exporte como PDF ou tire uma foto da tela.`;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return `"${file.name}" tem ${formatMb(file.size)} MB e o limite é ${formatMb(
      MAX_UPLOAD_BYTES,
    )} MB. Reduza a resolução da foto ou envie apenas a página do comprovante.`;
  }

  return null;
}

interface UseFileUploadOptions {
  /** Called with the accepted file, or `null` when the selection is cleared or rejected. */
  onChange: (file: File | null) => void;
  /** How long the picker button stays in its pressed/animated state. */
  pressedMs?: number;
}

export function useFileUpload({
  onChange,
  pressedMs = 1000,
}: UseFileUploadOptions) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const timerRef = React.useRef<number | null>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [pressed, setPressed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  React.useEffect(() => clearTimer, []);

  // The old code created this URL and never revoked it, so every re-pick leaked
  // the previous blob for the lifetime of the tab.
  React.useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = () => {
    clearTimer();
    setPressed(true);
    timerRef.current = window.setTimeout(() => setPressed(false), pressedMs);
    inputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.currentTarget.files?.[0] ?? null;
    // Reset the control so re-picking the same file still fires a change event.
    event.currentTarget.value = "";
    clearTimer();
    setPressed(false);

    if (!picked) {
      setError(null);
      setFile(null);
      onChange(null);
      return;
    }

    const message = validateUpload(picked);
    if (message) {
      setError(message);
      setFile(null);
      onChange(null);
      return;
    }

    setError(null);
    setFile(picked);
    onChange(picked);
  };

  return {
    /** Attach to the hidden `<input type="file">`. */
    inputRef,
    accept: ACCEPTED_UPLOAD_ATTR,
    handleInputChange,
    pick,
    file,
    previewUrl,
    /** True while the pick animation runs — drives the animated upload icon. */
    pressed,
    /** Actionable Portuguese rejection message, or null. */
    error,
  };
}
