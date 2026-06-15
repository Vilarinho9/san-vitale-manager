<template>
  <div class="page-layout">
    <Sidebar />
    <div class="page-main">
      <TopBar title="Financeiro" subtitle="Análise financeira do studio">
        <template #stats>
          <div class="export-btns">
            <button class="export-btn" @click="mockExport('PDF')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Exportar PDF
            </button>
            <button class="export-btn" @click="mockExport('Excel')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
              Exportar Excel
            </button>
          </div>
        </template>
      </TopBar>

      <div class="page-content">

        <!-- Finance Cards -->
        <div class="fin-cards fade-in">
          <div class="fin-card" v-for="c in finCards" :key="c.label" :style="{'--fc': c.color}">
            <div class="fc-icon" :style="{background: c.iconBg}"><span v-html="c.icon"></span></div>
            <div>
              <p class="fc-label">{{ c.label }}</p>
              <h3 class="fc-val">{{ c.value }}</h3>
              <p class="fc-sub">{{ c.sub }}</p>
            </div>
            <div class="fc-trend" :class="c.trendUp ? 'up' : 'down'">{{ c.trend }}</div>
          </div>
        </div>

        <div class="fin-grid">

          <!-- Receita mensal bar chart (CSS) -->
          <div class="card fade-in fade-in-delay-1">
            <div class="card-header">
              <h3>Faturamento Mensal</h3>
              <span class="year-label">2025</span>
            </div>
            <div class="bar-chart">
              <div class="bc-item" v-for="m in mesesData" :key="m.mes">
                <div class="bc-bar-wrap">
                  <div class="bc-bar" :style="{height: m.pct + '%'}" :title="'R$ ' + m.valor"></div>
                </div>
                <span class="bc-label">{{ m.mes }}</span>
              </div>
            </div>
          </div>

          <!-- Receita por categoria -->
          <div class="card fade-in fade-in-delay-2">
            <div class="card-header"><h3>Receita por Categoria</h3></div>
            <div class="cat-list">
              <div class="cat-item" v-for="c in catReceita" :key="c.cat">
                <div class="cat-dot" :style="{background: c.color}"></div>
                <span class="cat-name">{{ c.cat }}</span>
                <div class="cat-bar-wrap"><div class="cat-bar" :style="{width: c.pct+'%', background: c.color}"></div></div>
                <span class="cat-val">R$ {{ c.valor.toLocaleString('pt-BR') }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Transactions Table -->
        <div class="card fade-in fade-in-delay-3">
          <div class="card-header">
            <h3>Histórico de Atendimentos Concluídos</h3>
            <span class="tag-badge">{{ concluidos.length }} registros</span>
          </div>
          <div v-if="loading" class="skeleton-list">
            <div class="skeleton skeleton-row" v-for="i in 5" :key="i"></div>
          </div>
          <table v-else class="fin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="concluidos.length === 0">
                <td colspan="6">
                  <div class="empty-state-elegant">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <h4>Sem registros ainda</h4>
                    <p>Os atendimentos concluídos aparecerão aqui.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="a in concluidos" :key="a.id" class="fin-row">
                <td>{{ fmtDate(a.data) }}</td>
                <td><strong>{{ a.clientes?.nome || '—' }}</strong></td>
                <td>{{ a.servicos?.nome || '—' }}</td>
                <td><span class="cat-chip">{{ a.servicos?.categoria || '—' }}</span></td>
                <td class="val-cell">R$ {{ Number(a.servicos?.valor || 0).toFixed(2) }}</td>
                <td><span class="badge-status badge-concluido">Concluído</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import api from '@/services/api'

const loading = ref(true)
const agendamentos = ref([])

const concluidos = computed(() =>
  agendamentos.value.filter(a => a.status === 'Concluído' || a.status === 'Concluido')
)

const totalMes = computed(() => concluidos.value.reduce((s, a) => s + (a.servicos?.valor || 0), 0))
const ticketMedio = computed(() => concluidos.value.length ? totalMes.value / concluidos.value.length : 0)
const totalMesFmt = computed(() => 'R$ ' + totalMes.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))

const finCards = computed(() => [
  { label: 'Receita do Mês', value: totalMesFmt.value, sub: 'Atendimentos concluídos', trend: '↑ 22%', trendUp: true, color: '#1A6B3C', iconBg: 'rgba(26,107,60,0.08)', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { label: 'Ticket Médio', value: 'R$ ' + ticketMedio.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), sub: 'Por atendimento', trend: '↑ 5%', trendUp: true, color: '#1A56B8', iconBg: 'rgba(26,86,184,0.08)', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56B8" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  { label: 'Atendimentos Concluídos', value: concluidos.value.length, sub: 'No período', trend: '→ estável', trendUp: false, color: '#6F8F7B', iconBg: 'rgba(111,143,123,0.1)', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/></svg>` },
  { label: 'Serviço Mais Vendido', value: topServico.value, sub: 'Este mês', trend: '↑ popular', trendUp: true, color: '#92620A', iconBg: 'rgba(146,98,10,0.08)', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92620A" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
])

const topServico = computed(() => {
  const counts = {}
  concluidos.value.forEach(a => {
    const n = a.servicos?.nome || 'N/A'
    counts[n] = (counts[n] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1])
  return sorted[0]?.[0] || 'Massagem Relaxante'
})

const mesesData = [
  { mes: 'Jan', valor: 3200, pct: 55 },
  { mes: 'Fev', valor: 2800, pct: 48 },
  { mes: 'Mar', valor: 4100, pct: 70 },
  { mes: 'Abr', valor: 3700, pct: 63 },
  { mes: 'Mai', valor: 5200, pct: 88 },
  { mes: 'Jun', valor: 4800, pct: 82 },
  { mes: 'Jul', valor: 5800, pct: 100 },
  { mes: 'Ago', valor: 0, pct: 0 },
]

const catReceita = [
  { cat: 'Relaxamento', valor: 2400, pct: 100, color: '#6F8F7B' },
  { cat: 'Drenagem e Modeladora', valor: 1800, pct: 75, color: '#4E6B5B' },
  { cat: 'Cuidados com a face', valor: 1200, pct: 50, color: '#1A56B8' },
  { cat: 'Premium', valor: 950, pct: 40, color: '#92620A' },
  { cat: 'Alívio de dores', valor: 720, pct: 30, color: '#B81A1A' },
]

function fmtDate(d) {
  if (!d) return '—'
  const [y,m,day] = d.split('-')
  return `${day}/${m}/${y}`
}

function mockExport(type) {
  alert(`📊 Exportação em ${type} disponível na versão completa do sistema.`)
}

onMounted(async () => {
  try {
    const res = await api.get('/agendamentos')
    agendamentos.value = res.data
  } catch {}
  finally { loading.value = false }
})
</script>

<style scoped>
.export-btns { display: flex; gap: 8px; }
.export-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-color); background: var(--bg-card);
  font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
  color: var(--text-dark); cursor: pointer; transition: var(--transition);
}
.export-btn:hover { background: var(--green-pale); border-color: var(--green-primary); color: var(--green-dark); }

.fin-cards {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;
}
.fin-card {
  background: var(--bg-card); border-radius: var(--radius);
  border: 1px solid var(--border-color); box-shadow: var(--shadow);
  padding: 20px; display: flex; gap: 14px; align-items: flex-start;
  transition: var(--transition); position: relative; overflow: hidden;
}
.fin-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--fc); }
.fin-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.fc-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fc-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-muted); font-weight: 500; margin-bottom: 4px; }
.fc-val { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; color: var(--text-dark); line-height: 1; }
.fc-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
.fc-trend { position: absolute; right: 14px; top: 14px; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }
.fc-trend.up { background: #E8F5EF; color: #1A6B3C; }
.fc-trend.down { background: var(--bg-soft); color: var(--text-muted); }

.fin-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 20px; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px; border-bottom: 1px solid var(--border-color);
}
.card-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--text-dark); }
.year-label { font-size: 12px; color: var(--text-muted); }
.tag-badge { font-size: 11px; background: var(--green-pale); color: var(--green-dark); padding: 3px 10px; border-radius: 99px; font-weight: 600; }

/* Bar chart */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; padding: 20px 20px 14px; height: 160px; }
.bc-item { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; height: 100%; justify-content: flex-end; }
.bc-bar-wrap { width: 100%; flex: 1; display: flex; align-items: flex-end; }
.bc-bar { width: 100%; background: var(--green-primary); border-radius: 5px 5px 0 0; min-height: 4px; transition: height 1s ease; }
.bc-label { font-size: 10px; color: var(--text-muted); }

/* Category list */
.cat-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.cat-item { display: flex; align-items: center; gap: 10px; }
.cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cat-name { font-size: 12px; color: var(--text-dark); width: 150px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cat-bar-wrap { flex: 1; height: 6px; background: var(--border-color); border-radius: 99px; overflow: hidden; }
.cat-bar { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.cat-val { font-size: 12px; font-weight: 600; color: var(--text-dark); min-width: 80px; text-align: right; }

/* Table */
.fin-table { width: 100%; border-collapse: collapse; }
.fin-table th {
  padding: 11px 16px; text-align: left;
  font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
  color: var(--text-muted); border-bottom: 1px solid var(--border-color);
  background: var(--bg-soft);
}
.fin-table td { padding: 13px 16px; font-size: 13.5px; color: var(--text-dark); border-bottom: 1px solid var(--border-color); }
.fin-row:hover { background: var(--bg-soft); }
.fin-row:last-child td { border-bottom: none; }
.val-cell { font-weight: 600; color: var(--green-dark); }
.cat-chip { background: var(--bg-soft); color: var(--text-muted); padding: 3px 9px; border-radius: 99px; font-size: 11px; border: 1px solid var(--border-color); }

.skeleton-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-row { height: 48px; border-radius: var(--radius-sm); }

@media (max-width: 1100px) { .fin-cards { grid-template-columns: repeat(2, 1fr); } .fin-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .fin-cards { grid-template-columns: 1fr 1fr; } }
</style>