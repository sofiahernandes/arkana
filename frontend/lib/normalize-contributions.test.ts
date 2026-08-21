// Runnable check for the money-adjacent contribution parsing: `npx tsx lib/normalize-contributions.test.ts`
// No framework on purpose — it asserts the coercions the app actually depends on.
import assert from "node:assert/strict";

import { normalizeContributions } from "./normalize-contributions";

// Non-array payloads (error bodies, nulls) must degrade to an empty list.
assert.deepEqual(normalizeContributions(null), []);
assert.deepEqual(normalizeContributions({ message: "erro" }), []);
assert.deepEqual(normalizeContributions([]), []);

// Financial branch: pt-BR formatted strings for money fields.
{
  const [c] = normalizeContributions([
    {
      IdContribuicaoFinanceira: "12",
      RaUsuario: "123456",
      TipoDoacao: "Financeira",
      Quantidade: "1.234,50",
      Meta: "2.000,00",
      Gastos: "150,25",
      Fonte: "Rifa",
      DataContribuicao: "2025-03-04",
      uuid: "fixed-uuid",
    },
  ]);

  assert.equal(c.IdContribuicao, 12);
  assert.equal(c.RaUsuario, 123456);
  assert.equal(c.Quantidade, 1234.5);
  assert.equal(c.Meta, 2000);
  assert.equal(c.Gastos, 150.25);
  assert.equal(c.uuid, "fixed-uuid");
  // No food data: weight/score collapse to 0, never undefined.
  assert.equal(c.PesoUnidade, 0);
  assert.equal(c.PesoTotal, 0);
  assert.equal(c.PontuacaoTotal, 0);
  assert.deepEqual(c.alimentos, []);
  assert.equal(c.comprovante, undefined);
}

// Food branch: numeric quantities, per-unit weight, and score summed per unit.
{
  const [c] = normalizeContributions([
    {
      IdContribuicaoAlimenticia: 9,
      RaUsuario: 1,
      TipoDoacao: "Alimenticia",
      Quantidade: 10,
      PesoUnidade: "1,5",
      Meta: null,
      Gastos: null,
      alimentos: [
        { NomeAlimento: "Arroz", Pontuacao: "2" },
        { NomeAlimento: "Feijao" },
      ],
      uuid: "food-uuid",
    },
  ]);

  assert.equal(c.IdContribuicao, 9);
  assert.equal(c.PesoUnidade, 1.5);
  assert.equal(c.PesoTotal, 15);
  // 2 pts * 10 units + missing Pontuacao counted as 0.
  assert.equal(c.PontuacaoTotal, 20);
  // null Meta/Gastos become undefined so the UI can hide the row.
  assert.equal(c.Meta, undefined);
  assert.equal(c.Gastos, undefined);
  assert.deepEqual(c.alimentos, [
    { NomeAlimento: "Arroz", Pontuacao: 2 },
    { NomeAlimento: "Feijao", Pontuacao: 0 },
  ]);
}

// Missing fields: strings default to "", ids/quantities surface as NaN, uuid is generated.
{
  const [c] = normalizeContributions([{}]);

  assert.equal(c.TipoDoacao, "");
  assert.equal(c.Fonte, "");
  assert.equal(c.DataContribuicao, "");
  assert.equal(c.NomeAlimento, undefined);
  assert.ok(Number.isNaN(c.Quantidade));
  assert.ok(Number.isNaN(c.IdContribuicao));
  assert.ok(Number.isNaN(c.RaUsuario));
  // Quantidade is NaN, so the weight product is dropped and falls back to 0.
  assert.equal(c.PesoTotal, 0);
  assert.equal(typeof c.uuid, "string");
  assert.ok(c.uuid.length > 0);
}

// Receipt URLs: relative filenames get the backend prefix, absolute URLs pass through.
{
  process.env.NEXT_PUBLIC_BACKEND_URL = "https://api.example.com/";
  const [relative, absolute, nested] = normalizeContributions([
    { Comprovante: "/nota.png", IdComprovante: "7" },
    { Comprovante: "https://cdn.example.com/nota.png" },
    { comprovante: { IdComprovante: 3, Imagem: "recibo.jpg" } },
  ]);

  assert.deepEqual(relative.comprovante, {
    IdComprovante: 7,
    Imagem: "https://api.example.com/uploads/nota.png",
  });
  assert.deepEqual(absolute.comprovante, {
    IdComprovante: 0,
    Imagem: "https://cdn.example.com/nota.png",
  });
  assert.deepEqual(nested.comprovante, {
    IdComprovante: 3,
    Imagem: "https://api.example.com/uploads/recibo.jpg",
  });
}

console.log("normalize-contributions: all checks passed");
