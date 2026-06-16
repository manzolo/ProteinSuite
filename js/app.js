import { createI18n } from "./core/i18n.js";
import { createTheme } from "./core/theme.js";
import { createRouter } from "./core/router.js";
import { createSearch } from "./core/search.js";
import { routes } from "./routes.js";

const appRoot = document.querySelector("[data-app-root]");
const sidebar = document.querySelector("[data-sidebar]");
const navToggle = document.querySelector("[data-action='toggle-nav']");

const i18n = createI18n({
  defaultLanguage: "it",
  supportedLanguages: ["it", "en"],
  storageKey: "protein-suite-language"
});

const theme = createTheme({
  storageKey: "protein-suite-theme",
  root: document.documentElement,
  icon: document.querySelector("[data-theme-icon]")
});

const router = createRouter({
  root: appRoot,
  routes,
  i18n,
  afterRender(routeName) {
    document.querySelectorAll("[data-route-link]").forEach((link) => {
      const active = link.dataset.routeLink === routeName;
      link.toggleAttribute("aria-current", active);
    });
    sidebar?.removeAttribute("data-open");
    navToggle?.setAttribute("aria-expanded", "false");
    appRoot.focus({ preventScroll: true });
  }
});

const search = createSearch({
  input: document.querySelector("[data-search-input]"),
  results: document.querySelector("[data-search-results]"),
  i18n
});

document.querySelector("[data-action='toggle-theme']")?.addEventListener("click", () => {
  theme.toggle();
});

document.querySelector("[data-action='toggle-nav']")?.addEventListener("click", () => {
  const open = sidebar?.getAttribute("data-open") !== "true";
  sidebar?.setAttribute("data-open", String(open));
  navToggle?.setAttribute("aria-expanded", String(open));
});

document.querySelector("[data-language-select]")?.addEventListener("change", async (event) => {
  await i18n.setLanguage(event.target.value);
  router.renderCurrent();
  search.rebuild();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    sidebar?.removeAttribute("data-open");
    navToggle?.setAttribute("aria-expanded", "false");
    search.close();
  }
});

await i18n.init();
theme.init();
await search.init();
router.start();

