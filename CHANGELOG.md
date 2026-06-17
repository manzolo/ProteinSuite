# Changelog

Tutte le modifiche rilevanti al progetto sono annotate qui, dalla più recente.

## 2026-06-17 — Malattie genetiche

### Contesto
Il catalogo proteine (`data/proteins.json`) è curato per **funzione** (10 categorie,
~32 proteine ciascuna, criterio "UniProt reviewed + struttura PDB"), non per
associazione a malattie: per questo mancavano proteine note come SMN. Il gap è stato
colmato su due livelli.

### Aggiunte al catalogo funzionale — commit `4f3376b`
6 proteine monogeniche celebri inserite nelle categorie esistenti, con dati reali da
UniProt (sequenza, lunghezza, PDB, famiglia, localizzazione, funzione) e nuovo campo
`disease`:

| Proteina | Gene / UniProt | Categoria | Malattia |
|---|---|---|---|
| Survival motor neuron | SMN1 / Q16637 | RNA Binding | Atrofia muscolare spinale |
| CFTR | CFTR / P13569 | Transport | Fibrosi cistica |
| Hemoglobin β | HBB / P68871 | Transport | Anemia falciforme / β-talassemia |
| Phenylalanine hydroxylase | PAH / P00439 | Enzyme | Fenilchetonuria |
| β-hexosaminidase α | HEXA / P06865 | Enzyme | Malattia di Tay-Sachs |
| Dystrophin | DMD / P11532 | Structural | Distrofia di Duchenne/Becker |

Catalogo 294 → 300; indice di ricerca aggiornato (SMN ora ricercabile);
`data/proteins.json` validato rispetto a `data/protein-schema.json`.

### Nuova vista "Malattie genetiche" — commit `3f7ea61`
Pagina stand-alone `#/diseases`, separata dal Lab (nessun calcolo biochimico).
Struttura descrittiva per voce: **gene → proteina/enzima difettoso → tipo di danno →
malattia → decorso clinico → terapie**.

- `data/diseases.json`: 6 malattie curate, contenuto bilingue IT/EN, codici e link OMIM.
- `js/views/diseases.js`: filtro testuale, card descrittive, deep-link con scroll alla
  singola malattia, link "Apri nel catalogo" verso `#/explorer/<id>`.
- Route, navigazione, i18n IT/EN, CSS, manifest dashboard, cache-busting (`APP_VERSION`).
- 6 entry `type:"disease"` in `data/search-index.json`.
- `data/proteins.json` non modificato.

Fonti dati biomedici: MedlinePlus Genetics e FDA (terapie geniche approvate per SCD e DMD).

### Come estendere
Per aggiungere malattie: appendere a `data/diseases.json` (stesso schema bilingue),
aggiungere la entry `type:"disease"` nell'indice di ricerca e incrementare `APP_VERSION`.
Mantenere il set **curato** (non importare in massa migliaia di geni OMIM). L'italiano
usa accenti veri (à/è/é/ì/ò/ù), non apostrofi sostitutivi.
