# Notice

Protein Suite è un progetto educativo indipendente, non affiliato né approvato dalle istituzioni citate.

Protein Suite is an independent educational project and is not affiliated with or endorsed by the referenced institutions.

## Crediti / Credits

Il progetto Protein Suite nasce da un'idea di **Massimo Bianchini (CNR-IFAC — Istituto di Fisica Applicata "Nello Carrara", Consiglio Nazionale delle Ricerche)**. La realizzazione tecnica (sviluppo software, architettura, dati) è curata da Andrea Manzini (manzolo).

Protein Suite originates from an idea by **Massimo Bianchini (CNR-IFAC — "Nello Carrara" Institute of Applied Physics, Italian National Research Council)**. Technical implementation (software development, architecture, data) is by Andrea Manzini (manzolo).

## Fonti scientifiche e dati

- UniProt: https://www.uniprot.org/
- RCSB Protein Data Bank: https://www.rcsb.org/
- NCBI: https://www.ncbi.nlm.nih.gov/
- EMBL-EBI: https://www.ebi.ac.uk/
- AlphaFold Database: https://alphafold.ebi.ac.uk/

I dati scientifici inclusi devono essere usati per fini educativi e verificati rispetto alle licenze e alle condizioni d'uso delle fonti originali prima di riuso esteso o ridistribuzione.

## Dataset catalogo

Il file `data/proteins.json` contiene 294 voci ottenute il 16 giugno 2026 da UniProt REST API (voci `reviewed` Swiss-Prot con cross-reference PDB), classificate per categoria. Ogni voce conserva identificativi, nomi, gene primario, organismo, lunghezza, famiglie, keyword, cross-reference PDB, link e testo di funzione e localizzazione.

I campi `function` e `localization` sono **adattati da UniProtKB sotto licenza Creative Commons Attribution 4.0 International (CC BY 4.0)**: il testo è stato recuperato il 16 giugno 2026 e modificato rimuovendo le citazioni bibliografiche inline (`(PubMed:...)`, `(By similarity)`) per leggibilità. L'adattamento è dichiarato per ciascuna voce nel campo `source.textLicense`. Attribuzione: dati UniProtKB, The UniProt Consortium (https://www.uniprot.org/), © The UniProt Consortium, CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Gli ID PDB memorizzati sono cross-reference UniProt `xref_pdb` validati contro RCSB Data API GraphQL; il report locale è in `data/catalog-validation.json`.

The `function` and `localization` fields are **adapted from UniProtKB under CC BY 4.0**; per-record attribution is recorded in `source.textLicense`. See `DATA_LICENSE.md` for full attribution details.

La distinzione tra codice MIT e dati/fonti di terze parti è documentata in `DATA_LICENSE.md`.

## Metodi previsti per Protein Lab

- Kyte J. and Doolittle R.F. (1982), hydropathy scale for GRAVY and sliding-window hydrophobicity.
- Lobry J.R. (1994), aromaticity as the fraction of Phe, Trp, and Tyr.
- Guruprasad K., Reddy B.V.B., Pandit M.W. (1990), instability index and DIWV matrix.
- ExPASy/EMBOSS pKa sets for net charge and isoelectric point estimates.

Le costanti numeriche complete sono mantenute in `data/protein-constants.json`. La matrice DIWV è stata cross-checkata con Biopython `ProtParamData.py`, distribuito con Biopython License Agreement/BSD 3-Clause License; le fonti scientifiche primarie sono dichiarate nel file JSON e nella UI del Protein Lab.
