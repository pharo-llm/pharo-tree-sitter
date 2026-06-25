import { Parser, Language } from "https://unpkg.com/web-tree-sitter@0.25.8/tree-sitter.js";

await Parser.init({
  locateFile(scriptName, scriptDirectory) {
    return `https://unpkg.com/web-tree-sitter@0.25.8/${scriptName}`;
  },
});

const parser = new Parser();

const els = {
  wasmPath: document.getElementById("wasmPath"),
  loadGrammar: document.getElementById("loadGrammar"),
  parseBtn: document.getElementById("parseBtn"),
  liveParse: document.getElementById("liveParse"),
  code: document.getElementById("code"),
  tree: document.getElementById("tree"),
  query: document.getElementById("query"),
  runQuery: document.getElementById("runQuery"),
  queryOut: document.getElementById("queryOut"),
};

els.wasmPath.value = "tree-sitter-pharo.wasm";

let currentLang = null;
let currentTree = null;

els.loadGrammar.addEventListener("click", async () => {
  const path = (els.wasmPath.value || "").trim();
  if (!path) return alert("Please enter a path or URL for your grammar .wasm");
  try {
    els.loadGrammar.disabled = true;
    els.loadGrammar.textContent = "Loading…";
    currentLang = await Language.load(path);
    parser.setLanguage(currentLang);
    els.parseBtn.disabled = false;
    els.runQuery.disabled = false;
    els.loadGrammar.textContent = "Loaded";
    parseNow();
  } catch (err) {
    console.error(err);
    alert("Failed to load grammar .wasm. Check the path and CORS settings.");
  } finally {
    els.loadGrammar.disabled = false;
    setTimeout(() => (els.loadGrammar.textContent = "Load grammar"), 1200);
  }
});

els.parseBtn.addEventListener("click", () => parseNow());

els.code.addEventListener("input", () => {
  if (els.liveParse.checked) parseNow();
});

window.addEventListener("keydown", (ev) => {
  if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
    ev.preventDefault();
    parseNow();
  }
});

els.runQuery.addEventListener("click", () => runQuery());

function buildLineStarts(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) {
    if (src[i] === "\n") starts.push(i + 1);
  }
  return starts;
}

function posToIndex(lineStarts, pos) {
  return (lineStarts[pos.row] ?? 0) + pos.column;
}

let lineStarts = [];
let lastActiveNodeEl = null;

function clearActiveTreeNode() {
  if (lastActiveNodeEl) lastActiveNodeEl.classList.remove("ts-node--active");
  lastActiveNodeEl = null;
}

function activateTreeNode(el) {
  clearActiveTreeNode();
  el.classList.add("ts-node--active");
  lastActiveNodeEl = el;
}

function highlightEditorRange(start, end) {
  const ta = els.code;
  ta.focus();
  ta.setSelectionRange(start, end, "none");

  requestAnimationFrame(() => {
    ta.setSelectionRange(start, end, "forward");
  });
}

function renderNode(node) {
  const container = document.createElement("div");
  container.className = "ts-node";

  const label = document.createElement("div");
  label.className = "ts-label";
  label.textContent = `${node.type} [${node.startPosition.row}:${node.startPosition.column} → ${node.endPosition.row}:${node.endPosition.column}]`;
  container.appendChild(label);

  const startIdx = posToIndex(lineStarts, node.startPosition);
  const endIdx = posToIndex(lineStarts, node.endPosition);

  label.addEventListener("click", (ev) => {
    ev.stopPropagation();
    activateTreeNode(container);
    highlightEditorRange(startIdx, endIdx);
  });

  const kids = node.namedChildren || [];
  if (kids.length) {
    const wrap = document.createElement("div");
    wrap.className = "ts-children";
    for (const child of kids) {
      wrap.appendChild(renderNode(child));
    }
    container.appendChild(wrap);
  }
  return container;
}

function parseNow() {
  if (!currentLang) return;
  const src = els.code.value;
  lineStarts = buildLineStarts(src);
  currentTree = parser.parse(src);

  els.tree.innerHTML = "";
  els.tree.appendChild(renderNode(currentTree.rootNode));
}


function runQuery() {
  if (!currentLang) return;
  const q = els.query.value.trim();
  if (!q) { els.queryOut.textContent = "Enter a query."; return; }
  try {
    const Query = currentLang.query(q);
    const cursor = Query.matches(currentTree.rootNode);
    const lines = [];
    for (const m of cursor) {
      lines.push("Match:");
      for (const cap of m.captures) {
        lines.push(
          `  @${cap.name} -> ${cap.node.type} [${cap.node.startPosition.row}:${cap.node.startPosition.column} → ${cap.node.endPosition.row}:${cap.node.endPosition.column}]`);
      }
    }
    els.queryOut.textContent = lines.join("\n") || "(no matches)";
  } catch (err) {
    console.error(err);
    els.queryOut.textContent = String(err);
  }
}
