export function createTheme({ storageKey, root, icon }) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  let explicit = localStorage.getItem(storageKey);

  function currentTheme() {
    return explicit || (media.matches ? "dark" : "light");
  }

  function apply() {
    const theme = currentTheme();
    root.dataset.theme = theme;
    if (icon) {
      icon.textContent = theme === "dark" ? "☾" : "☼";
    }
  }

  return {
    init() {
      apply();
      media.addEventListener("change", () => {
        if (!explicit) {
          apply();
        }
      });
    },
    toggle() {
      explicit = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, explicit);
      apply();
    }
  };
}

