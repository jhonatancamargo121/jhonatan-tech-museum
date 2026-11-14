// Autoteste: node --experimental-strip-types lib/timeline.check.ts
import assert from "node:assert/strict";
import { montar, localizar, centroDaParada } from "./timeline.ts";

const est = ["a", "b", "c"].map((id) => ({ id, fundo: "", pose: "" }));
const segs = montar(est, { "a-b": {} });
assert.equal(segs.length, 5);
assert.equal(segs[0].de, 0);
assert.equal(segs.at(-1)!.ate, 1);
assert.deepEqual(segs.map((s) => s.tipo), ["parada", "trajeto", "parada", "trajeto", "parada"]);
assert.equal((segs[1] as any).clipe, "a-b");
assert.equal((segs[3] as any).clipe, null);
for (let i = 1; i < segs.length; i++) assert.equal(segs[i].de, segs[i - 1].ate);

assert.equal(localizar(segs, 0).indice, 0);
assert.equal(localizar(segs, 1).indice, 4);
assert.equal(localizar(segs, -5).t, 0);
const meio = localizar(segs, (segs[2].de + segs[2].ate) / 2);
assert.equal(meio.indice, 2);
assert.ok(Math.abs(meio.t - 0.5) < 1e-9);
assert.ok(Math.abs(centroDaParada(segs, 1) - (segs[2].de + segs[2].ate) / 2) < 1e-12);
console.log("timeline ok");
