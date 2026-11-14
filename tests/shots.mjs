// Capturas para revisão visual: node tests/shots.mjs
import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
for (const [nome, ctxOpt] of [["desk", { viewport: { width: 1440, height: 900 } }], ["cel", devices["iPhone 15"]]]) {
  const p = await (await b.newContext(ctxOpt)).newPage();
  await p.goto("http://localhost:4173/");
  await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.querySelector(".museu").scrollHeight - innerHeight);
  for (const f of [0, 0.03, 0.05, 0.25, 0.62]) {
    await p.evaluate((y) => scrollTo(0, y), Math.round(H * f));
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `../../shot-${nome}-${f}.jpg`, quality: 60, type: "jpeg" });
  }
}
await b.close();
