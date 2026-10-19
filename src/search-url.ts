// vjk is the job open in the side pane (it may be one just excluded) and start is the page offset.
const PARAMS_RESET_ON_SEARCH = ["vjk", "start"];

export function buildSearchUrl(current: URL, search: { q: string; l: string }): URL {
  const next = new URL(current);
  next.searchParams.set("q", search.q);
  next.searchParams.set("l", search.l);
  for (const param of PARAMS_RESET_ON_SEARCH) next.searchParams.delete(param);
  return next;
}
