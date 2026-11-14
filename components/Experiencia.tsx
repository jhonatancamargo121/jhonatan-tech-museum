"use client";
// Escolhe entre o museu cinematográfico e a versão 2D (botão "Modo 2D" do menu, lembrado no navegador).
import { useEffect, useState } from "react";
import Museu from "./Museu";
import Museu2D from "./Museu2D";

export default function Experiencia() {
  const [modo2d, setModo2d] = useState(false);

  useEffect(() => {
    let salvo: string | null = null;
    try { salvo = localStorage.getItem("modo"); } catch {}
    // O museu só se move quando a pessoa rola; com reduced-motion, o CSS já corta as animações automáticas.
    // A versão 2D fica como escolha explícita no botão do menu.
    setModo2d(salvo === "2d");
    const alternar = () => setModo2d((v) => {
      try { localStorage.setItem("modo", v ? "cinema" : "2d"); } catch {}
      return !v;
    });
    addEventListener("alternar-modo", alternar);
    return () => removeEventListener("alternar-modo", alternar);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.modo = modo2d ? "2d" : "cinema";
  }, [modo2d]);

  return modo2d ? <Museu2D /> : <Museu />;
}
