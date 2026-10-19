export interface PanelState {
  terms: string[];
  missingTermCount: number;
  queryLength: number;
  queryMaxLength: number | null;
}

export interface PanelHandlers {
  onAdd: (term: string) => void;
  onRemove: (term: string) => void;
  onApply: () => void;
}

const STYLES = `
  :host { all: initial; }
  .panel {
    position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
    width: 280px; max-height: 60vh; overflow-y: auto;
    padding: 12px; border-radius: 8px;
    background: #fff; color: #2d2d2d; border: 1px solid #d4d2d0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    font: 14px/1.4 system-ui, sans-serif;
  }
  .heading { margin: 0 0 8px; font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 4px 2px 10px; border-radius: 999px; background: #f3f2f1;
  }
  .chip button {
    border: 0; background: none; cursor: pointer; font-size: 16px; line-height: 1;
    padding: 0 4px; color: #595959;
  }
  .chip button:hover { color: #000; }
  form { display: flex; gap: 6px; }
  input {
    flex: 1; min-width: 0; padding: 6px 8px; font: inherit;
    border: 1px solid #949494; border-radius: 6px;
  }
  .action {
    padding: 6px 12px; border: 0; border-radius: 6px; cursor: pointer;
    background: #2557a7; color: #fff; font: inherit; font-weight: 600;
  }
  .notice { margin: 0 0 10px; padding: 8px; border-radius: 6px; background: #fef6e6; }
  .notice .action { margin-top: 6px; }
  .length { margin: 8px 0 0; color: #595959; font-size: 12px; }
  .length.over { color: #a9252b; font-weight: 600; }
`;

export class Panel {
  private readonly root: ShadowRoot;

  constructor(private readonly handlers: PanelHandlers) {
    const host = document.createElement("div");
    this.root = host.attachShadow({ mode: "open" });
    document.body.append(host);
  }

  render(state: PanelState): void {
    const style = document.createElement("style");
    style.textContent = STYLES;

    const panel = element("div", "panel");
    panel.append(element("p", "heading", `Excluded words (${state.terms.length})`));
    if (state.missingTermCount > 0) panel.append(this.renderNotice(state.missingTermCount));
    panel.append(this.renderChips(state.terms), this.renderAddForm(), renderLength(state));

    this.root.replaceChildren(style, panel);
  }

  private renderNotice(missingTermCount: number): HTMLElement {
    const notice = element(
      "div",
      "notice",
      `${missingTermCount} saved ${missingTermCount === 1 ? "word isn't" : "words aren't"} in this search.`,
    );
    const apply = element("button", "action", "Apply");
    apply.addEventListener("click", () => this.handlers.onApply());
    notice.append(document.createElement("br"), apply);
    return notice;
  }

  private renderChips(terms: string[]): HTMLElement {
    const chips = element("div", "chips");
    for (const term of terms) {
      const chip = element("span", "chip", term);
      const remove = element("button", "", "×");
      remove.title = `Stop excluding "${term}"`;
      remove.addEventListener("click", () => this.handlers.onRemove(term));
      chip.append(remove);
      chips.append(chip);
    }
    return chips;
  }

  private renderAddForm(): HTMLElement {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.placeholder = "Exclude a word or phrase";
    const submit = element("button", "action", "Exclude");
    form.append(input, submit);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handlers.onAdd(input.value);
    });
    return form;
  }
}

function renderLength(state: PanelState): HTMLElement {
  if (state.queryMaxLength === null) {
    return element("p", "length", `Query length: ${state.queryLength}`);
  }
  const over = state.queryLength > state.queryMaxLength;
  return element(
    "p",
    over ? "length over" : "length",
    `Query length: ${state.queryLength} / ${state.queryMaxLength}`,
  );
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const created = document.createElement(tag);
  if (className !== "") created.className = className;
  if (text !== undefined) created.textContent = text;
  return created;
}
