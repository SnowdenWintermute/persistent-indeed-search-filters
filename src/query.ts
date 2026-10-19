export interface ParsedQuery {
  positive: string;
  excluded: string[];
}

// Matches -"several words" or -word
const EXCLUSION_PATTERN = /(?:^|\s)-(?:"([^"]*)"|([^\s"]+))/g;

export function parseQuery(q: string): ParsedQuery {
  const excluded: string[] = [];
  const positive = q.replace(EXCLUSION_PATTERN, (_match, quoted?: string, bare?: string) => {
    const term = normalizeTerm(quoted ?? bare ?? "");
    if (term !== "") excluded.push(term);
    return " ";
  });
  return { positive: collapseSpaces(positive), excluded };
}

export function buildQuery(positive: string, excluded: string[]): string {
  return [collapseSpaces(positive), ...excluded.map((term) => `-"${term}"`)]
    .filter((part) => part !== "")
    .join(" ");
}

export function normalizeTerm(term: string): string {
  return collapseSpaces(term.replaceAll('"', "")).toLowerCase();
}

export function mergeTerms(existing: string[], added: string[]): string[] {
  const merged = [...existing];
  for (const term of added) {
    if (!merged.includes(term)) merged.push(term);
  }
  return merged;
}

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
