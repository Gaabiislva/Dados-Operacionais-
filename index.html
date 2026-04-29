<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contratos OPS — Painel Operacional</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="app-shell">

  <!-- ── SIDEBAR ── -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark">
        <div class="logo-icon">⚡</div>
        <span class="logo-text">Contratos OPS</span>
      </div>
      <div class="logo-sub">Painel Operacional</div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      <a class="nav-item" data-page="dashboard" onclick="navigate('dashboard')">
        <svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="1" width="6" height="6" rx="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5"/>
        </svg>
        Dashboard
      </a>
      <a class="nav-item" data-page="entrada" onclick="navigate('entrada')">
        <svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="2" width="12" height="12" rx="2"/>
          <path d="M5 8h6M8 5v6"/>
        </svg>
        Entrada de dados
      </a>

      <div class="nav-section-label">Ferramentas</div>
      <a class="nav-item" data-page="importar" onclick="navigate('importar')">
        <svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M8 2v8M5 7l3 3 3-3"/>
          <path d="M3 11v1a2 2 0 002 2h6a2 2 0 002-2v-1"/>
        </svg>
        Importar planilha
      </a>
      <a class="nav-item" data-page="historico" onclick="navigate('historico')">
        <svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="8" cy="8" r="6"/>
          <path d="M8 5v3l2 2"/>
        </svg>
        Histórico
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="version">
        <span>v1.0</span>
        <span style="color:var(--green-400)">● online</span>
      </div>
      <div style="margin-top:4px;font-size:10px">Contratos / GD</div>
    </div>
  </aside>

  <!-- ── MAIN ── -->
  <main class="main-content">

    <!-- TOPBAR -->
    <div class="topbar">
      <span class="topbar-title" id="topbar-title">Dashboard</span>
      <div class="topbar-right">
        <span class="topbar-badge" id="topbar-week-badge">Carregando...</span>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         PAGE: DASHBOARD
    ════════════════════════════════════════════ -->
    <div class="page" id="page-dashboard">

      <div style="padding-bottom:8px">
        <div class="section-header">
          <div>
            <div class="section-title">Visão da semana</div>
            <div class="section-subtitle" id="dash-week-label">Semana atual</div>
          </div>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <div class="kpi-card accent-green">
            <div class="kpi-label">Total feitos</div>
            <div class="kpi-value green" id="kpi-feitos">0</div>
            <div class="kpi-sub" id="kpi-feitos-sub">0% de conclusão</div>
          </div>
          <div class="kpi-card accent-amber">
            <div class="kpi-label">Excedente aprovado</div>
            <div class="kpi-value amber" id="kpi-exc">0</div>
            <div class="kpi-sub">contratos acima de 5.000</div>
          </div>
          <div class="kpi-card accent-amber">
            <div class="kpi-label">Custo excedente</div>
            <div class="kpi-value amber" id="kpi-custo">R$ 0,00</div>
            <div class="kpi-sub">× R$ 2,70 por contrato</div>
          </div>
          <div class="kpi-card accent-red">
            <div class="kpi-label">Total de erros</div>
            <div class="kpi-value red" id="kpi-erros">0</div>
            <div class="kpi-sub">distribuidora + sistema + status</div>
          </div>
        </div>

        <!-- Charts row -->
        <div class="grid-2" style="margin-bottom:20px">
          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);letter-spacing:.05em;text-transform:uppercase">Contratos feitos / dia</div>
              <div style="display:flex;gap:12px;font-size:11px;color:var(--text-tertiary)">
                <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:rgba(34,197,94,0.7);display:inline-block"></span>Feitos</span>
                <span style="display:flex;align-items:center;gap:4px"><span style="width:18px;height:1px;border-top:1.5px dashed rgba(239,68,68,0.6);display:inline-block"></span>Meta</span>
              </div>
            </div>
            <div class="chart-container" style="height:200px"><canvas id="chart-feitos" role="img" aria-label="Gráfico de contratos feitos por dia vs meta de 5000"></canvas></div>
          </div>
          <div class="card">
            <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);letter-spacing:.05em;text-transform:uppercase;margin-bottom:14px">Custo excedente / dia</div>
            <div class="chart-container" style="height:200px"><canvas id="chart-custo" role="img" aria-label="Gráfico de custo de excedente aprovado por dia em reais"></canvas></div>
          </div>
        </div>

        <!-- Erros chart -->
        <div class="card" style="margin-bottom:20px">
          <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);letter-spacing:.05em;text-transform:uppercase;margin-bottom:14px">Erros por tipo / dia</div>
          <div class="chart-container" style="height:180px"><canvas id="chart-erros" role="img" aria-label="Gráfico de erros por tipo por dia"></canvas></div>
        </div>

        <!-- Detail table -->
        <div class="card">
          <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);letter-spacing:.05em;text-transform:uppercase;margin-bottom:14px">Detalhe por dia</div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Enviados</th>
                <th>Feitos</th>
                <th>Exc. aprovado</th>
                <th>Custo</th>
                <th>Erros</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="detail-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         PAGE: ENTRADA
    ════════════════════════════════════════════ -->
    <div class="page" id="page-entrada">

      <div class="section-header">
        <div>
          <div class="section-title">Entrada de dados</div>
          <div class="section-subtitle">Preencha os dados de cada dia da semana</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="week-selector">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-tertiary)">
              <rect x="1" y="2" width="12" height="11" rx="2"/>
              <path d="M1 5h12M4 1v2M10 1v2"/>
            </svg>
            <input type="week" id="week-input" onchange="onWeekChange(this.value)">
          </div>
          <button class="btn btn-ghost btn-sm" onclick="clearCurrentWeek()">Limpar</button>
        </div>
      </div>

      <div id="days-grid" class="days-grid"></div>

      <div id="entrada-summary"></div>
    </div>

    <!-- ════════════════════════════════════════════
         PAGE: IMPORTAR
    ════════════════════════════════════════════ -->
    <div class="page" id="page-importar">

      <div class="section-header">
        <div>
          <div class="section-title">Importar planilha</div>
          <div class="section-subtitle">Carregue sua planilha semanal em .xlsx ou .csv</div>
        </div>
      </div>

      <div class="format-hint">
        <b style="color:var(--blue);font-family:var(--font-display)">Formato esperado das colunas:</b><br>
        <code>dia</code> &nbsp;
        <code>enviados</code> &nbsp;
        <code>feitos</code> &nbsp;
        <code>excedente_aprovado</code> &nbsp;
        <code>erros_distribuidora</code> &nbsp;
        <code>erros_sistema</code> &nbsp;
        <code>erros_status</code><br><br>
        Exemplo: <code>Seg,5000,5200,200,3,1,2</code><br>
        Cabeçalho é opcional. Máximo 5 linhas de dados (seg a sex).
      </div>

      <label class="import-zone" for="file-input">
        <input type="file" id="file-input" accept=".csv,.xlsx,.xls,.txt" onchange="handleFile(event)">
        <div class="import-icon">↓</div>
        <div class="import-title">Arraste ou clique para selecionar</div>
        <div class="import-sub">Aceita <b style="color:var(--green-400)">.xlsx</b> e <b style="color:var(--blue)">.csv</b></div>
      </label>

      <div id="import-status"></div>
      <div id="import-preview"></div>

    </div>

    <!-- ════════════════════════════════════════════
         PAGE: HISTÓRICO
    ════════════════════════════════════════════ -->
    <div class="page" id="page-historico">

      <div class="section-header">
        <div>
          <div class="section-title">Histórico de semanas</div>
          <div class="section-subtitle">Todas as semanas salvas no sistema</div>
        </div>
      </div>

      <!-- Histórico KPIs -->
      <div class="kpi-grid" style="margin-bottom:24px">
        <div class="kpi-card accent-blue">
          <div class="kpi-label">Semanas salvas</div>
          <div class="kpi-value" id="hist-kpi-semanas">0</div>
        </div>
        <div class="kpi-card accent-green">
          <div class="kpi-label">Total contratos feitos</div>
          <div class="kpi-value green" id="hist-kpi-contratos">0</div>
        </div>
        <div class="kpi-card accent-amber">
          <div class="kpi-label">Custo excedente acum.</div>
          <div class="kpi-value amber" id="hist-kpi-custo">R$ 0,00</div>
        </div>
        <div class="kpi-card accent-red">
          <div class="kpi-label">Total erros acum.</div>
          <div class="kpi-value red" id="hist-kpi-erros">0</div>
        </div>
      </div>

      <!-- Histórico chart -->
      <div class="card" style="margin-bottom:24px">
        <div style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-secondary);letter-spacing:.05em;text-transform:uppercase;margin-bottom:14px">Evolução semanal — feitos e custo</div>
        <div class="chart-container" style="height:200px"><canvas id="chart-historico" role="img" aria-label="Evolução de contratos feitos e custo de excedente por semana"></canvas></div>
      </div>

      <!-- Lista semanas -->
      <div id="historico-list"></div>

    </div>

  </main>
</div>

<!-- TOAST -->
<div class="toast" id="toast">
  <div class="toast-dot"></div>
  <span class="toast-msg">Salvo com sucesso</span>
</div>

<!-- SCRIPTS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script src="js/app.js"></script>
<script>
  // Update topbar badge after init
  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('topbar-week-badge');
    const label = document.getElementById('dash-week-label');
    const wl = weekLabel(currentWeekId);
    if (badge) badge.textContent = wl;
    if (label) label.textContent = wl;
  });
</script>

</body>
</html>
