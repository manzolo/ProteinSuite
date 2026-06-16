# Data licensing and attribution

Protein Suite separates original application code from third-party scientific data.

## Original code

Original HTML, CSS, JavaScript, JSON structure, and documentation authored for Protein Suite are released under the MIT license in `LICENSE`.

## UniProt-derived catalog index

`data/proteins.json` was generated from UniProt REST API search results on 2026-06-16. The file stores factual identifiers, cross-references, and adapted annotation text:

- UniProt accession
- protein name
- primary gene field
- organism
- protein length
- protein family field, when returned by UniProt
- keywords returned by UniProt
- PDB cross-reference IDs
- outbound links to UniProt and RCSB PDB
- canonical amino acid sequence (`sequence`)
- function text (`function`) and subcellular-location text (`localization`)

UniProtKB data are distributed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). Accordingly, the `function` and `localization` fields are **adapted from UniProtKB under CC BY 4.0**: the source narrative text was retrieved on 2026-06-16 and lightly edited by removing inline literature/evidence citations (e.g. `(PubMed:...)`, `(By similarity)`) for readability. This adaptation is indicated per record in the `source.textLicense` field. Source language is English (`source.textLanguage: "en"`); UI labels are bilingual.

Attribution: data retrieved from UniProtKB, The UniProt Consortium, https://www.uniprot.org/ — © The UniProt Consortium, CC BY 4.0.

- CC BY 4.0: https://creativecommons.org/licenses/by/4.0/
- UniProt license: https://www.uniprot.org/help/license
- UniProt: https://www.uniprot.org/

## RCSB PDB identifiers

Stored PDB IDs were validated against RCSB Data API GraphQL on 2026-06-16. The app stores only PDB identifiers and outbound links, not coordinate files or rendered structure images.

Review the current RCSB PDB usage policies:

- https://www.rcsb.org/pages/policies

## Disclaimer

This repository is an independent educational project. It is not affiliated with, endorsed by, or approved by UniProt, RCSB PDB, wwPDB, NCBI, EMBL-EBI, or AlphaFold Database.

This file is an engineering attribution note, not legal advice.
