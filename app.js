// Simple prototype data loader
const state = {
  data: null,
  tribe: null,
  lang: null
};

async function loadData() {
  const res = await fetch('assets/dayak-data.json');
  const data = await res.json();
  state.data = data;
  initTribes(data);
  renderArticles();
  renderLibrary();
  renderMarket();
  renderEvents();
  initLang(data);
}

function initTribes(data){
  const select = document.getElementById('tribeSelect');
  select.innerHTML = '';
  data.tribes.forEach(t=>{
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    select.appendChild(opt);
  });
  state.tribe = data.tribes[0].id;
  select.value = state.tribe;
  select.addEventListener('change', e=>{
    state.tribe = e.target.value;
    renderArticles();
  });
  document.getElementById('searchInput').addEventListener('input', renderArticles);
}

function renderArticles(){
  const wrap = document.getElementById('articles');
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const tribe = state.data.content[state.tribe];
  wrap.innerHTML = '';
  tribe.articles
    .filter(a => !q || a.title.toLowerCase().includes(q) || a.tags.join(' ').toLowerCase().includes(q))
    .forEach(a=>{
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<span class="badge">${a.type}</span>
        <h3>${a.title}</h3>
        <p>${a.summary}</p>`;
      wrap.appendChild(div);
    });
}

function renderLibrary(){
  const wrap = document.getElementById('library');
  wrap.innerHTML = '';
  Object.entries(state.data.library).forEach(([type, items])=>{
    items.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<span class="badge">${type}</span>
        <h3>${it.title}</h3>
        <p>${it.note}</p>`;
      wrap.appendChild(div);
    });
  });
}

function renderMarket(){
  const wrap = document.getElementById('market');
  wrap.innerHTML = '';
  state.data.market.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div><span class="badge">${p.suku}</span> &nbsp; <strong>${p.price}</strong></div>`;
    wrap.appendChild(div);
  });
}

function renderEvents(){
  const ul = document.getElementById('events');
  ul.innerHTML = '';
  state.data.events.forEach(ev=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${ev.date}</strong> — ${ev.name} <em>(${ev.location})</em>`;
    ul.appendChild(li);
  });
}

function initLang(data){
  const select = document.getElementById('langSelect');
  select.innerHTML = '';
  data.languages.forEach(l=>{
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = l.name;
    select.appendChild(opt);
  });
  state.lang = data.languages[0].id;
  select.value = state.lang;
  select.addEventListener('change', e=> state.lang = e.target.value);
  document.getElementById('btnTranslate').addEventListener('click', translateWord);
  document.getElementById('langQuery').addEventListener('keydown', (e)=>{
    if(e.key==='Enter') translateWord();
  });
}

function translateWord(){
  const q = (document.getElementById('langQuery').value || '').trim().toLowerCase();
  const out = document.getElementById('langResult');
  if(!q) { out.textContent = 'Masukkan kata untuk diterjemahkan.'; return; }
  const dict = state.data.dictionary[state.lang] || [];
  const found = dict.find(item => item.id.toLowerCase()===q || item.idn.toLowerCase()===q);
  if(found){
    out.innerHTML = `<b>${found.idn}</b> ↔ <b>${found.id}</b><br/><small>Contoh: ${found.example || '-'}</small>`;
  } else {
    out.textContent = 'Belum ada padanan di kamus. Tambah data di versi berikutnya.';
  }
}

loadData();