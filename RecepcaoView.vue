<template>
  <div class="sv-layout">
    <Sidebar />

    <div class="sv-main rec-main">

      <!-- ═══════════════════════════════════════
           TOPBAR
      ═══════════════════════════════════════ -->
      <header class="rec-topbar">
        <div class="rec-topbar-left">
          <h1 class="rec-title">Recepção</h1>
          <p class="rec-subtitle">Monitoramento operacional em tempo real</p>
        </div>

        <div class="rec-topbar-right">
          <!-- Relógio -->
          <div class="rec-clock">
            <div class="clock-time">{{ horaAtual }}</div>
            <div class="clock-date">{{ dataAtual }}</div>
          </div>

          <div class="rec-actions">
            <button class="sv-btn sv-btn-secondary" @click="atualizar" :class="{ 'btn--spinning': atualizando }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                :style="{ animation: atualizando ? 'spin 0.8s linear infinite' : 'none' }">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Atualizar
            </button>
            <button class="sv-btn sv-btn-secondary" @click="showCheckin = true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Check-in
            </button>
            <button class="sv-btn sv-btn-primary" @click="$router.push('/agendamentos')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo Atendimento
            </button>
          </div>
        </div>
      </header>

      <!-- ═══════════════════════════════════════
           CONTEÚDO
      ═══════════════════════════════════════ -->
      <div class="rec-body">

        <!-- ── KPI Cards ── -->
        <div class="rec-kpis anim-up">
          <div v-for="k in kpis" :key="k.label" class="rec-kpi" :style="{ '--kc': k.color }">
            <div class="rec-kpi-icon" :style="{ background: k.iconBg }">
              <span v-html="k.icon"></span>
            </div>
            <div class="rec-kpi-body">
              <p class="rec-kpi-label">{{ k.label }}</p>
              <p class="rec-kpi-value">{{ k.value }}</p>
              <p v-if="k.sub" class="rec-kpi-sub">{{ k.sub }}</p>
            </div>
            <div class="rec-kpi-accent"></div>
          </div>
        </div>

        <!-- ── Linha principal: atendimentos ao vivo + timeline ── -->
        <div class="rec-main-row anim-up d-2">

          <!-- Atendimentos Ao Vivo -->
          <div class="rec-atendimentos">
            <div class="rec-section-head">
              <div>
                <h2 class="rec-section-title">Atendimentos Ao Vivo</h2>
                <p class="rec-section-sub">{{ atendimentosAtivos.length }} atendimento{{ atendimentosAtivos.length !== 1 ? 's' : '' }} em andamento agora</p>
              </div>
              <div class="rec-live-indicator">
                <span class="live-dot"></span>
                <span>Ao vivo</span>
              </div>
            </div>

            <div class="rec-aten-list">
              <!-- Loading skeleton -->
              <template v-if="loading">
                <div v-for="i in 4" :key="i" class="skel" style="height:96px;border-radius:14px"></div>
              </template>

              <!-- Empty -->
              <div v-else-if="!atendimentosAtivos.length" class="rec-empty">
                <div class="rec-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p>Nenhum atendimento em andamento</p>
              </div>

              <!-- Cards de atendimento -->
              <template v-else>
                <div
                  v-for="(at, idx) in atendimentosAtivos"
                  :key="at.id"
                  class="rec-aten-card"
                  :class="[`status--${at.statusKey}`, { 'card-pulse': at.statusKey === 'ativo' }]"
                  :style="{ animationDelay: idx * 0.04 + 's' }"
                >
                  <div class="rac-left">
                    <div class="rac-avatar sv-avatar" :style="{ background: at.avatarColor, width:'46px', height:'46px', fontSize:'17px', fontWeight:'700', flexShrink:0 }">
                      {{ at.iniciais }}
                    </div>
                    <div class="rac-info">
                      <p class="rac-name">{{ at.nome }}</p>
                      <p class="rac-svc">{{ at.servico }}</p>
                      <div class="rac-meta">
                        <span class="rac-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {{ at.profissional }}
                        </span>
                        <span class="rac-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {{ at.horario }} · {{ at.duracao }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="rac-right">
                    <span class="rec-badge" :class="`rb--${at.statusKey}`">{{ at.status }}</span>
                    <div v-if="at.statusKey === 'ativo'" class="rac-timer">
                      <div class="timer-bar" :style="{ width: at.progresso + '%' }"></div>
                    </div>
                    <div class="rac-actions">
                      <button class="rac-btn" @click="avancarStatus(at)" :title="at.proximoStatus">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                      <button class="rac-btn rac-btn--wa" @click="enviarWA(at)" title="WhatsApp">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12 12 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Profissionais -->
            <div class="rec-profs-section">
              <h3 class="rec-profs-title">Status dos Profissionais</h3>
              <div class="rec-profs-grid">
                <div v-for="p in profissionais" :key="p.id" class="rec-prof-card" :class="`prof--${p.statusKey}`">
                  <div class="rpc-avatar sv-avatar" :style="{ background: p.color, width:'38px', height:'38px', fontSize:'14px', fontWeight:'600', flexShrink:0, position:'relative' }">
                    {{ p.iniciais }}
                    <span class="rpc-status-dot" :class="`dot--${p.statusKey}`"></span>
                  </div>
                  <div class="rpc-info">
                    <p class="rpc-name">{{ p.nome }}</p>
                    <p class="rpc-esp">{{ p.especialidade }}</p>
                    <p class="rpc-status">{{ p.statusLabel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline ao vivo -->
          <div class="rec-timeline-col">
            <div class="rec-section-head">
              <h2 class="rec-section-title">Atividades</h2>
              <button class="tl-clear-btn" @click="limparTimeline">Limpar</button>
            </div>

            <div class="rec-timeline" ref="timelineRef">
              <transition-group name="tl-item" tag="div" class="tl-list">
                <div v-for="ev in timeline" :key="ev.id" class="tl-event">
                  <div class="tl-left">
                    <div class="tl-icon-wrap" :class="`tl-icon--${ev.type}`">
                      <span v-html="ev.icon"></span>
                    </div>
                    <div class="tl-line" v-if="ev.id !== timeline[timeline.length-1]?.id"></div>
                  </div>
                  <div class="tl-body">
                    <p class="tl-text">{{ ev.text }}</p>
                    <span class="tl-time">{{ ev.hora }}</span>
                  </div>
                </div>
              </transition-group>

              <div v-if="!timeline.length" class="rec-empty" style="padding:24px 0">
                <div class="rec-empty-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <p>Sem atividades recentes</p>
              </div>
            </div>
          </div>

        </div>

        <!-- ── Painel lateral + próximos + alertas + resumo ── -->
        <div class="rec-bottom-row anim-up d-3">

          <!-- Próximos horários -->
          <div class="rec-card">
            <div class="rec-card-head">
              <h3>Próximos Horários</h3>
              <span class="rec-card-count">{{ proximosHorarios.length }}</span>
            </div>
            <div class="rec-proximos-list">
              <div v-for="p in proximosHorarios" :key="p.id" class="rec-prox-item">
                <div class="rpi-hora">{{ p.hora }}</div>
                <div class="sv-avatar rpi-ava" :style="{ background: p.avatarColor, width:'32px', height:'32px', fontSize:'12px', fontWeight:'600', flexShrink:0 }">
                  {{ p.iniciais }}
                </div>
                <div class="rpi-info">
                  <p class="rpi-nome">{{ p.nome }}</p>
                  <p class="rpi-svc">{{ p.servico }} · {{ p.prof }}</p>
                </div>
                <span class="rec-badge" :class="`rb--${p.statusKey}`">{{ p.status }}</span>
              </div>
              <div v-if="!proximosHorarios.length" class="rec-empty" style="padding:16px 0">
                <p>Sem horários próximos</p>
              </div>
            </div>
          </div>

          <!-- Alertas -->
          <div class="rec-card">
            <div class="rec-card-head">
              <h3>Alertas</h3>
              <span class="rec-badge rb--pending">{{ alertas.filter(a => !a.lido).length }} novos</span>
            </div>
            <div class="rec-alertas-list">
              <div
                v-for="a in alertas"
                :key="a.id"
                class="rec-alerta"
                :class="[`alerta--${a.type}`, { 'alerta--lido': a.lido }]"
                @click="a.lido = true"
              >
                <div class="alerta-icon" :class="`ai--${a.type}`">
                  <span v-html="a.icon"></span>
                </div>
                <div class="alerta-body">
                  <p class="alerta-text">{{ a.text }}</p>
                  <span class="alerta-time">{{ a.hora }}</span>
                </div>
                <div v-if="!a.lido" class="alerta-unread"></div>
              </div>
              <div v-if="!alertas.length" class="rec-empty" style="padding:16px 0">
                <p>Nenhum alerta no momento</p>
              </div>
            </div>
          </div>

          <!-- Resumo do dia -->
          <div class="rec-card rec-resumo">
            <div class="rec-card-head">
              <h3>Resumo do Dia</h3>
              <span class="rec-resumo-date">{{ dataAtual }}</span>
            </div>
            <div class="rec-resumo-body">
              <div v-for="r in resumo" :key="r.label" class="resumo-item">
                <div class="resumo-label">
                  <span class="resumo-icon" v-html="r.icon"></span>
                  <span>{{ r.label }}</span>
                </div>
                <span class="resumo-value" :style="{ color: r.color || 'var(--text-primary)' }">{{ r.value }}</span>
              </div>

              <!-- Barra de ocupação -->
              <div class="resumo-ocupacao">
                <div class="ro-head">
                  <span>Taxa de Ocupação</span>
                  <span class="ro-pct">{{ taxaOcupacao }}%</span>
                </div>
                <div class="ro-bar">
                  <div class="ro-fill" :style="{ width: taxaOcupacao + '%' }"></div>
                </div>
              </div>

              <!-- Formas de pagamento -->
              <div class="resumo-pagtos">
                <p class="rp-title">Formas de Pagamento</p>
                <div class="rp-list">
                  <div v-for="pg in pagamentos" :key="pg.label" class="rp-item">
                    <span class="rp-dot" :style="{ background: pg.color }"></span>
                    <span class="rp-label">{{ pg.label }}</span>
                    <span class="rp-val">{{ pg.val }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════
         MODAL CHECK-IN
    ═══════════════════════════════════════ -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showCheckin" class="sv-overlay" @click.self="showCheckin=false">
          <div class="sv-modal checkin-modal">
            <div class="sv-modal-head">
              <h2>Check-in de Cliente</h2>
              <button class="sv-modal-close" @click="showCheckin=false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="sv-modal-body" style="display:flex;flex-direction:column;gap:16px">
              <div class="checkin-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input v-model="checkinBusca" placeholder="Buscar cliente por nome ou telefone..." class="sv-input" style="padding-left:38px" />
              </div>
              <div class="checkin-lista">
                <div
                  v-for="ag in checkinFiltrado"
                  :key="ag.id"
                  class="checkin-item"
                  :class="{ 'ci--selected': checkinSelecionado?.id === ag.id }"
                  @click="checkinSelecionado = ag"
                >
                  <div class="sv-avatar" style="width:38px;height:38px;font-size:15px;font-weight:700;flex-shrink:0" :style="{ background: '#4E6B5B' }">
                    {{ ag.nome?.charAt(0) || '?' }}
                  </div>
                  <div style="flex:1">
                    <p style="font-weight:600;font-size:13.5px;color:var(--text-primary)">{{ ag.nome }}</p>
                    <p style="font-size:12px;color:var(--text-muted)">{{ ag.servico }} · {{ ag.hora }}</p>
                  </div>
                  <span class="rec-badge rb--pending">{{ ag.status }}</span>
                </div>
                <div v-if="!checkinFiltrado.length" class="rec-empty" style="padding:20px">
                  <p>Nenhum cliente encontrado</p>
                </div>
              </div>
            </div>
            <div class="sv-modal-foot">
              <button class="sv-btn sv-btn-secondary" @click="showCheckin=false">Cancelar</button>
              <button class="sv-btn sv-btn-primary" @click="fazerCheckin" :disabled="!checkinSelecionado">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/></svg>
                Confirmar Check-in
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import api from '@/services/api'

/* ─── Relógio ─── */
const horaAtual = ref('')
const dataAtual = ref('')
let clockInterval = null

function tickClock() {
  const now = new Date()
  horaAtual.value = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  dataAtual.value = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

/* ─── Estado ─── */
const loading      = ref(true)
const atualizando  = ref(false)
const agendamentos = ref([])
const showCheckin  = ref(false)
const checkinBusca = ref('')
const checkinSelecionado = ref(null)
const timelineRef  = ref(null)

/* ─── Profissionais mock ─── */
const profissionais = ref([
  { id:'p1', nome:'Patrícia Lima',    especialidade:'Massagista',     iniciais:'PL', color:'#4E6B5B', statusKey:'livre',    statusLabel:'Disponível' },
  { id:'p2', nome:'Fernanda Costa',   especialidade:'Esteticista',    iniciais:'FC', color:'#7A9B89', statusKey:'ocupado',  statusLabel:'Em atendimento' },
  { id:'p3', nome:'Mariana Oliveira', especialidade:'Fisioterapeuta', iniciais:'MO', color:'#C9A84C', statusKey:'ocupado',  statusLabel:'Em atendimento' },
  { id:'p4', nome:'Beatriz Lima',     especialidade:'Massagista',     iniciais:'BL', color:'#5C7A69', statusKey:'intervalo',statusLabel:'Intervalo' },
  { id:'p5', nome:'Camila Silva',     especialidade:'Manicure',       iniciais:'CS', color:'#A3BFB2', statusKey:'livre',    statusLabel:'Disponível' },
  { id:'p6', nome:'Ana Rodrigues',    especialidade:'Esteticista',    iniciais:'AR', color:'#8B9B6A', statusKey:'ausente',  statusLabel:'Ausente' },
])

/* ─── Timeline de eventos ─── */
const timeline = ref([])
let timelineId = 0

const icones = {
  chegada:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  pagamento:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  inicio:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  finalizado: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  reserva:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  alerta:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  disponivel: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
}

function addEvento(text, type = 'inicio') {
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  timeline.value.unshift({ id: ++timelineId, text, type, icon: icones[type] || icones.inicio, hora })
  if (timeline.value.length > 20) timeline.value = timeline.value.slice(0, 20)
}

function limparTimeline() { timeline.value = [] }

/* ─── Eventos iniciais simulados ─── */
const eventosIniciais = [
  { text: 'Camila Silva ficou disponível', type: 'disponivel', delay: 0 },
  { text: 'Pagamento confirmado via PIX — Juliana Santos', type: 'pagamento', delay: 1 },
  { text: 'Fernanda Costa iniciou Drenagem Linfática', type: 'inicio', delay: 2 },
  { text: 'Maria Oliveira realizou check-in', type: 'chegada', delay: 3 },
  { text: 'Nova reserva criada: Beatriz Lima — 16h00', type: 'reserva', delay: 4 },
  { text: 'Atendimento de Patrícia finalizado', type: 'finalizado', delay: 5 },
  { text: 'Cliente Ana aguardando na recepção', type: 'alerta', delay: 6 },
]

/* ─── Alertas ─── */
const alertas = ref([
  { id:1, text:'Camila Silva atrasou 10 minutos no atendimento', type:'urgente', hora:'14:35', lido:false,
    icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id:2, text:'Pagamento pendente: Massagem Relaxante — R$ 120', type:'pagamento', hora:'14:20', lido:false,
    icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` },
  { id:3, text:'Sala 2 disponível para próximo atendimento', type:'info', hora:'14:10', lido:false,
    icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
  { id:4, text:'Encaixe disponível às 15h30 com Fernanda', type:'ok', hora:'13:55', lido:true,
    icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>` },
])

/* ─── Mock de atendimentos ao vivo ─── */
const cores = ['#4E6B5B','#7A9B89','#C9A84C','#5C7A69','#A3BFB2','#8B9B6A']

const atendimentosMock = ref([
  { id:'a1', nome:'Camila Silva',   iniciais:'CS', avatarColor: cores[0], servico:'Massagem Relaxante', profissional:'Patrícia Lima', horario:'09:00', duracao:'60 min', status:'Em atendimento', statusKey:'ativo',      progresso: 65, proximoStatus:'Finalizar', telefone:'86999990001' },
  { id:'a2', nome:'Juliana Santos', iniciais:'JS', avatarColor: cores[1], servico:'Limpeza de Pele',    profissional:'Fernanda Costa', horario:'10:30', duracao:'90 min', status:'Em atendimento', statusKey:'ativo',      progresso: 40, proximoStatus:'Finalizar', telefone:'86999990002' },
  { id:'a3', nome:'Maria Oliveira', iniciais:'MO', avatarColor: cores[2], servico:'Drenagem Linfática', profissional:'Mariana Oliveira', horario:'14:00', duracao:'60 min', status:'Cliente chegou', statusKey:'chegou',    progresso: 0,  proximoStatus:'Iniciar',  telefone:'86999990003' },
  { id:'a4', nome:'Beatriz Lima',   iniciais:'BL', avatarColor: cores[3], servico:'Peeling Diamante',   profissional:'Fernanda Costa', horario:'15:30', duracao:'45 min', status:'Confirmado',    statusKey:'confirmado', progresso: 0,  proximoStatus:'Check-in', telefone:'86999990004' },
])

const atendimentosAtivos = computed(() => atendimentosMock.value)

/* ─── Próximos horários ─── */
const proximosHorarios = ref([
  { id:'n1', nome:'Alessandra Rocha', iniciais:'AR', avatarColor: cores[4], servico:'Massagem Terapêutica', prof:'Patrícia Lima',    hora:'16:00', status:'Confirmado',  statusKey:'confirmado' },
  { id:'n2', nome:'Paula Mendes',     iniciais:'PM', avatarColor: cores[5], servico:'Reflexologia Podal',   prof:'Beatriz Lima',     hora:'16:30', status:'Pendente',    statusKey:'pending' },
  { id:'n3', nome:'Fernanda Castro',  iniciais:'FC', avatarColor: cores[0], servico:'Limpeza de Pele',      prof:'Fernanda Costa',   hora:'17:00', status:'Confirmado',  statusKey:'confirmado' },
  { id:'n4', nome:'Sandra Alves',     iniciais:'SA', avatarColor: cores[2], servico:'Aromaterapia',         prof:'Mariana Oliveira', hora:'17:30', status:'Pendente',    statusKey:'pending' },
])

/* ─── Resumo ─── */
const resumo = [
  { label:'Total de atendimentos', value:'12', color:'var(--text-primary)',
    icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { label:'Faturamento do dia',    value:'R$ 2.840,00', color:'#2D6B45',
    icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { label:'Cancelamentos',         value:'1',           color:'#C0392B',
    icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>` },
  { label:'Clientes presentes',    value:'4',
    icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
]

const taxaOcupacao = ref(72)

const pagamentos = [
  { label:'Pix',     val:'R$ 1.440', color:'#4CAF78' },
  { label:'Cartão',  val:'R$ 960',   color:'#1D4ED8' },
  { label:'Dinheiro',val:'R$ 440',   color:'#C9A84C' },
]

/* ─── KPIs ─── */
const kpis = computed(() => [
  {
    label: 'Clientes no SPA',
    value: atendimentosMock.value.filter(a => ['ativo','chegou'].includes(a.statusKey)).length,
    sub: 'presentes agora',
    color: '#4E6B5B',
    iconBg: 'rgba(78,107,91,0.1)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    label: 'Em Atendimento',
    value: atendimentosMock.value.filter(a => a.statusKey === 'ativo').length,
    sub: 'salas ativas',
    color: '#F07F2A',
    iconBg: 'rgba(240,127,42,0.08)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F07F2A" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  },
  {
    label: 'Pagamentos Confirmados',
    value: 8,
    sub: 'hoje',
    color: '#2D6B45',
    iconBg: 'rgba(45,107,69,0.08)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B45" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/><path d="M9 11l3 3"/></svg>`
  },
  {
    label: 'Fila de Espera',
    value: 2,
    sub: 'aguardando',
    color: '#8B6200',
    iconBg: 'rgba(139,98,0,0.08)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B6200" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
  },
  {
    label: 'Profissionais Livres',
    value: profissionais.value.filter(p => p.statusKey === 'livre').length,
    sub: 'disponíveis',
    color: '#4CAF78',
    iconBg: 'rgba(76,175,120,0.08)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF78" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    label: 'Receita do Dia',
    value: 'R$ 2.840',
    sub: '+14% vs ontem',
    color: '#2D6B45',
    iconBg: 'rgba(45,107,69,0.08)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B45" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
])

/* ─── Check-in mock list ─── */
const checkinLista = ref([
  { id:'c1', nome:'Alessandra Rocha', servico:'Massagem Terapêutica', hora:'16:00', status:'Confirmado' },
  { id:'c2', nome:'Paula Mendes',     servico:'Reflexologia Podal',   hora:'16:30', status:'Pendente' },
  { id:'c3', nome:'Sandra Alves',     servico:'Aromaterapia',         hora:'17:30', status:'Pendente' },
])

const checkinFiltrado = computed(() => {
  if (!checkinBusca.value.trim()) return checkinLista.value
  const q = checkinBusca.value.toLowerCase()
  return checkinLista.value.filter(c => c.nome.toLowerCase().includes(q) || c.servico.toLowerCase().includes(q))
})

function fazerCheckin() {
  if (!checkinSelecionado.value) return
  const c = checkinSelecionado.value
  addEvento(`Check-in realizado: ${c.nome} — ${c.servico}`, 'chegada')
  checkinLista.value = checkinLista.value.filter(x => x.id !== c.id)

  // Adicionar como atendimento ativo
  atendimentosMock.value.unshift({
    id: 'a' + Date.now(),
    nome: c.nome,
    iniciais: c.nome.split(' ').map(n => n[0]).slice(0,2).join(''),
    avatarColor: cores[Math.floor(Math.random() * cores.length)],
    servico: c.servico,
    profissional: 'Patrícia Lima',
    horario: c.hora,
    duracao: '60 min',
    status: 'Cliente chegou',
    statusKey: 'chegou',
    progresso: 0,
    proximoStatus: 'Iniciar',
    telefone: ''
  })

  showCheckin.value = false
  checkinSelecionado.value = null
  checkinBusca.value = ''
}

/* ─── Ações ─── */
const statusFlow = {
  confirmado: { next: 'chegou',    label: 'Cliente chegou', statusKey: 'chegou' },
  chegou:     { next: 'ativo',     label: 'Em atendimento', statusKey: 'ativo' },
  ativo:      { next: 'finalizado',label: 'Finalizado',     statusKey: 'finalizado' },
}

function avancarStatus(at) {
  const flow = statusFlow[at.statusKey]
  if (!flow) return
  const old = at.status
  at.status    = flow.label
  at.statusKey = flow.next
  if (at.statusKey === 'ativo') at.progresso = 0
  addEvento(`${at.nome}: ${old} → ${flow.label}`, flow.next === 'ativo' ? 'inicio' : flow.next === 'finalizado' ? 'finalizado' : 'chegada')
}

function enviarWA(at) {
  const tel = at.telefone?.replace(/\D/g,'')
  if (!tel) return
  const msg = `Olá, ${at.nome}! 🌿 Lembrete do seu atendimento de *${at.servico}* às *${at.horario}* na San Vitale. Estamos aguardando você!`
  window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank')
}

async function atualizar() {
  atualizando.value = true
  await new Promise(r => setTimeout(r, 1000))
  atualizando.value = false
  addEvento('Painel atualizado manualmente', 'info')
}

/* ─── Simulação de eventos em tempo real ─── */
let eventTimer = null
const eventosSim = [
  { text: 'Pagamento via Pix confirmado — R$ 120,00', type: 'pagamento' },
  { text: 'Cliente Laura chegou para Massagem Relaxante', type: 'chegada' },
  { text: 'Beatriz Lima iniciou atendimento — Sala 2', type: 'inicio' },
  { text: 'Profissional Patrícia ficou disponível', type: 'disponivel' },
  { text: 'Nova reserva: Amanhã, 10h — Drenagem', type: 'reserva' },
  { text: 'Atendimento de Juliana finalizado', type: 'finalizado' },
  { text: 'Cliente aguardando há 5 minutos', type: 'alerta' },
]
let simIdx = 0

function startSimulation() {
  eventTimer = setInterval(() => {
    const ev = eventosSim[simIdx % eventosSim.length]
    addEvento(ev.text, ev.type)
    simIdx++
    // Atualizar progresso dos ativos
    atendimentosMock.value.forEach(a => {
      if (a.statusKey === 'ativo' && a.progresso < 100) {
        a.progresso = Math.min(100, a.progresso + 3)
      }
    })
  }, 8000)
}

/* ─── Lifecycle ─── */
onMounted(async () => {
  tickClock()
  clockInterval = setInterval(tickClock, 1000)

  // Carregar agendamentos reais
  try {
    const res = await api.get('/agendamentos')
    agendamentos.value = res.data
  } catch (e) {
    console.error('Erro ao carregar agendamentos:', e)
  } finally {
    loading.value = false
  }

  // Eventos iniciais
  eventosIniciais.forEach(ev => {
    setTimeout(() => addEvento(ev.text, ev.type), ev.delay * 300)
  })

  // Simulação em tempo real
  setTimeout(startSimulation, 3000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearInterval(eventTimer)
})
</script>

<style scoped>
/* ════ MAIN ════ */
.rec-main { background: var(--cream); }

/* ════ TOPBAR ════ */
.rec-topbar {
  height: 70px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; gap: 16px; flex-shrink: 0;
}
.rec-title {
  font-family: var(--font-serif);
  font-size: 26px; font-weight: 400; color: var(--text-primary); line-height: 1;
}
.rec-subtitle { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }

.rec-topbar-right { display: flex; align-items: center; gap: 12px; }

.rec-clock {
  text-align: right; margin-right: 4px;
}
.clock-time {
  font-size: 20px; font-weight: 700; color: var(--text-primary);
  font-variant-numeric: tabular-nums; letter-spacing: 0.5px; line-height: 1;
}
.clock-date {
  font-size: 11px; color: var(--text-muted);
  text-transform: capitalize; margin-top: 2px;
}

.rec-actions { display: flex; align-items: center; gap: 8px; }

/* ════ BODY ════ */
.rec-body { padding: 22px 28px; display: flex; flex-direction: column; gap: 18px; }

/* ════ KPIs ════ */
.rec-kpis {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
.rec-kpi {
  background: var(--white);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  padding: 16px 18px 14px;
  display: flex; align-items: flex-start; gap: 12px;
  position: relative; overflow: hidden;
  transition: all 0.2s var(--ease);
}
.rec-kpi::after {
  content: ''; position: absolute;
  left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--kc);
}
.rec-kpi:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.rec-kpi-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rec-kpi-label {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.7px; color: var(--text-muted); margin-bottom: 4px;
}
.rec-kpi-value {
  font-family: var(--font-serif);
  font-size: 26px; font-weight: 600; color: var(--text-primary); line-height: 1;
}
.rec-kpi-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

/* ════ MAIN ROW ════ */
.rec-main-row {
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 16px;
  align-items: start;
}

/* ════ ATENDIMENTOS ════ */
.rec-atendimentos {
  background: var(--white);
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.rec-section-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.rec-section-title {
  font-family: var(--font-serif); font-size: 17px; font-weight: 500; color: var(--text-primary);
}
.rec-section-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.rec-live-indicator {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 500; color: #2D6B45;
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #4CAF78;
  animation: livePulse 1.8s ease-in-out infinite;
}
@keyframes livePulse {
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(76,175,120,0.4); }
  50%      { opacity: 0.85; box-shadow: 0 0 0 5px rgba(76,175,120,0); }
}

.rec-aten-list {
  padding: 12px;
  display: flex; flex-direction: column; gap: 8px;
  min-height: 100px;
}

/* Card de atendimento */
.rec-aten-card {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--cream);
  border-left: 3px solid transparent;
  transition: all 0.2s var(--ease);
  animation: fadeUp 0.38s var(--ease) both;
}
.rec-aten-card:hover { transform: translateX(3px); box-shadow: var(--shadow-sm); background: var(--white); }

.status--ativo      { border-left-color: #F07F2A; background: #FFFAF5; }
.status--confirmado { border-left-color: #4CAF78; }
.status--chegou     { border-left-color: #F5A623; background: #FFFDF5; }
.status--finalizado { border-left-color: #3DA05A; opacity: 0.7; }

@keyframes cardPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(240,127,42,0); }
  50%      { box-shadow: 0 0 0 4px rgba(240,127,42,0.12); }
}
.card-pulse { animation: cardPulse 3s ease-in-out infinite; }

.rac-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.rac-info { min-width: 0; }
.rac-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.rac-svc  { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
.rac-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
.rac-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 11.5px; color: var(--text-muted);
}

.rac-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.rac-timer {
  width: 80px; height: 4px;
  background: var(--cream-2); border-radius: 99px; overflow: hidden;
}
.timer-bar { height: 100%; background: #F07F2A; border-radius: 99px; transition: width 1s linear; }
.rac-actions { display: flex; gap: 5px; }
.rac-btn {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--cream); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-secondary); transition: all 0.15s;
}
.rac-btn:hover { background: var(--green-100); color: var(--green-700); border-color: var(--green-300); }
.rac-btn--wa { color: #22C55E; }
.rac-btn--wa:hover { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }

/* Profissionais */
.rec-profs-section {
  padding: 14px 16px;
  border-top: 1px solid var(--border);
}
.rec-profs-title {
  font-size: 12.5px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.7px; color: var(--text-muted); margin-bottom: 12px;
}
.rec-profs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.rec-prof-card {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--cream);
  border: 1px solid var(--border);
  transition: all 0.15s;
}
.rec-prof-card:hover { background: var(--white); box-shadow: var(--shadow-xs); }
.prof--livre     { border-left: 2px solid #4CAF78; }
.prof--ocupado   { border-left: 2px solid #F07F2A; }
.prof--intervalo { border-left: 2px solid #C9A84C; }
.prof--ausente   { border-left: 2px solid #9CA3AF; opacity: 0.65; }

.rpc-avatar { position: relative; }
.rpc-status-dot {
  position: absolute; bottom: 0; right: 0;
  width: 9px; height: 9px; border-radius: 50%;
  border: 2px solid var(--white);
}
.dot--livre     { background: #4CAF78; }
.dot--ocupado   { background: #F07F2A; }
.dot--intervalo { background: #C9A84C; }
.dot--ausente   { background: #9CA3AF; }

.rpc-name   { font-size: 12.5px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpc-esp    { font-size: 11px; color: var(--text-muted); }
.rpc-status { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

/* ════ TIMELINE ════ */
.rec-timeline-col {
  background: var(--white);
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  display: flex; flex-direction: column;
  max-height: 600px;
}
.tl-clear-btn {
  background: none; border: none; cursor: pointer;
  font-size: 12px; color: var(--text-muted);
  font-family: var(--font-sans); padding: 2px 6px;
  border-radius: 4px; transition: all 0.15s;
}
.tl-clear-btn:hover { background: var(--cream-2); color: var(--text-primary); }

.rec-timeline {
  flex: 1; overflow-y: auto; padding: 12px 16px;
}
.tl-list { display: flex; flex-direction: column; gap: 0; }

/* Item da timeline */
.tl-event {
  display: flex; gap: 12px; padding: 10px 0;
}
.tl-left {
  display: flex; flex-direction: column; align-items: center; flex-shrink: 0;
}
.tl-icon-wrap {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.tl-icon--chegada   { background: #EBF5EE; color: #2D6B45; }
.tl-icon--pagamento { background: #E8F0FE; color: #1D4ED8; }
.tl-icon--inicio    { background: #FFF0E0; color: #8B4500; }
.tl-icon--finalizado{ background: #F0FDF4; color: #15803D; }
.tl-icon--reserva   { background: var(--cream-2); color: var(--text-secondary); }
.tl-icon--alerta    { background: #FDF3E0; color: #8B6200; }
.tl-icon--disponivel{ background: var(--green-100); color: var(--green-700); }
.tl-icon--info      { background: var(--cream-2); color: var(--text-secondary); }

.tl-line {
  width: 1px; flex: 1; background: var(--border); margin: 4px 0;
  min-height: 12px;
}
.tl-body { flex: 1; min-width: 0; padding-top: 5px; }
.tl-text { font-size: 12.5px; color: var(--text-primary); line-height: 1.45; }
.tl-time { font-size: 11px; color: var(--text-muted); margin-top: 3px; display: block; }

/* Timeline transitions */
.tl-item-enter-active { transition: all 0.35s var(--ease); }
.tl-item-enter-from   { opacity: 0; transform: translateY(-10px) scale(0.97); }

/* ════ BOTTOM ROW ════ */
.rec-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}

/* Cards genéricos */
.rec-card {
  background: var(--white);
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}
.rec-card-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 15px 18px; border-bottom: 1px solid var(--border);
}
.rec-card-head h3 {
  font-family: var(--font-serif); font-size: 16px; font-weight: 500; color: var(--text-primary);
}
.rec-card-count {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--green-100); color: var(--green-700);
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* Próximos */
.rec-proximos-list { padding: 6px 0; }
.rec-prox-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-bottom: 1px solid var(--border);
  transition: background 0.12s;
}
.rec-prox-item:last-child { border-bottom: none; }
.rec-prox-item:hover { background: var(--cream); }
.rpi-hora { font-size: 13.5px; font-weight: 700; color: var(--text-secondary); min-width: 40px; font-variant-numeric: tabular-nums; }
.rpi-info { flex: 1; min-width: 0; }
.rpi-nome { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpi-svc  { font-size: 11.5px; color: var(--text-muted); }

/* Alertas */
.rec-alertas-list { padding: 6px 0; }
.rec-alerta {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 16px; border-bottom: 1px solid var(--border);
  cursor: pointer; transition: background 0.12s; position: relative;
}
.rec-alerta:last-child { border-bottom: none; }
.rec-alerta:hover { background: var(--cream); }
.rec-alerta.alerta--lido { opacity: 0.6; }
.alerta-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}
.ai--urgente  { background: #FEF2F2; color: #DC2626; }
.ai--pagamento{ background: #E8F0FE; color: #1D4ED8; }
.ai--info     { background: #FDF3E0; color: #8B6200; }
.ai--ok       { background: #EBF5EE; color: #2D6B45; }
.alerta-body  { flex: 1; min-width: 0; }
.alerta-text  { font-size: 12.5px; color: var(--text-primary); line-height: 1.45; }
.alerta-time  { font-size: 11px; color: var(--text-muted); margin-top: 2px; display: block; }
.alerta-unread {
  width: 7px; height: 7px; border-radius: 50%; background: var(--gold);
  flex-shrink: 0; margin-top: 4px;
}

/* Resumo */
.rec-resumo-date { font-size: 11.5px; color: var(--text-muted); text-transform: capitalize; }
.rec-resumo-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; }
.resumo-item { display: flex; align-items: center; justify-content: space-between; }
.resumo-label { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-secondary); }
.resumo-icon  { color: var(--text-muted); display: flex; align-items: center; }
.resumo-value { font-size: 13.5px; font-weight: 600; }

.resumo-ocupacao { margin-top: 4px; }
.ro-head { display: flex; justify-content: space-between; margin-bottom: 7px; }
.ro-head span { font-size: 12.5px; color: var(--text-secondary); }
.ro-pct  { font-weight: 700; color: var(--green-700); }
.ro-bar  { height: 6px; background: var(--cream-2); border-radius: 99px; overflow: hidden; }
.ro-fill { height: 100%; background: linear-gradient(90deg, var(--green-600), var(--green-400)); border-radius: 99px; transition: width 1s var(--ease); }

.resumo-pagtos { border-top: 1px solid var(--border); padding-top: 12px; }
.rp-title { font-size: 11.5px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 8px; }
.rp-list  { display: flex; flex-direction: column; gap: 7px; }
.rp-item  { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
.rp-dot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.rp-label { flex: 1; color: var(--text-secondary); }
.rp-val   { font-weight: 600; color: var(--text-primary); }

/* ════ BADGES ════ */
.rec-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 99px;
  font-size: 11.5px; font-weight: 500; white-space: nowrap;
}
.rb--ativo      { background: #FFF0E0; color: #8B4500; }
.rb--confirmado { background: var(--status-confirm-bg); color: var(--status-confirm-fg); }
.rb--chegou     { background: #FDF3E0; color: #8B6200; }
.rb--finalizado { background: var(--status-done-bg); color: var(--status-done-fg); }
.rb--pending    { background: var(--status-pending-bg); color: var(--status-pending-fg); }
.rb--cancel     { background: var(--status-cancel-bg); color: var(--status-cancel-fg); }

/* ════ EMPTY ════ */
.rec-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 28px; text-align: center; color: var(--text-muted);
}
.rec-empty-icon {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--cream-2); display: flex; align-items: center; justify-content: center;
  color: var(--green-300);
}
.rec-empty p { font-size: 13px; }

/* ════ MODAL CHECK-IN ════ */
.checkin-modal { max-width: 520px; }
.checkin-search { position: relative; display: flex; align-items: center; }
.checkin-search svg { position: absolute; left: 13px; color: var(--text-muted); pointer-events: none; }
.checkin-lista { display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto; }
.checkin-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 12px;
  border: 1.5px solid var(--border);
  cursor: pointer; transition: all 0.15s;
}
.checkin-item:hover { background: var(--cream); border-color: var(--green-300); }
.ci--selected { background: var(--green-50); border-color: var(--green-500); }

/* ════ SPIN ════ */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
.anim-up { animation: fadeUp 0.38s var(--ease) both; }
.d-2 { animation-delay: 0.06s; }
.d-3 { animation-delay: 0.12s; }

/* ════ RESPONSIVE ════ */
@media (max-width: 1400px) {
  .rec-kpis { grid-template-columns: repeat(3,1fr); }
}
@media (max-width: 1200px) {
  .rec-main-row { grid-template-columns: 1fr; }
  .rec-timeline-col { max-height: 320px; }
  .rec-bottom-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .rec-kpis { grid-template-columns: repeat(2, 1fr); }
  .rec-bottom-row { grid-template-columns: 1fr; }
  .rec-profs-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .rec-body { padding: 14px 14px; }
  .rec-topbar { padding: 0 12px 0 50px; }
  .clock-time { font-size: 16px; }
  .clock-date { display: none; }
  .rec-kpis { grid-template-columns: 1fr 1fr; }
  .rec-aten-card { flex-direction: column; align-items: flex-start; }
  .rac-right { flex-direction: row; width: 100%; justify-content: space-between; }
}
</style>