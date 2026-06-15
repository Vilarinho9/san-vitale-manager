<template>
  <div class="sv-layout">
    <Sidebar />
    <div class="sv-main">
      <TopBar
        title=""
        search-placeholder="Buscar clientes, agendamentos..."
        :notif-count="3"
      >
        <template #actions>
          <div class="dash-topbar-greeting">
            <h1 class="dash-greeting">Olá, {{ firstName }}!</h1>
            <p class="dash-greeting-sub">Aqui está o resumo do seu negócio hoje.</p>
          </div>
        </template>
        <template #cta>
          <button class="sv-btn sv-btn-primary" @click="$router.push('/agendamentos')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Agendamento
          </button>
        </template>
      </TopBar>

      <div class="sv-content">

        <!-- KPI Row — 5 cards como na referência -->
        <div class="dash-kpi-row anim-up">
          <template v-if="loading">
            <div v-for="i in 5" :key="i" class="kpi-card skel" style="height:110px"></div>
          </template>
          <template v-else>
            <div v-for="k in kpis" :key="k.label" class="kpi-card">
              <div class="kpi-card__label">{{ k.label }}</div>
              <div class="kpi-card__icon">
                <span v-html="k.icon"></span>
              </div>
              <div class="kpi-card__value">{{ k.value }}</div>
              <div class="kpi-card__footer">
                <span class="kpi-card__delta" :class="{ 'kpi-card__delta-neg': !k.up }">
                  {{ k.up ? '+' : '' }}{{ k.delta }}
                </span>
                <span class="kpi-card__vs">vs ontem</span>
              </div>
              <!-- Sparkline SVG simulado -->
              <div class="kpi-card__sparkline">
                <svg width="100%" height="36" viewBox="0 0 120 36" preserveAspectRatio="none">
                  <path :d="k.sparkline" fill="none" :stroke="k.up ? '#5C7A69' : '#E05252'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </template>
        </div>

        <!-- Middle row: Receita 7 dias | Serviços mais realizados | Agenda de Hoje -->
        <div class="dash-mid anim-up d-2">

          <!-- Receita 7 dias -->
          <div class="sv-card dash-receita">
            <div class="sv-card-header">
              <div>
                <h3>Receita dos últimos 7 dias</h3>
                <div style="margin-top:6px">
                  <span class="dash-big-value">R$ {{ receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                  <span class="dash-delta-label">+14% <span style="color:var(--text-muted);font-weight:400">vs semana anterior</span></span>
                </div>
              </div>
            </div>
            <div class="sv-card-body" style="padding:16px 20px 20px">
              <div class="dash-bar-chart">
                <div class="dbc-grid">
                  <span>10k</span><span>8k</span><span>6k</span><span>4k</span><span>2k</span><span>0</span>
                </div>
                <div class="dbc-bars">
                  <div v-for="d in barData" :key="d.label" class="dbc-col">
                    <div class="dbc-bar-wrap">
                      <div
                        class="dbc-bar"
                        :class="{ 'dbc-bar--gold': d.gold, 'dbc-bar--today': d.today }"
                        :style="{ height: d.pct + '%' }"
                      ></div>
                    </div>
                    <span class="dbc-label">{{ d.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Serviços mais realizados — donut estilo referência -->
          <div class="sv-card dash-servicos-chart">
            <div class="sv-card-header"><h3>Serviços mais realizados</h3></div>
            <div class="sv-card-body" style="padding:20px">
              <div class="dash-donut-wrap">
                <!-- Donut SVG -->
                <svg class="dash-donut" width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#E8F0EC" stroke-width="20"/>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#2C3B2D" stroke-width="20"
                    :stroke-dasharray="`${0.32 * 327} ${327}`" stroke-dashoffset="-0" stroke-linecap="round" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#4E6B5B" stroke-width="20"
                    :stroke-dasharray="`${0.24 * 327} ${327}`" :stroke-dashoffset="`${-(0.32 * 327)}`" stroke-linecap="round" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#7A9B89" stroke-width="20"
                    :stroke-dasharray="`${0.18 * 327} ${327}`" :stroke-dashoffset="`${-((0.32+0.24) * 327)}`" stroke-linecap="round" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#C9A84C" stroke-width="20"
                    :stroke-dasharray="`${0.14 * 327} ${327}`" :stroke-dashoffset="`${-((0.32+0.24+0.18) * 327)}`" stroke-linecap="round" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#D4C9B8" stroke-width="20"
                    :stroke-dasharray="`${0.12 * 327} ${327}`" :stroke-dashoffset="`${-((0.32+0.24+0.18+0.14) * 327)}`" stroke-linecap="round" transform="rotate(-90 70 70)"/>
                  <text x="70" y="66" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-sans)">Total</text>
                  <text x="70" y="82" text-anchor="middle" font-size="20" font-weight="600" fill="var(--text-primary)" font-family="var(--font-serif)">128</text>
                </svg>
                <div class="dash-donut-legend">
                  <div v-for="s in topServicos" :key="s.nome" class="ddl-item">
                    <span class="ddl-dot" :style="{ background: s.color }"></span>
                    <span class="ddl-nome">{{ s.nome }}</span>
                    <span class="ddl-pct">{{ s.pct }}% ({{ s.total }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agenda de Hoje — timeline lateral igual à referência -->
          <div class="sv-card dash-agenda-hoje">
            <div class="sv-card-header">
              <h3>Agenda de Hoje</h3>
              <div style="display:flex;gap:6px">
                <button class="dash-tab" :class="{ active: agendaTab==='dia' }" @click="agendaTab='dia'">Dia</button>
                <button class="dash-tab" :class="{ active: agendaTab==='semana' }" @click="agendaTab='semana'">Semana</button>
                <button class="dash-tab" :class="{ active: agendaTab==='mes' }" @click="agendaTab='mes'">Mês</button>
              </div>
            </div>
            <div class="dash-timeline">
              <div v-if="loading" style="padding:16px;display:flex;flex-direction:column;gap:8px">
                <div class="skel" v-for="i in 5" :key="i" style="height:60px"></div>
              </div>
              <template v-else>
                <div v-for="ag in agendaHoje" :key="ag.id" class="dtl-item" :class="`dtl-item--${ag._key}`">
                  <div class="dtl-hour">{{ ag.horario?.slice(0,5) }}</div>
                  <div class="dtl-card">
                    <div class="dtl-name">{{ ag.clientes?.nome || '—' }}</div>
                    <div class="dtl-svc">{{ ag.servicos?.nome || '—' }}</div>
                    <div class="dtl-prof">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {{ ag.servicos?.categoria || 'Profissional' }}
                    </div>
                  </div>
                </div>
                <div v-if="!agendaHoje.length" class="sv-empty" style="padding:28px">
                  <div class="sv-empty-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                  <p>Sem agendamentos hoje</p>
                </div>
              </template>
            </div>
          </div>

        </div>

        <!-- Bottom row: Próximos Agendamentos | Status da Recepção -->
        <div class="dash-bottom anim-up d-3">

          <!-- Próximos agendamentos — igual à referência -->
          <div class="sv-card dash-proximos">
            <div class="sv-card-header">
              <h3>Próximos Agendamentos</h3>
            </div>
            <div class="dash-ag-list">
              <div v-if="loading">
                <div class="skel" v-for="i in 4" :key="i" style="height:56px;margin:8px 16px;border-radius:8px"></div>
              </div>
              <template v-else>
                <div v-for="ag in proximosAgendamentos" :key="ag.id" class="dag-row">
                  <span class="dag-hour">{{ ag.horario?.slice(0,5) }}</span>
                  <div class="sv-avatar dag-ava" style="width:34px;height:34px;font-size:13px;font-weight:600">
                    {{ ag.clientes?.nome?.charAt(0) || '?' }}
                  </div>
                  <div class="dag-info">
                    <p class="dag-name">{{ ag.clientes?.nome || '—' }}</p>
                    <p class="dag-svc">{{ ag.servicos?.nome || '—' }} • {{ ag.servicos?.duracao || '' }}</p>
                  </div>
                  <div class="dag-prof">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    </svg>
                    {{ ag.servicos?.categoria || '—' }}
                  </div>
                  <span class="sv-badge" :class="badgeClass(ag.status)">{{ ag.status || 'Pendente' }}</span>
                </div>
                <div v-if="!proximosAgendamentos.length" class="sv-empty" style="padding:24px">
                  <p>Sem agendamentos próximos</p>
                </div>
              </template>
              <button class="dag-ver-todos" @click="$router.push('/agendamentos')">
                Ver todos agendamentos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Status da Recepção -->
          <div class="sv-card dash-recepcao-status">
            <div class="sv-card-header"><h3>Status da Recepção</h3></div>
            <div class="sv-card-body" style="display:flex;flex-direction:column;gap:12px">
              <div v-for="s in recStatus" :key="s.label" class="drs-item">
                <div class="drs-icon" :style="{ background: s.bg }">
                  <span v-html="s.icon"></span>
                </div>
                <div>
                  <p class="drs-label">{{ s.label }}</p>
                  <p class="drs-count">{{ s.count }}</p>
                </div>
              </div>
              <button class="sv-btn sv-btn-primary" style="width:100%;margin-top:8px" @click="$router.push('/recepcao')">
                Abrir Recepção
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

        </div>

        <!-- Footer San Vitale -->
        <div class="dash-footer">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M16 4C16 4 10 10 10 16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16C22 10 16 4 16 4Z" fill="var(--green-400)"/>
          </svg>
          <span>SAN VITALE</span>
          <span class="dash-footer-sub">BELEZA & BEM-ESTAR</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar  from '@/components/TopBar.vue'
import api     from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const auth    = useAuthStore()
const loading = ref(true)
const agendamentos = ref([])
const clientes = ref([])
const servicos = ref([])
const agendaTab = ref('dia')
const today = new Date().toISOString().split('T')[0]

const firstName = computed(() => {
  const n = (auth.user?.email || '').split('@')[0] || 'Aline'
  return n.charAt(0).toUpperCase() + n.slice(1)
})

const receitaSemana = ref(32680)

const kpis = computed(() => [
  {
    label: 'AGENDAMENTOS HOJE',
    value: agendamentos.value.filter(a => a.data === today).length,
    delta: '+12%', up: true,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    sparkline: 'M0,28 C10,22 20,18 30,15 C40,12 50,18 60,12 C70,6 80,10 90,8 C100,6 110,10 120,6'
  },
  {
    label: 'RECEITA DO DIA',
    value: 'R$ ' + (5420).toLocaleString('pt-BR', {minimumFractionDigits:2}),
    delta: '+18%', up: true,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    sparkline: 'M0,30 C10,24 20,16 30,10 C40,4 50,12 60,8 C70,4 80,8 90,4 C100,0 110,6 120,2'
  },
  {
    label: 'CLIENTES ATENDIDOS',
    value: agendamentos.value.filter(a => a.status === 'Concluído' && a.data === today).length || 23,
    delta: '+7%', up: true,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    sparkline: 'M0,26 C10,22 20,20 30,18 C40,16 50,14 60,12 C70,10 80,12 90,8 C100,4 110,8 120,6'
  },
  {
    label: 'TICKET MÉDIO',
    value: 'R$ 235,65',
    delta: '+15%', up: true,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    sparkline: 'M0,20 C10,18 20,16 30,14 C40,12 50,16 60,12 C70,8 80,12 90,10 C100,8 110,12 120,8'
  },
  {
    label: 'NOVOS CLIENTES',
    value: '0' + clientes.value.length,
    delta: '+33%', up: true,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    sparkline: 'M0,28 C10,24 20,22 30,18 C40,14 50,16 60,10 C70,4 80,8 90,6 C100,4 110,6 120,2'
  },
])

const barData = [
  { label: '14/05', pct: 40, gold: false, today: false },
  { label: '15/05', pct: 55, gold: false, today: false },
  { label: '16/05', pct: 60, gold: false, today: false },
  { label: '17/05', pct: 70, gold: false, today: false },
  { label: '18/05', pct: 75, gold: false, today: false },
  { label: '19/05', pct: 95, gold: true,  today: false },
  { label: '20/05', pct: 65, gold: false, today: true  },
]

const topServicos = [
  { nome: 'Massagem Relaxante', pct: 32, total: 41, color: '#2C3B2D' },
  { nome: 'Limpeza de Pele',    pct: 24, total: 31, color: '#4E6B5B' },
  { nome: 'Drenagem Linfática', pct: 18, total: 23, color: '#7A9B89' },
  { nome: 'Peeling',            pct: 14, total: 18, color: '#C9A84C' },
  { nome: 'Outros',             pct: 12, total: 15, color: '#D4C9B8' },
]

const agendaHoje = computed(() =>
  agendamentos.value
    .filter(a => a.data === today)
    .sort((a, b) => a.horario.localeCompare(b.horario))
    .slice(0, 6)
    .map(a => ({ ...a, _key: statusKey(a.status) }))
)

const proximosAgendamentos = computed(() =>
  agendamentos.value
    .filter(a => a.data >= today)
    .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario))
    .slice(0, 5)
)

const recStatus = computed(() => [
  {
    label: 'Aguardando',
    count: `0${agendamentos.value.filter(a=>a.data===today&&a.status==='Confirmado').length} clientes`,
    bg: '#FDF3E0',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  },
  {
    label: 'Em Atendimento',
    count: `0${agendamentos.value.filter(a=>a.data===today&&a.status==='Em atendimento').length} clientes`,
    bg: '#E8F2EC',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B45" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
  },
  {
    label: 'Finalizados Hoje',
    count: `${agendamentos.value.filter(a=>a.data===today&&a.status==='Concluído').length} atendimentos`,
    bg: '#E8F0EC',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D5E3D" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/></svg>'
  },
])

function statusKey(s='') {
  const m = { 'Pendente':'pending','Confirmado':'confirm','Em atendimento':'active','Concluído':'done','Cancelado':'cancel' }
  return m[s] || 'pending'
}
function badgeClass(s='') {
  const m = { 'Pendente':'badge-pending','Confirmado':'badge-confirm','Em atendimento':'badge-active','Concluído':'badge-done','Cancelado':'badge-cancel' }
  return m[s] || 'badge-pending'
}

onMounted(async () => {
  try {
    const [agRes, cliRes, serRes] = await Promise.all([
      api.get('/agendamentos'), api.get('/clientes'), api.get('/servicos')
    ])
    agendamentos.value = agRes.data
    clientes.value = cliRes.data
    servicos.value = serRes.data
    const mes = new Date().getMonth()
    receitaSemana.value = agRes.data
      .filter(a => ['Concluído'].includes(a.status) && new Date(a.data).getMonth() === mes)
      .reduce((s, a) => s + (a.servicos?.valor || 0), 0) || 32680
  } catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
/* Topbar greeting override */
.dash-topbar-greeting { display: flex; flex-direction: column; }
.dash-greeting { font-family: var(--font-serif); font-size: 26px; font-weight: 400; color: var(--text-primary); line-height: 1.1; }
.dash-greeting-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

/* KPI Row */
.dash-kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.kpi-card__footer { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
.kpi-card__delta { font-size: 12px; font-weight: 600; color: var(--green-600); }
.kpi-card__delta-neg { color: #E05252; }
.kpi-card__vs { font-size: 11.5px; color: var(--text-muted); }

/* Mid row */
.dash-mid {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr 1.4fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* Bar chart */
.dash-bar-chart { display: flex; gap: 0; height: 180px; }
.dbc-grid {
  display: flex; flex-direction: column; justify-content: space-between;
  padding-right: 8px; font-size: 10px; color: var(--text-muted);
  padding-bottom: 18px;
}
.dbc-bars {
  flex: 1; display: flex; align-items: flex-end; gap: 6px;
}
.dbc-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; height: 100%; justify-content: flex-end; }
.dbc-bar-wrap { width: 100%; flex: 1; display: flex; align-items: flex-end; }
.dbc-bar {
  width: 100%; background: var(--green-200);
  border-radius: 5px 5px 0 0; min-height: 4px;
  transition: height 1s var(--ease);
}
.dbc-bar--gold { background: var(--gold); }
.dbc-bar--today { background: var(--green-600); }
.dbc-label { font-size: 10px; color: var(--text-muted); white-space: nowrap; }
.dash-big-value { font-family: var(--font-serif); font-size: 26px; font-weight: 500; color: var(--text-primary); display: block; }
.dash-delta-label { font-size: 12px; font-weight: 600; color: var(--green-600); margin-left: 8px; }

/* Donut */
.dash-donut-wrap { display: flex; align-items: center; gap: 20px; }
.dash-donut { flex-shrink: 0; }
.dash-donut-legend { display: flex; flex-direction: column; gap: 9px; }
.ddl-item { display: flex; align-items: center; gap: 7px; font-size: 12.5px; }
.ddl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ddl-nome { flex: 1; color: var(--text-secondary); }
.ddl-pct { color: var(--text-muted); white-space: nowrap; }

/* Tabs */
.dash-tab {
  padding: 4px 10px; border: 1px solid var(--border-2); border-radius: 6px;
  background: none; font-size: 12px; color: var(--text-muted); cursor: pointer;
  font-family: var(--font-sans); transition: all 0.15s;
}
.dash-tab.active { background: var(--green-800); color: white; border-color: var(--green-800); }
.dash-tab:hover:not(.active) { background: var(--cream-2); }

/* Agenda timeline (right col) */
.dash-timeline { padding: 8px 0; max-height: 340px; overflow-y: auto; }
.dtl-item {
  display: flex; align-items: stretch; gap: 0;
  padding: 0 16px 0 14px; margin-bottom: 4px;
}
.dtl-hour { font-size: 11px; color: var(--text-muted); min-width: 38px; padding-top: 12px; font-variant-numeric: tabular-nums; }
.dtl-card {
  flex: 1; background: var(--cream); border-radius: 10px;
  padding: 10px 12px; border-left: 3px solid transparent;
  transition: background 0.15s;
}
.dtl-item--confirm .dtl-card  { border-left-color: var(--status-confirm-dot); }
.dtl-item--pending .dtl-card  { border-left-color: var(--status-pending-dot); }
.dtl-item--active .dtl-card   { border-left-color: var(--status-active-dot); background: #FFF8F0; }
.dtl-item--done .dtl-card     { border-left-color: var(--status-done-dot); opacity: 0.7; }
.dtl-item--cancel .dtl-card   { border-left-color: var(--status-cancel-dot); opacity: 0.55; }
.dtl-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.dtl-svc  { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
.dtl-prof { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); margin-top: 4px; }

/* Bottom row */
.dash-bottom {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  margin-bottom: 32px;
}

/* Próximos agendamentos list */
.dag-row {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 18px; border-bottom: 1px solid var(--border);
  transition: background 0.12s;
}
.dag-row:last-child { border-bottom: none; }
.dag-row:hover { background: var(--cream); }
.dag-hour { font-size: 14px; font-weight: 600; color: var(--text-secondary); min-width: 44px; font-variant-numeric: tabular-nums; }
.dag-info { flex: 1; min-width: 0; }
.dag-name { font-size: 13.5px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dag-svc  { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
.dag-prof { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); min-width: 100px; }
.dag-ver-todos {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 14px;
  background: none; border: none; border-top: 1px solid var(--border);
  font-size: 13px; color: var(--green-600); cursor: pointer;
  font-family: var(--font-sans); font-weight: 500;
  transition: background 0.15s;
}
.dag-ver-todos:hover { background: var(--cream); }

/* Recepção status */
.drs-item {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px; border-radius: var(--r-lg); background: var(--cream);
}
.drs-icon {
  width: 42px; height: 42px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.drs-label { font-size: 13.5px; font-weight: 500; color: var(--text-primary); }
.drs-count { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* Footer */
.dash-footer {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 20px 0 8px;
  border-top: 1px solid var(--border);
}
.dash-footer span:first-of-type {
  font-family: var(--font-serif);
  font-size: 15px; font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1.5px;
}
.dash-footer-sub {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

@media (max-width: 1400px) { .dash-kpi-row { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 1100px) { .dash-mid { grid-template-columns: 1fr 1fr; } .dash-agenda-hoje { display: none; } }
@media (max-width: 900px)  { .dash-mid { grid-template-columns: 1fr; } .dash-bottom { grid-template-columns: 1fr; } }
@media (max-width: 640px)  { .dash-kpi-row { grid-template-columns: 1fr 1fr; } }
</style>