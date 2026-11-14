"use client";
// Formulário → e-mail via FormSubmit (ativado uma vez pelo dono do e-mail), com honeypot e validação.
import { useState } from "react";
import { contato } from "@/content/museu";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contato() {
  const [status, setStatus] = useState<{ txt: string; tipo?: "ok" | "falha" }>({ txt: "" });
  const [erros, setErros] = useState<Record<string, boolean>>({});
  const [enviando, setEnviando] = useState(false);

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const dados = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (dados._honey) return; // robô
    const e: Record<string, boolean> = {};
    for (const k of ["nome", "assunto", "mensagem"]) if ((dados[k] || "").trim().length < 2) e[k] = true;
    if (!EMAIL_OK.test(dados.email || "")) e.email = true;
    setErros(e);
    if (Object.keys(e).length) return setStatus({ txt: "Confira os campos destacados.", tipo: "falha" });
    delete dados._honey;
    setEnviando(true);
    setStatus({ txt: "Enviando…" });
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contato.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "Novo contato pelo portfólio", _template: "table", _captcha: "false", ...dados }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || r.status);
      form.reset();
      setStatus({ txt: "Mensagem enviada. Respondo em breve.", tipo: "ok" });
    } catch {
      setStatus({ txt: "Não foi possível enviar agora. Me chame no WhatsApp.", tipo: "falha" });
    } finally {
      setEnviando(false);
    }
  }

  const campo = (id: string, rotulo: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={`campo${erros[id] ? " erro" : ""}`}>
      <label htmlFor={`f-${id}`}>{rotulo}</label>
      <input id={`f-${id}`} name={id} aria-invalid={erros[id] || undefined} maxLength={160} {...extra} />
    </div>
  );

  return (
    <form className="form" noValidate onSubmit={enviar}>
      {campo("nome", "Nome", { autoComplete: "name", required: true })}
      {campo("email", "E-mail", { type: "email", autoComplete: "email", required: true })}
      {campo("empresa", "Empresa (opcional)", { autoComplete: "organization" })}
      {campo("assunto", "Assunto", { required: true })}
      <div className={`campo campo--inteiro${erros.mensagem ? " erro" : ""}`}>
        <label htmlFor="f-mensagem">Mensagem</label>
        <textarea id="f-mensagem" name="mensagem" rows={5} maxLength={4000} required aria-invalid={erros.mensagem || undefined} />
      </div>
      <input type="text" name="_honey" className="pote" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="botao campo--inteiro" disabled={enviando}>Enviar</button>
      <p className={`form-status campo--inteiro ${status.tipo ?? ""}`} role="status" aria-live="polite">{status.txt}</p>
    </form>
  );
}
