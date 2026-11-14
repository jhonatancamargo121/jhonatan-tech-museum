// Linha do tempo pura: progresso do scroll (0..1) → segmento ativo e progresso local.
// "parada" = robô parada num quadro (balão, título, arte). "trajeto" = caminhada (clipe) ou dissolve.

export type Estacao = { id: string; fundo: string; pose: string };
export type Segmento =
  | { tipo: "parada"; estacao: number; de: number; ate: number }
  | { tipo: "trajeto"; de_estacao: number; para: number; clipe: string | null; de: number; ate: number };

export const PESO_PARADA = 1;
export const PESO_TRAJETO = 0.9;

export function clipeId(a: string, b: string) {
  return `${a}-${b}`;
}

export function montar(estacoes: Estacao[], clipes: Record<string, unknown>): Segmento[] {
  type SemFaixa<T> = T extends Segmento ? Omit<T, "de" | "ate"> & { w: number } : never;
  const pesos: SemFaixa<Segmento>[] = [];
  estacoes.forEach((_, i) => {
    pesos.push({ tipo: "parada", estacao: i, w: PESO_PARADA });
    if (i < estacoes.length - 1) {
      const id = clipeId(estacoes[i].id, estacoes[i + 1].id);
      pesos.push({ tipo: "trajeto", de_estacao: i, para: i + 1, clipe: id in clipes ? id : null, w: PESO_TRAJETO });
    }
  });
  const total = pesos.reduce((s, p) => s + p.w, 0);
  let acc = 0;
  return pesos.map(({ w, ...p }) => {
    const de = acc / total;
    acc += w;
    return { ...p, de, ate: acc / total } as Segmento;
  });
}

export function localizar(segs: Segmento[], p: number): { seg: Segmento; t: number; indice: number } {
  const x = Math.min(1, Math.max(0, p));
  let lo = 0, hi = segs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (segs[mid].ate <= x && mid < segs.length - 1) lo = mid + 1;
    else hi = mid;
  }
  const seg = segs[lo];
  return { seg, t: (x - seg.de) / (seg.ate - seg.de || 1), indice: lo };
}

// Centro da parada i, em progresso global: usado para saltar entre galerias.
export function centroDaParada(segs: Segmento[], estacao: number) {
  const s = segs.find((x) => x.tipo === "parada" && x.estacao === estacao)!;
  return (s.de + s.ate) / 2;
}
