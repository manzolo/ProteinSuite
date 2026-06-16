import { withVersion } from "../core/version.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function topEntries(counts, limit = 10) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}

function barList(entries, total) {
  const max = Math.max(...entries.map((entry) => entry[1]), 1);
  return `
    <div class="bar-list">
      ${entries.map(([label, count]) => `
        <div class="bar-row">
          <span>${escapeHtml(label)}</span>
          <div><i style="width:${(count / max) * 100}%"></i></div>
          <strong>${count}</strong>
          <small>${((count / total) * 100).toFixed(1)}%</small>
        </div>
      `).join("")}
    </div>
  `;
}

function lengthBins(proteins) {
  const bins = {
    "1-100": 0,
    "101-250": 0,
    "251-500": 0,
    "501-1000": 0,
    ">1000": 0
  };
  proteins.forEach((protein) => {
    if (protein.length <= 100) bins["1-100"] += 1;
    else if (protein.length <= 250) bins["101-250"] += 1;
    else if (protein.length <= 500) bins["251-500"] += 1;
    else if (protein.length <= 1000) bins["501-1000"] += 1;
    else bins[">1000"] += 1;
  });
  return bins;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function statisticsView({ i18n }) {
  const response = await fetch(withVersion("data/proteins.json"));
  const proteins = response.ok ? await response.json() : [];
  const pdbIds = new Set(proteins.flatMap((protein) => protein.pdbIds));
  const categories = countBy(proteins, "category");
  const organisms = countBy(proteins, "organism");
  const families = countBy(proteins, "family");
  const lengths = proteins.map((protein) => protein.length);
  const avgLength = average(lengths);

  return `
    <section class="page" aria-labelledby="statistics-title">
      <header class="page-header">
        <h1 id="statistics-title">${i18n.t("statistics.title")}</h1>
        <p>${i18n.t("statistics.subtitle")}</p>
      </header>

      <div class="grid">
        <article class="stat-card"><span class="muted">${i18n.t("statistics.records")}</span><strong>${proteins.length}</strong></article>
        <article class="stat-card"><span class="muted">${i18n.t("statistics.pdb")}</span><strong>${pdbIds.size}</strong></article>
        <article class="stat-card"><span class="muted">${i18n.t("statistics.organisms")}</span><strong>${Object.keys(organisms).length}</strong></article>
        <article class="stat-card"><span class="muted">${i18n.t("statistics.avgLength")}</span><strong>${avgLength.toFixed(0)}</strong></article>
      </div>

      <section class="stats-grid">
        <article class="panel">
          <h2>${i18n.t("statistics.byCategory")}</h2>
          ${barList(topEntries(categories, 10), proteins.length)}
        </article>
        <article class="panel">
          <h2>${i18n.t("statistics.byLength")}</h2>
          ${barList(Object.entries(lengthBins(proteins)), proteins.length)}
        </article>
        <article class="panel">
          <h2>${i18n.t("statistics.topOrganisms")}</h2>
          ${barList(topEntries(organisms, 10), proteins.length)}
        </article>
        <article class="panel">
          <h2>${i18n.t("statistics.topFamilies")}</h2>
          ${barList(topEntries(families, 10), proteins.length)}
        </article>
      </section>
    </section>
  `;
}
