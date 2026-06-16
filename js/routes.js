import { dashboardView } from "./views/dashboard.js";
import { simpleView } from "./views/simple.js";
import { catalogAfterRender, catalogView } from "./views/catalog.js";
import { explorerAfterRender, explorerView } from "./views/explorer.js";
import { labAfterRender, labView } from "./views/lab.js";
import { statisticsView } from "./views/statistics.js";
import { fastaAfterRender, fastaView } from "./views/fasta.js";
import { knowledgeAfterRender, knowledgeView } from "./views/knowledge.js";
import { aboutView } from "./views/about.js";

export const routes = {
  dashboard: {
    title: (i18n) => i18n.t("nav.dashboard"),
    render: dashboardView
  },
  catalog: {
    title: (i18n) => i18n.t("nav.catalog"),
    render: catalogView,
    afterRender: catalogAfterRender
  },
  explorer: {
    title: (i18n) => i18n.t("nav.explorer"),
    render: explorerView,
    afterRender: explorerAfterRender
  },
  lab: {
    title: (i18n) => i18n.t("nav.lab"),
    render: labView,
    afterRender: labAfterRender
  },
  fasta: {
    title: (i18n) => i18n.t("nav.fasta"),
    render: fastaView,
    afterRender: fastaAfterRender
  },
  statistics: {
    title: (i18n) => i18n.t("nav.statistics"),
    render: statisticsView
  },
  knowledge: {
    title: (i18n) => i18n.t("nav.knowledge"),
    render: knowledgeView,
    afterRender: knowledgeAfterRender
  },
  about: {
    title: (i18n) => i18n.t("about.title"),
    render: aboutView
  }
};
