"use client";
// Palco do museu: o scroll (GSAP ScrollTrigger, scrub) move um progresso 0..1 que decide
// qual estação aparece, toca os frames das caminhadas no canvas e mostra balão, título e quadro.
// O React só monta o DOM; a cada frame o JS altera estilos direto (sem re-render).
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { galerias, quadros, boasVindas, despedida } from "@/content/museu";
import { montar, localizar, centroDaParada, type Estacao } from "@/lib/timeline";
import clipes from "@/public/media/clipes.json";
import Efeito from "./Efeito";

gsap.registerPlugin(ScrollTrigger);

const M = "/media";
const estacoes: Estacao[] = [
  { id: "00", fundo: "entrada", pose: "p00" },
  ...quadros.map((q) => ({ id: q.id, fundo: `g${q.galeriaIndice + 1}`, pose: `p${q.id}` })),
  { id: "99", fundo: "g6", pose: "p99" },
];
const segs = montar(estacoes, clipes);
const ALTURA_VH = segs.length * 55; // ~55vh de rolagem por segmento
const sin = (t: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
const fade = (t: number, a = 0.14) => Math.min(1, t / a, (1 - t) / a);

type Clipe = { frames: number };
const CLIPES = clipes as Record<string, Clipe>;

export default function Museu() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = raiz.current!;
    const palco = el.querySelector<HTMLElement>(".palco")!;
    const cena = el.querySelector<HTMLElement>(".cena")!;
    const ancora = el.querySelector<HTMLElement>(".ancora")!;
    const canvas = el.querySelector<HTMLCanvasElement>("canvas")!;
    const ctx = canvas.getContext("2d")!;
    const camadas = [...el.querySelectorAll<HTMLElement>(".estacao")];
    const placas = [...el.querySelectorAll<HTMLElement>(".placa")];
    const pontos = [...document.querySelectorAll<HTMLElement>("[data-ir-galeria]")];
    const barra = document.querySelector<HTMLElement>(".progresso i");
    const celular = matchMedia("(max-aspect-ratio: 1/1)");
    const imgs: Record<string, HTMLImageElement[]> = {};
    let ultimo = "";

    // Geometria compartilhada pela cena (DOM) e pelo canvas: cena 16:9 em "cover", com foco horizontal.
    const geometria = () => {
      const vw = palco.clientWidth, vh = palco.clientHeight;
      const s = Math.max(vw / 16, vh / 9);
      const w = 16 * s, h = 9 * s;
      const foco = celular.matches ? 0.22 : 0.5;
      const x = Math.min(0, Math.max(vw - w, vw / 2 - foco * w));
      return { x, y: (vh - h) / 2, w, h };
    };
    const ajustar = () => {
      const g = geometria();
      for (const alvo of [cena, ancora]) Object.assign(alvo.style, { left: `${g.x}px`, top: `${g.y}px`, width: `${g.w}px`, height: `${g.h}px` });
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(palco.clientWidth * dpr);
      canvas.height = Math.round(palco.clientHeight * dpr);
      ultimo = "";
      desenhar(estado.p);
    };

    const carregarClipe = (id: string) => {
      if (imgs[id] || !CLIPES[id]) return;
      const pasta = celular.matches ? "m" : "d";
      imgs[id] = Array.from({ length: CLIPES[id].frames }, (_, i) => {
        const im = new Image();
        im.decoding = "async";
        im.src = `${M}/clipes/${id}/${pasta}/f_${String(i + 1).padStart(4, "0")}.webp`;
        im.onload = () => { ultimo = ""; };
        return im;
      });
    };
    const pronto = (im?: HTMLImageElement) => !!im && im.complete && im.naturalWidth > 0;

    const pintarFrame = (id: string, t: number) => {
      const lista = imgs[id];
      if (!lista) return false;
      const n = lista.length, alvo = Math.round(t * (n - 1));
      let j = -1;
      for (let d = 0; d < n && j < 0; d++) {
        if (pronto(lista[alvo - d])) j = alvo - d;
        else if (pronto(lista[alvo + d])) j = alvo + d;
      }
      if (j < 0) return false;
      const chave = `${id}:${j}`;
      if (chave !== ultimo) {
        const g = geometria(), dpr = canvas.width / palco.clientWidth;
        ctx.drawImage(lista[j], g.x * dpr, g.y * dpr, g.w * dpr, g.h * dpr);
        ultimo = chave;
      }
      return true;
    };

    const estado = { p: 0 };
    function desenhar(p: number) {
      const { seg, t, indice } = localizar(segs, p);
      // pré-carrega clipes vizinhos
      for (let k = Math.max(0, indice - 3); k <= Math.min(segs.length - 1, indice + 5); k++) {
        const s = segs[k];
        if (s.tipo === "trajeto" && s.clipe) carregarClipe(s.clipe);
      }
      let a = -1, b = -1, mix = 0, video = false;
      if (seg.tipo === "parada") a = seg.estacao;
      else {
        a = seg.de_estacao; b = seg.para; mix = t;
        if (seg.clipe) video = pintarFrame(seg.clipe, t);
      }
      canvas.style.opacity = video ? "1" : "0";
      camadas.forEach((c, i) => {
        let o = 0, z = 1, dx = 0, rx = 0;
        if (i === a) {
          o = b >= 0 ? 1 - mix : 1;
          if (seg.tipo === "parada") { const s = sin(t); z = 1 + 0.025 * s; dx = -0.8 * s; rx = 0.9 * s; }
          else if (!video) z = 1 + 0.04 * mix;
        } else if (i === b) {
          o = mix;
          if (!video) z = 1.04 - 0.04 * mix;
        }
        c.style.opacity = video ? "0" : String(o);
        c.style.visibility = o > 0 && !video ? "visible" : "hidden";
        c.style.setProperty("--z", String(z));
        c.style.setProperty("--dx", `${dx}%`);
        c.style.setProperty("--rx", `${rx}%`);
      });
      placas.forEach((pl, i) => {
        const ativo = seg.tipo === "parada" && seg.estacao === i;
        // A abertura já começa visível e o fim fica visível até o final da rolagem.
        const o = !ativo ? 0 : i === 0 ? Math.min(1, (1 - t) / 0.14) : i === placas.length - 1 ? Math.min(1, t / 0.14) : fade(t);
        pl.style.opacity = String(o);
        pl.style.visibility = o > 0.01 ? "visible" : "hidden";
        pl.style.setProperty("--t", ativo ? t.toFixed(3) : "0");
        pl.toggleAttribute("inert", !ativo);
      });
      const est = seg.tipo === "parada" ? seg.estacao : t < 0.5 ? a : b;
      const gal = est <= 0 ? -1 : est > quadros.length ? galerias.length - 1 : quadros[est - 1].galeriaIndice;
      pontos.forEach((pt) => pt.toggleAttribute("aria-current", Number(pt.dataset.irGaleria) === gal));
      if (barra) barra.style.transform = `scaleX(${p})`;
      el.dataset.estacao = String(est);
      // Legenda para leitor de tela: uma por parada, só depois que a rolagem assenta.
      if (seg.tipo === "parada" && seg.estacao !== falada) {
        clearTimeout(timerLegenda);
        const alvo = seg.estacao;
        timerLegenda = window.setTimeout(() => {
          falada = alvo;
          legenda.textContent = placas[alvo]?.querySelector(".balao")?.textContent ?? "";
        }, 700);
      }
    }
    const legenda = el.querySelector<HTMLElement>(".legenda")!;
    let falada = -1, timerLegenda = 0;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: matchMedia("(prefers-reduced-motion: reduce)").matches ? true : 0.7,
      animation: gsap.to(estado, { p: 1, ease: "none", onUpdate: () => desenhar(estado.p) }),
      onToggle: (self) => { document.documentElement.dataset.palco = self.isActive ? "1" : "0"; },
    });

    // Navegação: galerias e teclado vão até o centro de uma parada.
    const irPara = (p: number) => {
      const y = st.start + p * (st.end - st.start);
      scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    const aoClicarGaleria = (ev: Event) => {
      const gi = Number((ev.currentTarget as HTMLElement).dataset.irGaleria);
      const primeiro = quadros.findIndex((q) => q.galeriaIndice === gi) + 1;
      irPara(centroDaParada(segs, primeiro));
    };
    pontos.forEach((pt) => pt.addEventListener("click", aoClicarGaleria));
    const paradas = estacoes.map((_, i) => centroDaParada(segs, i));
    const aoTeclar = (ev: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(ev.key)) return;
      if ((ev.target as HTMLElement).closest("input, textarea, select")) return;
      const p = estado.p;
      if (scrollY < st.start - 10 || scrollY > st.end + 10) return;
      const frente = ev.key === "ArrowDown" || ev.key === "PageDown";
      const alvo = frente ? paradas.find((x) => x > p + 0.002) : [...paradas].reverse().find((x) => x < p - 0.002);
      if (alvo === undefined) return;
      ev.preventDefault();
      irPara(alvo);
    };
    addEventListener("keydown", aoTeclar);
    let largura = innerWidth;
    const aoRedimensionar = () => { if (innerWidth !== largura || !cena.style.width) { largura = innerWidth; ajustar(); } };
    addEventListener("resize", aoRedimensionar);
    celular.addEventListener("change", ajustar);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    ajustar();

    return () => {
      removeEventListener("keydown", aoTeclar);
      removeEventListener("resize", aoRedimensionar);
      celular.removeEventListener("change", ajustar);
      pontos.forEach((pt) => pt.removeEventListener("click", aoClicarGaleria));
    };
  }, { scope: raiz });

  return (
    <div className="museu" ref={raiz} style={{ height: `${ALTURA_VH}vh` }} data-estacao="0">
      <div className="palco">
        <div className="cena" aria-hidden="true">
          {estacoes.map((e, i) => (
            <div className="estacao" key={e.id} style={{ opacity: i === 0 ? 1 : 0 }}>
              <img className="fundo" src={`${M}/salao/${e.fundo}.webp`} alt="" />
              <img className="robo" src={`${M}/poses/${e.pose}.webp`} alt="" />
            </div>
          ))}
        </div>
        <canvas aria-hidden="true" />
        <div className="vinheta" aria-hidden="true" />
        <div className="legenda sr" aria-live="polite" />
        <div className="ancora">

        {estacoes.map((e, i) => {
          if (i === 0) {
            return (
              <section className="placa placa--abertura" key={e.id} style={{ opacity: 1 }} aria-label="Boas-vindas">
                <div className="hero">
                  <p className="sobretitulo">The Tech Museum</p>
                  <h1>Jhonatan Camargo</h1>
                  <p className="cargo">Full Stack Developer | AI Agents | Automation | DevOps</p>
                  <p className="apoio">Desenvolvo sistemas, integro tecnologias e construo automações inteligentes.</p>
                  <div className="acoes">
                    <a className="botao" href="#projetos">Ver projetos</a>
                    <a className="botao botao--linha" href="#contato">Entrar em contato</a>
                  </div>
                </div>
                <p className="balao balao--abertura">{boasVindas}</p>
                <div className="dica" aria-hidden="true"><span />role para começar a visita</div>
              </section>
            );
          }
          if (i === estacoes.length - 1) {
            return (
              <section className="placa" key={e.id} aria-label="Fim da visita">
                <p className="balao">{despedida}</p>
                <div className="fim-acoes">
                  <a className="botao" href="#projetos">Explorar projetos</a>
                  <a className="botao botao--linha" href="#contato">Vamos conversar</a>
                </div>
              </section>
            );
          }
          const q = quadros[i - 1];
          const g = galerias[q.galeriaIndice];
          return (
            <section className="placa" key={e.id} id={`q${q.id}`} aria-labelledby={`t${q.id}`}>
              <figure className="quadro">
                <div className="moldura">
                  <img src={`${M}/artes/a${q.id}.webp`} alt={`Ilustração conceitual: ${q.titulo}`} loading="lazy" />
                  <Efeito tipo={q.efeito} />
                </div>
                <figcaption>
                  <span className="galeria-nome">{g.nome}</span>
                  <h2 id={`t${q.id}`}>{q.titulo}</h2>
                </figcaption>
              </figure>
              <p className="balao">{q.fala}</p>
            </section>
          );
        })}
        </div>
      </div>
    </div>
  );
}
