# Protein Suite

**[🇮🇹 Italiano](README.md) · 🇬🇧 English**

> 🌐 **Live app:** https://manzolo.github.io/ProteinSuite/

Protein Suite is a **static, free, bilingual (IT/EN)** web application built to **learn what proteins are** starting from scratch — with no assumptions about your background in biology, chemistry, or computing.

The idea is simple: take real scientific data (real proteins, with their actual UniProt and PDB codes) and make it **explorable and understandable** even if you've never studied biochemistry. No formulas dropped out of nowhere: every tool explains what it does, where the numbers come from, and which sources it uses.

## Who it's for

- **Curious people** who want to understand how a protein is made, what a FASTA sequence means, why a protein has a certain charge or structure.
- **Students and teachers** looking for a clear teaching tool, in both Italian and English.
- Anyone getting into **bioinformatics** who wants to look "under the hood" at real calculations (molecular weight, pI, hydrophobicity, instability index…) with the scientific sources clearly stated.

Nothing to install, no account, no technical skills required: **just open the site**.

## What you can do

- **Dashboard** — a starting overview.
- **Protein Catalog** — 294 real proteins with verified UniProt and PDB codes, filterable and searchable.
- **Protein Explorer** — a detail page for each protein.
- **Protein Lab** — real, citable biochemical calculations on any sequence.
- **FASTA Manager** — load, validate, and manage FASTA sequences.
- **Statistics** — distributions and figures from the catalog.
- **Knowledge Center** — a small bilingual handbook: from the basics ("what is an amino acid") up to scientific deep-dives.

Plus automatic light/dark theme, full-text search, and keyboard navigation.

## The spirit of the project

This is not a commercial product nor a certified lab tool: it is an **independent educational project**, created to share and to learn. The computed values are **didactic estimates** based on published methods — useful for understanding, not for clinical or research decisions.

The project originates from an idea by **Massimo Bianchini (CNR-IFAC — "Nello Carrara" Institute of Applied Physics, Italian National Research Council)**; the technical work (development, architecture, data) is by **Andrea Manzi** ([@manzolo](https://github.com/manzolo)).

## Every contribution is welcome 🙌

Truly any kind of help is valuable, **even if you can't code**:

- 🐛 Found a bug, a typo, or wrong data? [Open an issue](https://github.com/manzolo/ProteinSuite/issues).
- 📚 Want to improve an explanation or its translation? The Knowledge Center texts are plain Markdown files in `docs/it/` and `docs/en/`.
- 💡 Got an idea, a protein to add, a teaching suggestion? Drop it in an issue — plain words are fine.
- 💻 Comfortable with code? Send a pull request: it's all native HTML, CSS, and JavaScript, no frameworks.

There are no "too basic" questions. If something isn't clear to you, it probably isn't clear to others either — pointing it out **is** a contribution.

## Local server

There's no build to run. You only need a small static server.

```sh
make serve
```

Override the port (default 8080):

```sh
make serve PORT=9000
```

Or with Docker (nginx):

```sh
make build
make up
```

## How it's built (for the curious)

A **100% static** site: no build, no bundler, no runtime dependencies. Just HTML5, CSS3, and ES6 JavaScript (native modules). All paths are relative, so it behaves identically on GitHub Pages, `python3 -m http.server`, and nginx.

- `index.html` — app shell.
- `css/` — responsive and accessible styles.
- `js/` — ES6 modules: router, bilingual system, theme, and views.
- `data/` — protein dataset (JSON), scientific constants, and search indexes.
- `docs/` — bilingual Markdown documentation.
- `lang/` — UI strings (it/en).
- `assets/` — local icons and resources.

## Sources and licenses

The original code is released under the **MIT** license (`LICENSE`).

Scientific data comes from public sources and is attributed accordingly: the catalog's function and subcellular-location texts are **adapted from UniProtKB under CC BY 4.0**. Full details on sources, attribution, and disclaimer are in **[`NOTICE.md`](NOTICE.md)** and **[`DATA_LICENSE.md`](DATA_LICENSE.md)**.

Protein Suite is an independent educational project, **not affiliated with or endorsed by** UniProt, RCSB PDB, NCBI, EMBL-EBI, or AlphaFold Database.
