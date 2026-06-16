# Protein Suite

Protein Suite è una web application statica per educazione scientifica su proteine, sequenze FASTA, cataloghi UniProt/PDB e proprietà biochimiche stimate.

> Il progetto nasce da un'idea di **Massimo Bianchini (CNR-IFAC — Istituto di Fisica Applicata "Nello Carrara", CNR)**. La parte tecnica (sviluppo, architettura, dati) è curata da Andrea Manzini (manzolo).

## Requisiti

- Nessun build step.
- Nessun bundler.
- Nessuna dipendenza npm a runtime.
- Percorsi relativi compatibili con GitHub Pages in sottocartella.

## Avvio locale

```sh
make serve
```

La variabile `PORT` permette di cambiare porta:

```sh
make serve PORT=9000
```

## Docker

```sh
make build
make up
```

## Struttura

- `index.html`: shell dell'app.
- `css/`: stili globali responsive e accessibili.
- `js/`: moduli ES6, router, i18n, tema e viste.
- `data/`: manifest, indici e dataset.
- `docs/`: documentazione Markdown bilingue.
- `lang/`: stringhe UI bilingui.
- `assets/`: asset locali.

## Licenza

Il codice originale è distribuito con licenza MIT. I dati scientifici e gli identificativi derivati da fonti esterne sono documentati separatamente in `DATA_LICENSE.md` e `NOTICE.md`.
