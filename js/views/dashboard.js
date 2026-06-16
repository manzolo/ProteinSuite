import { withVersion } from "../core/version.js";

export async function dashboardView({ i18n }) {
  const response = await fetch(withVersion("data/app-manifest.json"));
  const manifest = response.ok ? await response.json() : { modules: [] };
  const lang = i18n.language;

  return `
    <section class="page" aria-labelledby="dashboard-title">
      <header class="page-header">
        <h1 id="dashboard-title">${i18n.t("dashboard.title")}</h1>
        <p>${i18n.t("dashboard.subtitle")}</p>
      </header>

      <div class="grid" aria-label="${i18n.t("dashboard.metrics")}">
        <article class="stat-card">
          <span class="muted">${i18n.t("dashboard.modules")}</span>
          <strong>${manifest.modules.length}</strong>
        </article>
        <article class="stat-card">
          <span class="muted">${i18n.t("dashboard.languages")}</span>
          <strong>IT / EN</strong>
        </article>
        <article class="stat-card">
          <span class="muted">${i18n.t("dashboard.runtime")}</span>
          <strong>Static ES6</strong>
        </article>
      </div>

      <section class="grid" style="margin-top: 1rem">
        ${manifest.modules.map((module) => `
          <article class="panel">
            <h2>${module.title[lang] || module.title.it}</h2>
            <p class="muted">${module.summary[lang] || module.summary.it}</p>
            <a class="button secondary" href="${module.url}">${i18n.t("actions.open")}</a>
          </article>
        `).join("")}
      </section>
    </section>
  `;
}

