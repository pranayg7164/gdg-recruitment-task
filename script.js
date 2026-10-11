// ---------- Data ----------
const STORAGE_KEY = "resource-hub-data";
const THEME_KEY = "resource-hub-theme";
const CATEGORIES = ["All", "Web Dev", "App Dev", "AI/ML", "Tools"];

// Starter resources shown the first time someone opens the site
const SEED = [
  { id: 1, title: "MDN Web Docs", category: "Web Dev", description: "The reference for HTML, CSS and JavaScript, with examples.", link: "https://developer.mozilla.org", votes: 12, upvoted: false, custom: false },
  { id: 2, title: "Flutter Docs", category: "App Dev", description: "Build Android, iOS and web apps from one codebase.", link: "https://docs.flutter.dev", votes: 9, upvoted: false, custom: false },
  { id: 3, title: "Google AI Studio", category: "AI/ML", description: "Try Gemini models and prototype prompts in the browser.", link: "https://aistudio.google.com", votes: 8, upvoted: false, custom: false },
  { id: 4, title: "GitHub Docs", category: "Tools", description: "Learn Git, pull requests and GitHub Pages step by step.", link: "https://docs.github.com", votes: 7, upvoted: false, custom: false },
  { id: 5, title: "javascript.info", category: "Web Dev", description: "A modern JavaScript tutorial, from basics to advanced topics.", link: "https://javascript.info", votes: 6, upvoted: false, custom: false },
  { id: 6, title: "Google Cloud Skills Boost", category: "Tools", description: "Hands-on cloud labs and learning paths.", link: "https://www.cloudskillsboost.google", votes: 5, upvoted: false, custom: false },
];

let resources = loadResources();
let activeCategory = "All";
let query = "";

// ---------- Storage (wrapped in try/catch in case storage is blocked) ----------
function loadResources() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* fall back to seed data */ }
  return SEED;
}
function saveResources() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(resources)); } catch (e) { /* ignore */ }
}

// ---------- Elements ----------
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
const formEl = document.getElementById("addForm");
const errorEl = document.getElementById("formError");
const themeBtn = document.getElementById("themeToggle");

// ---------- Render ----------
function getVisible() {
  const q = query.trim().toLowerCase();
  return resources
    .filter(r => activeCategory === "All" || r.category === activeCategory)
    .filter(r => !q || (r.title + " " + r.description + " " + r.category).toLowerCase().includes(q))
    .sort((a, b) => b.votes - a.votes); // most upvoted first
}

function renderFilters() {
  filtersEl.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(cat === activeCategory));
    btn.addEventListener("click", () => { activeCategory = cat; renderFilters(); renderList(); });
    filtersEl.appendChild(btn);
  });
}

function renderList() {
  const items = getVisible();
  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;

  items.forEach(r => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.cat = r.category;

    // textContent (not innerHTML) so user input can never inject HTML/scripts
    const cat = document.createElement("p");
    cat.className = "cat";
    cat.textContent = r.category;

    const title = document.createElement("h3");
    title.textContent = r.title;

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = r.description;

    const row = document.createElement("div");
    row.className = "row";

    const link = document.createElement("a");
    link.href = r.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open resource";

    const vote = document.createElement("button");
    vote.className = "vote";
    vote.setAttribute("aria-pressed", String(r.upvoted));
    vote.setAttribute("aria-label", "Upvote " + r.title);
    vote.textContent = "▲ " + r.votes;
    vote.addEventListener("click", () => toggleVote(r.id));

    row.append(link, vote);
    card.append(cat, title, desc, row);

    if (r.custom) {
      const rm = document.createElement("button");
      rm.className = "remove";
      rm.textContent = "Remove";
      rm.addEventListener("click", () => removeResource(r.id));
      card.appendChild(rm);
    }
    listEl.appendChild(card);
  });
}

// ---------- Actions ----------
// One vote per visitor per resource: clicking again takes the vote back (stops spam-liking)
function toggleVote(id) {
  const r = resources.find(x => x.id === id);
  if (!r) return;
  r.upvoted = !r.upvoted;
  r.votes += r.upvoted ? 1 : -1;
  saveResources();
  renderList();
}

function removeResource(id) {
  resources = resources.filter(r => r.id !== id);
  saveResources();
  renderList();
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = !msg;
}

formEl.addEventListener("submit", e => {
  e.preventDefault(); // stop the page from refreshing
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!title || !description || !link) return showError("Fill in the title, description and link.");

  // Validate the link: must parse as a URL and use http or https
  let url;
  try { url = new URL(link); } catch (err) { return showError("Enter a full link, starting with https://"); }
  if (!["http:", "https:"].includes(url.protocol)) return showError("Only http and https links are allowed.");

  resources.push({ id: Date.now(), title, category, description, link: url.href, votes: 0, upvoted: false, custom: true });
  saveResources();
  showError("");
  formEl.reset();
  renderList();
});

searchEl.addEventListener("input", () => { query = searchEl.value; renderList(); }); // live search on every keystroke

// ---------- Theme ----------
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}
function initTheme() {
  let theme = null;
  try { theme = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  if (!theme) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(theme);
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
});

// ---------- Start ----------
initTheme();
renderFilters();
renderList();
