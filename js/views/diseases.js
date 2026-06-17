import { withVersion } from "../core/version.js";

const state = {
  diseases: [],
  filtered: []
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localized(value, lang) {
  return value?.[lang] || value?.it || value?.en || "";
}

function searchableText(disease) {
  return [
    disease.name.it,
    disease.name.en,
    disease.gene,
    disease.uniprotId,
    disease.proteinName,
    disease.inheritance.it,
    disease.inheritance.en,
    disease.damageType.it,
    disease.damageType.en,
    disease.course.it,
    disease.course.en,
    disease.therapies.it,
    disease.therapies.en
  ].join(" ").toLowerCase();
}

function activeQuery(root) {
  return root.querySelector("[data-disease-search]")?.value.trim().toLowerCase() || "";
}

function applyFilters(root) {
  const query = activeQuery(root);
  state.filtered = state.diseases.filter((disease) => !query || searchableText(disease).includes(query));
  renderList(root);
}

function externalLinks(disease, i18n) {
  return `
    <div class="link-stack">
      <a href="${escapeHtml(disease.links.uniprot)}" target="_blank" rel="noreferrer">UniProt</a>
      ${disease.links.omim ? `<a href="${escapeHtml(disease.links.omim)}" target="_blank" rel="noreferrer">OMIM ${escapeHtml(disease.omim || "")}</a>` : ""}
      ${disease.links.orphanet ? `<a href="${escapeHtml(disease.links.orphanet)}" target="_blank" rel="noreferrer">Orphanet</a>` : ""}
      <a class="text-link" href="#/explorer/${encodeURIComponent(disease.uniprotId)}">${i18n.t("diseases.openCatalog")}</a>
    </div>
  `;
}

function renderList(root) {
  const list = root.querySelector("[data-disease-list]");
  const status = root.querySelector("[data-disease-status]");
  const i18n = root.__i18n;
  const lang = i18n.language;

  status.textContent = i18n.t("diseases.status")
    .replace("{count}", state.filtered.length)
    .replace("{total}", state.diseases.length);

  if (!state.filtered.length) {
    list.innerHTML = `<article class="panel"><p class="muted">${i18n.t("diseases.noResults")}</p></article>`;
    return;
  }

  list.innerHTML = state.filtered.map((disease) => `
    <article class="panel disease-card" id="${escapeHtml(disease.id)}">
      <div class="catalog-summary disease-card-header">
        <div>
          <h2>${escapeHtml(localized(disease.name, lang))}</h2>
          <p class="muted">${escapeHtml(disease.gene)} · ${escapeHtml(disease.proteinName)} · ${escapeHtml(disease.uniprotId)}</p>
        </div>
        <span class="tag">${escapeHtml(localized(disease.inheritance, lang))}</span>
      </div>

      <ol class="disease-flow" aria-label="${i18n.t("diseases.flow")}">
        <li>
          <span>${i18n.t("diseases.gene")}</span>
          <strong>${escapeHtml(disease.gene)}</strong>
        </li>
        <li>
          <span>${i18n.t("diseases.protein")}</span>
          <strong>${escapeHtml(disease.proteinName)}</strong>
        </li>
        <li>
          <span>${i18n.t("diseases.damage")}</span>
          <strong>${escapeHtml(localized(disease.damageType, lang))}</strong>
        </li>
        <li>
          <span>${i18n.t("diseases.disease")}</span>
          <strong>${escapeHtml(localized(disease.name, lang))}</strong>
        </li>
        <li>
          <span>${i18n.t("diseases.course")}</span>
          <strong>${escapeHtml(localized(disease.course, lang))}</strong>
        </li>
        <li>
          <span>${i18n.t("diseases.therapies")}</span>
          <strong>${escapeHtml(localized(disease.therapies, lang))}</strong>
        </li>
      </ol>

      <footer class="disease-links">
        ${externalLinks(disease, i18n)}
      </footer>
    </article>
  `).join("");
}

export async function diseasesView({ i18n }) {
  if (!state.diseases.length) {
    const response = await fetch(withVersion("data/diseases.json"));
    state.diseases = response.ok ? await response.json() : [];
    state.filtered = [...state.diseases];
  }

  return `
    <section class="page" aria-labelledby="diseases-title">
      <header class="page-header">
        <h1 id="diseases-title">${i18n.t("diseases.title")}</h1>
        <p>${i18n.t("diseases.subtitle")}</p>
      </header>

      <section class="tool-panel catalog-controls" aria-label="${i18n.t("diseases.filters")}">
        <div class="form-grid">
          <label class="field">
            <span>${i18n.t("diseases.search")}</span>
            <input type="search" data-disease-search placeholder="${i18n.t("diseases.searchPlaceholder")}">
          </label>
        </div>
        <div class="catalog-summary">
          <p class="muted" data-disease-status></p>
        </div>
      </section>

      <section class="disease-list" data-disease-list></section>
    </section>
  `;
}

export function diseasesAfterRender({ root, i18n, params }) {
  root.__i18n = i18n;
  applyFilters(root);

  root.querySelector("[data-disease-search]")?.addEventListener("input", () => applyFilters(root));

  const selectedId = params?.[0];
  if (selectedId) {
    root.querySelector(`#${CSS.escape(selectedId)}`)?.scrollIntoView({ block: "start" });
  }
}
