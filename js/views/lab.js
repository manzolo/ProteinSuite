import { analyzeSequence, parseFasta } from "../core/protein-analysis.js";

let constants = null;
let proteins = null;

const example = `>sp|P42212|GFP_AEQVI Green fluorescent protein
MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK`;

async function ensureProteins() {
  if (!proteins) {
    const response = await fetch("data/proteins.json");
    proteins = response.ok ? await response.json() : [];
  }
  return proteins;
}

function buildFasta(protein) {
  return `>${protein.uniprotId} ${protein.name} OS=${protein.organism}\n${protein.sequence}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function format(value, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function resultTable(result, i18n) {
  if (result.error) {
    return `
      <article class="panel">
        <h2>${escapeHtml(result.record.id)}</h2>
        <p class="muted">${i18n.t("lab.validationError")}</p>
        <p>${escapeHtml(result.error)}</p>
        <p>${i18n.t("lab.ambiguous")}: ${escapeHtml(result.validation.ambiguous.join(", ") || "-")}</p>
      </article>
    `;
  }
  const stable = result.instabilityIndex < 40 ? i18n.t("lab.predictedStable") : i18n.t("lab.predictedUnstable");
  return `
    <article class="panel">
      <h2>${escapeHtml(result.record.id)}</h2>
      <p class="muted">${escapeHtml(result.record.description)}</p>
      <div class="table-scroll">
        <table class="data-table">
          <tbody>
            <tr><th>${i18n.t("lab.length")}</th><td>${result.length}</td></tr>
            <tr><th>${i18n.t("lab.mwAverage")}</th><td>${format(result.molecularWeightAverage, 2)} Da</td></tr>
            <tr><th>${i18n.t("lab.mwMono")}</th><td>${format(result.molecularWeightMonoisotopic, 2)} Da</td></tr>
            <tr><th>${i18n.t("lab.netCharge")}</th><td>${format(result.netCharge, 3)}</td></tr>
            <tr><th>${i18n.t("lab.pI")}</th><td>${format(result.pI, 3)}</td></tr>
            <tr><th>${i18n.t("lab.gravy")}</th><td>${format(result.gravy, 3)}</td></tr>
            <tr><th>${i18n.t("lab.aromaticity")}</th><td>${format(result.aromaticity * 100, 2)}%</td></tr>
            <tr><th>${i18n.t("lab.instability")}</th><td>${format(result.instabilityIndex, 2)} · ${stable}</td></tr>
          </tbody>
        </table>
      </div>
      <h3>${i18n.t("lab.hydrophobicityProfile")}</h3>
      <div class="sparkline" aria-label="${i18n.t("lab.hydrophobicityProfile")}">
        ${result.hydrophobicityProfile.slice(0, 80).map((point) => `<span style="height:${Math.max(4, Math.min(46, 22 + point.value * 5))}px" title="${point.position}: ${format(point.value, 2)}"></span>`).join("")}
      </div>
      <h3>${i18n.t("lab.composition")}</h3>
      <div class="composition-grid">
        ${result.composition.map((item) => `
          <div><strong>${item.letter}</strong><span>${item.count}</span><small>${format(item.fraction * 100, 1)}%</small></div>
        `).join("")}
      </div>
    </article>
  `;
}

async function ensureConstants() {
  if (!constants) {
    const response = await fetch("data/protein-constants.json");
    constants = await response.json();
  }
  return constants;
}

async function runAnalysis(root, i18n) {
  const values = {
    sequence: root.querySelector("[data-lab-sequence]").value,
    pH: Number(root.querySelector("[data-lab-ph]").value),
    windowSize: Number(root.querySelector("[data-lab-window]").value)
  };
  const parsed = parseFasta(values.sequence);
  const c = await ensureConstants();
  const results = parsed.map((record) => analyzeSequence(record, c, values));
  root.querySelector("[data-lab-results]").innerHTML = results.length
    ? results.map((result) => resultTable(result, i18n)).join("")
    : `<p class="muted">${i18n.t("lab.empty")}</p>`;
}

export async function labView({ i18n, params }) {
  let initial = example;
  let loadedNotice = "";
  const accession = params?.[0];
  if (accession) {
    const list = await ensureProteins();
    const protein = list.find((item) => item.uniprotId === accession);
    if (protein?.sequence) {
      initial = buildFasta(protein);
      loadedNotice = `<p class="muted lab-loaded">${i18n.t("lab.loadedFrom").replace("{name}", protein.name).replace("{id}", protein.uniprotId)}</p>`;
    }
  }
  return `
    <section class="page" aria-labelledby="lab-title">
      <header class="page-header">
        <h1 id="lab-title">${i18n.t("lab.title")}</h1>
        <p>${i18n.t("lab.subtitle")}</p>
      </header>
      ${loadedNotice}

      <section class="tool-panel">
        <div class="form-grid">
          <label class="field">
            <span>${i18n.t("lab.ph")}</span>
            <input type="number" min="0" max="14" step="0.1" value="7.0" data-lab-ph>
          </label>
          <label class="field">
            <span>${i18n.t("lab.window")}</span>
            <input type="number" min="1" max="51" step="2" value="9" data-lab-window>
          </label>
        </div>
        <label class="field" style="margin-top: 0.8rem">
          <span>${i18n.t("lab.sequence")}</span>
          <textarea data-lab-sequence spellcheck="false">${escapeHtml(initial)}</textarea>
        </label>
        <div class="actions">
          <button class="button" type="button" data-lab-run>${i18n.t("lab.analyze")}</button>
          <button class="button secondary" type="button" data-lab-clear>${i18n.t("lab.clear")}</button>
        </div>
      </section>

      <section class="grid lab-results" data-lab-results aria-live="polite"></section>

      <section class="panel markdown">
        <h2>${i18n.t("lab.sourcesTitle")}</h2>
        <ul>
          <li>${i18n.t("lab.sourceMass")}</li>
          <li>${i18n.t("lab.sourceCharge")}</li>
          <li>${i18n.t("lab.sourceHydro")}</li>
          <li>${i18n.t("lab.sourceAroma")}</li>
          <li>${i18n.t("lab.sourceInstability")}</li>
        </ul>
      </section>
    </section>
  `;
}

export function labAfterRender({ root, i18n }) {
  root.querySelector("[data-lab-run]")?.addEventListener("click", () => runAnalysis(root, i18n));
  root.querySelector("[data-lab-clear]")?.addEventListener("click", () => {
    root.querySelector("[data-lab-sequence]").value = "";
    root.querySelector("[data-lab-results]").innerHTML = "";
  });
  runAnalysis(root, i18n);
}
