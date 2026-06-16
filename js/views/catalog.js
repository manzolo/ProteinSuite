const state = {
  proteins: [],
  filtered: [],
  page: 1,
  pageSize: 25,
  sort: "name",
  direction: "asc"
};

const fields = ["name", "gene", "uniprotId", "organism", "function", "family", "category", "keywords"];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionList(values, selected, allLabel) {
  return `<option value="">${escapeHtml(allLabel)}</option>${values.map((value) => `
    <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>
  `).join("")}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function searchableText(protein) {
  return fields.map((field) => Array.isArray(protein[field]) ? protein[field].join(" ") : protein[field]).join(" ").toLowerCase();
}

function activeFilters(root) {
  return {
    q: root.querySelector("[data-catalog-search]")?.value.trim().toLowerCase() || "",
    category: root.querySelector("[data-catalog-category]")?.value || "",
    organism: root.querySelector("[data-catalog-organism]")?.value || "",
    family: root.querySelector("[data-catalog-family]")?.value || ""
  };
}

function compareValues(a, b, key, direction) {
  const left = a[key];
  const right = b[key];
  const result = typeof left === "number"
    ? left - right
    : String(left ?? "").localeCompare(String(right ?? ""));
  return direction === "asc" ? result : -result;
}

function applyFilters(root) {
  const filters = activeFilters(root);
  state.filtered = state.proteins
    .filter((protein) => !filters.q || searchableText(protein).includes(filters.q))
    .filter((protein) => !filters.category || protein.category === filters.category)
    .filter((protein) => !filters.organism || protein.organism === filters.organism)
    .filter((protein) => !filters.family || protein.family === filters.family)
    .sort((a, b) => compareValues(a, b, state.sort, state.direction));
  state.page = 1;
  renderTable(root);
}

function visibleRecords() {
  const start = (state.page - 1) * state.pageSize;
  return state.filtered.slice(start, start + state.pageSize);
}

function renderTable(root) {
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const rows = visibleRecords();
  const table = root.querySelector("[data-catalog-table]");
  const status = root.querySelector("[data-catalog-status]");
  const pager = root.querySelector("[data-catalog-pager]");
  const i18n = root.__i18n;

  status.textContent = i18n.t("catalog.status")
    .replace("{count}", state.filtered.length)
    .replace("{total}", state.proteins.length);

  table.innerHTML = `
    <table class="data-table catalog-table">
      <thead>
        <tr>
          <th><button type="button" data-sort="name">${i18n.t("catalog.columns.name")}</button></th>
          <th><button type="button" data-sort="category">${i18n.t("catalog.columns.category")}</button></th>
          <th><button type="button" data-sort="organism">${i18n.t("catalog.columns.organism")}</button></th>
          <th><button type="button" data-sort="length">${i18n.t("catalog.columns.length")}</button></th>
          <th>${i18n.t("catalog.columns.references")}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((protein) => `
          <tr>
            <td>
              <strong>${escapeHtml(protein.name)}</strong>
              <span class="muted block">${escapeHtml(protein.gene)} · ${escapeHtml(protein.uniprotId)}</span>
              <span class="block">${escapeHtml(protein.description)}</span>
              <a class="text-link" href="#/explorer/${encodeURIComponent(protein.uniprotId)}">${i18n.t("catalog.openExplorer")}</a>
              <a class="text-link" href="#/lab/${encodeURIComponent(protein.uniprotId)}">${i18n.t("catalog.openLab")}</a>
              <button class="text-button" type="button" data-live-uniprot="${escapeHtml(protein.uniprotId)}">${i18n.t("catalog.liveDetails")}</button>
            </td>
            <td><span class="tag">${escapeHtml(protein.category)}</span></td>
            <td>${escapeHtml(protein.organism)}</td>
            <td>${protein.length.toLocaleString()}</td>
            <td>
              <div class="link-stack">
                <a href="${protein.links.uniprot}" target="_blank" rel="noreferrer">${i18n.t("catalog.uniprot")}</a>
                ${protein.pdbIds.slice(0, 3).map((pdb, index) => `
                  <a href="${protein.links.pdb[index]}" target="_blank" rel="noreferrer">PDB ${escapeHtml(pdb)}</a>
                `).join("")}
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  pager.innerHTML = `
    <button class="button secondary" type="button" data-page="prev" ${state.page === 1 ? "disabled" : ""}>${i18n.t("catalog.prev")}</button>
    <span>${i18n.t("catalog.page").replace("{page}", state.page).replace("{pages}", totalPages)}</span>
    <button class="button secondary" type="button" data-page="next" ${state.page === totalPages ? "disabled" : ""}>${i18n.t("catalog.next")}</button>
  `;
}

export async function catalogView({ i18n }) {
  if (!state.proteins.length) {
    const response = await fetch("data/proteins.json");
    state.proteins = response.ok ? await response.json() : [];
    state.filtered = [...state.proteins];
  }

  const categories = unique(state.proteins.map((protein) => protein.category));
  const organisms = unique(state.proteins.map((protein) => protein.organism));
  const families = unique(state.proteins.map((protein) => protein.family));

  return `
    <section class="page" aria-labelledby="catalog-title">
      <header class="page-header">
        <h1 id="catalog-title">${i18n.t("catalog.title")}</h1>
        <p>${i18n.t("catalog.subtitle")}</p>
      </header>

      <section class="tool-panel catalog-controls" aria-label="${i18n.t("catalog.filters")}">
        <div class="form-grid">
          <label class="field">
            <span>${i18n.t("catalog.search")}</span>
            <input type="search" data-catalog-search placeholder="${i18n.t("catalog.searchPlaceholder")}">
          </label>
          <label class="field">
            <span>${i18n.t("catalog.category")}</span>
            <select data-catalog-category>${optionList(categories, "", i18n.t("catalog.allCategories"))}</select>
          </label>
          <label class="field">
            <span>${i18n.t("catalog.organism")}</span>
            <select data-catalog-organism>${optionList(organisms, "", i18n.t("catalog.allOrganisms"))}</select>
          </label>
          <label class="field">
            <span>${i18n.t("catalog.family")}</span>
            <select data-catalog-family>${optionList(families, "", i18n.t("catalog.allFamilies"))}</select>
          </label>
        </div>
        <div class="catalog-summary">
          <p class="muted" data-catalog-status></p>
          <a href="data/catalog-validation.json">${i18n.t("catalog.validation")}</a>
        </div>
      </section>

      <div class="table-scroll" data-catalog-table></div>
      <section class="live-panel" data-live-panel hidden aria-live="polite"></section>
      <nav class="pager" aria-label="${i18n.t("catalog.pagination")}" data-catalog-pager></nav>
    </section>
  `;
}

function firstRecommendedName(record) {
  return record.proteinDescription?.recommendedName?.fullName?.value
    || record.proteinDescription?.submissionNames?.[0]?.fullName?.value
    || record.primaryAccession;
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

async function loadLiveUniProt(root, accession) {
  const panel = root.querySelector("[data-live-panel]");
  const i18n = root.__i18n;
  panel.hidden = false;
  panel.innerHTML = `<p class="muted">${i18n.t("catalog.loadingLive").replace("{id}", accession)}</p>`;

  try {
    const response = await fetch(`https://rest.uniprot.org/uniprotkb/${encodeURIComponent(accession)}.json`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const record = await response.json();
    const functionText = commentText(record, "FUNCTION") || i18n.t("catalog.noLiveFunction");
    const locationText = commentText(record, "SUBCELLULAR LOCATION") || i18n.t("catalog.noLiveLocation");
    const gene = record.genes?.[0]?.geneName?.value || accession;
    panel.innerHTML = `
      <article>
        <div class="catalog-summary">
          <div>
            <h2>${escapeHtml(firstRecommendedName(record))}</h2>
            <p class="muted">${escapeHtml(gene)} · ${escapeHtml(record.organism?.scientificName || "")} · ${escapeHtml(accession)}</p>
          </div>
          <a class="button secondary" href="https://www.uniprot.org/uniprotkb/${escapeHtml(accession)}/entry" target="_blank" rel="noreferrer">UniProt</a>
        </div>
        <h3>${i18n.t("catalog.liveFunction")}</h3>
        <p>${escapeHtml(functionText)}</p>
        <h3>${i18n.t("catalog.liveLocation")}</h3>
        <p>${escapeHtml(locationText)}</p>
        <p class="muted">${i18n.t("catalog.liveSource")}</p>
      </article>
    `;
    panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  } catch (error) {
    panel.innerHTML = `<p class="muted">${i18n.t("catalog.liveError").replace("{id}", accession)}</p>`;
  }
}

export function catalogAfterRender({ root, i18n }) {
  root.__i18n = i18n;
  applyFilters(root);

  root.querySelectorAll("[data-catalog-search], [data-catalog-category], [data-catalog-organism], [data-catalog-family]").forEach((control) => {
    control.addEventListener("input", () => applyFilters(root));
    control.addEventListener("change", () => applyFilters(root));
  });

  root.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-sort]");
    if (sortButton) {
      const nextSort = sortButton.dataset.sort;
      state.direction = state.sort === nextSort && state.direction === "asc" ? "desc" : "asc";
      state.sort = nextSort;
      state.filtered.sort((a, b) => compareValues(a, b, state.sort, state.direction));
      renderTable(root);
    }

    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      state.page += pageButton.dataset.page === "next" ? 1 : -1;
      renderTable(root);
    }

    const liveButton = event.target.closest("[data-live-uniprot]");
    if (liveButton) {
      loadLiveUniProt(root, liveButton.dataset.liveUniprot);
    }
  });
}
