const STANDARD = "ACDEFGHIKLMNPQRSTVWY";
const AMBIGUOUS = "BJOUXZ";

export function parseFasta(input) {
  const text = input.trim();
  if (!text) {
    return [];
  }
  if (!text.startsWith(">")) {
    return [{
      id: "sequence_1",
      description: "Raw sequence",
      sequence: normalizeSequence(text)
    }];
  }

  const records = [];
  let current = null;
  text.split(/\r?\n/).forEach((line) => {
    if (line.startsWith(">")) {
      if (current) {
        current.sequence = normalizeSequence(current.sequence);
        records.push(current);
      }
      const header = line.slice(1).trim() || `sequence_${records.length + 1}`;
      current = {
        id: header.split(/\s+/)[0],
        description: header,
        sequence: ""
      };
      return;
    }
    if (current) {
      current.sequence += line;
    }
  });
  if (current) {
    current.sequence = normalizeSequence(current.sequence);
    records.push(current);
  }
  return records;
}

export function normalizeSequence(sequence) {
  return sequence.toUpperCase().replace(/[^A-Z*]/g, "");
}

export function validateSequence(sequence) {
  const invalid = [...new Set(sequence.replace(/[A-Z*]/g, "").split("").filter(Boolean))];
  const ambiguous = [...new Set(sequence.split("").filter((letter) => AMBIGUOUS.includes(letter)))];
  const stops = (sequence.match(/\*/g) || []).length;
  const standardLength = sequence.split("").filter((letter) => STANDARD.includes(letter)).length;
  return {
    validForCalculation: invalid.length === 0 && stops === 0 && ambiguous.length === 0 && standardLength > 0,
    invalid,
    ambiguous,
    stops,
    standardLength
  };
}

function counts(sequence) {
  return [...STANDARD].reduce((acc, letter) => {
    acc[letter] = (sequence.match(new RegExp(letter, "g")) || []).length;
    return acc;
  }, {});
}

export function molecularWeight(sequence, constants, mode = "average") {
  const masses = constants.residueMasses[mode];
  return sequence.split("").reduce((sum, letter) => sum + (masses[letter] || 0), constants.water[mode]);
}

export function netCharge(sequence, constants, pH) {
  const c = counts(sequence);
  const pka = constants.pka;
  const positive = (
    1 / (1 + 10 ** (pH - pka.nTerm)) +
    c.K / (1 + 10 ** (pH - pka.sideChains.K)) +
    c.R / (1 + 10 ** (pH - pka.sideChains.R)) +
    c.H / (1 + 10 ** (pH - pka.sideChains.H))
  );
  const negative = (
    1 / (1 + 10 ** (pka.cTerm - pH)) +
    c.D / (1 + 10 ** (pka.sideChains.D - pH)) +
    c.E / (1 + 10 ** (pka.sideChains.E - pH)) +
    c.C / (1 + 10 ** (pka.sideChains.C - pH)) +
    c.Y / (1 + 10 ** (pka.sideChains.Y - pH))
  );
  return positive - negative;
}

export function isoelectricPoint(sequence, constants) {
  let low = 0;
  let high = 14;
  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    if (netCharge(sequence, constants, mid) > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function gravy(sequence, constants) {
  return sequence.split("").reduce((sum, letter) => sum + constants.kyteDoolittle[letter], 0) / sequence.length;
}

export function hydrophobicityProfile(sequence, constants, windowSize) {
  const size = Math.max(1, Math.min(windowSize, sequence.length));
  const profile = [];
  for (let i = 0; i <= sequence.length - size; i += 1) {
    const fragment = sequence.slice(i, i + size);
    profile.push({
      position: i + 1,
      value: gravy(fragment, constants)
    });
  }
  return profile;
}

export function aromaticity(sequence) {
  const aromatic = (sequence.match(/[FWY]/g) || []).length;
  return aromatic / sequence.length;
}

export function instabilityIndex(sequence, constants) {
  if (sequence.length < 2) {
    return 0;
  }
  let score = 0;
  for (let i = 0; i < sequence.length - 1; i += 1) {
    score += constants.diwv[sequence[i]][sequence[i + 1]];
  }
  return (10 / sequence.length) * score;
}

export function composition(sequence) {
  const c = counts(sequence);
  return Object.entries(c).map(([letter, count]) => ({
    letter,
    count,
    fraction: sequence.length ? count / sequence.length : 0
  }));
}

export function analyzeSequence(record, constants, options = {}) {
  const validation = validateSequence(record.sequence);
  const sequence = record.sequence.split("").filter((letter) => STANDARD.includes(letter)).join("");
  if (!validation.validForCalculation) {
    return { record, validation, sequence, error: "Sequence contains ambiguous, stop, or invalid symbols." };
  }
  const pH = Number(options.pH ?? 7);
  const windowSize = Number(options.windowSize ?? 9);
  return {
    record,
    validation,
    sequence,
    length: sequence.length,
    molecularWeightAverage: molecularWeight(sequence, constants, "average"),
    molecularWeightMonoisotopic: molecularWeight(sequence, constants, "monoisotopic"),
    netCharge: netCharge(sequence, constants, pH),
    pI: isoelectricPoint(sequence, constants),
    gravy: gravy(sequence, constants),
    hydrophobicityProfile: hydrophobicityProfile(sequence, constants, windowSize),
    aromaticity: aromaticity(sequence),
    instabilityIndex: instabilityIndex(sequence, constants),
    composition: composition(sequence)
  };
}
