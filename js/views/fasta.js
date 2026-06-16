import { normalizeSequence, parseFasta, validateSequence } from "../core/protein-analysis.js";

const sample = `>GFP_AEQVI Green fluorescent protein
MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK
>INS_HUMAN Insulin
MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrapSequence(sequence, width = 60) {
  return sequence.match(new RegExp(`.{1,${width}}`, "g"))?.join("\n") || "";
}

function normalizedFasta(records) {
  return records.map((record, index) => {
    const id = record.id || `sequence_${index + 1}`;
    return `>${id} ${record.description === id ? "" : record.description}`.trim() + `\n${wrapSequence(normalizeSequence(record.sequence).replace(/\*/g, ""))}`;
  }).join("\n\n");
}

function renderRecords(records, i18n) {
  if (!records.length) {
    return `<p class="muted">${i18n.t("fasta.empty")}</p>`;
  }
  return `
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>${i18n.t("fasta.id")}</th>
            <th>${i18n.t("fasta.length")}</th>
            <th>${i18n.t("fasta.status")}</th>
            <th>${i18n.t("fasta.issues")}</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => {
            const validation = validateSequence(record.sequence);
            const issues = [
              validation.ambiguous.length ? `${i18n.t("fasta.ambiguous")}: ${validation.ambiguous.join(", ")}` : "",
              validation.stops ? `${i18n.t("fasta.stops")}: ${validation.stops}` : "",
              validation.invalid.length ? `${i18n.t("fasta.invalid")}: ${validation.invalid.join(", ")}` : ""
            ].filter(Boolean).join("; ") || "-";
            return `
              <tr>
                <td><strong>${escapeHtml(record.id)}</strong><span class="muted block">${escapeHtml(record.description)}</span></td>
                <td>${record.sequence.length}</td>
                <td><span class="tag">${validation.validForCalculation ? i18n.t("fasta.ready") : i18n.t("fasta.review")}</span></td>
                <td>${escapeHtml(issues)}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function update(root, i18n) {
  const input = root.querySelector("[data-fasta-input]");
  const records = parseFasta(input.value);
  const output = normalizedFasta(records);
  root.querySelector("[data-fasta-output]").value = output;
  root.querySelector("[data-fasta-summary]").innerHTML = `
    <article class="stat-card"><span class="muted">${i18n.t("fasta.records")}</span><strong>${records.length}</strong></article>
    <article class="stat-card"><span class="muted">${i18n.t("fasta.totalLength")}</span><strong>${records.reduce((sum, record) => sum + record.sequence.length, 0)}</strong></article>
    <article class="stat-card"><span class="muted">${i18n.t("fasta.valid")}</span><strong>${records.filter((record) => validateSequence(record.sequence).validForCalculation).length}</strong></article>
  `;
  root.querySelector("[data-fasta-records]").innerHTML = renderRecords(records, i18n);
}

function download(root) {
  const output = root.querySelector("[data-fasta-output]").value;
  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "protein-suite-normalized.fasta";
  link.click();
  URL.revokeObjectURL(url);
}

export async function fastaView({ i18n }) {
  return `
    <section class="page" aria-labelledby="fasta-title">
      <header class="page-header">
        <h1 id="fasta-title">${i18n.t("fasta.title")}</h1>
        <p>${i18n.t("fasta.subtitle")}</p>
      </header>

      <div class="split-workspace">
        <section class="tool-panel">
          <label class="field">
            <span>${i18n.t("fasta.input")}</span>
            <textarea data-fasta-input spellcheck="false">${sample}</textarea>
          </label>
          <div class="actions">
            <button class="button" type="button" data-fasta-normalize>${i18n.t("fasta.normalize")}</button>
            <button class="button secondary" type="button" data-fasta-download>${i18n.t("fasta.download")}</button>
            <button class="button secondary" type="button" data-fasta-clear>${i18n.t("fasta.clear")}</button>
          </div>
        </section>
        <section class="tool-panel">
          <label class="field">
            <span>${i18n.t("fasta.output")}</span>
            <textarea data-fasta-output spellcheck="false" readonly></textarea>
          </label>
        </section>
      </div>

      <section class="grid" data-fasta-summary></section>
      <section class="panel" data-fasta-records></section>
    </section>
  `;
}

export function fastaAfterRender({ root, i18n }) {
  root.querySelector("[data-fasta-normalize]")?.addEventListener("click", () => update(root, i18n));
  root.querySelector("[data-fasta-input]")?.addEventListener("input", () => update(root, i18n));
  root.querySelector("[data-fasta-download]")?.addEventListener("click", () => download(root));
  root.querySelector("[data-fasta-clear]")?.addEventListener("click", () => {
    root.querySelector("[data-fasta-input]").value = "";
    update(root, i18n);
  });
  update(root, i18n);
}
