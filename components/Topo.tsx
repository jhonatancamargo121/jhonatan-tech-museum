"use client";
import { galerias, contato } from "@/content/museu";

export default function Topo() {
  return (
    <header className="topo">
      <a href="#inicio" className="marca">
        <span className="monograma" aria-hidden="true">JC</span>
        <span className="marca-texto">Jhonatan Camargo</span>
      </a>
      <nav className="galerias-nav" aria-label="Galerias do museu">
        {galerias.map((g, i) => (
          <button key={g.id} type="button" data-ir-galeria={i} title={`Ir para a galeria ${g.nome}`}
            onClick={() => { if (document.documentElement.dataset.modo === "2d") document.getElementById(`galeria-${g.id}`)?.scrollIntoView(); }}>
            <span>{g.nome}</span>
          </button>
        ))}
      </nav>
      <nav className="menu" aria-label="Atalhos">
        <a href="#projetos" className="pular">Pular visita</a>
        <a href="#projetos">Projetos</a>
        <a href={contato.github} target="_blank" rel="noopener">GitHub</a>
        <a href={contato.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        {contato.cv && <a href={contato.cv} download>CV</a>}
        <button type="button" className="modo" onClick={() => dispatchEvent(new Event("alternar-modo"))}>
          <span className="so-cinema">Modo 2D</span><span className="so-2d">Modo cinema</span>
        </button>
        <a href="#contato" className="menu-cta">Contato</a>
      </nav>
      <div className="progresso" aria-hidden="true"><i /></div>
    </header>
  );
}
