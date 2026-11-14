// Versão 2D: o mesmo conteúdo do museu, sem rolagem cinematográfica.
import { galerias, boasVindas } from "@/content/museu";

export default function Museu2D() {
  return (
    <div className="museu2d">
      <header className="hero hero--2d">
        <p className="sobretitulo">The Tech Museum</p>
        <h1>Jhonatan Camargo</h1>
        <p className="cargo">Full Stack Developer | AI Agents | Automation | DevOps</p>
        <p className="apoio">Desenvolvo sistemas, integro tecnologias e construo automações inteligentes.</p>
        <div className="acoes">
          <a className="botao" href="#projetos">Ver projetos</a>
          <a className="botao botao--linha" href="#contato">Entrar em contato</a>
        </div>
        <p className="balao balao--estatico">{boasVindas}</p>
      </header>
      {galerias.map((g, gi) => (
        <section key={g.id} id={`galeria-${g.id}`} className="galeria2d" aria-labelledby={`g2-${g.id}`}>
          <h2 id={`g2-${g.id}`}><span>Galeria {gi + 1}</span>{g.nome}</h2>
          <div className="grade2d">
            {g.quadros.map((q) => (
              <article key={q.id} className="cartao2d">
                <img src={`/media/artes/a${q.id}.webp`} alt={`Ilustração conceitual: ${q.titulo}`} loading="lazy" />
                <h3>{q.titulo}</h3>
                <p>{q.fala}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
