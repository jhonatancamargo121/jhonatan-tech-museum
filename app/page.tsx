import Topo from "@/components/Topo";
import Experiencia from "@/components/Experiencia";
import Projetos from "@/components/Projetos";
import Contato from "@/components/Contato";
import { contato } from "@/content/museu";

type Repo = { name: string; html_url: string; description: string | null; language: string | null; fork: boolean };

// Repositórios públicos buscados no build (sem limite de API no navegador do visitante).
async function repos(): Promise<Repo[]> {
  try {
    const r = await fetch("https://api.github.com/users/jhonatancamargo121/repos?sort=updated&per_page=30");
    if (!r.ok) return [];
    return ((await r.json()) as Repo[]).filter((x) => !x.fork).slice(0, 6);
  } catch {
    return [];
  }
}

const whats = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagem)}`;

export default async function Pagina() {
  const lista = await repos();
  return (
    <>
      <a href="#projetos" className="pular-link">Pular a visita e ir para os projetos</a>
      <Topo />
      <main id="inicio">
        <Experiencia />

        <section id="projetos" className="secao">
          <p className="sobretitulo">Galeria principal</p>
          <h2>Projetos</h2>
          <p className="intro">Sistemas, agentes e automações em que trabalhei. Abra um projeto para ver os detalhes.</p>
          <Projetos />
        </section>

        <section id="github" className="secao">
          <p className="sobretitulo">Código aberto</p>
          <h2>GitHub</h2>
          {lista.length > 0 && (
            <ul className="repos">
              {lista.map((r) => (
                <li key={r.name}>
                  <a href={r.html_url} target="_blank" rel="noopener">
                    <strong>{r.name}</strong>
                    <span>{[r.description, r.language].filter(Boolean).join(" · ")}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a className="botao botao--linha" href={contato.github} target="_blank" rel="noopener">github.com/jhonatancamargo121</a>
        </section>

        <section id="contato" className="secao secao--contato">
          <p className="sobretitulo">Contato</p>
          <h2>Vamos conversar</h2>
          <p className="intro">Para uma vaga, um projeto ou uma integração, escreva por aqui ou me chame direto.</p>
          <ul className="canais">
            <li><a href={whats} target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href={`mailto:${contato.email}`}>{contato.email}</a></li>
            <li><a href={contato.github} target="_blank" rel="noopener">GitHub</a></li>
            <li><a href={contato.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
          </ul>
          <Contato />
        </section>
      </main>
      <footer className="rodape">
        <span>Jhonatan Camargo · Cidade Ocidental, Goiás · remoto para todo o Brasil</span>
        <span>Ilustrações e personagem gerados com IA para fins ilustrativos.</span>
      </footer>
      <a className="whats" href={whats} target="_blank" rel="noopener" aria-label="Vamos conversar no WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.3-4-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2s10.5 4.6 10.5 10.4S21.8 26.1 16 26.1Z"/></svg>
      </a>
    </>
  );
}
