export function createRouter({ root, routes, i18n, afterRender }) {
  function routePartsFromHash() {
    const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    return {
      name: parts[0] || "dashboard",
      params: parts.slice(1).map((part) => decodeURIComponent(part))
    };
  }

  async function renderCurrent() {
    const { name, params } = routePartsFromHash();
    const route = routes[name] || routes.dashboard;
    root.innerHTML = await route.render({ i18n, routeName: name, params });
    route.afterRender?.({ root, i18n, params });
    document.title = `${route.title(i18n)} · Protein Suite`;
    afterRender?.(routes[name] ? name : "dashboard");
  }

  return {
    start() {
      window.addEventListener("hashchange", renderCurrent);
      if (!window.location.hash) {
        window.location.hash = "#/dashboard";
        return;
      }
      renderCurrent();
    },
    renderCurrent
  };
}
