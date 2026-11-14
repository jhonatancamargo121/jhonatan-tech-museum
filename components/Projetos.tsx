"use client";
// Projetos: cartões que abrem um painel acessível (<dialog>: foco preso e Esc fecham nativamente).
import { useRef, useState } from "react";
import { projetos, type Projeto } from "@/content/museu";

export default function Projetos() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [atual, setAtual] = useState<Projeto | null>(null);

  const abrir = (p: Projeto) => { setAtual(p); dlg.current?.showModal(); };

  return (
    <>
      <div className="projetos">
        {projetos.map((p) => (
          <button key={p.nome} type="button" className="cartao-projeto" onClick={() => abrir(p)}>
            <h3>{p.nome}</h3>
            <p>{p.descricao}</p>
            <ul className="chips">{p.tecnologias.map((t) => <li key={t}>{t}</li>)}</ul>
            <span className="abrir">Ver detalhes</span>
          </button>
        ))}
      </div>
      <dialog ref={dlg} className="painel-projeto" aria-labelledby="painel-titulo" onClose={() => setAtual(null)}
        onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}>
        {atual && (
          <div className="painel-conteudo">
            <button type="button" className="fechar" onClick={() => dlg.current?.close()} aria-label="Fechar">×</button>
            <h3 id="painel-titulo">{atual.nome}</h3>
            <p>{atual.descricao}</p>
            <h4>Tecnologias e integrações</h4>
            <ul className="chips">{atual.tecnologias.map((t) => <li key={t}>{t}</li>)}</ul>
            {atual.imagens?.length ? (
              <div className="capturas">{atual.imagens.map((src) => <img key={src} src={src} alt={`Captura de tela: ${atual.nome}`} />)}</div>
            ) : (
              <p className="nota">Capturas de tela e detalhes de arquitetura deste projeto serão publicados em breve.</p>
            )}
            {atual.repo && <a className="botao botao--linha" href={atual.repo} target="_blank" rel="noopener">Repositório no GitHub</a>}
          </div>
        )}
      </dialog>
    </>
  );
}
