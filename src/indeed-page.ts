export interface SearchForm {
  form: HTMLFormElement;
  what: HTMLInputElement;
  where: HTMLInputElement;
}

export function findSearchForm(): SearchForm | null {
  const form = document.getElementById("jobsearch");
  const what = document.getElementById("text-input-what");
  const where = document.getElementById("text-input-where");
  if (
    !(form instanceof HTMLFormElement) ||
    !(what instanceof HTMLInputElement) ||
    !(where instanceof HTMLInputElement)
  ) {
    return null;
  }
  return { form, what, where };
}

// Indeed's inputs are React-controlled; assigning .value alone is overwritten on the next render,
// so set it through the native setter and fire an input event so React picks it up.
export function setInputValue(input: HTMLInputElement, value: string): void {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
