import { loadExcludedTerms, saveExcludedTerms } from "./exclusion-store";
import { findSearchForm, setInputValue, type SearchForm } from "./indeed-page";
import { Panel } from "./panel";
import { buildQuery, mergeTerms, normalizeTerm, parseQuery } from "./query";
import { buildSearchUrl } from "./search-url";

async function main(): Promise<void> {
  const currentUrl = new URL(location.href);
  const current = parseQuery(currentUrl.searchParams.get("q") ?? "");
  const currentWhere = currentUrl.searchParams.get("l") ?? "";
  const searchForm = findSearchForm();

  const storedTerms = await loadExcludedTerms();
  const terms = mergeTerms(storedTerms, current.excluded);
  if (terms.length !== storedTerms.length) await saveExcludedTerms(terms);

  if (searchForm !== null) {
    setInputValue(searchForm.what, current.positive);
    interceptSearch(searchForm, currentUrl, terms);
  }

  async function rerunSearch(nextTerms: string[]): Promise<void> {
    await saveExcludedTerms(nextTerms);
    const q = buildQuery(current.positive, nextTerms);
    location.assign(buildSearchUrl(currentUrl, { q, l: currentWhere }));
  }

  const panel = new Panel({
    onAdd: (input) => {
      const term = normalizeTerm(input);
      if (term === "" || terms.includes(term)) return;
      void rerunSearch([...terms, term]);
    },
    onRemove: (term) => void rerunSearch(terms.filter((existing) => existing !== term)),
    onApply: () => void rerunSearch(terms),
  });
  panel.render({
    terms,
    missingTermCount: terms.filter((term) => !current.excluded.includes(term)).length,
    queryLength: buildQuery(current.positive, terms).length,
    queryMaxLength: searchForm === null || searchForm.what.maxLength < 0 ? null : searchForm.what.maxLength,
  });
}

// Indeed's own submit rebuilds the URL from the form action, which drops filters such as
// salaryType. Take over the submit so only q and l change.
function interceptSearch(searchForm: SearchForm, currentUrl: URL, savedTerms: string[]): void {
  window.addEventListener(
    "submit",
    (event) => {
      if (event.target !== searchForm.form) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      const typed = parseQuery(searchForm.what.value);
      const terms = mergeTerms(savedTerms, typed.excluded);
      const q = buildQuery(typed.positive, terms);
      void saveExcludedTerms(terms).then(() =>
        location.assign(buildSearchUrl(currentUrl, { q, l: searchForm.where.value.trim() })),
      );
    },
    { capture: true },
  );
}

void main();
