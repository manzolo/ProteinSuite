import { withVersion } from "../core/version.js";

const state = {
  docs: [],
  activeSlug: "introduction",
  cache: new Map()
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      continue;
    }
    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    if (line.startsWith("# ")) html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    else if (line.startsWith("## ")) html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    else if (line.startsWith("### ")) html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
    else html.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  if (listOpen) {
    html.push("</ul>");
  }
  return html.join("");
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}

async function loadDoc(doc, language) {
  const path = doc.path[language] || doc.path.it;
  if (!state.cache.has(path)) {
    const response = await fetch(withVersion(path));
    state.cache.set(path, response.ok ? await response.text() : "");
  }
  return state.cache.get(path);
}

async function renderActive(root, i18n) {
  const doc = state.docs.find((item) => item.slug === state.activeSlug) || state.docs[0];
  state.activeSlug = doc.slug;
  const markdown = await loadDoc(doc, i18n.language);
  root.querySelector("[data-knowledge-breadcrumb]").textContent = `Protein Suite / ${doc.title[i18n.language] || doc.title.it}`;
  root.querySelector("[data-knowledge-content]").innerHTML = renderMarkdown(markdown);
  root.querySelectorAll("[data-doc-link]").forEach((link) => {
    link.toggleAttribute("aria-current", link.dataset.docLink === doc.slug);
  });
}

async function searchDocs(root, i18n) {
  const query = root.querySelector("[data-doc-search]").value.trim().toLowerCase();
  const target = root.querySelector("[data-doc-results]");
  if (query.length < 2) {
    target.innerHTML = "";
    return;
  }
  const matches = [];
  for (const doc of state.docs) {
    const markdown = await loadDoc(doc, i18n.language);
    const haystack = `${doc.title[i18n.language]} ${markdown}`.toLowerCase();
    if (haystack.includes(query)) {
      matches.push(doc);
    }
  }
  target.innerHTML = matches.map((doc) => `
    <button type="button" class="related-item" data-doc-jump="${escapeHtml(doc.slug)}">
      <strong>${escapeHtml(doc.title[i18n.language] || doc.title.it)}</strong>
      <span>${escapeHtml(doc.slug)}</span>
    </button>
  `).join("") || `<p class="muted">${i18n.t("knowledge.noResults")}</p>`;
}

export async function knowledgeView({ i18n, params }) {
  if (!state.docs.length) {
    const response = await fetch(withVersion("data/docs-index.json"));
    state.docs = response.ok ? await response.json() : [];
  }
  state.activeSlug = params[0] || state.activeSlug || "introduction";
  return `
    <section class="page" aria-labelledby="knowledge-title">
      <header class="page-header">
        <h1 id="knowledge-title">${i18n.t("knowledge.title")}</h1>
        <p>${i18n.t("knowledge.subtitle")}</p>
      </header>

      <div class="knowledge-layout">
        <aside class="panel knowledge-nav">
          <label class="field">
            <span>${i18n.t("knowledge.search")}</span>
            <input type="search" data-doc-search placeholder="${i18n.t("knowledge.searchPlaceholder")}">
          </label>
          <div data-doc-results></div>
          <nav aria-label="${i18n.t("knowledge.topics")}">
            ${state.docs.map((doc) => `
              <a href="#/knowledge/${encodeURIComponent(doc.slug)}" data-doc-link="${escapeHtml(doc.slug)}">${escapeHtml(doc.title[i18n.language] || doc.title.it)}</a>
            `).join("")}
          </nav>
        </aside>
        <article class="panel markdown knowledge-content">
          <p class="muted" data-knowledge-breadcrumb></p>
          <div data-knowledge-content></div>
        </article>
      </div>
    </section>
  `;
}

export function knowledgeAfterRender({ root, i18n }) {
  renderActive(root, i18n);
  root.querySelector("[data-doc-search]")?.addEventListener("input", () => searchDocs(root, i18n));
  root.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-doc-jump]");
    if (jump) {
      window.location.hash = `#/knowledge/${encodeURIComponent(jump.dataset.docJump)}`;
    }
  });
}
