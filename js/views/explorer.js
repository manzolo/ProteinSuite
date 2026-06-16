import { withVersion } from "../core/version.js";

const state = {
  proteins: [],
  selectedId: "",
  compareId: "",
  liveCache: new Map()
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function proteinOptions(proteins, selectedId) {
  return proteins.map((protein) => `
    <option value="${escapeHtml(protein.uniprotId)}" ${protein.uniprotId === selectedId ? "selected" : ""}>
      ${escapeHtml(protein.name)} (${escapeHtml(protein.uniprotId)})
    </option>
  `).join("");
}

function relatedProteins(protein) {
  return state.proteins
    .filter((item) => item.uniprotId !== protein.uniprotId)
    .filter((item) => item.category === protein.category || item.family === protein.family)
    .slice(0, 8);
}

function metricRow(label, left, right = null) {
  return `
    <tr>
      <th>${escapeHtml(label)}</th>
      <td>${escapeHtml(left)}</td>
      ${right === null ? "" : `<td>${escapeHtml(right)}</td>`}
    </tr>
  `;
}

function detailCard(protein, i18n) {
  return `
    <article class="panel explorer-card">
      <div class="catalog-summary">
        <div>
          <h2>${escapeHtml(protein.name)}</h2>
          <p class="muted">${escapeHtml(protein.gene)} · ${escapeHtml(protein.organism)}</p>
        </div>
        <span class="tag">${escapeHtml(protein.category)}</span>
      </div>
      <dl class="fact-grid">
        <div><dt>${i18n.t("explorer.uniprot")}</dt><dd><a href="${protein.links.uniprot}" target="_blank" rel="noreferrer">${escapeHtml(protein.uniprotId)}</a></dd></div>
        <div><dt>${i18n.t("explorer.length")}</dt><dd>${protein.length.toLocaleString()}</dd></div>
        <div><dt>${i18n.t("explorer.family")}</dt><dd>${escapeHtml(protein.family)}</dd></div>
        <div><dt>${i18n.t("explorer.pdb")}</dt><dd>${protein.pdbIds.map((pdb, index) => `<a href="${protein.links.pdb[index]}" target="_blank" rel="noreferrer">${escapeHtml(pdb)}</a>`).join(", ")}</dd></div>
      </dl>
      <h3>${i18n.t("explorer.indexDescription")}</h3>
      <p>${escapeHtml(protein.description)}</p>
      <h3>${i18n.t("explorer.keywords")}</h3>
      <div class="tag-list">${protein.keywords.slice(0, 18).map((keyword) => `<span class="tag">${escapeHtml(keyword)}</span>`).join("")}</div>
      <div class="actions">
        <button class="button" type="button" data-load-live="${escapeHtml(protein.uniprotId)}">${i18n.t("explorer.loadLive")}</button>
        <a class="button secondary" href="#/lab/${encodeURIComponent(protein.uniprotId)}">${i18n.t("explorer.sendToLab")}</a>
      </div>
    </article>
  `;
}

function renderRelated(root, protein, i18n) {
  const target = root.querySelector("[data-related]");
  const related = relatedProteins(protein);
  target.innerHTML = related.map((item) => `
    <a class="related-item" href="#/explorer/${encodeURIComponent(item.uniprotId)}">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.category)} · ${escapeHtml(item.uniprotId)}</span>
    </a>
  `).join("") || `<p class="muted">${i18n.t("explorer.noRelated")}</p>`;
}

function renderComparison(root, protein, i18n) {
  const compare = state.proteins.find((item) => item.uniprotId === state.compareId);
  const target = root.querySelector("[data-comparison]");
  if (!compare) {
    target.innerHTML = `<p class="muted">${i18n.t("explorer.chooseCompare")}</p>`;
    return;
  }
  target.innerHTML = `
    <div class="table-scroll">
      <table class="data-table comparison-table">
        <thead>
          <tr>
            <th>${i18n.t("explorer.property")}</th>
            <th>${escapeHtml(protein.uniprotId)}</th>
            <th>${escapeHtml(compare.uniprotId)}</th>
          </tr>
        </thead>
        <tbody>
          ${metricRow(i18n.t("explorer.name"), protein.name, compare.name)}
          ${metricRow(i18n.t("explorer.gene"), protein.gene, compare.gene)}
          ${metricRow(i18n.t("explorer.category"), protein.category, compare.category)}
          ${metricRow(i18n.t("explorer.organism"), protein.organism, compare.organism)}
          ${metricRow(i18n.t("explorer.family"), protein.family, compare.family)}
          ${metricRow(i18n.t("explorer.length"), protein.length, compare.length)}
          ${metricRow(i18n.t("explorer.pdbCount"), protein.pdbIds.length, compare.pdbIds.length)}
        </tbody>
      </table>
    </div>
  `;
}

function commentText(record, type) {
  const comment = record.comments?.find((item) => item.commentType === type);
  if (!comment) {
    return "";
  }
  if (comment.texts?.length) {
    return comment.texts.map((item) => item.value).join(" ");
  }
  if (comment.subcellularLocations?.length) {
    return comment.subcellularLocations
      .map((item) => item.location?.value)
      .filter(Boolean)
      .join("; ");
  }
  return "";
}

async function loadLive(root, accession, i18n) {
  const panel = root.querySelector("[data-live-explorer]");
  panel.hidden = false;
  panel.innerHTML = `<p class="muted">${i18n.t("explorer.loadingLive").replace("{id}", accession)}</p>`;
  try {
    if (!state.liveCache.has(accession)) {
      const response = await fetch(`https://rest.uniprot.org/uniprotkb/${encodeURIComponent(accession)}.json`, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      state.liveCache.set(accession, await response.json());
    }
    const record = state.liveCache.get(accession);
    const proteinName = record.proteinDescription?.recommendedName?.fullName?.value || accession;
    const functionText = commentText(record, "FUNCTION") || i18n.t("explorer.noLiveFunction");
    const locationText = commentText(record, "SUBCELLULAR LOCATION") || i18n.t("explorer.noLiveLocation");
    panel.innerHTML = `
      <article>
        <h2>${escapeHtml(proteinName)}</h2>
        <p class="muted">${escapeHtml(record.organism?.scientificName || "")} · ${escapeHtml(accession)}</p>
        <h3>${i18n.t("explorer.liveFunction")}</h3>
        <p>${escapeHtml(functionText)}</p>
        <h3>${i18n.t("explorer.liveLocation")}</h3>
        <p>${escapeHtml(locationText)}</p>
        <p class="muted">${i18n.t("explorer.liveNotice")}</p>
      </article>
    `;
  } catch (error) {
    panel.innerHTML = `<p class="muted">${i18n.t("explorer.liveError").replace("{id}", accession)}</p>`;
  }
}

function renderExplorer(root, i18n) {
  const protein = state.proteins.find((item) => item.uniprotId === state.selectedId) || state.proteins[0];
  state.selectedId = protein.uniprotId;
  root.querySelector("[data-selected-protein]").value = state.selectedId;
  root.querySelector("[data-detail]").innerHTML = detailCard(protein, i18n);
  renderRelated(root, protein, i18n);
  renderComparison(root, protein, i18n);
}

export async function explorerView({ i18n, params }) {
  if (!state.proteins.length) {
    const response = await fetch(withVersion("data/proteins.json"));
    state.proteins = response.ok ? await response.json() : [];
  }
  state.selectedId = params[0] || state.selectedId || state.proteins[0]?.uniprotId || "";
  state.compareId = state.compareId || state.proteins.find((item) => item.uniprotId !== state.selectedId)?.uniprotId || "";

  return `
    <section class="page" aria-labelledby="explorer-title">
      <header class="page-header">
        <h1 id="explorer-title">${i18n.t("explorer.title")}</h1>
        <p>${i18n.t("explorer.subtitle")}</p>
      </header>

      <section class="tool-panel explorer-controls" aria-label="${i18n.t("explorer.controls")}">
        <div class="form-grid">
          <label class="field">
            <span>${i18n.t("explorer.primaryProtein")}</span>
            <select data-selected-protein>${proteinOptions(state.proteins, state.selectedId)}</select>
          </label>
          <label class="field">
            <span>${i18n.t("explorer.compareProtein")}</span>
            <select data-compare-protein>${proteinOptions(state.proteins, state.compareId)}</select>
          </label>
        </div>
      </section>

      <div class="explorer-layout">
        <div data-detail></div>
        <aside class="panel">
          <h2>${i18n.t("explorer.related")}</h2>
          <div class="related-list" data-related></div>
        </aside>
      </div>

      <section class="panel">
        <h2>${i18n.t("explorer.comparison")}</h2>
        <div data-comparison></div>
      </section>

      <section class="live-panel" data-live-explorer hidden aria-live="polite"></section>
    </section>
  `;
}

export function explorerAfterRender({ root, i18n }) {
  renderExplorer(root, i18n);

  root.querySelector("[data-selected-protein]")?.addEventListener("change", (event) => {
    state.selectedId = event.target.value;
    window.location.hash = `#/explorer/${encodeURIComponent(state.selectedId)}`;
  });

  root.querySelector("[data-compare-protein]")?.addEventListener("change", (event) => {
    state.compareId = event.target.value;
    renderExplorer(root, i18n);
  });

  root.addEventListener("click", (event) => {
    const liveButton = event.target.closest("[data-load-live]");
    if (liveButton) {
      loadLive(root, liveButton.dataset.loadLive, i18n);
    }
  });
}
