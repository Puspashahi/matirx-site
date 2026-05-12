(() => {
  const STORAGE_KEY = "matrix.settings.v1";
  const DEFAULT_PLACEHOLDERS = ["IP", "USERNAME", "PASSWORD", "DOMAIN", "LHOST", "PORT", "TOKEN", "USER_ID"];
  const commands = window.MATRIX_COMMANDS || [];

  const $ = (id) => document.getElementById(id);
  const els = {
    search: $("searchInput"),
    section: $("sectionFilter"),
    category: $("categoryFilter"),
    sort: $("sortSelect"),
    pageSize: $("pageSizeSelect"),
    placeholderInputs: $("placeholderInputs"),
    commandList: $("commandList"),
    template: $("commandTemplate"),
    resultCount: $("resultCount"),
    activeSummary: $("activeSummary"),
    prev: $("prevPage"),
    next: $("nextPage"),
    pageInfo: $("pageInfo"),
    clearPlaceholders: $("clearPlaceholders"),
    resetAll: $("resetAll"),
  };

  const state = loadState();

  function loadState() {
    try {
      return {
        query: "",
        section: "All",
        category: "All",
        sort: "section",
        pageSize: 10,
        page: 1,
        placeholders: {},
        ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
      };
    } catch {
      return { query: "", section: "All", category: "All", sort: "section", pageSize: 10, page: 1, placeholders: {} };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function unique(values) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }

  function optionList(select, values, selected) {
    select.innerHTML = "";
    for (const value of ["All", ...values]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      if (value === selected) option.selected = true;
      select.appendChild(option);
    }
  }

  function allPlaceholders() {
    return unique([...DEFAULT_PLACEHOLDERS, ...commands.flatMap((c) => c.placeholders || [])]);
  }

  function renderPlaceholderInputs() {
    els.placeholderInputs.innerHTML = "";
    for (const name of allPlaceholders()) {
      const label = document.createElement("label");
      label.textContent = `{{${name}}}`;
      const input = document.createElement("input");
      input.placeholder = exampleFor(name);
      input.value = state.placeholders[name] || "";
      input.addEventListener("input", () => {
        state.placeholders[name] = input.value;
        saveState();
        render();
      });
      label.appendChild(input);
      els.placeholderInputs.appendChild(label);
    }
  }

  function exampleFor(name) {
    return {
      IP: "10.10.10.10",
      USERNAME: "admin",
      PASSWORD: "password123",
      DOMAIN: "example.local",
      LHOST: "10.10.14.2",
      PORT: "8080",
      TOKEN: "eyJ...",
      USER_ID: "1001",
    }[name] || "value";
  }

  function applyPlaceholders(command) {
    return command.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (match, key) => {
      const value = state.placeholders[key];
      return value ? value : match;
    });
  }

  function matchesQuery(command, query) {
    if (!query) return true;
    const haystack = [command.title, command.description, command.section, command.category, command.command, command.pack]
      .join(" ")
      .toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
  }

  function getFiltered() {
    const filtered = commands.filter((c) => {
      return (state.section === "All" || c.section === state.section)
        && (state.category === "All" || c.category === state.category)
        && matchesQuery(c, state.query);
    });

    filtered.sort((a, b) => {
      if (state.sort === "title") return a.title.localeCompare(b.title);
      if (state.sort === "category") return `${a.category}${a.title}`.localeCompare(`${b.category}${b.title}`);
      return `${a.section}${a.category}${a.title}`.localeCompare(`${b.section}${b.category}${b.title}`);
    });
    return filtered;
  }

  function updateCategoryOptions() {
    const categories = unique(commands
      .filter((c) => state.section === "All" || c.section === state.section)
      .map((c) => c.category));
    if (state.category !== "All" && !categories.includes(state.category)) state.category = "All";
    optionList(els.category, categories, state.category);
  }

  function renderControls() {
    optionList(els.section, unique(commands.map((c) => c.section)), state.section);
    updateCategoryOptions();
    els.search.value = state.query;
    els.sort.value = state.sort;
    els.pageSize.value = String(state.pageSize);
  }

  function render() {
    const filtered = getFiltered();
    const pages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * state.pageSize;
    const current = filtered.slice(start, start + state.pageSize);

    els.commandList.innerHTML = "";
    if (!current.length) {
      els.commandList.innerHTML = `<div class="panel empty">No commands found. Try another search or filter.</div>`;
    }

    for (const command of current) {
      const node = els.template.content.cloneNode(true);
      const article = node.querySelector("article");
      const code = applyPlaceholders(command.command);
      article.querySelector(".meta").textContent = `${command.section} / ${command.category}`;
      article.querySelector("h3").textContent = command.title;
      article.querySelector(".description").textContent = command.description;
      article.querySelector("code").textContent = code;

      const chips = article.querySelector(".chips");
      for (const ph of command.placeholders || []) {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = `{{${ph}}}`;
        chips.appendChild(chip);
      }
      const copy = article.querySelector(".copy-btn");
      copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(code);
        copy.textContent = "Copied";
        copy.classList.add("copied");
        setTimeout(() => { copy.textContent = "Copy"; copy.classList.remove("copied"); }, 1100);
      });
      els.commandList.appendChild(node);
    }

    els.resultCount.textContent = `${filtered.length} command${filtered.length === 1 ? "" : "s"}`;
    els.activeSummary.textContent = `Section: ${state.section} • Category: ${state.category} • Search: ${state.query || "none"}`;
    els.pageInfo.textContent = `Page ${state.page} of ${pages}`;
    els.prev.disabled = state.page <= 1;
    els.next.disabled = state.page >= pages;
    saveState();
  }

  function bindEvents() {
    els.search.addEventListener("input", () => { state.query = els.search.value; state.page = 1; render(); });
    els.section.addEventListener("change", () => { state.section = els.section.value; state.category = "All"; state.page = 1; updateCategoryOptions(); render(); });
    els.category.addEventListener("change", () => { state.category = els.category.value; state.page = 1; render(); });
    els.sort.addEventListener("change", () => { state.sort = els.sort.value; render(); });
    els.pageSize.addEventListener("change", () => { state.pageSize = Number(els.pageSize.value); state.page = 1; render(); });
    els.prev.addEventListener("click", () => { state.page -= 1; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    els.next.addEventListener("click", () => { state.page += 1; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    els.clearPlaceholders.addEventListener("click", () => { state.placeholders = {}; renderPlaceholderInputs(); render(); });
    els.resetAll.addEventListener("click", () => {
      state.query = "";
      state.section = "All";
      state.category = "All";
      state.sort = "section";
      state.pageSize = 10;
      state.page = 1;
      renderControls();
      render();
    });
  }

  renderControls();
  renderPlaceholderInputs();
  bindEvents();
  render();
})();
