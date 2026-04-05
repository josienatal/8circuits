// ── ROUTER ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');
  const link = document.querySelector(`.nav-links a[data-page="${page}"]`);
  if (link) link.classList.add('active');
  APP_STATE.currentPage = page;
  window.scrollTo(0, 0);
  if (page === 'explore') renderExplore(0);
  if (page === 'assess') renderAssess();
  if (page === 'results') renderResults();
  if (page === 'reflect') renderReflect();
}

// ── HOME ──
function renderHome() {
  const dots = document.getElementById('hero-dots');
  if (dots) {
    dots.innerHTML = CIRCUITS.map((c, i) =>
      `<div class="hero-circuit-dot" id="dot-${i}" onclick="litDot(${i})" title="Circuit ${c.num}: ${c.name}"></div>`
    ).join('');
    animateDots();
  }

  const cards = document.getElementById('home-cards');
  if (cards) {
    cards.innerHTML = CIRCUITS.map((c, i) => `
      <button class="home-card" onclick="navigate('explore'); setTimeout(()=>renderExplore(${i}),50)">
        <div class="home-card-num">0${c.num}</div>
        <div class="home-card-title">${c.name}</div>
        <div class="home-card-desc">${c.keyword} · ${c.tier}</div>
      </button>
    `).join('');
  }
}

let dotInterval;
function animateDots() {
  let i = 0;
  clearInterval(dotInterval);
  dotInterval = setInterval(() => {
    litDot(i % 8);
    i++;
  }, 600);
}

function litDot(idx) {
  document.querySelectorAll('.hero-circuit-dot').forEach((d, i) => {
    d.classList.toggle('lit', i === idx);
  });
}

// ── EXPLORE ──
let activeCircuitIdx = 0;

function renderExplore(idx = activeCircuitIdx) {
  activeCircuitIdx = idx;

  // Sidebar
  const sidebar = document.getElementById('explore-sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-section-label">Terrestrial</div>
      ${CIRCUITS.slice(0,4).map((c, i) => `
        <button class="sidebar-item ${i === idx ? 'active' : ''}" onclick="renderExplore(${i})">
          <span class="sidebar-dot"></span>
          <span>C${c.num} — ${c.name}</span>
        </button>
      `).join('')}
      <div class="sidebar-section-label">Cosmic</div>
      ${CIRCUITS.slice(4).map((c, i) => `
        <button class="sidebar-item ${i+4 === idx ? 'active' : ''}" onclick="renderExplore(${i+4})">
          <span class="sidebar-dot"></span>
          <span>C${c.num} — ${c.name}</span>
        </button>
      `).join('')}
    `;
  }

  const c = CIRCUITS[idx];
  const content = document.getElementById('explore-content');
  if (!content) return;

  const activation = [90, 85, 70, 75, 40, 35, 20, 10][idx];

  content.innerHTML = `
    <div class="fade-in">
      <div class="circuit-eyebrow">Circuit ${c.num} · ${c.tier}</div>
      <div class="circuit-hero-title">${c.name}</div>
      <div class="circuit-keyword">${c.keyword}</div>
      <p class="circuit-desc">${c.description}</p>

      <div class="circuit-grid-2">
        <div class="circuit-panel">
          <div class="panel-label">When stuck</div>
          <p class="panel-text">${c.stuck}</p>
        </div>
        <div class="circuit-panel">
          <div class="panel-label">Practices to activate</div>
          <ul class="practice-list">
            ${c.practices.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="activation-bar-wrap">
        <div class="activation-label">
          <span>Average activation in modern humans</span>
          <span>${activation}%</span>
        </div>
        <div class="activation-track">
          <div class="activation-fill" style="width: 0%" id="act-fill"></div>
        </div>
      </div>

      <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 0.5px solid var(--border); display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="navigate('assess')">Take Assessment →</button>
        <button class="btn" onclick="navigate('reflect'); setTimeout(()=>setReflectCircuit(${idx}), 100)">Journal This Circuit</button>
        ${idx < 7 ? `<button class="btn" onclick="renderExplore(${idx+1})">Next Circuit →</button>` : ''}
      </div>
    </div>
  `;

  setTimeout(() => {
    const fill = document.getElementById('act-fill');
    if (fill) fill.style.width = activation + '%';
  }, 100);
}

// ── ASSESS ──
let assessAnswers = [];
let assessCurrent = 0;
let assessSelected = null;

function renderAssess() {
  assessAnswers = [];
  assessCurrent = 0;
  assessSelected = null;
  renderAssessQuestion();
}

function renderAssessQuestion() {
  const wrap = document.getElementById('assess-wrap');
  if (!wrap) return;

  if (assessCurrent >= CIRCUITS.length) {
    finishAssess();
    return;
  }

  const c = CIRCUITS[assessCurrent];
  assessSelected = null;

  wrap.innerHTML = `
    <div class="fade-in">
      <div class="assess-progress">
        ${CIRCUITS.map((_, i) => `
          <div class="progress-seg ${i < assessCurrent ? 'done' : i === assessCurrent ? 'current' : ''}"></div>
        `).join('')}
      </div>

      <div class="assess-circuit-label">Circuit ${c.num} of 8 · ${c.name}</div>
      <div class="assess-question">${c.question}</div>

      <div class="assess-options" id="assess-opts">
        ${c.options.map((o, i) => `
          <button class="assess-opt" onclick="selectAssessOpt(${i})">${o.text}</button>
        `).join('')}
      </div>

      <div class="assess-nav">
        <button class="btn btn-primary" id="assess-next" onclick="nextAssessQ()" disabled>
          ${assessCurrent < 7 ? 'Next →' : 'See Results →'}
        </button>
      </div>
    </div>
  `;
}

function selectAssessOpt(i) {
  assessSelected = i;
  document.querySelectorAll('.assess-opt').forEach((el, idx) => {
    el.classList.toggle('selected', idx === i);
  });
  const btn = document.getElementById('assess-next');
  if (btn) btn.disabled = false;
}

function nextAssessQ() {
  if (assessSelected === null) return;
  const score = CIRCUITS[assessCurrent].options[assessSelected].score;
  assessAnswers.push(score);
  assessCurrent++;
  assessSelected = null;
  renderAssessQuestion();
}

function finishAssess() {
  APP_STATE.scores = assessAnswers;
  APP_STATE.lastAssessed = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  APP_STATE.save();
  navigate('results');
}

// ── RESULTS ──
function renderResults() {
  const wrap = document.getElementById('results-wrap');
  if (!wrap) return;

  if (!APP_STATE.scores) {
    wrap.innerHTML = `
      <div style="text-align:center; padding: 6rem 2rem;">
        <div class="circuit-eyebrow" style="margin-bottom:1rem;">No assessment yet</div>
        <p style="color:var(--text-muted); margin-bottom:2rem; font-weight:300;">Complete the 8-circuit assessment to see your profile.</p>
        <button class="btn btn-primary" onclick="navigate('assess')">Take Assessment →</button>
      </div>
    `;
    return;
  }

  const scores = APP_STATE.scores;
  const dominantIdx = APP_STATE.getDominantCircuit();
  const strongestIdx = APP_STATE.getStrongestCircuit();
  const dominant = CIRCUITS[dominantIdx];
  const strongest = CIRCUITS[strongestIdx];
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const terrestrialAvg = (scores.slice(0,4).reduce((a,b)=>a+b,0)/4).toFixed(1);
  const cosmicAvg = (scores.slice(4).reduce((a,b)=>a+b,0)/4).toFixed(1);

  const insight = scores[0] <= 2
    ? `Your survival circuit (C1) is low, which means higher circuits are difficult to access — your nervous system is running a threat protocol. The most leveraged thing you can do is focus on <strong>Circuit 1 first</strong>. Safety unlocks everything above it.`
    : `With your survival circuit relatively stable, you have a real foundation to build from. Your weakest point is <strong>Circuit ${dominant.num} (${dominant.name})</strong> at ${scores[dominantIdx]}/4 — this is where your growth edge lives. Your strongest is <strong>Circuit ${strongest.num} (${strongest.name})</strong>.`;

  wrap.innerHTML = `
    <div class="fade-in">
      <div class="results-title">Your Profile</div>
      <div class="results-date">Assessed ${APP_STATE.lastAssessed}</div>

      <div class="results-grid" style="margin-bottom:2.5rem;">
        <div class="result-cell">
          <div class="result-cell-label">Overall average</div>
          <div class="result-cell-value">${avg}<span style="font-size:18px;color:var(--gold-dim)">/4</span></div>
        </div>
        <div class="result-cell">
          <div class="result-cell-label">Growth edge</div>
          <div class="result-cell-value" style="font-size:24px;">${dominant.name}</div>
          <div class="result-cell-sub">Circuit ${dominant.num} · ${scores[dominantIdx]}/4</div>
        </div>
        <div class="result-cell">
          <div class="result-cell-label">Terrestrial avg</div>
          <div class="result-cell-value">${terrestrialAvg}<span style="font-size:18px;color:var(--gold-dim)">/4</span></div>
          <div class="result-cell-sub">Circuits 1–4</div>
        </div>
        <div class="result-cell">
          <div class="result-cell-label">Cosmic avg</div>
          <div class="result-cell-value">${cosmicAvg}<span style="font-size:18px;color:var(--gold-dim)">/4</span></div>
          <div class="result-cell-sub">Circuits 5–8</div>
        </div>
      </div>

      <div class="section-label">Circuit breakdown</div>
      <div class="circuit-bars" id="circuit-bars">
        ${CIRCUITS.map((c, i) => `
          <div class="circuit-bar-row ${i === dominantIdx ? 'weakest' : ''} ${i === strongestIdx ? 'strongest' : ''}"
               onclick="navigate('explore'); setTimeout(()=>renderExplore(${i}),50)">
            <span class="circuit-bar-name">C${c.num} ${c.name}</span>
            <div class="circuit-bar-track">
              <div class="circuit-bar-fill" style="width:0%" data-width="${(scores[i]/4)*100}%"></div>
            </div>
            <span class="circuit-bar-score">${scores[i]}/4</span>
          </div>
        `).join('')}
      </div>

      <div class="insight-block">${insight}</div>

      <div class="results-actions">
        <button class="btn btn-primary" onclick="navigate('reflect'); setTimeout(()=>setReflectCircuit(${dominantIdx}),100)">Journal Circuit ${dominant.num} →</button>
        <button class="btn" onclick="openShareModal()">Share Profile</button>
        <button class="btn" onclick="navigate('assess')">Retake</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.circuit-bar-fill').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 150);
}

// ── REFLECT ──
let reflectCircuitIdx = 0;

function renderReflect() {
  const today = APP_STATE.getTodayPrompts();
  const todayCircuit = CIRCUITS[today.circuitIdx];

  const left = document.getElementById('reflect-left');
  const right = document.getElementById('reflect-right');
  if (!left || !right) return;

  left.innerHTML = `
    <div class="reflect-title">Reflect</div>
    <p class="reflect-sub">Journal prompts drawn from Leary's 8-circuit model. Your responses can be sent to Claude for deeper analysis.</p>

    <div class="today-circuit">
      <div class="today-label">Today's circuit</div>
      <div class="today-name">C${todayCircuit.num} — ${todayCircuit.name}</div>
    </div>

    <div class="section-label" style="margin-bottom:0.75rem;">Or choose a circuit</div>
    <div class="circuit-tabs">
      ${CIRCUITS.map((c, i) => `
        <button class="circuit-tab ${i === reflectCircuitIdx ? 'active' : ''}" onclick="setReflectCircuit(${i})">
          C${c.num} ${c.name}
        </button>
      `).join('')}
    </div>

    <div id="journal-prompts"></div>

    <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="sendToAI()">Reflect with AI →</button>
      <button class="btn" onclick="saveJournal()">Save Entries</button>
    </div>
  `;

  right.innerHTML = `
    <div class="section-label">AI reflection</div>
    <div class="ai-response empty" id="ai-response">
      Write your reflections, then click "Reflect with AI" to receive personalized insights.
    </div>
  `;

  renderJournalPrompts();
}

function setReflectCircuit(idx) {
  reflectCircuitIdx = idx;
  const tabs = document.querySelectorAll('.circuit-tab');
  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  renderJournalPrompts();
}

function renderJournalPrompts() {
  const c = CIRCUITS[reflectCircuitIdx];
  const saved = APP_STATE.journals[reflectCircuitIdx] || {};
  const container = document.getElementById('journal-prompts');
  if (!container) return;

  container.innerHTML = c.journalPrompts.map((prompt, i) => `
    <div class="journal-prompt">
      <div class="journal-prompt-q">${prompt}</div>
      <textarea class="journal-textarea" id="journal-${reflectCircuitIdx}-${i}"
        placeholder="Write freely...">${saved[i] || ''}</textarea>
    </div>
  `).join('');
}

function saveJournal() {
  const c = CIRCUITS[reflectCircuitIdx];
  const entries = {};
  c.journalPrompts.forEach((_, i) => {
    const el = document.getElementById(`journal-${reflectCircuitIdx}-${i}`);
    if (el) entries[i] = el.value;
  });
  APP_STATE.journals[reflectCircuitIdx] = entries;
  APP_STATE.save();
  showToast('Saved');
}

async function sendToAI() {
  const c = CIRCUITS[reflectCircuitIdx];
  const entries = c.journalPrompts.map((prompt, i) => {
    const el = document.getElementById(`journal-${reflectCircuitIdx}-${i}`);
    const val = el?.value?.trim();
    return val ? `Q: ${prompt}\nA: ${val}` : null;
  }).filter(Boolean);

  const responseEl = document.getElementById('ai-response');

  if (entries.length === 0) {
    if (responseEl) {
      responseEl.className = 'ai-response';
      responseEl.textContent = 'Write at least one journal entry first.';
    }
    return;
  }

  if (responseEl) {
    responseEl.className = 'ai-response loading';
    responseEl.textContent = 'Reflecting...';
  }

  const scores = APP_STATE.scores;
  const scoreContext = scores
    ? `The user's circuit assessment: ${CIRCUITS.map((circuit, i) => `C${circuit.num} ${circuit.name}: ${scores[i]}/4`).join(', ')}.`
    : '';

  const system = `You are a thoughtful guide working with someone exploring Timothy Leary's 8-circuit model of consciousness as a self-development framework. ${scoreContext} Be direct, warm, and specific. No jargon. Under 300 words.`;

  const userPrompt = `I've been journaling about Circuit ${c.num}: ${c.name} (${c.keyword}).

My reflections:
${entries.join('\n\n')}

Respond with:
1. What genuine patterns you notice in my responses (specific, not generic)
2. What I might be missing or avoiding (honest, direct)
3. One concrete practice I could do THIS WEEK based specifically on what I wrote`;

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    const text = data.content?.find(b => b.type === 'text')?.text || 'No response.';
    if (responseEl) {
      responseEl.className = 'ai-response fade-in';
      responseEl.textContent = text;
    }
  } catch (err) {
    if (responseEl) {
      responseEl.className = 'ai-response';
      responseEl.textContent = `Error: ${err.message}`;
    }
  }
}

// ── SHARE ──
function openShareModal() {
  if (!APP_STATE.scores) return;
  const modal = document.getElementById('share-modal');
  if (!modal) return;

  const scores = APP_STATE.scores;
  const dominantIdx = APP_STATE.getDominantCircuit();
  const dominant = CIRCUITS[dominantIdx];

  document.getElementById('share-modal-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;">
      <div>
        <div class="circuit-eyebrow">8 Circuits</div>
        <div class="modal-title">My Profile</div>
      </div>
      <button class="modal-close" onclick="closeShareModal()">×</button>
    </div>

    <div class="share-circuit-list">
      ${CIRCUITS.map((c, i) => `
        <div class="share-row">
          <span class="share-row-name">C${c.num} ${c.name}</span>
          <span class="share-row-score">${scores[i]}/4</span>
        </div>
      `).join('')}
    </div>

    <div style="margin-top:1rem;padding:12px;background:var(--surface);border-left:2px solid var(--gold);font-size:13px;color:var(--text-muted);">
      Growth edge: <strong style="color:var(--gold)">C${dominant.num} ${dominant.name}</strong>
    </div>

    <div style="margin-top:1.5rem;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="copyShareText()">Copy Results</button>
      <button class="btn" onclick="closeShareModal()">Close</button>
    </div>
  `;

  modal.classList.add('open');
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('open');
}

function copyShareText() {
  const scores = APP_STATE.scores;
  const dominantIdx = APP_STATE.getDominantCircuit();
  const text = `My 8-Circuit Consciousness Profile\n\n${CIRCUITS.map((c, i) => `C${c.num} ${c.name}: ${scores[i]}/4`).join('\n')}\n\nGrowth edge: C${CIRCUITS[dominantIdx].num} ${CIRCUITS[dominantIdx].name}\n\nDiscover yours at 8circuits.app`;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  navigate('home');
});
