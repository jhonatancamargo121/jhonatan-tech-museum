import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("hero aparece na hora com nome, cargo e atalhos", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Jhonatan Camargo" }).first()).toBeVisible();
  await expect(page.getByText("Full Stack Developer | AI Agents | Automation | DevOps").first()).toBeVisible();
  await expect(page.locator('.menu a[href="#contato"]')).toBeVisible();
});

test("todo o conteúdo dos 24 quadros está no HTML", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  for (const t of ["Python", "Agentes autônomos", "PostgreSQL e bancos de dados", "Proxmox e virtualização", "Harness, Spec-Driven e TDD"]) {
    expect(html).toContain(t);
  }
});

test("rolar avança as paradas e voltar retrocede", async ({ page }, info) => {
  await page.goto("/");
  const museu = page.locator(".museu");
  await expect(museu).toHaveAttribute("data-estacao", "0");
  const altura = await museu.evaluate((el) => el.scrollHeight);
  await page.evaluate((y) => scrollTo(0, y), altura * 0.3);
  await expect.poll(async () => Number(await museu.getAttribute("data-estacao")), { timeout: 8000 }).toBeGreaterThan(3);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(async () => Number(await museu.getAttribute("data-estacao")), { timeout: 8000 }).toBe(0);
});

test("salto para galeria leva à parada certa", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "nav de galerias só no desktop");
  await page.goto("/");
  await page.locator('[data-ir-galeria="4"]').click();
  // Infraestrutura começa no quadro 23 = estação 19 (1 abertura + 18 quadros antes)
  await expect.poll(async () => Number(await page.locator(".museu").getAttribute("data-estacao")), { timeout: 10000 }).toBe(19);
});

test("reduced-motion abre o museu e o botão leva à versão 2D", async ({ page }, info) => {
  test.skip(info.project.name !== "reduzido");
  await page.goto("/");
  await expect(page.locator(".museu .robo").first()).toBeVisible();
  await page.getByRole("button", { name: "Modo 2D" }).click();
  await expect(page.locator(".museu2d")).toBeVisible();
  await expect(page.locator(".museu")).toHaveCount(0);
});

test("painel de projeto abre e fecha com Esc", async ({ page }) => {
  await page.goto("/#projetos");
  await page.getByRole("button", { name: /Agentes de IA para WhatsApp/ }).click();
  const dlg = page.getByRole("dialog");
  await expect(dlg).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
});

test("formulário valida campos obrigatórios sem enviar", async ({ page }) => {
  await page.goto("/#contato");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Confira os campos destacados.")).toBeVisible();
});

test("WhatsApp aponta para o número certo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a.whats")).toHaveAttribute("href", /wa\.me\/5561996085789/);
});

test("sem violações sérias de acessibilidade", async ({ page }) => {
  await page.goto("/");
  const r = await new AxeBuilder({ page }).exclude(".cena").analyze();
  const serias = r.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(serias.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test("conteúdo proibido não aparece", async ({ page }) => {
  await page.goto("/");
  const html = (await page.content()).toLowerCase();
  expect(html).not.toContain("engenheiro de software");
  for (const verde of ["#22c55e", "#16a34a", "#10b981", "green"]) expect(html).not.toContain(verde);
});
