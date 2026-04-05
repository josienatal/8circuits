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
  if (page === 'progress') renderProgress();
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
        <button class="btn btn-primary" onclick="openPlanModal(${dominantIdx}, ${scores[dominantIdx]})">Get a Plan →</button>
        <button class="btn" onclick="navigate('reflect'); setTimeout(()=>setReflectCircuit(${dominantIdx}),100)">Journal Circuit ${dominant.num}</button>
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


// ── PLAN ──
async function openPlanModal(circuitIdx, score) {
  const modal = document.getElementById('share-modal');
  const modalContent = document.getElementById('share-modal-content');
  if (!modal || !modalContent) return;

  const c = CIRCUITS[circuitIdx];
  const scores = APP_STATE.scores;

  modalContent.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;">
      <div>
        <div class="circuit-eyebrow">Circuit ${c.num} · ${c.name}</div>
        <div class="modal-title">Your Plan</div>
      </div>
      <button class="modal-close" onclick="closeShareModal()">×</button>
    </div>
    <div class="ai-response loading" id="plan-response">Building your plan...</div>
    <div id="plan-actions" style="display:none;margin-top:1rem;display:none;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="savePlan()">Save Plan</button>
      <button class="btn" onclick="copyPlan()">Copy to Clipboard</button>
      <button class="btn" onclick="closeShareModal()">Close</button>
    </div>
  `;

  modal.classList.add('open');

  const scoreContext = scores
    ? scores.map((s, i) => `C${CIRCUITS[i].num} ${CIRCUITS[i].name}: ${s}/4`).join(', ')
    : '';

  const system = `You are a direct, practical guide helping someone work with Timothy Leary's 8-circuit model as a self-development tool. Give concrete, specific advice. No jargon. No fluff.`;

  const userPrompt = `My weakest circuit is Circuit ${c.num} (${c.name}) — I scored ${score}/4.
My full profile: ${scoreContext}.

Give me the most practical steps I can take THIS WEEK to strengthen Circuit ${c.num}. Be specific — day by day if helpful, concrete actions, not generic advice. Under 350 words.`;

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
    const el = document.getElementById('plan-response');
    if (el) {
      el.className = 'ai-response fade-in';
      el.textContent = text;
      window._currentPlan = { text, circuitIdx };
    }
    const actions = document.getElementById('plan-actions');
    if (actions) actions.style.display = 'flex';
  } catch (err) {
    const el = document.getElementById('plan-response');
    if (el) {
      el.className = 'ai-response';
      el.textContent = `Error: ${err.message}`;
    }
  }
}

function savePlan() {
  if (!window._currentPlan) return;
  APP_STATE.savePlan(window._currentPlan.text, window._currentPlan.circuitIdx);
  showToast('Plan saved');
}

function copyPlan() {
  if (!window._currentPlan) return;
  const c = CIRCUITS[window._currentPlan.circuitIdx];
  const text = `My 8 Circuits Plan — Circuit ${c.num}: ${c.name}\n\n${window._currentPlan.text}`;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
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


// ── PROGRESS ──
function renderProgress() {
  const wrap = document.getElementById('progress-wrap');
  if (!wrap) return;

  const checkins = APP_STATE.checkins;
  const savedPlan = APP_STATE.savedPlan;
  const hasCheckins = checkins.length > 0;

  wrap.innerHTML = `
    <div class="progress-layout">

      <div class="progress-main">
        <div class="progress-header">
          <div class="results-title">Progress</div>
          <button class="btn btn-primary" onclick="openCheckinModal()">Weekly Check-in →</button>
        </div>

        ${!hasCheckins ? `
          <div class="progress-empty">
            <p style="font-size:18px;color:var(--text-muted);font-weight:300;margin-bottom:1rem;">No check-ins yet.</p>
            <p style="font-size:16px;color:var(--text-dim);font-weight:300;">Complete a weekly check-in to start tracking how your circuits shift over time.</p>
          </div>
        ` : `
          <div class="section-label" style="margin-top:2rem;">Circuit trends</div>
          <div class="trend-chart" id="trend-chart"></div>
          <div class="checkin-history" id="checkin-history"></div>
        `}
      </div>

      <div class="progress-sidebar">
        ${savedPlan ? `
          <div class="saved-plan-block">
            <div class="section-label">Saved plan</div>
            <div class="saved-plan-circuit">C${savedPlan.circuitIdx + 1} ${CIRCUITS[savedPlan.circuitIdx].name}</div>
            <div class="saved-plan-date">${new Date(savedPlan.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div class="saved-plan-text">${savedPlan.plan}</div>
            <div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;">
              <button class="btn" onclick="copyPlanFromSaved()">Copy</button>
              <button class="btn" onclick="clearPlan()">Clear</button>
            </div>
          </div>
        ` : `
          <div class="saved-plan-block empty-plan">
            <div class="section-label">Saved plan</div>
            <p style="font-size:16px;color:var(--text-dim);font-weight:300;line-height:1.7;">No plan saved yet. Generate one from your Results page.</p>
            <button class="btn" style="margin-top:1rem;" onclick="navigate('results')">Go to Results</button>
          </div>
        `}
      </div>

    </div>
  `;

  if (hasCheckins) {
    renderTrendChart();
    renderCheckinHistory();
  }
}

function renderTrendChart() {
  const chart = document.getElementById('trend-chart');
  if (!chart) return;

  const checkins = APP_STATE.checkins.slice(-8); // last 8 weeks
  const w = chart.offsetWidth || 600;
  const h = 200;
  const padL = 40, padR = 20, padT = 16, padB = 32;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const cols = ['#2176c7','#1a5fa0','#7a9ab8','#c8d8e8','#003b6f','#4a8fc0','#93b8d8','#e8f0f8'];

  const xStep = checkins.length > 1 ? chartW / (checkins.length - 1) : chartW;

  let paths = CIRCUITS.map((c, ci) => {
    const pts = checkins.map((chk, i) => {
      const x = padL + (checkins.length > 1 ? i * xStep : chartW / 2);
      const y = padT + chartH - ((chk.scores[ci] - 1) / 3) * chartH;
      return `${x},${y}`;
    });
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${cols[ci]}" stroke-width="1.5" opacity="0.7"/>`;
  }).join('');

  let dots = CIRCUITS.map((c, ci) =>
    checkins.map((chk, i) => {
      const x = padL + (checkins.length > 1 ? i * xStep : chartW / 2);
      const y = padT + chartH - ((chk.scores[ci] - 1) / 3) * chartH;
      return `<circle cx="${x}" cy="${y}" r="3" fill="${cols[ci]}" opacity="0.9"><title>C${c.num} ${c.name}: ${chk.scores[ci]}/4</title></circle>`;
    }).join('')
  ).join('');

  // Y axis labels
  const yLabels = [1,2,3,4].map(v => {
    const y = padT + chartH - ((v - 1) / 3) * chartH;
    return `<text x="${padL - 8}" y="${y + 4}" fill="#2a4a68" font-size="12" text-anchor="end">${v}</text>`;
  }).join('');

  // X axis dates
  const xLabels = checkins.map((chk, i) => {
    const x = padL + (checkins.length > 1 ? i * xStep : chartW / 2);
    const d = new Date(chk.date);
    const label = `${d.getMonth()+1}/${d.getDate()}`;
    return `<text x="${x}" y="${h - 6}" fill="#2a4a68" font-size="11" text-anchor="middle">${label}</text>`;
  }).join('');

  // Grid lines
  const gridLines = [1,2,3,4].map(v => {
    const y = padT + chartH - ((v - 1) / 3) * chartH;
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#0a1f35" stroke-width="1"/>`;
  }).join('');

  chart.innerHTML = `
    <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="overflow:visible">
      ${gridLines}${paths}${dots}${yLabels}${xLabels}
    </svg>
    <div class="chart-legend">
      ${CIRCUITS.map((c, ci) => `
        <span class="legend-item">
          <span class="legend-dot" style="background:${cols[ci]}"></span>
          C${c.num} ${c.name}
        </span>
      `).join('')}
    </div>
  `;
}

function renderCheckinHistory() {
  const el = document.getElementById('checkin-history');
  if (!el) return;

  const checkins = [...APP_STATE.checkins].reverse();

  el.innerHTML = `
    <div class="section-label" style="margin-top:2.5rem;">Check-in history</div>
    ${checkins.map((chk, i) => {
      const d = new Date(chk.date);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const dominant = chk.scores.indexOf(Math.min(...chk.scores));
      const strongest = chk.scores.indexOf(Math.max(...chk.scores));
      return `
        <div class="checkin-card">
          <div class="checkin-card-header">
            <span class="checkin-date">${dateStr}</span>
            <button class="checkin-delete" onclick="deleteCheckin(${APP_STATE.checkins.length - 1 - i})">×</button>
          </div>
          <div class="checkin-scores">
            ${CIRCUITS.map((c, ci) => `
              <div class="checkin-score-row">
                <span class="checkin-circuit-name ${ci === dominant ? 'low' : ci === strongest ? 'high' : ''}"">C${c.num} ${c.name}</span>
                <div class="checkin-bar-track">
                  <div class="checkin-bar-fill" style="width:${(chk.scores[ci]/4)*100}%"></div>
                </div>
                <span class="checkin-score-val">${chk.scores[ci]}/4</span>
              </div>
            `).join('')}
          </div>
          ${chk.note ? `<p class="checkin-note">${chk.note}</p>` : ''}
        </div>
      `;
    }).join('')}
  `;
}

function deleteCheckin(idx) {
  APP_STATE.checkins.splice(idx, 1);
  APP_STATE.save();
  renderProgress();
}

function copyPlanFromSaved() {
  const p = APP_STATE.savedPlan;
  if (!p) return;
  const c = CIRCUITS[p.circuitIdx];
  navigator.clipboard.writeText(`My 8 Circuits Plan — C${c.num} ${c.name}\n\n${p.plan}`)
    .then(() => showToast('Copied'));
}

function clearPlan() {
  APP_STATE.savedPlan = null;
  APP_STATE.save();
  renderProgress();
}

// ── CHECK-IN MODAL ──
function openCheckinModal() {
  const modal = document.getElementById('share-modal');
  const content = document.getElementById('share-modal-content');
  if (!modal || !content) return;

  const prev = APP_STATE.scores || Array(8).fill(2);

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;">
      <div>
        <div class="circuit-eyebrow">Weekly</div>
        <div class="modal-title">Check-in</div>
      </div>
      <button class="modal-close" onclick="closeShareModal()">×</button>
    </div>

    <p style="font-size:16px;color:var(--text-muted);margin-bottom:1.5rem;font-weight:300;">Rate each circuit honestly — where are you right now, this week?</p>

    <div id="checkin-sliders">
      ${CIRCUITS.map((c, i) => `
        <div class="checkin-slider-row">
          <div class="checkin-slider-label">
            <span>C${c.num} ${c.name}</span>
            <span class="checkin-slider-val" id="val-${i}">${prev[i]}/4</span>
          </div>
          <input type="range" min="1" max="4" step="1" value="${prev[i]}"
            oninput="document.getElementById('val-${i}').textContent=this.value+'/4'"
            id="slider-${i}" style="width:100%;"/>
        </div>
      `).join('')}
    </div>

    <div style="margin-top:1.5rem;">
      <div class="api-key-label">Note (optional)</div>
      <textarea class="journal-textarea" id="checkin-note" placeholder="How are you feeling this week?" style="min-height:64px;margin-top:6px;"></textarea>
    </div>

    <div style="display:flex;gap:8px;margin-top:1.25rem;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="submitCheckin()">Save Check-in</button>
      <button class="btn" onclick="closeShareModal()">Cancel</button>
    </div>
  `;

  modal.classList.add('open');
}

function submitCheckin() {
  const scores = CIRCUITS.map((_, i) => parseInt(document.getElementById(`slider-${i}`)?.value || 2));
  const note = document.getElementById('checkin-note')?.value?.trim() || '';
  APP_STATE.addCheckin(scores, note);
  closeShareModal();
  showToast('Check-in saved');
  navigate('progress');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  navigate('home');
});
