# Protein Suite

**🇮🇹 Italiano · [🇬🇧 English](README.en.md)**

> 🌐 **App online:** https://manzolo.github.io/ProteinSuite/

Protein Suite è una web application **statica, gratuita e bilingue (IT/EN)** pensata per **imparare cosa sono le proteine** partendo da zero, senza dare per scontate competenze di biologia, chimica o informatica.

L'idea è semplice: prendere dati scientifici reali (proteine vere, con i loro codici UniProt e PDB) e renderli **esplorabili e comprensibili** anche a chi non ha mai studiato biochimica. Niente formule calate dall'alto: ogni strumento spiega cosa fa, da dove vengono i numeri e quali fonti usa.

## A chi è rivolto

- A chi è **curioso** e vuole capire come è fatta una proteina, cosa significa una sequenza FASTA, perché una proteina ha una certa carica o struttura.
- A **studenti e docenti** che cercano uno strumento didattico chiaro, in italiano e in inglese.
- A chi si avvicina alla **bioinformatica** e vuole vedere "sotto il cofano" calcoli reali (peso molecolare, pI, idrofobicità, indice di instabilità…) con le fonti scientifiche dichiarate.

Non serve installare nulla, non serve un account, non servono competenze tecniche: **basta aprire il sito**.

## Cosa puoi fare

- **Dashboard** — punto di partenza con una panoramica.
- **Catalogo proteine** — 294 proteine reali con codici UniProt e PDB verificati, filtrabili e ricercabili.
- **Protein Explorer** — scheda di dettaglio di ogni proteina.
- **Protein Lab** — calcoli biochimici reali e citabili su qualsiasi sequenza.
- **FASTA Manager** — carica, valida e gestisci sequenze in formato FASTA.
- **Statistiche** — distribuzioni e numeri del catalogo.
- **Knowledge Center** — un piccolo manuale bilingue: dalle basi ("cos'è un amminoacido") fino agli approfondimenti scientifici.

Più tema chiaro/scuro automatico, ricerca full-text e navigazione da tastiera.

## Lo spirito del progetto

Questo non è un prodotto commerciale né uno strumento di laboratorio certificato: è un **progetto educativo indipendente**, nato per condividere e imparare. I valori calcolati sono **stime didattiche** basate su metodi pubblicati — utili per capire, non per prendere decisioni cliniche o di ricerca.

Il progetto nasce da un'idea di **Massimo Bianchini (CNR-IFAC — Istituto di Fisica Applicata "Nello Carrara", CNR)**; la parte tecnica (sviluppo, architettura, dati) è curata da **Andrea Manzi** ([@manzolo](https://github.com/manzolo)).

## Ogni contributo è benvenuto 🙌

Davvero ogni tipo di aiuto è prezioso, **anche se non sai programmare**:

- 🐛 Hai trovato un errore, un refuso o un dato sbagliato? [Apri una issue](https://github.com/manzolo/ProteinSuite/issues).
- 📚 Vuoi migliorare una spiegazione o tradurla meglio? I testi del Knowledge Center sono semplici file Markdown in `docs/it/` e `docs/en/`.
- 💡 Hai un'idea, una proteina da aggiungere, un suggerimento didattico? Scrivilo in una issue, anche solo a parole.
- 💻 Sai mettere mano al codice? Fai una pull request: è tutto HTML, CSS e JavaScript nativo, senza framework.

Non esistono domande "troppo banali". Se qualcosa non ti è chiaro, probabilmente non è chiaro nemmeno ad altri: segnalarlo **è** un contributo.

## Avvio locale

Non c'è nessuna build da fare. Ti serve solo un piccolo server statico.

```sh
make serve
```

Per cambiare porta (default 8080):

```sh
make serve PORT=9000
```

In alternativa, con Docker (nginx):

```sh
make build
make up
```

## Com'è fatto (per i curiosi)

Sito **100% statico**: nessuna build, nessun bundler, nessuna dipendenza a runtime. Solo HTML5, CSS3 e JavaScript ES6 (moduli nativi). Tutti i percorsi sono relativi, così funziona identico su GitHub Pages, `python3 -m http.server` e nginx.

- `index.html` — shell dell'app.
- `css/` — stili responsive e accessibili.
- `js/` — moduli ES6: router, sistema bilingue, tema e viste.
- `data/` — dataset proteico (JSON), costanti scientifiche e indici di ricerca.
- `docs/` — documentazione bilingue in Markdown.
- `lang/` — stringhe dell'interfaccia (it/en).
- `assets/` — icone e risorse locali.

## Fonti e licenze

Il codice originale è rilasciato sotto licenza **MIT** (`LICENSE`).

I dati scientifici provengono da fonti pubbliche e sono attribuiti come dovuto: i testi di funzione e localizzazione del catalogo sono **adattati da UniProtKB sotto licenza CC BY 4.0**. Dettagli completi su fonti, attribuzioni e disclaimer in **[`NOTICE.md`](NOTICE.md)** e **[`DATA_LICENSE.md`](DATA_LICENSE.md)**.

Protein Suite è un progetto educativo indipendente, **non affiliato né approvato** da UniProt, RCSB PDB, NCBI, EMBL-EBI o AlphaFold Database.
