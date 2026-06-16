export function createSearch({ input, results, i18n }) {
  let index = [];

  async function loadIndex() {
    const response = await fetch("data/search-index.json");
    index = response.ok ? await response.json() : [];
  }

  function normalize(value) {
    return value.toLocaleLowerCase(i18n.language);
  }

  function close() {
    results.hidden = true;
    results.innerHTML = "";
  }

  function render(items) {
    if (!items.length) {
      results.innerHTML = `<div class="search-result"><strong>${i18n.t("search.noResults")}</strong></div>`;
      results.hidden = false;
      return;
    }

    results.innerHTML = items.map((item) => `
      <a class="search-result" href="${item.url}">
        <strong>${item.title[i18n.language] || item.title.it}</strong>
        <small>${item.type} · ${item.summary[i18n.language] || item.summary.it}</small>
      </a>
    `).join("");
    results.hidden = false;
  }

  function run(query) {
    const q = normalize(query.trim());
    if (q.length < 2) {
      close();
      return;
    }
    const matches = index
      .map((item) => {
        const haystack = normalize([
          item.type,
          item.title.it,
          item.title.en,
          item.summary.it,
          item.summary.en,
          ...(item.keywords || [])
        ].join(" "));
        return { item, score: haystack.includes(q) ? haystack.indexOf(q) + 1 : 0 };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((entry) => entry.item);
    render(matches);
  }

  input?.addEventListener("input", () => run(input.value));
  input?.addEventListener("focus", () => run(input.value));
  document.addEventListener("click", (event) => {
    if (!results.contains(event.target) && event.target !== input) {
      close();
    }
  });

  return {
    async init() {
      await loadIndex();
    },
    async rebuild() {
      await loadIndex();
      run(input.value);
    },
    close
  };
}

