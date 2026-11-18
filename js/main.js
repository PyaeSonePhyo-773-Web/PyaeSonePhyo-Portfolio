document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const menu = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menu?.addEventListener('click', () => nav.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  document.getElementById('year').textContent = new Date().getFullYear();

  // Fetch the public repositories for the connected GitHub profile.
  // Curated project cards remain visible if the API is unavailable or rate-limited.
  const username = 'PyaeSonePhyo-773-Web';
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    .then(response => {
      if (!response.ok) throw new Error('GitHub API unavailable');
      return response.json();
    })
    .then(repos => {
      if (!Array.isArray(repos) || !repos.length) return;
      const section = document.createElement('div');
      section.className = 'live-repos';
      section.innerHTML = `<div class="live-repos-heading"><span class="section-index">LIVE FROM GITHUB</span><span class="live-indicator"><i></i> PUBLIC REPOSITORIES</span></div><div class="live-repo-grid"></div>`;
      const grid = section.querySelector('.live-repo-grid');
      repos.slice(0, 6).forEach(repo => {
        const card = document.createElement('a');
        card.className = 'live-repo-card';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noreferrer';
        const title = document.createElement('h4');
        title.textContent = repo.name;
        const desc = document.createElement('p');
        desc.dataset.fallback = String(!repo.description);
        desc.textContent = repo.description || (document.documentElement.lang === 'ja' ? 'ソースコードとプロジェクトの記録。' : 'Source code and project notes.');
        const meta = document.createElement('span');
        meta.textContent = `${repo.language || 'Code'}  ·  ★ ${repo.stargazers_count}`;
        card.append(title, desc, meta);
        grid.append(card);
      });
      document.querySelector('#projects .project-grid').after(section);
      setPortfolioLanguage(document.documentElement.lang);
    })
    .catch(() => {});
});
// Full bilingual content switcher. Keep copy in translations.js for easy maintenance.
function setPortfolioLanguage(lang) {
  const selected = lang === 'ja' ? 'ja' : 'en';
  document.documentElement.lang = selected;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const entry = window.portfolioCopy?.[el.dataset.i18n];
    if (entry) el.textContent = entry[selected];
  });
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = selected === 'ja'
    ? 'Pyae Sone Phyoのポートフォリオ。AWS、Linux、ネットワーク、DevOpsを学ぶクラウドエンジニア志望。'
    : 'Pyae Sone Phyo — aspiring Cloud Engineer focused on AWS, Linux, networking and DevOps.';
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === selected;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  // Translate dynamically loaded GitHub section without changing repository names/descriptions.
  const liveTitle = document.querySelector('.live-repos-heading .section-index');
  const liveStatus = document.querySelector('.live-repos-heading .live-indicator');
  if (liveTitle) liveTitle.textContent = selected === 'ja' ? 'GitHubの最新情報' : 'LIVE FROM GITHUB';
  if (liveStatus) liveStatus.textContent = selected === 'ja' ? '● 公開リポジトリ' : '● PUBLIC REPOSITORIES';
  document.querySelectorAll('.live-repo-card p').forEach(el => {
    if (el.dataset.fallback === 'true') el.textContent = selected === 'ja' ? 'ソースコードとプロジェクトの記録。' : 'Source code and project notes.';
  });
  try { localStorage.setItem('portfolio-language', selected); } catch (_) {}
}
document.querySelectorAll('.lang-btn').forEach(btn =>
  btn.addEventListener('click', () => setPortfolioLanguage(btn.dataset.lang))
);
let initialLang = 'en';
try { initialLang = localStorage.getItem('portfolio-language') || 'en'; } catch (_) {}
setPortfolioLanguage(initialLang);
