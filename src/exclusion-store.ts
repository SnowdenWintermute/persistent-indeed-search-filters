const STORAGE_KEY = "excludedTerms";

export async function loadExcludedTerms(): Promise<string[]> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  const value: unknown = stored[STORAGE_KEY];
  if (!Array.isArray(value)) return [];
  return value.filter((term): term is string => typeof term === "string");
}

export async function saveExcludedTerms(terms: string[]): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: terms });
}
