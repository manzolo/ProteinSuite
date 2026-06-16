const SOURCES = [
  { name: "UniProt", url: "https://www.uniprot.org/" },
  { name: "RCSB Protein Data Bank", url: "https://www.rcsb.org/" },
  { name: "NCBI", url: "https://www.ncbi.nlm.nih.gov/" },
  { name: "EMBL-EBI", url: "https://www.ebi.ac.uk/" },
  { name: "AlphaFold Database", url: "https://alphafold.ebi.ac.uk/" }
];

const REPO = "https://github.com/manzolo/ProteinSuite";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export async function aboutView({ i18n }) {
  const t = (key) => i18n.t(`about.${key}`);

  const sources = SOURCES.map((source) => `
    <li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a></li>
  `).join("");

  return `
    <section class="page about-page" aria-labelledby="about-title">
      <header class="page-header">
        <h1 id="about-title">${t("title")}</h1>
        <p>${t("lead")}</p>
      </header>

      <div class="grid about-grid">
        <article class="tool-panel">
          <h2>${t("creditsTitle")}</h2>
          <dl class="about-dl">
            <dt>${t("ideaLabel")}</dt>
            <dd>${t("ideaValue")}</dd>
            <dt>${t("techLabel")}</dt>
            <dd>${t("techValue")}</dd>
            <dt>${t("contributeLabel")}</dt>
            <dd>${t("contributeValue")}</dd>
          </dl>
          <div class="actions">
            <a class="button" href="${REPO}/issues" target="_blank" rel="noopener noreferrer">${t("contributeCta")}</a>
          </div>
        </article>

        <article class="tool-panel">
          <h2>${t("sourcesTitle")}</h2>
          <p class="muted">${t("sourcesLead")}</p>
          <ul class="about-sources">${sources}</ul>
        </article>
      </div>

      <article class="tool-panel about-licenses">
        <h2>${t("licenseTitle")}</h2>
        <dl class="about-dl">
          <dt>${t("codeLicenseLabel")}</dt>
          <dd>${t("codeLicenseValue")}</dd>
          <dt>${t("dataLicenseLabel")}</dt>
          <dd>${t("dataLicenseValue")}</dd>
          <dt>${t("constantsLabel")}</dt>
          <dd>${t("constantsValue")}</dd>
        </dl>
      </article>

      <article class="tool-panel about-disclaimer">
        <h2>${t("disclaimerTitle")}</h2>
        <p>${t("disclaimerValue")}</p>
        <div class="actions">
          <a class="button secondary" href="${REPO}/blob/main/NOTICE.md" target="_blank" rel="noopener noreferrer">${t("fullNoticeCta")}</a>
          <a class="button secondary" href="${REPO}/blob/main/DATA_LICENSE.md" target="_blank" rel="noopener noreferrer">${t("fullDataCta")}</a>
        </div>
      </article>
    </section>
  `;
}
