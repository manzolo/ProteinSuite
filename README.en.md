# Protein Suite

Protein Suite is a static web application for science education about proteins, FASTA sequences, UniProt/PDB catalogs, and estimated biochemical properties.

> The project originates from an idea by **Massimo Bianchini (CNR-IFAC — "Nello Carrara" Institute of Applied Physics, Italian National Research Council)**. Technical work (development, architecture, data) is by Andrea Manzini (manzolo).

## Requirements

- No build step.
- No bundler.
- No runtime npm dependency.
- Relative paths compatible with GitHub Pages under a subdirectory.

## Local server

```sh
make serve
```

Override the port with `PORT`:

```sh
make serve PORT=9000
```

## Docker

```sh
make build
make up
```

## Structure

- `index.html`: app shell.
- `css/`: responsive and accessible global styles.
- `js/`: ES6 modules, router, i18n, theme, and views.
- `data/`: manifests, indexes, and datasets.
- `docs/`: bilingual Markdown documentation.
- `lang/`: bilingual UI strings.
- `assets/`: local assets.

## License

Original code is released under the MIT license. Scientific data and identifiers derived from external sources are documented separately in `DATA_LICENSE.md` and `NOTICE.md`.
