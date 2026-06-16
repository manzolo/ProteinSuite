export function createI18n({ defaultLanguage, supportedLanguages, storageKey }) {
  let language = localStorage.getItem(storageKey) || defaultLanguage;
  let dictionary = {};

  async function load(lang) {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Cannot load language file: ${lang}`);
    }
    return response.json();
  }

  function get(path, fallback = path) {
    const value = path.split(".").reduce((node, key) => node?.[key], dictionary);
    return typeof value === "string" ? value : fallback;
  }

  function applyDocument() {
    document.documentElement.lang = language;
    document.querySelector("[data-language-select]").value = language;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = get(node.dataset.i18n, node.textContent);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = get(node.dataset.i18nPlaceholder, node.placeholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", get(node.dataset.i18nAriaLabel, node.getAttribute("aria-label") || ""));
    });
  }

  return {
    async init() {
      if (!supportedLanguages.includes(language)) {
        language = defaultLanguage;
      }
      dictionary = await load(language);
      applyDocument();
    },
    async setLanguage(nextLanguage) {
      if (!supportedLanguages.includes(nextLanguage)) {
        return;
      }
      language = nextLanguage;
      localStorage.setItem(storageKey, language);
      dictionary = await load(language);
      applyDocument();
    },
    t: get,
    get language() {
      return language;
    }
  };
}

