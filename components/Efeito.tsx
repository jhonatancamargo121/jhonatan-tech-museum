// Animação interna de cada quadro, em SVG sobre a arte. A variável CSS --t (0..1, progresso da parada)
// controla o que aparece em sequência; o resto é movimento contínuo e discreto em CSS.
import type { Efeito as Tipo } from "@/content/museu";

const n = (i: number, total: number) => ({ "--k": i / total } as React.CSSProperties);

function Passos({ rotulos }: { rotulos: string[] }) {
  return (
    <g className="passos">
      {rotulos.map((r, i) => {
        const x = 40 + i * (320 / (rotulos.length - 1));
        return (
          <g key={r} style={n(i, rotulos.length)} className="passo">
            {i > 0 && <line x1={x - 320 / (rotulos.length - 1) + 14} y1="262" x2={x - 14} y2="262" />}
            <circle cx={x} cy="262" r="10" />
            <text x={x} y="290" textAnchor="middle">{r}</text>
          </g>
        );
      })}
    </g>
  );
}

function Rede({ nos }: { nos: [number, number][] }) {
  const [cx, cy] = nos[0];
  return (
    <g className="rede">
      {nos.slice(1).map(([x, y], i) => (
        <g key={i} style={n(i, nos.length - 1)} className="ligacao">
          <line x1={cx} y1={cy} x2={x} y2={y} pathLength={1} />
          <circle className="pulso" r="3.5" style={{ offsetPath: `path("M${cx},${cy} L${x},${y}")`, animationDelay: `${i * 0.35}s` } as React.CSSProperties} />
          <circle cx={x} cy={y} r="6" />
        </g>
      ))}
    </g>
  );
}

function Faiscas({ qtd = 14 }: { qtd?: number }) {
  return (
    <g className="faiscas">
      {Array.from({ length: qtd }, (_, i) => (
        <circle key={i} cx={30 + ((i * 97) % 340)} cy={30 + ((i * 61) % 240)} r={1.5 + (i % 3)} style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
    </g>
  );
}

function Blocos({ qtd = 6, colunas = 3 }: { qtd?: number; colunas?: number }) {
  const w = 300 / colunas - 12, linhas = Math.ceil(qtd / colunas), h = 170 / linhas - 12;
  return (
    <g className="blocos">
      {Array.from({ length: qtd }, (_, i) => (
        <rect key={i} style={n(i, qtd)} className="bloco" x={50 + (i % colunas) * (w + 12)} y={60 + Math.floor(i / colunas) * (h + 12)} width={w} height={h} rx="6" />
      ))}
    </g>
  );
}

function Trilha({ d, qtd = 4 }: { d: string; qtd?: number }) {
  return (
    <g className="trilha">
      <path d={d} />
      {Array.from({ length: qtd }, (_, i) => (
        <circle key={i} className="pulso" r="4" style={{ offsetPath: `path("${d}")`, animationDelay: `${(i * 2.4) / qtd}s` } as React.CSSProperties} />
      ))}
    </g>
  );
}

const hub: [number, number][] = [[200, 150], [80, 70], [320, 70], [70, 220], [330, 220], [200, 40]];

export default function Efeito({ tipo }: { tipo: Tipo }) {
  let conteudo: React.ReactNode;
  switch (tipo) {
    case "particulas": case "sinapses": case "galeria":
      conteudo = <Faiscas qtd={tipo === "galeria" ? 8 : 16} />; break;
    case "orbita": case "rede": case "conexoes": case "pontes":
      conteudo = <Rede nos={hub} />; break;
    case "modulos": case "montagem": case "graficos": case "grade": case "containers":
      conteudo = <Blocos qtd={tipo === "grade" ? 9 : 6} colunas={3} />; break;
    case "colmeia": case "escudo":
      conteudo = <g className="varredura"><rect x="0" y="0" width="400" height="300" /></g>; break;
    case "terminal":
      conteudo = (
        <g className="terminal">
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} style={n(i, 5)} className="linha" x="70" y={80 + i * 30} width={180 - (i % 3) * 40} height="9" rx="4" />)}
          <rect className="cursor" x="70" y="230" width="10" height="14" />
        </g>
      ); break;
    case "checklist":
      conteudo = <Passos rotulos={["plano", "execução", "análise", "validado"]} />; break;
    case "pipeline":
      conteudo = <Passos rotulos={["commit", "build", "testes", "deploy"]} />; break;
    case "tdd":
      conteudo = <Passos rotulos={["red", "pass", "refactor"]} />; break;
    case "camadas":
      conteudo = <Trilha d="M30,150 C110,40 150,260 200,150 S300,40 370,150" qtd={5} />; break;
    case "fluxo": case "fila": case "consultas":
      conteudo = <Trilha d="M30,230 L130,230 L130,90 L270,90 L270,230 L370,230" qtd={4} />; break;
    case "mensagem":
      conteudo = <Trilha d="M60,80 C160,80 140,220 260,220 L350,220" qtd={3} />; break;
    case "clique":
      conteudo = <g className="clique"><circle cx="250" cy="170" r="8" /><circle className="onda" cx="250" cy="170" r="8" /></g>; break;
  }
  return (
    <svg className={`efeito ef-${tipo}`} viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      {conteudo}
    </svg>
  );
}
