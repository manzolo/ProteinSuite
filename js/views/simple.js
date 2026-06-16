import { withVersion } from "../core/version.js";

export async function simpleView({ i18n }, key) {
  const response = await fetch(withVersion("data/app-manifest.json"));
  const manifest = response.ok ? await response.json() : { modules: [] };
  const module = manifest.modules.find((item) => item.key === key);
  const lang = i18n.language;
  const title = module?.title[lang] || i18n.t(`nav.${key}`);
  const summary = module?.summary[lang] || "";
  const capabilities = module?.capabilities?.[lang] || [];

  return `
    <section class="page" aria-labelledby="${key}-title">
      <header class="page-header">
        <h1 id="${key}-title">${title}</h1>
        <p>${summary}</p>
      </header>
      <div class="tool-panel">
        <h2>${i18n.t("module.capabilities")}</h2>
        <ul>
          ${capabilities.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}
