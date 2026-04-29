// ── CONSTANTS ──────────────────────────────────────────────────
const META_DIARIA = 5000;
const VALOR_EXCEDENTE = 2.70;
const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const DAYS_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

// ── STORAGE ────────────────────────────────────────────────────
const DB = {
  key: 'contratos_ops_v1',

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || { weeks: [] };
    } catch { return { weeks: [] }; }
  },

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  getWeek(weekId) {
    const db = this.load();
    return db.weeks.find(w => w.id === weekId) || null;
  },

  saveWeek(week) {
    const db = this.load();
    const idx = db.weeks.findIndex(w => w.id === week.id);
    if (idx >= 0) db.weeks[idx] = week;
    else db.weeks.unshift(week);
    this.save(db);
  },

  deleteWeek(weekId) {
    const db = this.load();
    db.weeks = db.weeks.filter(w => w.id !== weekId);
    this.save(db);
  },

  allWeeks() {
    return this.load().weeks.sort((a, b) => b.id.localeCompare(a.id));
  }
};

// ── CALCULATIONS ───────────────────────────────────────────────
function calcDay(day) {
  const feitos = day.feitos || 0;
  const excAprovado = day.excedente_aprovado || 0;
  const custoExc = excAprovado * VALOR_EXCEDENTE;
  const metaAtingida = feitos >= META_DIARIA;
  const pct = day.enviados > 0 ? ((feitos / day.enviados) * 100) : 0;
  return { feitos, excAprovado, custoExc, metaAtingida, pct };
}

function calcWeek(week) {
  const dias = week.dias || [];
  const totalEnviados = dias.reduce((a, d) => a + (d.enviados || 0), 0);
  const totalFeitos = dias.reduce((a, d) => a + (d.feitos || 0), 0);
  const totalExcAprovado = dias.reduce((a, d) => a + (d.excedente_aprovado || 0), 0);
  const totalErros = dias.reduce((a, d) => a + (d.erros || 0), 0);
  const totalErrosDist = dias.reduce((a, d) => a + (d.erros_distribuidora || 0), 0);
  const totalErrosSist = dias.reduce((a, d) => a + (d.erros_sistema || 0), 0);
  const totalErrosStatus = dias.reduce((a, d) => a + (d.erros_status || 0), 0);
  const custoTotal = totalExcAprovado * VALOR_EXCEDENTE;
  const diasMeta = dias.filter(d => (d.feitos || 0) >= META_DIARIA).length;
  const pct = totalEnviados > 0 ? ((totalFeitos / totalEnviados) * 100) : 0;
  return {
    totalEnviados, totalFeitos, totalExcAprovado,
    totalErros, totalErrosDist, totalErrosSist, totalErrosStatus,
    custoTotal, diasMeta, pct
  };
}

// ── WEEK ID ────────────────────────────────────────────────────
function weekIdFromDate(dateStr) {
  if (!dateStr) return null;
  return dateStr; // format: 2025-W18
}

function getCurrentWeekId() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function weekLabel(weekId) {
  if (!weekId) return '—';
  const [year, w] = weekId.split('-W');
  return `Semana ${w} / ${year}`;
}

function emptyWeek(weekId) {
  return {
    id: weekId,
    dias: DAYS.map((name, i) => ({
      dia: DAYS_SHORT[i],
      nome: name,
      enviados: 0,
      feitos: 0,
      excedente_aprovado: 0,
      erros: 0,
      erros_distribuidora: 0,
      erros_sistema: 0,
      erros_status: 0
    }))
  };
}

// ── CURRENT WEEK STATE ─────────────────────────────────────────
let currentWeekId = getCurrentWeekId();
let currentWeek = DB.getWeek(currentWeekId) || emptyWeek(currentWeekId);

// ── NAVIGATION ─────────────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + pageId)?.classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    entrada: 'Entrada de dados',
    importar: 'Importar planilha',
    historico: 'Histórico de semanas'
  };
  document.getElementById('topbar-title').textContent = titles[pageId] || pageId;

  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'historico') renderHistorico();
}

// ── ENTRADA PAGE ───────────────────────────────────────────────
function buildEntradaPage() {
  const grid = document.getElementById('days-grid');
  grid.innerHTML = '';

  DAYS.forEach((name, i) => {
    const d = currentWeek.dias[i];
    const card = document.createElement('div');
    card.className = 'day-card' + (d.feitos > 0 ? ' has-data' : '');
    card.id = `day-card-${i}`;
    card.innerHTML = `
      <div class="day-header">
        <span class="day-name">${DAYS_SHORT[i]}</span>
        <span class="day-badge empty" id="badge-${i}">—</span>
      </div>
      <div class="field">
        <label class="field-label">Enviados p/ operação</label>
        <input type="number" min="0" placeholder="0" id="env_${i}" value="${d.enviados || ''}" oninput="updateDay(${i})">
      </div>
      <div class="field">
        <label class="field-label">Feitos no dia</label>
        <input type="number" min="0" placeholder="0" id="fei_${i}" value="${d.feitos || ''}" oninput="updateDay(${i})">
      </div>
      <div class="day-divider"></div>
      <div class="field">
        <label class="field-label">Excedente aprovado</label>
        <input type="number" min="0" placeholder="0" id="exc_${i}" value="${d.excedente_aprovado || ''}" oninput="updateDay(${i})">
      </div>
      <div class="day-divider"></div>
      <div class="field">
        <label class="field-label">Erros distribuidora</label>
        <input type="number" min="0" placeholder="0" id="errd_${i}" value="${d.erros_distribuidora || ''}" oninput="updateDay(${i})">
      </div>
      <div class="field">
        <label class="field-label">Erros sistêmicos</label>
        <input type="number" min="0" placeholder="0" id="errs_${i}" value="${d.erros_sistema || ''}" oninput="updateDay(${i})">
      </div>
      <div class="field">
        <label class="field-label">Erros de status</label>
        <input type="number" min="0" placeholder="0" id="errst_${i}" value="${d.erros_status || ''}" oninput="updateDay(${i})">
      </div>
      <div class="day-result" id="result-${i}">
        <div class="result-row"><span>Meta atingida</span><b id="r-meta-${i}">—</b></div>
        <div class="result-row"><span>Custo excedente</span><b id="r-custo-${i}" class="amber">R$ 0,00</b></div>
        <div class="result-row"><span>% conclusão</span><b id="r-pct-${i}">—</b></div>
      </div>
    `;
    grid.appendChild(card);
    updateDayDisplay(i);
  });

  updateSummaryBar();
}

function getNum(id) { return parseFloat(document.getElementById(id)?.value) || 0; }

function updateDay(i) {
  currentWeek.dias[i].enviados = getNum(`env_${i}`);
  currentWeek.dias[i].feitos = getNum(`fei_${i}`);
  currentWeek.dias[i].excedente_aprovado = getNum(`exc_${i}`);
  currentWeek.dias[i].erros_distribuidora = getNum(`errd_${i}`);
  currentWeek.dias[i].erros_sistema = getNum(`errs_${i}`);
  currentWeek.dias[i].erros_status = getNum(`errst_${i}`);
  currentWeek.dias[i].erros =
    currentWeek.dias[i].erros_distribuidora +
    currentWeek.dias[i].erros_sistema +
    currentWeek.dias[i].erros_status;

  updateDayDisplay(i);
  updateSummaryBar();
}

function updateDayDisplay(i) {
  const d = currentWeek.dias[i];
  const c = calcDay(d);

  const badge = document.getElementById(`badge-${i}`);
  const card = document.getElementById(`day-card-${i}`);

  if (d.feitos === 0) {
    badge.textContent = '—';
    badge.className = 'day-badge empty';
    card.classList.remove('has-data');
  } else if (c.metaAtingida) {
    badge.textContent = 'META';
    badge.className = 'day-badge ok';
    card.classList.add('has-data');
  } else if (c.pct >= 80) {
    badge.textContent = 'PARCIAL';
    badge.className = 'day-badge warn';
    card.classList.add('has-data');
  } else {
    badge.textContent = 'BAIXO';
    badge.className = 'day-badge fail';
    card.classList.add('has-data');
  }

  const metaEl = document.getElementById(`r-meta-${i}`);
  if (d.feitos === 0) {
    metaEl.textContent = '—';
    metaEl.className = '';
  } else {
    metaEl.textContent = c.metaAtingida ? 'Sim' : 'Não';
    metaEl.className = c.metaAtingida ? 'green' : 'amber';
  }

  document.getElementById(`r-custo-${i}`).textContent =
    'R$ ' + c.custoExc.toFixed(2).replace('.', ',');
  document.getElementById(`r-pct-${i}`).textContent =
    d.enviados > 0 ? c.pct.toFixed(1) + '%' : '—';
}

function updateSummaryBar() {
  const s = calcWeek(currentWeek);
  const el = document.getElementById('entrada-summary');
  if (!el) return;
  el.innerHTML = `
    <div class="card-sm" style="display:flex;gap:32px;flex-wrap:wrap;align-items:center">
      <div>
        <div class="kpi-label">Total feitos</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--green-400)">${s.totalFeitos.toLocaleString('pt-BR')}</div>
      </div>
      <div>
        <div class="kpi-label">Excedente aprovado</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--amber)">${s.totalExcAprovado.toLocaleString('pt-BR')}</div>
      </div>
      <div>
        <div class="kpi-label">Custo excedente</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--amber)">R$ ${s.custoTotal.toFixed(2).replace('.', ',')}</div>
      </div>
      <div>
        <div class="kpi-label">Erros totais</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--red)">${s.totalErros.toLocaleString('pt-BR')}</div>
      </div>
      <div>
        <div class="kpi-label">Dias c/ meta</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--text-primary)">${s.diasMeta}/5</div>
      </div>
      <div style="margin-left:auto">
        <button class="btn btn-primary" onclick="saveCurrentWeek()">Salvar semana</button>
      </div>
    </div>
  `;
}

function saveCurrentWeek() {
  DB.saveWeek(currentWeek);
  showToast('Semana salva com sucesso');
}

function clearCurrentWeek() {
  if (!confirm('Limpar todos os dados desta semana?')) return;
  currentWeek = emptyWeek(currentWeekId);
  buildEntradaPage();
}

function onWeekChange(val) {
  if (!val) return;
  currentWeekId = val;
  currentWeek = DB.getWeek(currentWeekId) || emptyWeek(currentWeekId);
  buildEntradaPage();
}

// ── DASHBOARD PAGE ─────────────────────────────────────────────
let chartFeitos = null, chartCusto = null, chartErros = null;

function renderDashboard() {
  const s = calcWeek(currentWeek);

  // KPIs
  document.getElementById('kpi-feitos').textContent = s.totalFeitos.toLocaleString('pt-BR');
  document.getElementById('kpi-exc').textContent = s.totalExcAprovado.toLocaleString('pt-BR');
  document.getElementById('kpi-custo').textContent = 'R$ ' + s.custoTotal.toFixed(2).replace('.', ',');
  document.getElementById('kpi-erros').textContent = s.totalErros.toLocaleString('pt-BR');

  const pctEl = document.getElementById('kpi-feitos-sub');
  if (pctEl) pctEl.textContent = s.pct.toFixed(1) + '% de conclusão';

  // Charts
  renderChartFeitos(s);
  renderChartCusto(s);
  renderChartErros(s);

  // Detalhe dias
  renderDayDetail();
}

function renderChartFeitos() {
  const labels = DAYS_SHORT;
  const feitos = currentWeek.dias.map(d => d.feitos || 0);
  const meta = DAYS_SHORT.map(() => META_DIARIA);
  const ctx = document.getElementById('chart-feitos');
  if (!ctx) return;
  if (chartFeitos) chartFeitos.destroy();
  chartFeitos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Feitos',
          data: feitos,
          backgroundColor: feitos.map(v => v >= META_DIARIA ? 'rgba(34,197,94,0.7)' : 'rgba(245,158,11,0.6)'),
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Meta (5.000)',
          data: meta,
          type: 'line',
          borderColor: 'rgba(239,68,68,0.6)',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' } } },
        y: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' }, callback: v => v.toLocaleString('pt-BR') } }
      }
    }
  });
}

function renderChartCusto() {
  const custos = currentWeek.dias.map(d => parseFloat(((d.excedente_aprovado || 0) * VALOR_EXCEDENTE).toFixed(2)));
  const ctx = document.getElementById('chart-custo');
  if (!ctx) return;
  if (chartCusto) chartCusto.destroy();
  chartCusto = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DAYS_SHORT,
      datasets: [{
        label: 'Custo (R$)',
        data: custos,
        backgroundColor: 'rgba(245,158,11,0.65)',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' } } },
        y: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' }, callback: v => 'R$' + v.toFixed(2).replace('.', ',') } }
      }
    }
  });
}

function renderChartErros() {
  const dist = currentWeek.dias.map(d => d.erros_distribuidora || 0);
  const sist = currentWeek.dias.map(d => d.erros_sistema || 0);
  const stat = currentWeek.dias.map(d => d.erros_status || 0);
  const ctx = document.getElementById('chart-erros');
  if (!ctx) return;
  if (chartErros) chartErros.destroy();
  chartErros = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DAYS_SHORT,
      datasets: [
        { label: 'Distribuidora', data: dist, backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4, stack: 'erros' },
        { label: 'Sistêmico',     data: sist, backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4, stack: 'erros' },
        { label: 'Status',        data: stat, backgroundColor: 'rgba(56,189,248,0.7)', borderRadius: 4, stack: 'erros' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#7a9e80', font: { family: 'DM Mono', size: 11 }, boxWidth: 12, boxHeight: 12 }
        }
      },
      scales: {
        x: { stacked: true, grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' } } },
        y: { stacked: true, grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' } } }
      }
    }
  });
}

function renderDayDetail() {
  const tbody = document.getElementById('detail-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  currentWeek.dias.forEach((d, i) => {
    const c = calcDay(d);
    const tr = document.createElement('tr');
    const metaTag = d.feitos === 0 ? '<span class="tag tag-gray">—</span>'
      : c.metaAtingida ? '<span class="tag tag-green">META</span>'
      : '<span class="tag tag-amber">PARCIAL</span>';
    tr.innerHTML = `
      <td><b style="font-family:var(--font-display)">${DAYS_SHORT[i]}</b></td>
      <td>${(d.enviados || 0).toLocaleString('pt-BR')}</td>
      <td>${(d.feitos || 0).toLocaleString('pt-BR')}</td>
      <td>${(d.excedente_aprovado || 0).toLocaleString('pt-BR')}</td>
      <td><span style="color:var(--amber)">R$ ${c.custoExc.toFixed(2).replace('.', ',')}</span></td>
      <td>${(d.erros || 0).toLocaleString('pt-BR')}</td>
      <td>${metaTag}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals row
  const s = calcWeek(currentWeek);
  const tr = document.createElement('tr');
  tr.style.cssText = 'border-top:1px solid var(--border-strong);background:var(--surface-2)';
  tr.innerHTML = `
    <td><b style="font-family:var(--font-display);color:var(--text-secondary)">TOTAL</b></td>
    <td><b>${s.totalEnviados.toLocaleString('pt-BR')}</b></td>
    <td><b style="color:var(--green-400)">${s.totalFeitos.toLocaleString('pt-BR')}</b></td>
    <td><b>${s.totalExcAprovado.toLocaleString('pt-BR')}</b></td>
    <td><b style="color:var(--amber)">R$ ${s.custoTotal.toFixed(2).replace('.', ',')}</b></td>
    <td><b style="color:var(--red)">${s.totalErros.toLocaleString('pt-BR')}</b></td>
    <td><span class="tag tag-green">${s.diasMeta}/5 dias</span></td>
  `;
  tbody.appendChild(tr);
}

// ── HISTÓRICO PAGE ─────────────────────────────────────────────
function renderHistorico() {
  const weeks = DB.allWeeks();
  const container = document.getElementById('historico-list');
  if (!container) return;

  if (weeks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <div class="empty-state-title">Nenhuma semana salva ainda</div>
        <div style="font-size:12px;color:var(--text-tertiary);margin-top:4px">Salve a semana atual na aba de entrada de dados</div>
      </div>`;
    return;
  }

  // Aggregate stats for history KPIs
  const totalContratosHist = weeks.reduce((a, w) => a + calcWeek(w).totalFeitos, 0);
  const totalCustoHist = weeks.reduce((a, w) => a + calcWeek(w).custoTotal, 0);
  const totalErrosHist = weeks.reduce((a, w) => a + calcWeek(w).totalErros, 0);

  document.getElementById('hist-kpi-semanas').textContent = weeks.length;
  document.getElementById('hist-kpi-contratos').textContent = totalContratosHist.toLocaleString('pt-BR');
  document.getElementById('hist-kpi-custo').textContent = 'R$ ' + totalCustoHist.toFixed(2).replace('.', ',');
  document.getElementById('hist-kpi-erros').textContent = totalErrosHist.toLocaleString('pt-BR');

  container.innerHTML = '';
  weeks.forEach(week => {
    const s = calcWeek(week);
    const div = document.createElement('div');
    div.style.marginBottom = '12px';
    const feitosArr = week.dias.map(d => d.feitos || 0);
    const maxF = Math.max(...feitosArr, 1);
    const miniBars = feitosArr.map(v => {
      const h = Math.round((v / Math.max(maxF, META_DIARIA)) * 28);
      const color = v >= META_DIARIA ? 'var(--green-500)' : v >= META_DIARIA * 0.8 ? 'var(--amber)' : 'rgba(239,68,68,0.5)';
      return `<div class="mini-bar" style="height:${Math.max(h, 2)}px;background:${color}"></div>`;
    }).join('');

    div.innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:3px">${weekLabel(week.id)}</div>
            <div style="font-size:11px;color:var(--text-tertiary)">${week.id}</div>
          </div>
          <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center">
            <div style="text-align:center">
              <div class="kpi-label">Feitos</div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--green-400)">${s.totalFeitos.toLocaleString('pt-BR')}</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-label">Custo exc.</div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--amber)">R$ ${s.custoTotal.toFixed(2).replace('.', ',')}</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-label">Erros</div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red)">${s.totalErros.toLocaleString('pt-BR')}</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-label">Dias meta</div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--text-primary)">${s.diasMeta}/5</div>
            </div>
            <div class="mini-bars">${miniBars}</div>
            <button class="btn btn-ghost btn-sm" onclick="deleteWeek('${week.id}')">Excluir</button>
          </div>
        </div>
        <div class="divider" style="margin:14px 0"></div>
        <table class="data-table">
          <thead><tr>
            <th>Dia</th><th>Enviados</th><th>Feitos</th><th>Exc. aprovado</th><th>Custo</th><th>Erros</th>
          </tr></thead>
          <tbody>
            ${week.dias.map(d => {
              const c = calcDay(d);
              return `<tr>
                <td><b style="font-family:var(--font-display)">${d.dia}</b></td>
                <td>${(d.enviados||0).toLocaleString('pt-BR')}</td>
                <td style="color:${c.metaAtingida?'var(--green-400)':'var(--text-primary)'}"><b>${(d.feitos||0).toLocaleString('pt-BR')}</b></td>
                <td>${(d.excedente_aprovado||0).toLocaleString('pt-BR')}</td>
                <td style="color:var(--amber)">R$ ${c.custoExc.toFixed(2).replace('.',',')}</td>
                <td style="color:${d.erros>0?'var(--red)':'var(--text-tertiary)'}">${(d.erros||0).toLocaleString('pt-BR')}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    container.appendChild(div);
  });

  renderChartHistorico(weeks);
}

let chartHist = null;
function renderChartHistorico(weeks) {
  const ctx = document.getElementById('chart-historico');
  if (!ctx) return;
  const sliced = weeks.slice(0, 12).reverse();
  const labels = sliced.map(w => weekLabel(w.id).replace('Semana ', 'S'));
  const feitos = sliced.map(w => calcWeek(w).totalFeitos);
  const custos = sliced.map(w => parseFloat(calcWeek(w).custoTotal.toFixed(2)));
  if (chartHist) chartHist.destroy();
  chartHist = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Feitos', data: feitos, backgroundColor: 'rgba(34,197,94,0.6)', borderRadius: 5, yAxisID: 'y' },
        { label: 'Custo (R$)', data: custos, type: 'line', borderColor: 'rgba(245,158,11,0.8)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: 'var(--amber)', fill: false, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: '#7a9e80', font: { family: 'DM Mono', size: 11 }, boxWidth: 12 } }
      },
      scales: {
        x: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono', size: 11 } } },
        y: { grid: { color: 'rgba(34,197,94,0.06)' }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' }, callback: v => v.toLocaleString('pt-BR') } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#4a6b50', font: { family: 'DM Mono' }, callback: v => 'R$' + v.toFixed(0) } }
      }
    }
  });
}

function deleteWeek(weekId) {
  if (!confirm('Excluir os dados desta semana?')) return;
  DB.deleteWeek(weekId);
  if (weekId === currentWeekId) currentWeek = emptyWeek(currentWeekId);
  renderHistorico();
  showToast('Semana excluída');
}

// ── IMPORT PAGE ────────────────────────────────────────────────
function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const name = file.name.toLowerCase();
  const isXlsx = name.endsWith('.xlsx') || name.endsWith('.xls');
  const isCsv = name.endsWith('.csv') || name.endsWith('.txt');
  if (!isXlsx && !isCsv) {
    showImportStatus('Formato inválido. Use .xlsx ou .csv', 'error'); return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      let rows = [];
      if (isXlsx) {
        const wb = XLSX.read(ev.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        const start = isNaN(parseFloat(raw[0]?.[1])) ? 1 : 0;
        rows = raw.slice(start).filter(r => r.some(c => c !== ''));
      } else {
        const text = ev.target.result;
        rows = text.split('\n').map(l => l.trim().split(/,|;|\t/)).filter(r => r.length >= 2);
        if (isNaN(parseFloat(rows[0]?.[1]))) rows = rows.slice(1);
      }
      applyImportedRows(rows, file.name);
    } catch (err) {
      showImportStatus('Erro ao ler arquivo: ' + err.message, 'error');
    }
  };
  if (isXlsx) reader.readAsArrayBuffer(file);
  else reader.readAsText(file);
}

function applyImportedRows(rows, filename) {
  rows.slice(0, 5).forEach((r, i) => {
    currentWeek.dias[i].enviados           = parseFloat(r[1]) || 0;
    currentWeek.dias[i].feitos             = parseFloat(r[2]) || 0;
    currentWeek.dias[i].excedente_aprovado = parseFloat(r[3]) || 0;
    currentWeek.dias[i].erros_distribuidora= parseFloat(r[4]) || 0;
    currentWeek.dias[i].erros_sistema      = parseFloat(r[5]) || 0;
    currentWeek.dias[i].erros_status       = parseFloat(r[6]) || 0;
    currentWeek.dias[i].erros =
      currentWeek.dias[i].erros_distribuidora +
      currentWeek.dias[i].erros_sistema +
      currentWeek.dias[i].erros_status;
  });

  showImportStatus(`${Math.min(rows.length, 5)} dias importados de "${filename}"`, 'ok');
  renderImportPreview();
}

function renderImportPreview() {
  const wrap = document.getElementById('import-preview');
  if (!wrap) return;
  wrap.innerHTML = `
    <div style="margin-top:20px">
      <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:10px;letter-spacing:.05em;text-transform:uppercase">Prévia dos dados importados</div>
      <div class="card" style="padding:0;overflow:hidden">
        <table class="data-table">
          <thead><tr>
            <th>Dia</th><th>Enviados</th><th>Feitos</th><th>Exc. aprovado</th><th>Err. dist.</th><th>Err. sist.</th><th>Err. status</th>
          </tr></thead>
          <tbody>
            ${currentWeek.dias.map(d => `<tr>
              <td><b style="font-family:var(--font-display)">${d.dia}</b></td>
              <td>${(d.enviados||0).toLocaleString('pt-BR')}</td>
              <td>${(d.feitos||0).toLocaleString('pt-BR')}</td>
              <td style="color:var(--amber)">${(d.excedente_aprovado||0).toLocaleString('pt-BR')}</td>
              <td>${(d.erros_distribuidora||0).toLocaleString('pt-BR')}</td>
              <td>${(d.erros_sistema||0).toLocaleString('pt-BR')}</td>
              <td>${(d.erros_status||0).toLocaleString('pt-BR')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:14px;display:flex;gap:10px">
        <button class="btn btn-primary" onclick="saveAndGo()">Salvar e ir para entrada</button>
        <button class="btn btn-ghost" onclick="navigate('dashboard')">Ver dashboard</button>
      </div>
    </div>`;
}

function saveAndGo() {
  DB.saveWeek(currentWeek);
  buildEntradaPage();
  navigate('entrada');
  showToast('Dados importados e salvos');
}

function showImportStatus(msg, type) {
  const el = document.getElementById('import-status');
  if (!el) return;
  const color = type === 'ok' ? 'var(--green-400)' : 'var(--red)';
  el.innerHTML = `<div style="padding:10px 0;font-size:13px;color:${color}">${msg}</div>`;
}

// ── TOAST ──────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('.toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('week-input').value = currentWeekId;
  buildEntradaPage();
  navigate('dashboard');
});
