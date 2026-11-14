import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const titulo = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600"], variable: "--f-titulo" });
const texto = Inter({ subsets: ["latin"], variable: "--f-texto" });
const codigo = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-codigo" });

const SITE = "https://jhonatan-camargo.natela.tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Jhonatan Camargo · The Tech Museum · Full Stack, AI Agents e DevOps",
  description:
    "Portfólio de Jhonatan Camargo em forma de museu tecnológico: desenvolvimento Full Stack, agentes de IA, automação, integrações e infraestrutura.",
  openGraph: {
    type: "profile",
    title: "Jhonatan Camargo · The Tech Museum",
    description: "Do código à infraestrutura. Da automação à inteligência artificial.",
    url: SITE,
    images: ["/media/og.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#080D18" };

const pessoa = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jhonatan Camargo",
  jobTitle: "Desenvolvedor Full Stack",
  address: { "@type": "PostalAddress", addressLocality: "Cidade Ocidental", addressRegion: "GO", addressCountry: "BR" },
  sameAs: ["https://github.com/jhonatancamargo121", "https://www.linkedin.com/in/jhonatan-santos-de-camargo-a4a388127/"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable} ${codigo.variable}`} data-modo="cinema">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pessoa) }} />
        {children}
      </body>
    </html>
  );
}
