// Runnable check for the receipt validator: `npx tsx hooks/use-file-upload.test.ts`
// The receipt is the only proof a contribution happened, so a silent accept of a
// 40MB file or a .docx is data loss at the point of submission.
import assert from "node:assert/strict";

import {
  MAX_UPLOAD_BYTES,
  validateUpload,
} from "./use-file-upload";

const stub = (name: string, type: string, size: number) => ({
  name,
  type,
  size,
});

// Oversize: rejected, and the message has to name both sizes so the user knows
// how much to cut.
const oversize = validateUpload(
  stub("comprovante.png", "image/png", MAX_UPLOAD_BYTES + 1),
);
assert.ok(oversize, "arquivo acima do limite deve ser rejeitado");
assert.match(oversize, /limite/);
assert.match(oversize, /5 MB/);

// Wrong type: rejected, and the message has to name the accepted formats.
const wrongType = validateUpload(
  stub("planilha.xlsx", "application/vnd.ms-excel", 1024),
);
assert.ok(wrongType, "formato não suportado deve ser rejeitado");
assert.match(wrongType, /PNG, JPEG ou PDF/);

// Accepted cases: every allowed type, and exactly-at-the-limit is inside it.
assert.equal(validateUpload(stub("a.png", "image/png", 1024)), null);
assert.equal(validateUpload(stub("a.jpg", "image/jpeg", 1024)), null);
assert.equal(validateUpload(stub("a.jpg", "image/jpg", 1024)), null);
assert.equal(
  validateUpload(stub("a.pdf", "application/pdf", MAX_UPLOAD_BYTES)),
  null,
  "exatamente no limite deve ser aceito",
);

// No selection is not an error — it is the cleared state.
assert.equal(validateUpload(null), null);

console.log("use-file-upload: 8 asserts OK");
