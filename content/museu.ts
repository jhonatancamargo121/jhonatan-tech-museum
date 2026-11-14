// Conteúdo do museu: única fonte de texto para o palco, a versão 2D e o SEO.
// Falas do MASTER-SPEC §6. Não inventar fatos.

export type Efeito =
  | "particulas" | "modulos" | "orbita" | "colmeia" | "sinapses" | "rede"
  | "terminal" | "checklist" | "camadas" | "conexoes" | "montagem" | "fluxo"
  | "graficos" | "consultas" | "mensagem" | "clique" | "pontes" | "fila"
  | "grade" | "containers" | "pipeline" | "escudo" | "tdd" | "galeria";

export type Quadro = {
  id: string;        // número da referência (05–28)
  titulo: string;
  fala: string;
  efeito: Efeito;
};

export type Galeria = { id: string; nome: string; quadros: Quadro[] };

export const galerias: Galeria[] = [
  {
    id: "linguagens", nome: "Linguagens",
    quadros: [
      { id: "05", titulo: "Python", efeito: "particulas", fala: "Python é uma das linguagens que utilizo para desenvolver automações, integrações e aplicações com inteligência artificial." },
      { id: "06", titulo: "TypeScript e JavaScript", efeito: "modulos", fala: "Essas tecnologias fazem parte do desenvolvimento de aplicações web, interfaces e integrações entre componentes." },
      { id: "07", titulo: "Java e Spring Boot", efeito: "orbita", fala: "Java e Spring Boot compõem meu conjunto de ferramentas para desenvolvimento de APIs e sistemas empresariais." },
      { id: "08", titulo: "C# e .NET", efeito: "colmeia", fala: "C# amplia minhas possibilidades de desenvolvimento de aplicações, serviços e integrações." },
    ],
  },
  {
    id: "ia", nome: "IA e agentes",
    quadros: [
      { id: "09", titulo: "LLMs e IA generativa", efeito: "sinapses", fala: "Aqui estão os modelos de linguagem e as tecnologias de inteligência artificial utilizadas em agentes e automações." },
      { id: "10", titulo: "Agentes autônomos", efeito: "rede", fala: "Agentes especializados podem planejar, executar tarefas, utilizar ferramentas e validar resultados em fluxos coordenados." },
      { id: "11", titulo: "Claude Code e Codex", efeito: "terminal", fala: "Claude Code e Codex fazem parte do meu fluxo de desenvolvimento assistido por inteligência artificial." },
      { id: "12", titulo: "Agent SDKs e testes", efeito: "checklist", fala: "Também trabalho com agentes para automatizar etapas de testes, análise de aplicações e validação de funcionalidades." },
      { id: "13", titulo: "Machine Learning", efeito: "camadas", fala: "Machine Learning e Deep Learning permitem desenvolver aplicações que identificam padrões e aprendem a partir de dados." },
      { id: "14", titulo: "RAG, MCP e Tool Calling", efeito: "conexoes", fala: "Essas tecnologias permitem conectar agentes a documentos, bases de conhecimento e ferramentas externas." },
    ],
  },
  {
    id: "web", nome: "Web e sistemas",
    quadros: [
      { id: "15", titulo: "React e Next.js", efeito: "montagem", fala: "Com React e Next.js, desenvolvo interfaces e aplicações web organizadas em componentes." },
      { id: "16", titulo: "Django, FastAPI e APIs", efeito: "fluxo", fala: "No back-end, utilizo frameworks e APIs para conectar aplicações, dados e serviços." },
      { id: "17", titulo: "ERP, CRM e SaaS", efeito: "graficos", fala: "Esses projetos envolvem sistemas empresariais, plataformas de gestão e aplicações com diferentes módulos e usuários." },
      { id: "18", titulo: "PostgreSQL e bancos de dados", efeito: "consultas", fala: "Bancos de dados são fundamentais para persistência, integridade, consultas e controle de acesso às informações." },
    ],
  },
  {
    id: "automacao", nome: "Automação e integrações",
    quadros: [
      { id: "19", titulo: "WhatsApp e atendimento com IA", efeito: "mensagem", fala: "Uma das minhas áreas de atuação é a criação de agentes inteligentes para atendimento e integração com sistemas empresariais." },
      { id: "20", titulo: "Python e Playwright", efeito: "clique", fala: "Utilizo automação para executar rotinas, interagir com aplicações web e validar processos." },
      { id: "21", titulo: "APIs e Webhooks", efeito: "pontes", fala: "As integrações permitem que diferentes sistemas troquem informações e executem ações automaticamente." },
      { id: "22", titulo: "Redis e RabbitMQ", efeito: "fila", fala: "Filas, eventos e serviços de apoio ajudam a organizar o processamento e a comunicação entre aplicações." },
    ],
  },
  {
    id: "infra", nome: "Infraestrutura",
    quadros: [
      { id: "23", titulo: "Proxmox e virtualização", efeito: "grade", fala: "Minha experiência em infraestrutura inclui virtualização, administração de ambientes e operação de serviços." },
      { id: "24", titulo: "Docker e Linux", efeito: "containers", fala: "Docker e Linux fazem parte do ambiente utilizado para executar, organizar e manter aplicações." },
      { id: "25", titulo: "Git, CI/CD e deploy", efeito: "pipeline", fala: "Versionamento, testes e processos de implantação ajudam a manter o desenvolvimento organizado." },
      { id: "26", titulo: "Segurança e monitoramento", efeito: "escudo", fala: "Segurança, controle de acesso e monitoramento são importantes para a confiabilidade das aplicações." },
    ],
  },
  {
    id: "metodo", nome: "Método e projetos",
    quadros: [
      { id: "27", titulo: "Harness, Spec-Driven e TDD", efeito: "tdd", fala: "Utilizo práticas de especificação, desenvolvimento assistido por agentes e testes para organizar e validar implementações." },
      { id: "28", titulo: "Projetos", efeito: "galeria", fala: "Agora você pode explorar os projetos e conhecer as tecnologias, integrações e soluções desenvolvidas." },
    ],
  },
];

export const quadros = galerias.flatMap((g, gi) => g.quadros.map((q) => ({ ...q, galeria: g.id, galeriaIndice: gi })));

export const boasVindas =
  "Olá, seja bem-vindo! Sou a guia deste museu e vou apresentar as tecnologias e os projetos de Jhonatan Camargo. Role a página para começar a visita.";
export const despedida = "Obrigada pela visita! Os projetos e o contato estão logo abaixo.";

// Projetos do brief.md. Sem screenshots reais nem repositórios confirmados ainda: o painel mostra só o que existe.
export type Projeto = { nome: string; descricao: string; tecnologias: string[]; repo?: string; imagens?: string[] };
export const projetos: Projeto[] = [
  { nome: "Agentes de IA para WhatsApp", descricao: "Atendimento inteligente, automação de processos e integração com sistemas CRM.", tecnologias: ["WhatsApp Cloud API", "Evolution API", "Agentes de IA", "CRM"] },
  { nome: "Agentes autônomos para testes", descricao: "Planejamento, geração e execução de testes com agentes, Playwright e ferramentas de desenvolvimento.", tecnologias: ["Playwright", "Agent SDKs", "Python"] },
  { nome: "Multi-Agent Development Workflow", descricao: "Agentes especializados em planejamento, implementação, revisão e validação de código.", tecnologias: ["Claude Code", "Codex", "Multiagentes"] },
  { nome: "CRM e SaaS multi-tenant", descricao: "Autenticação, controle de acesso, integrações e isolamento de dados.", tecnologias: ["PostgreSQL", "RLS", "RBAC", "APIs REST"] },
  { nome: "Infraestrutura Proxmox", descricao: "Ambientes virtualizados, servidores Linux, Docker, redes e monitoramento.", tecnologias: ["Proxmox VE", "Linux", "Docker", "Uptime Kuma", "Beszel"] },
  { nome: "Automações com Python", descricao: "Rotinas empresariais, processamento de dados e interação com sistemas web.", tecnologias: ["Python", "Playwright"] },
  { nome: "ERP e sistemas empresariais", descricao: "Desenvolvimento e manutenção de aplicações de gestão e integração.", tecnologias: ["ERP", "Integrações"] },
  { nome: "Rastreamento e geolocalização", descricao: "Integrações com Traccar, MapLibre e OpenStreetMap.", tecnologias: ["Traccar", "MapLibre", "OpenStreetMap"] },
];

export const contato = {
  whatsapp: "5561996085789",
  mensagem: "Olá, Jhonatan! Conheci seu portfólio e gostaria de conversar sobre uma oportunidade profissional ou projeto de desenvolvimento.",
  email: "jhonatancamargo121@gmail.com",
  github: "https://github.com/jhonatancamargo121",
  linkedin: "https://www.linkedin.com/in/jhonatan-santos-de-camargo-a4a388127/",
  cv: "", // shortcut: sem PDF do CV ainda; o link aparece quando houver arquivo em public/cv.pdf
};
