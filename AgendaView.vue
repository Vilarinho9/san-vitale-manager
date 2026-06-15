<template>
  <div class="sv-layout">
    <Sidebar />

    <div class="sv-main ag-main">

      <!-- ══════════ TOPBAR ══════════ -->
      <header class="ag-topbar">
        <div class="ag-topbar-left">
          <h1 class="ag-title">Agenda</h1>
          <p class="ag-subtitle">Visualize e gerencie todos os agendamentos.</p>
        </div>

        <div class="ag-topbar-center">
          <div class="ag-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="buscaGlobal" placeholder="Buscar cliente ou serviço..." />
          </div>
        </div>

        <div class="ag-topbar-right">
          <button class="ag-notif-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="ag-notif-dot">3</span>
          </button>

          <div class="ag-date-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ todayLabel }}
          </div>

          <button class="sv-btn sv-btn-primary ag-novo-btn" @click="abrirModalNovo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Agendamento
          </button>
        </div>
      </header>

      <!-- ══════════ BODY ══════════ -->
      <div class="ag-body">

        <!-- ── Sidebar esquerda: mini calendário + profissionais + filtros ── -->
        <aside class="ag-left-panel">

          <!-- Mini calendário -->
          <div class="ag-mini-cal">
            <div class="amc-header">
              <button class="amc-nav" @click="prevMonth">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span class="amc-title">{{ monthLabel }}</span>
              <button class="amc-nav" @click="nextMonth">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div class="amc-weekdays">
              <span v-for="d in ['D','S','T','Q','Q','S','S']" :key="d+'_'+Math.random()">{{ d }}</span>
            </div>
            <div class="amc-days">
              <button
                v-for="cell in calCells"
                :key="cell.key"
                class="amc-day"
                :class="{
                  'amc-day--empty': !cell.day,
                  'amc-day--today': cell.isToday,
                  'amc-day--selected': cell.isSelected,
                  'amc-day--has': cell.hasAg,
                  'amc-day--other': cell.otherMonth,
                }"
                :disabled="!cell.day"
                @click="cell.day && selectDay(cell)"
              >
                {{ cell.day || '' }}
                <span v-if="cell.hasAg && !cell.isSelected" class="amc-dot"></span>
              </button>
            </div>
          </div>

          <!-- Profissionais -->
          <div class="ag-profissionais">
            <p class="ag-section-title">Profissionais</p>
            <label class="ag-prof-item">
              <input type="checkbox" v-model="filtroTodosProfissionais" @change="toggleTodos" />
              <span class="ag-check-box"></span>
              <span class="ag-prof-label">Todos os profissionais</span>
            </label>
            <label
              v-for="p in profissionaisList"
              :key="p.id"
              class="ag-prof-item"
            >
              <input type="checkbox" :value="p.id" v-model="filtroProfs" />
              <span class="ag-check-box"></span>
              <div class="sv-avatar ag-prof-ava" :style="{ background: p.color, width:'28px', height:'28px', fontSize:'11px', fontWeight:'600' }">
                {{ p.iniciais }}
              </div>
              <div class="ag-prof-info">
                <span class="ag-prof-name">{{ p.nome }}</span>
                <span class="ag-prof-esp">{{ p.especialidade }}</span>
              </div>
            </label>
          </div>

          <!-- Filtros -->
          <div class="ag-filtros">
            <p class="ag-section-title">Filtros</p>

            <div class="ag-filter-group">
              <button class="ag-filter-select" @click="toggleServicosDD">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {{ filtroServico || 'Todos os serviços' }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-if="showServicosDD" class="ag-dd">
                <button class="ag-dd-item" @click="filtroServico=''; showServicosDD=false">Todos os serviços</button>
                <button v-for="s in servicosList" :key="s.id" class="ag-dd-item" @click="filtroServico=s.nome; showServicosDD=false">{{ s.nome }}</button>
              </div>
            </div>

            <div class="ag-filter-group">
              <button class="ag-filter-select" @click="toggleStatusDD">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ filtroStatus || 'Todos os status' }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-if="showStatusDD" class="ag-dd">
                <button class="ag-dd-item" @click="filtroStatus=''; showStatusDD=false">Todos os status</button>
                <button v-for="s in statusList" :key="s" class="ag-dd-item" @click="filtroStatus=s; showStatusDD=false">{{ s }}</button>
              </div>
            </div>

            <button class="ag-limpar" @click="limparFiltros">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Limpar filtros
            </button>
          </div>
        </aside>

        <!-- ── Área principal: vista Calendário/Lista + grade ── -->
        <div class="ag-center">

          <!-- Barra de controle da grade -->
          <div class="ag-grade-controls">
            <div class="ag-view-tabs">
              <button class="ag-vtab" :class="{ active: viewTab==='calendario' }" @click="viewTab='calendario'">Calendário</button>
              <button class="ag-vtab" :class="{ active: viewTab==='lista' }" @click="viewTab='lista'">Lista</button>
            </div>

            <div class="ag-period-tabs">
              <button class="ag-ptab" :class="{ active: periodTab==='dia' }"    @click="setPeriod('dia')">Dia</button>
              <button class="ag-ptab" :class="{ active: periodTab==='semana' }" @click="setPeriod('semana')">Semana</button>
              <button class="ag-ptab" :class="{ active: periodTab==='mes' }"    @click="setPeriod('mes')">Mês</button>
            </div>

            <div class="ag-nav">
              <button class="ag-nav-btn" @click="navAnterior">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span class="ag-nav-label">{{ navLabel }}</span>
              <button class="ag-nav-btn" @click="navProximo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            <div class="ag-grade-right">
              <button class="ag-hoje-btn" @click="irHoje">Hoje</button>
              <button class="ag-opcoes-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Opções
              </button>
              <button class="sv-btn sv-btn-secondary ag-bloquear-btn" @click="abrirModalBloqueio">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Bloqueios de horário
              </button>
            </div>
          </div>

          <!-- ── VISTA CALENDÁRIO — GRADE SEMANAL ── -->
          <div v-if="viewTab==='calendario'" class="ag-calendar-wrap">

            <!-- LOADING -->
            <div v-if="loading" class="ag-loading">
              <div class="ag-loading-grid">
                <div v-for="i in 21" :key="i" class="skel" style="height:80px;border-radius:10px"></div>
              </div>
            </div>

            <!-- GRADE SEMANAL (como na imagem de referência) -->
            <div v-else-if="periodTab==='semana'" class="ag-week-grid">

              <!-- Cabeçalho: dias da semana com datas -->
              <div class="agw-header">
                <div class="agw-time-col"></div>
                <div
                  v-for="day in weekDays"
                  :key="day.iso"
                  class="agw-day-head"
                  :class="{ 'agw-day-head--today': day.isToday }"
                >
                  <span class="agw-day-name">{{ day.nome }}</span>
                  <span class="agw-day-num" :class="{ 'agw-day-num--today': day.isToday }">{{ day.num }}</span>
                </div>
              </div>

              <!-- Corpo scrollável com horários -->
              <div class="agw-body" ref="gridBody">
                <!-- Linha de horário atual -->
                <div v-if="showCurrentLine" class="agw-now-line" :style="{ top: currentLineTop + 'px' }">
                  <div class="agw-now-dot"></div>
                </div>

                <div
                  v-for="hora in horasGrade"
                  :key="hora"
                  class="agw-row"
                >
                  <!-- Coluna da hora -->
                  <div class="agw-time">{{ hora }}</div>

                  <!-- Célula por dia da semana -->
                  <div
                    v-for="day in weekDays"
                    :key="day.iso + hora"
                    class="agw-cell"
                    :class="{ 'agw-cell--today': day.isToday }"
                    @click="quickBook(day.iso, hora)"
                  >
                    <!-- Blocos de agendamento na célula -->
                    <template v-for="ag in getAgsCell(day.iso, hora)" :key="ag.id">
                      <div
                        class="agw-block"
                        :class="[`agw-block--${statusKey(ag.status)}`, { 'agw-block--hover': hoveredBlock===ag.id }]"
                        :style="blockStyle(ag)"
                        @click.stop="abrirDetalhes(ag)"
                        @mouseenter="hoveredBlock=ag.id"
                        @mouseleave="hoveredBlock=null"
                      >
                        <div class="agwb-inner">
                          <p class="agwb-name">{{ ag.clientes?.nome || '—' }}</p>
                          <p class="agwb-svc">{{ ag.servicos?.nome || '—' }}</p>
                          <p class="agwb-time">{{ ag.horario?.slice(0,5) }} - {{ calcEnd(ag) }}</p>
                          <span class="agwb-status-icon">
                            <span v-html="statusIcon(ag.status)"></span>
                          </span>
                        </div>
                      </div>
                    </template>

                    <!-- Bloco bloqueado -->
                    <div v-if="getBloqueio(day.iso, hora)" class="agw-block agw-block--bloqueado">
                      <div class="agwb-inner">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <p class="agwb-name">Bloqueado</p>
                        <p class="agwb-svc">{{ getBloqueio(day.iso, hora)?.motivo }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legenda inferior -->
              <div class="agw-legend">
                <div v-for="l in legendas" :key="l.label" class="agwl-item">
                  <span class="agwl-dot" :style="{ background: l.color }"></span>
                  {{ l.label }}
                </div>
              </div>
            </div>

            <!-- GRADE DIÁRIA -->
            <div v-else-if="periodTab==='dia'" class="ag-day-grid">
              <div class="agd-header">
                <div class="agd-time-col"></div>
                <!-- Profissionais como colunas (estilo Zenoti/Fresha) -->
                <div
                  v-for="p in profissionaisVisiveis"
                  :key="p.id"
                  class="agd-prof-col"
                >
                  <div class="agd-prof-head">
                    <div class="sv-avatar agd-prof-ava" :style="{ background: p.color, width:'32px', height:'32px', fontSize:'12px', fontWeight:'600' }">
                      {{ p.iniciais }}
                    </div>
                    <div>
                      <p class="agd-prof-name">{{ p.nome }}</p>
                      <p class="agd-prof-esp">{{ p.especialidade }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="agd-body" ref="dayGridBody">
                <div v-for="hora in horasGrade" :key="hora" class="agd-row">
                  <div class="agd-time">{{ hora }}</div>
                  <div
                    v-for="p in profissionaisVisiveis"
                    :key="p.id + hora"
                    class="agd-cell"
                    @click="quickBookProf(selectedDateIso, hora, p.id)"
                  >
                    <template v-for="ag in getAgsCellProf(selectedDateIso, hora, p.id)" :key="ag.id">
                      <div
                        class="agw-block"
                        :class="`agw-block--${statusKey(ag.status)}`"
                        :style="blockStyle(ag)"
                        @click.stop="abrirDetalhes(ag)"
                      >
                        <div class="agwb-inner">
                          <p class="agwb-name">{{ ag.clientes?.nome || '—' }}</p>
                          <p class="agwb-svc">{{ ag.servicos?.nome }}</p>
                          <p class="agwb-time">{{ ag.horario?.slice(0,5) }} - {{ calcEnd(ag) }}</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- GRADE MENSAL -->
            <div v-else-if="periodTab==='mes'" class="ag-month-grid">
              <div class="agm-weekdays">
                <span v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</span>
              </div>
              <div class="agm-days">
                <div
                  v-for="cell in monthCells"
                  :key="cell.key"
                  class="agm-cell"
                  :class="{ 'agm-cell--today': cell.isToday, 'agm-cell--other': cell.otherMonth, 'agm-cell--selected': cell.iso === selectedDateIso }"
                  @click="cell.iso && selectDayFromMonth(cell)"
                >
                  <span class="agm-cell-num">{{ cell.day }}</span>
                  <div class="agm-cell-ags">
                    <div
                      v-for="ag in getAgsDate(cell.iso).slice(0,3)"
                      :key="ag.id"
                      class="agm-ag-pill"
                      :class="`agm-ag-pill--${statusKey(ag.status)}`"
                      @click.stop="abrirDetalhes(ag)"
                    >
                      {{ ag.clientes?.nome?.split(' ')[0] }} · {{ ag.servicos?.nome?.split(' ')[0] }}
                    </div>
                    <div v-if="getAgsDate(cell.iso).length > 3" class="agm-ag-more">
                      +{{ getAgsDate(cell.iso).length - 3 }} mais
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── VISTA LISTA ── -->
          <div v-if="viewTab==='lista'" class="ag-lista">
            <div v-if="loading" style="display:flex;flex-direction:column;gap:8px;padding:20px">
              <div v-for="i in 6" :key="i" class="skel" style="height:60px;border-radius:10px"></div>
            </div>
            <div v-else-if="!agsFiltrados.length" class="sv-empty" style="padding:60px">
              <div class="sv-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h4>Sem agendamentos</h4>
              <p>Não há agendamentos para os filtros selecionados.</p>
              <button class="sv-btn sv-btn-primary" style="margin-top:14px" @click="abrirModalNovo">Criar agendamento</button>
            </div>
            <div v-else class="agl-wrap">
              <table class="sv-table">
                <thead>
                  <tr>
                    <th>Data / Hora</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Profissional</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th style="width:120px">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ag in agsFiltrados" :key="ag.id" @click="abrirDetalhes(ag)" style="cursor:pointer">
                    <td>
                      <div class="agl-datetime">
                        <div class="agl-cal">
                          <span class="agl-cal-day">{{ fmtDay(ag.data) }}</span>
                          <span class="agl-cal-mon">{{ fmtMon(ag.data) }}</span>
                        </div>
                        <span class="agl-time">{{ ag.horario?.slice(0,5) }}</span>
                      </div>
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;gap:9px">
                        <div class="sv-avatar" style="width:30px;height:30px;font-size:12px;font-weight:600;flex-shrink:0">
                          {{ ag.clientes?.nome?.charAt(0) || '?' }}
                        </div>
                        <div>
                          <p style="font-weight:600;font-size:13.5px;color:var(--text-primary)">{{ ag.clientes?.nome || '—' }}</p>
                          <p style="font-size:12px;color:var(--text-muted)">{{ ag.clientes?.telefone }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style="font-weight:500;font-size:13.5px">{{ ag.servicos?.nome || '—' }}</p>
                      <p style="font-size:12px;color:var(--text-muted)">{{ ag.servicos?.duracao }}</p>
                    </td>
                    <td style="font-size:13px;color:var(--text-secondary)">{{ ag.servicos?.categoria || '—' }}</td>
                    <td>
                      <select
                        class="agl-status-sel"
                        :value="ag.status"
                        @change="updateStatus(ag, $event.target.value)"
                        @click.stop
                      >
                        <option v-for="s in statusList" :key="s">{{ s }}</option>
                      </select>
                    </td>
                    <td style="font-weight:600;color:var(--green-600);font-size:13.5px">
                      R$ {{ Number(ag.servicos?.valor || 0).toFixed(2) }}
                    </td>
                    <td @click.stop>
                      <div style="display:flex;gap:4px">
                        <button class="sv-btn sv-btn-wa" style="width:30px;height:30px;padding:0" @click="enviarWA(ag)" title="WhatsApp">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.08 12.08 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                          </svg>
                        </button>
                        <button class="sv-btn sv-btn-secondary sv-btn-sm" @click="abrirDetalhes(ag)">Editar</button>
                        <button class="sv-btn sv-btn-danger sv-btn-sm" @click.stop="confirmarExclusao(ag)">✕</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ══════════ MODAL NOVO/EDITAR AGENDAMENTO ══════════ -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showModal" class="sv-overlay" @click.self="fecharModal">
          <div class="sv-modal ag-modal">
            <div class="sv-modal-head">
              <div>
                <h2>{{ editando ? 'Editar Agendamento' : 'Novo Agendamento' }}</h2>
                <p style="font-size:12.5px;color:var(--text-muted);margin-top:3px">
                  {{ editando ? 'Atualize os dados do atendimento' : 'Preencha os dados para criar um novo atendimento' }}
                </p>
              </div>
              <button class="sv-modal-close" @click="fecharModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="sv-modal-body ag-modal-body">
              <!-- Cliente -->
              <div class="ag-modal-section">
                <p class="ag-modal-sec-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Cliente
                </p>
                <div class="sv-field">
                  <label class="sv-label">Selecionar cliente *</label>
                  <select class="sv-select" v-model="form.cliente_id">
                    <option value="" disabled>Escolha o cliente...</option>
                    <option v-for="c in clientesList" :key="c.id" :value="c.id">{{ c.nome }}</option>
                  </select>
                </div>
              </div>

              <!-- Serviço -->
              <div class="ag-modal-section">
                <p class="ag-modal-sec-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Serviço
                </p>
                <div class="ag-modal-2col">
                  <div class="sv-field">
                    <label class="sv-label">Serviço *</label>
                    <select class="sv-select" v-model="form.servico_id">
                      <option value="" disabled>Escolha o serviço...</option>
                      <option v-for="s in servicosList.filter(x=>x.ativo)" :key="s.id" :value="s.id">
                        {{ s.nome }} ({{ s.duracao }})
                      </option>
                    </select>
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Profissional</label>
                    <select class="sv-select" v-model="form.profissional_id">
                      <option value="">Qualquer profissional</option>
                      <option v-for="p in profissionaisList" :key="p.id" :value="p.id">{{ p.nome }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Data e hora -->
              <div class="ag-modal-section">
                <p class="ag-modal-sec-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Data e Horário
                </p>
                <div class="ag-modal-3col">
                  <div class="sv-field">
                    <label class="sv-label">Data *</label>
                    <input class="sv-input" type="date" v-model="form.data" />
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Horário *</label>
                    <input class="sv-input" type="time" v-model="form.horario" />
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Status</label>
                    <select class="sv-select" v-model="form.status">
                      <option v-for="s in statusList" :key="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Pagamento -->
              <div class="ag-modal-section">
                <p class="ag-modal-sec-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Pagamento
                </p>
                <div class="ag-modal-2col">
                  <div class="sv-field">
                    <label class="sv-label">Forma de pagamento</label>
                    <select class="sv-select" v-model="form.pagamento">
                      <option value="">Não definido</option>
                      <option value="pix">Pix</option>
                      <option value="cartao">Cartão</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="link">Link de pagamento</option>
                    </select>
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Sala / Maca</label>
                    <select class="sv-select" v-model="form.sala">
                      <option value="">Não definida</option>
                      <option v-for="s in ['Sala 1','Sala 2','Sala 3','Maca 1','Maca 2']" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Observações -->
              <div class="ag-modal-section">
                <p class="ag-modal-sec-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Observações
                </p>
                <div class="sv-field">
                  <textarea class="sv-textarea" v-model="form.observacoes" placeholder="Anotações sobre o atendimento, preferências do cliente..." rows="3"></textarea>
                </div>
              </div>
            </div>

            <div class="sv-modal-foot">
              <button class="sv-btn sv-btn-secondary" @click="fecharModal">Cancelar</button>
              <button v-if="editando" class="sv-btn sv-btn-danger" style="margin-right:auto" @click="confirmarExclusao(editando)">Excluir</button>
              <button class="sv-btn sv-btn-primary" @click="salvar" :disabled="saving">
                <span v-if="saving" class="sv-btn-spinner"></span>
                <span v-else>{{ editando ? 'Salvar alterações' : 'Criar agendamento' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ══════════ MODAL BLOQUEIO ══════════ -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showBloqueio" class="sv-overlay" @click.self="showBloqueio=false">
          <div class="sv-modal" style="max-width:480px">
            <div class="sv-modal-head">
              <h2>Bloquear Horário</h2>
              <button class="sv-modal-close" @click="showBloqueio=false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="sv-modal-body" style="display:flex;flex-direction:column;gap:14px">
              <div class="sv-field">
                <label class="sv-label">Profissional</label>
                <select class="sv-select" v-model="formBloqueio.profissional_id">
                  <option value="">Todos os profissionais</option>
                  <option v-for="p in profissionaisList" :key="p.id" :value="p.id">{{ p.nome }}</option>
                </select>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="sv-field">
                  <label class="sv-label">Data início *</label>
                  <input class="sv-input" type="date" v-model="formBloqueio.data_inicio" />
                </div>
                <div class="sv-field">
                  <label class="sv-label">Data fim</label>
                  <input class="sv-input" type="date" v-model="formBloqueio.data_fim" />
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="sv-field">
                  <label class="sv-label">Hora início</label>
                  <input class="sv-input" type="time" v-model="formBloqueio.hora_inicio" />
                </div>
                <div class="sv-field">
                  <label class="sv-label">Hora fim</label>
                  <input class="sv-input" type="time" v-model="formBloqueio.hora_fim" />
                </div>
              </div>
              <div class="sv-field">
                <label class="sv-label">Motivo do bloqueio</label>
                <select class="sv-select" v-model="formBloqueio.motivo">
                  <option value="">Selecione...</option>
                  <option v-for="m in motivosBloqueio" :key="m">{{ m }}</option>
                </select>
              </div>
              <div class="sv-field">
                <label class="sv-label">Observação</label>
                <textarea class="sv-textarea" v-model="formBloqueio.obs" placeholder="Detalhes adicionais..." rows="2"></textarea>
              </div>
            </div>
            <div class="sv-modal-foot">
              <button class="sv-btn sv-btn-secondary" @click="showBloqueio=false">Cancelar</button>
              <button class="sv-btn sv-btn-primary" @click="salvarBloqueio">Confirmar bloqueio</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ══════════ MODAL CONFIRMAR EXCLUSÃO ══════════ -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showExclusao" class="sv-overlay" @click.self="showExclusao=false">
          <div class="sv-modal" style="max-width:420px">
            <div class="sv-modal-head">
              <h2>Excluir agendamento</h2>
              <button class="sv-modal-close" @click="showExclusao=false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="sv-modal-body">
              <p style="font-size:14px;color:var(--text-secondary);line-height:1.6">
                Tem certeza que deseja excluir o agendamento de
                <strong style="color:var(--text-primary)">{{ agParaDel?.clientes?.nome }}</strong>?
                <br>Esta ação não pode ser desfeita.
              </p>
            </div>
            <div class="sv-modal-foot">
              <button class="sv-btn sv-btn-secondary" @click="showExclusao=false">Cancelar</button>
              <button class="sv-btn sv-btn-danger" @click="excluir" :disabled="deleting">
                <span v-if="deleting" class="sv-btn-spinner" style="border-color:rgba(220,38,38,0.3);border-top-color:#DC2626"></span>
                <span v-else>Excluir agendamento</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast notifications -->
    <teleport to="body">
      <div class="ag-toast-wrap">
        <transition-group name="ag-toast">
          <div v-for="t in toasts" :key="t.id" class="ag-toast" :class="`ag-toast--${t.type}`">
            <span v-html="toastIcon(t.type)"></span>
            {{ t.message }}
          </div>
        </transition-group>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import api     from '@/services/api'

/* ─────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────── */
const loading  = ref(true)
const saving   = ref(false)
const deleting = ref(false)

const agendamentos  = ref([])
const clientesList  = ref([])
const servicosList  = ref([])

const showModal   = ref(false)
const showBloqueio= ref(false)
const showExclusao= ref(false)
const editando    = ref(null)
const agParaDel   = ref(null)
const hoveredBlock= ref(null)

/* ─────────────────────────────────────────
   PROFISSIONAIS (mock — substituir por API)
───────────────────────────────────────── */
const profissionaisList = ref([
  { id:'p1', nome:'Patrícia Lima',    especialidade:'Massagista',    iniciais:'PL', color:'#4E6B5B' },
  { id:'p2', nome:'Fernanda Costa',   especialidade:'Esteticista',   iniciais:'FC', color:'#7A9B89' },
  { id:'p3', nome:'Mariana Oliveira', especialidade:'Fisioterapeuta',iniciais:'MO', color:'#C9A84C' },
  { id:'p4', nome:'Beatriz Lima',     especialidade:'Massagista',    iniciais:'BL', color:'#5C7A69' },
  { id:'p5', nome:'Camila Silva',     especialidade:'Manicure',      iniciais:'CS', color:'#A3BFB2' },
])

/* ─────────────────────────────────────────
   BLOQUEIOS (mock)
───────────────────────────────────────── */
const bloqueios = ref([
  { id:'b1', data:'2025-01-20', hora:'12:00', prof:'p1', motivo:'Almoço', duracao:60 },
  { id:'b2', data:'2025-01-20', hora:'12:00', prof:'p2', motivo:'Almoço', duracao:60 },
])

const motivosBloqueio = ['Almoço','Intervalo','Férias','Treinamento','Evento interno','Ausência','Manutenção']

/* ─────────────────────────────────────────
   FILTROS
───────────────────────────────────────── */
const buscaGlobal          = ref('')
const filtroTodosProfissionais = ref(true)
const filtroProfs          = ref([])
const filtroServico        = ref('')
const filtroStatus         = ref('')
const showServicosDD       = ref(false)
const showStatusDD         = ref(false)

const statusList = ['Pendente','Confirmado','Em atendimento','Concluído','Cancelado','Não compareceu']

watch(filtroProfs, () => {
  filtroTodosProfissionais.value = filtroProfs.value.length === 0
})

function toggleTodos() {
  if (filtroTodosProfissionais.value) filtroProfs.value = []
}
function toggleServicosDD() { showServicosDD.value = !showServicosDD.value; showStatusDD.value = false }
function toggleStatusDD()   { showStatusDD.value   = !showStatusDD.value;   showServicosDD.value = false }
function limparFiltros()    { filtroServico.value=''; filtroStatus.value=''; filtroProfs.value=[]; filtroTodosProfissionais.value=true }

/* ─────────────────────────────────────────
   VIEWS / NAVEGAÇÃO
───────────────────────────────────────── */
const viewTab   = ref('calendario')
const periodTab = ref('semana')

const today           = new Date()
const selectedDateIso = ref(today.toISOString().split('T')[0])

// Para o mini-calendário
const calViewYear  = ref(today.getFullYear())
const calViewMonth = ref(today.getMonth()) // 0-based

// Para a grade semanal
const weekStart = ref(getWeekStart(today))

function getWeekStart(d) {
  const date = new Date(d)
  const day  = date.getDay() // 0=Dom
  date.setDate(date.getDate() - day)
  date.setHours(0,0,0,0)
  return date
}

function setPeriod(p) {
  periodTab.value = p
  if (p === 'semana') weekStart.value = getWeekStart(new Date(selectedDateIso.value))
}

function navAnterior() {
  if (periodTab.value === 'semana') {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() - 7)
    weekStart.value = d
    selectedDateIso.value = d.toISOString().split('T')[0]
  } else if (periodTab.value === 'dia') {
    const d = new Date(selectedDateIso.value + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    selectedDateIso.value = d.toISOString().split('T')[0]
  } else {
    const d = new Date(selectedDateIso.value + 'T12:00:00')
    d.setMonth(d.getMonth() - 1)
    selectedDateIso.value = d.toISOString().split('T')[0]
  }
}

function navProximo() {
  if (periodTab.value === 'semana') {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + 7)
    weekStart.value = d
    selectedDateIso.value = d.toISOString().split('T')[0]
  } else if (periodTab.value === 'dia') {
    const d = new Date(selectedDateIso.value + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    selectedDateIso.value = d.toISOString().split('T')[0]
  } else {
    const d = new Date(selectedDateIso.value + 'T12:00:00')
    d.setMonth(d.getMonth() + 1)
    selectedDateIso.value = d.toISOString().split('T')[0]
  }
}

function irHoje() {
  const t = new Date()
  selectedDateIso.value = t.toISOString().split('T')[0]
  weekStart.value = getWeekStart(t)
}

const navLabel = computed(() => {
  if (periodTab.value === 'dia') {
    const d = new Date(selectedDateIso.value + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' })
  }
  if (periodTab.value === 'semana') {
    const end = new Date(weekStart.value)
    end.setDate(end.getDate() + 6)
    return `${weekStart.value.getDate()} - ${end.getDate()} de ${end.toLocaleDateString('pt-BR',{month:'long', year:'numeric'})}`
  }
  const d = new Date(selectedDateIso.value + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { month:'long', year:'numeric' })
})

/* ─────────────────────────────────────────
   DIAS DA SEMANA (grade semanal)
───────────────────────────────────────── */
const NOMES = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const ABREV = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const weekDays = computed(() => {
  const todayIso = new Date().toISOString().split('T')[0]
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    return {
      iso,
      nome: ABREV[d.getDay()],
      num:  d.getDate() + '/' + String(d.getMonth()+1).padStart(2,'0'),
      isToday: iso === todayIso,
    }
  })
})

/* ─────────────────────────────────────────
   HORÁRIOS DA GRADE
───────────────────────────────────────── */
const horasGrade = [
  '08:00','09:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00'
]

/* ─────────────────────────────────────────
   LINHA DO HORÁRIO ATUAL
───────────────────────────────────────── */
const gridBody     = ref(null)
const currentTime  = ref(new Date())
let clockTimer     = null

const showCurrentLine = computed(() => {
  const todayIso = new Date().toISOString().split('T')[0]
  return weekDays.value.some(d => d.iso === todayIso)
})

const currentLineTop = computed(() => {
  const h = currentTime.value.getHours()
  const m = currentTime.value.getMinutes()
  const startHour = 8
  const rowH = 64 // height of each hour row in px
  return ((h - startHour) * 60 + m) / 60 * rowH
})

/* ─────────────────────────────────────────
   MINI CALENDÁRIO
───────────────────────────────────────── */
const monthLabel = computed(() => {
  const d = new Date(calViewYear.value, calViewMonth.value, 1)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  if (calViewMonth.value === 0) { calViewMonth.value = 11; calViewYear.value-- }
  else calViewMonth.value--
}
function nextMonth() {
  if (calViewMonth.value === 11) { calViewMonth.value = 0; calViewYear.value++ }
  else calViewMonth.value++
}

const calCells = computed(() => {
  const year  = calViewYear.value
  const month = calViewMonth.value
  const first = new Date(year, month, 1).getDay()
  const days  = new Date(year, month + 1, 0).getDate()
  const todayIso = new Date().toISOString().split('T')[0]
  const cells = []

  for (let i = 0; i < first; i++) cells.push({ key: 'e'+i, day: null, hasAg: false })
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({
      key: iso, day: d, iso,
      isToday:    iso === todayIso,
      isSelected: iso === selectedDateIso.value,
      hasAg:      agendamentos.value.some(a => a.data === iso),
      otherMonth: false,
    })
  }
  return cells
})

function selectDay(cell) {
  selectedDateIso.value = cell.iso
  weekStart.value = getWeekStart(new Date(cell.iso + 'T12:00:00'))
  calViewYear.value  = new Date(cell.iso + 'T12:00:00').getFullYear()
  calViewMonth.value = new Date(cell.iso + 'T12:00:00').getMonth()
}

/* ─────────────────────────────────────────
   GRADE MENSAL
───────────────────────────────────────── */
const monthCells = computed(() => {
  const d   = new Date(selectedDateIso.value + 'T12:00:00')
  const y   = d.getFullYear()
  const m   = d.getMonth()
  const first = new Date(y, m, 1).getDay()
  const days  = new Date(y, m + 1, 0).getDate()
  const todayIso = new Date().toISOString().split('T')[0]
  const cells = []
  for (let i = 0; i < first; i++) cells.push({ key:'ep'+i, day:'', iso:'', otherMonth:true })
  for (let day = 1; day <= days; day++) {
    const iso = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    cells.push({ key:iso, day, iso, isToday: iso===todayIso, otherMonth:false })
  }
  while (cells.length % 7 !== 0) cells.push({ key:'ef'+cells.length, day:'', iso:'', otherMonth:true })
  return cells
})

function selectDayFromMonth(cell) {
  if (!cell.iso) return
  selectedDateIso.value = cell.iso
  periodTab.value = 'dia'
}

/* ─────────────────────────────────────────
   GETTERS DE AGENDAMENTOS
───────────────────────────────────────── */
const agsFiltrados = computed(() => {
  return agendamentos.value.filter(a => {
    const q = buscaGlobal.value.toLowerCase()
    const okQ = !q || a.clientes?.nome?.toLowerCase().includes(q) || a.servicos?.nome?.toLowerCase().includes(q)
    const okS = !filtroStatus.value  || a.status   === filtroStatus.value
    const okSv= !filtroServico.value || a.servicos?.nome === filtroServico.value
    const okP = filtroProfs.value.length === 0 // sem filtro de prof real, pois vem do Supabase
    return okQ && okS && okSv && okP
  }).sort((a,b) => b.data.localeCompare(a.data) || a.horario.localeCompare(b.horario))
})

function getAgsDate(iso) {
  if (!iso) return []
  return agendamentos.value.filter(a => a.data === iso)
}

function getAgsCell(iso, hora) {
  // Na grade semanal: agendamentos que começam nessa hora
  return agendamentos.value.filter(a => {
    const q  = buscaGlobal.value.toLowerCase()
    const okQ= !q || a.clientes?.nome?.toLowerCase().includes(q)
    const okD= a.data === iso
    const okH= a.horario?.slice(0,5) === hora
    const okS= !filtroStatus.value  || a.status   === filtroStatus.value
    return okD && okH && okS && okQ
  })
}

function getAgsCellProf(iso, hora, profId) {
  // Mesma lógica mas filtrando por profissional (usado quando temos prof_id no agendamento)
  return agendamentos.value.filter(a =>
    a.data === iso &&
    a.horario?.slice(0,5) === hora
  )
}

function getBloqueio(iso, hora) {
  return bloqueios.value.find(b => b.data === iso && b.hora === hora) || null
}

const profissionaisVisiveis = computed(() => {
  if (filtroProfs.value.length === 0) return profissionaisList.value
  return profissionaisList.value.filter(p => filtroProfs.value.includes(p.id))
})

/* ─────────────────────────────────────────
   ESTILO DOS BLOCOS
───────────────────────────────────────── */
function blockStyle(ag) {
  // Duração do serviço em horas para calcular altura
  const dur = parseDuracao(ag.servicos?.duracao)
  const rowH = 64 // px por hora
  const h = Math.max(dur / 60 * rowH, 44)
  return { minHeight: h + 'px' }
}

function parseDuracao(dur) {
  if (!dur) return 60
  const m = dur.match(/(\d+)/)
  return m ? parseInt(m[1]) : 60
}

function calcEnd(ag) {
  if (!ag.horario) return '—'
  const [h, m] = ag.horario.split(':').map(Number)
  const dur = parseDuracao(ag.servicos?.duracao)
  const end = new Date(2000,0,1,h,m + dur)
  return String(end.getHours()).padStart(2,'0') + ':' + String(end.getMinutes()).padStart(2,'0')
}

/* ─────────────────────────────────────────
   STATUS HELPERS
───────────────────────────────────────── */
function statusKey(s = '') {
  const m = {
    'Pendente':'pending', 'Confirmado':'confirm', 'Em atendimento':'active',
    'Concluído':'done', 'Cancelado':'cancel', 'Não compareceu':'absent'
  }
  return m[s] || 'pending'
}

function badgeClass(s = '') {
  return 'badge-' + statusKey(s)
}

function statusIcon(s = '') {
  const icons = {
    'Confirmado':       `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    'Pendente':         `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    'Em atendimento':   `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'Concluído':        `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>`,
    'Cancelado':        `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    'Não compareceu':   `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  }
  return icons[s] || icons['Pendente']
}

const legendas = [
  { label: 'Confirmado',     color: '#4CAF78' },
  { label: 'Pendente',       color: '#F5A623' },
  { label: 'Em andamento',   color: '#F07F2A' },
  { label: 'Concluído',      color: '#3DA05A' },
  { label: 'Cancelado',      color: '#E05252' },
]

/* ─────────────────────────────────────────
   DATAS HELPERS
───────────────────────────────────────── */
const todayLabel = computed(() =>
  new Date().toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' })
)

function fmtDay(d) { return d ? new Date(d+'T12:00:00').getDate() : '—' }
function fmtMon(d) { return d ? new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.','') : '' }

/* ─────────────────────────────────────────
   FORM
───────────────────────────────────────── */
const formDefault = () => ({
  cliente_id: '', servico_id: '', profissional_id: '',
  data: selectedDateIso.value, horario: '', status: 'Pendente',
  pagamento: '', sala: '', observacoes: ''
})
const form = ref(formDefault())

const formBloqueioDefault = () => ({
  profissional_id: '', data_inicio: selectedDateIso.value,
  data_fim: '', hora_inicio: '', hora_fim: '', motivo: '', obs: ''
})
const formBloqueio = ref(formBloqueioDefault())

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
const toasts = ref([])
let toastId  = 0

function addToast(message, type = 'success') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3500)
}

function toastIcon(type) {
  const icons = {
    success: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  }
  return icons[type] || icons.info
}

/* ─────────────────────────────────────────
   AÇÕES
───────────────────────────────────────── */
function abrirModalNovo() {
  editando.value = null
  form.value = formDefault()
  showModal.value = true
}

function quickBook(iso, hora) {
  editando.value = null
  form.value = { ...formDefault(), data: iso, horario: hora }
  showModal.value = true
}

function quickBookProf(iso, hora, profId) {
  editando.value = null
  form.value = { ...formDefault(), data: iso, horario: hora, profissional_id: profId }
  showModal.value = true
}

function abrirDetalhes(ag) {
  editando.value = ag
  form.value = {
    cliente_id:     ag.clientes?.id || '',
    servico_id:     ag.servicos?.id || '',
    profissional_id:'',
    data:           ag.data || '',
    horario:        ag.horario?.slice(0,5) || '',
    status:         ag.status || 'Pendente',
    pagamento:      ag.pagamento || '',
    sala:           ag.sala || '',
    observacoes:    ag.observacoes || '',
  }
  showModal.value = true
}

function fecharModal() { showModal.value = false; editando.value = null }

function abrirModalBloqueio() {
  formBloqueio.value = formBloqueioDefault()
  showBloqueio.value = true
}

function salvarBloqueio() {
  if (!formBloqueio.value.data_inicio) { addToast('Informe a data de início.', 'error'); return }
  bloqueios.value.push({
    id: 'b' + Date.now(),
    data:   formBloqueio.value.data_inicio,
    hora:   formBloqueio.value.hora_inicio,
    prof:   formBloqueio.value.profissional_id,
    motivo: formBloqueio.value.motivo || 'Bloqueio',
    duracao:60
  })
  addToast('Horário bloqueado com sucesso!')
  showBloqueio.value = false
}

async function salvar() {
  if (!form.value.cliente_id) { addToast('Selecione o cliente.', 'error'); return }
  if (!form.value.servico_id) { addToast('Selecione o serviço.', 'error'); return }
  if (!form.value.data)        { addToast('Informe a data.', 'error'); return }
  if (!form.value.horario)     { addToast('Informe o horário.', 'error'); return }

  saving.value = true
  try {
    const payload = {
      cliente_id: form.value.cliente_id,
      servico_id: form.value.servico_id,
      data:       form.value.data,
      horario:    form.value.horario,
      status:     form.value.status,
      observacoes:form.value.observacoes,
    }
    if (editando.value) {
      const res = await api.put(`/agendamentos/${editando.value.id}`, payload)
      const idx = agendamentos.value.findIndex(a => a.id === editando.value.id)
      if (idx !== -1) agendamentos.value[idx] = res.data
      addToast('Agendamento atualizado!')
    } else {
      const res = await api.post('/agendamentos', payload)
      agendamentos.value.unshift(res.data)
      addToast('Agendamento criado com sucesso!')
    }
    fecharModal()
  } catch (e) {
    addToast(e.response?.data?.error || 'Erro ao salvar agendamento.', 'error')
    console.error(e)
  } finally {
    saving.value = false
  }
}

function confirmarExclusao(ag) {
  agParaDel.value  = ag
  showExclusao.value = true
  if (showModal.value) fecharModal()
}

async function excluir() {
  deleting.value = true
  try {
    await api.delete(`/agendamentos/${agParaDel.value.id}`)
    agendamentos.value = agendamentos.value.filter(a => a.id !== agParaDel.value.id)
    addToast('Agendamento excluído.')
    showExclusao.value = false
  } catch (e) {
    addToast('Erro ao excluir.', 'error')
  } finally {
    deleting.value = false
  }
}

async function updateStatus(ag, newStatus) {
  try {
    await api.put(`/agendamentos/${ag.id}`, {
      cliente_id: ag.clientes?.id, servico_id: ag.servicos?.id,
      data: ag.data, horario: ag.horario, status: newStatus, observacoes: ag.observacoes
    })
    ag.status = newStatus
    addToast('Status atualizado!')
  } catch { addToast('Erro ao atualizar status.', 'error') }
}

function enviarWA(ag) {
  const tel = ag.clientes?.telefone?.replace(/\D/g,'')
  if (!tel) { addToast('Telefone não cadastrado.','error'); return }
  const d = fmtDay(ag.data) + '/' + fmtMon(ag.data)
  const msg = `Olá, ${ag.clientes?.nome}! 🌿 Seu agendamento na *San Vitale Wellness Studio* para *${ag.servicos?.nome}* está marcado para *${d}* às *${ag.horario?.slice(0,5)}*. Aguardamos você! ✨`
  window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank')
}

/* ─────────────────────────────────────────
   CARREGAR DADOS
───────────────────────────────────────── */
async function carregarDados() {
  loading.value = true
  try {
    const [agRes, cliRes, serRes] = await Promise.all([
      api.get('/agendamentos'),
      api.get('/clientes'),
      api.get('/servicos'),
    ])
    agendamentos.value = agRes.data
    clientesList.value = cliRes.data
    servicosList.value = serRes.data
  } catch (e) {
    addToast('Erro ao carregar dados.', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

/* ─────────────────────────────────────────
   LIFECYCLE
───────────────────────────────────────── */
onMounted(() => {
  carregarDados()
  clockTimer = setInterval(() => { currentTime.value = new Date() }, 60000)
})
onUnmounted(() => clearInterval(clockTimer))

// Fechar dropdowns ao clicar fora
function onDocClick() { showServicosDD.value = false; showStatusDD.value = false }
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
/* ══════════════════════════════════════════
   LAYOUT PRINCIPAL
══════════════════════════════════════════ */
.ag-main {
  background: var(--cream);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ══════════════════════════════════════════
   TOPBAR DA AGENDA
══════════════════════════════════════════ */
.ag-topbar {
  height: 70px;
  background: var(--cream);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  gap: 16px;
  flex-shrink: 0;
}

.ag-topbar-left h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1;
}
.ag-topbar-left p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.ag-topbar-center { flex: 1; display: flex; justify-content: center; }

.ag-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--white);
  border: 1px solid var(--border-2);
  border-radius: var(--r-pill);
  padding: 8px 16px;
  width: 300px;
}
.ag-search input { border: none; outline: none; background: none; font-size: 13.5px; color: var(--text-primary); width: 100%; }
.ag-search input::placeholder { color: var(--text-muted); }
.ag-search svg { color: var(--text-muted); flex-shrink: 0; }

.ag-topbar-right { display: flex; align-items: center; gap: 8px; }

.ag-notif-btn {
  position: relative; width: 40px; height: 40px;
  border-radius: var(--r-md);
  background: var(--white); border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); cursor: pointer;
}
.ag-notif-dot {
  position: absolute; top: -4px; right: -4px;
  background: var(--green-700); color: white;
  font-size: 9px; font-weight: 700;
  width: 17px; height: 17px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--cream);
}

.ag-date-pill {
  display: flex; align-items: center; gap: 7px;
  background: var(--white); border: 1px solid var(--border-2);
  border-radius: var(--r-md); padding: 8px 14px;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
}

.ag-novo-btn { white-space: nowrap; }

/* ══════════════════════════════════════════
   CORPO DA AGENDA
══════════════════════════════════════════ */
.ag-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 70px);
}

/* ══════════════════════════════════════════
   PAINEL ESQUERDO
══════════════════════════════════════════ */
.ag-left-panel {
  width: 240px;
  flex-shrink: 0;
  background: var(--white);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Mini calendário */
.ag-mini-cal {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--border);
}
.amc-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.amc-nav {
  width: 26px; height: 26px; border-radius: 7px;
  background: none; border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muted); transition: all 0.15s;
}
.amc-nav:hover { background: var(--cream-2); }
.amc-title { font-size: 13px; font-weight: 600; color: var(--text-primary); text-transform: capitalize; }

.amc-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}
.amc-weekdays span { text-align: center; font-size: 10.5px; font-weight: 600; color: var(--text-muted); padding: 3px 0; }

.amc-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
.amc-day {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--text-secondary); border: none; background: none;
  cursor: pointer; border-radius: 7px; transition: all 0.12s; position: relative;
}
.amc-day:hover:not(:disabled):not(.amc-day--today):not(.amc-day--selected) { background: var(--cream-2); }
.amc-day--today   { background: var(--green-100); color: var(--green-700); font-weight: 700; }
.amc-day--selected{ background: var(--green-800) !important; color: white !important; font-weight: 700; }
.amc-day--other   { color: var(--text-light); }
.amc-day--empty   { cursor: default; }
.amc-day--has:not(.amc-day--selected) { font-weight: 600; }
.amc-dot {
  position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
  width: 4px; height: 4px; border-radius: 50%; background: var(--green-500);
}

/* Profissionais */
.ag-profissionais {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.ag-section-title {
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 10px;
}

.ag-prof-item {
  display: flex; align-items: center; gap: 9px;
  padding: 6px 0; cursor: pointer;
}
.ag-prof-item input[type="checkbox"] { display: none; }
.ag-check-box {
  width: 16px; height: 16px; border-radius: 4px;
  border: 1.5px solid var(--border-input);
  background: var(--white); flex-shrink: 0;
  transition: all 0.15s; position: relative;
}
.ag-prof-item input:checked ~ .ag-check-box {
  background: var(--green-800); border-color: var(--green-800);
}
.ag-prof-item input:checked ~ .ag-check-box::after {
  content: '';
  position: absolute; left: 4px; top: 1px;
  width: 5px; height: 9px;
  border: 2px solid white; border-top: none; border-left: none;
  transform: rotate(45deg);
}
.ag-prof-ava { flex-shrink: 0; }
.ag-prof-info { display: flex; flex-direction: column; min-width: 0; }
.ag-prof-label { font-size: 13px; color: var(--text-secondary); }
.ag-prof-name  { font-size: 12.5px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ag-prof-esp   { font-size: 11px; color: var(--text-muted); }

/* Filtros */
.ag-filtros { padding: 16px; display: flex; flex-direction: column; gap: 8px; }

.ag-filter-group { position: relative; }
.ag-filter-select {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 9px 11px; background: var(--cream); border: 1px solid var(--border-2);
  border-radius: var(--r-sm); font-size: 12.5px; color: var(--text-secondary);
  cursor: pointer; font-family: var(--font-sans);
  transition: all 0.15s; text-align: left;
}
.ag-filter-select:hover { border-color: var(--green-300); background: var(--cream-2); }
.ag-filter-select svg:last-child { margin-left: auto; color: var(--text-muted); }
.ag-dd {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: var(--white); border: 1px solid var(--border-2);
  border-radius: var(--r-md); box-shadow: var(--shadow-lg);
  z-index: 100; overflow: hidden;
}
.ag-dd-item {
  width: 100%; padding: 9px 13px; background: none; border: none;
  font-size: 13px; color: var(--text-secondary); cursor: pointer;
  text-align: left; font-family: var(--font-sans);
  border-bottom: 1px solid var(--border); transition: background 0.12s;
}
.ag-dd-item:last-child { border-bottom: none; }
.ag-dd-item:hover { background: var(--cream); }

.ag-limpar {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 0; background: none; border: none;
  font-size: 12.5px; color: var(--text-muted); cursor: pointer;
  font-family: var(--font-sans); transition: color 0.15s;
}
.ag-limpar:hover { color: var(--green-600); }

/* ══════════════════════════════════════════
   ÁREA CENTRAL
══════════════════════════════════════════ */
.ag-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* Controles da grade */
.ag-grade-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.ag-view-tabs {
  display: flex; background: var(--cream); border-radius: var(--r-sm);
  border: 1px solid var(--border-2); padding: 2px;
}
.ag-vtab {
  padding: 6px 14px; border: none; background: none;
  border-radius: calc(var(--r-sm) - 2px);
  font-size: 13px; font-weight: 500; cursor: pointer;
  color: var(--text-muted); transition: all 0.15s; font-family: var(--font-sans);
}
.ag-vtab.active { background: var(--white); color: var(--text-primary); box-shadow: var(--shadow-xs); }

.ag-period-tabs {
  display: flex; background: var(--cream); border-radius: var(--r-sm);
  border: 1px solid var(--border-2); padding: 2px;
}
.ag-ptab {
  padding: 6px 14px; border: none; background: none;
  border-radius: calc(var(--r-sm) - 2px);
  font-size: 13px; font-weight: 500; cursor: pointer;
  color: var(--text-muted); transition: all 0.15s; font-family: var(--font-sans);
}
.ag-ptab.active { background: var(--green-800); color: white; }

.ag-nav { display: flex; align-items: center; gap: 6px; }
.ag-nav-btn {
  width: 30px; height: 30px; border-radius: var(--r-sm);
  background: var(--white); border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-secondary); transition: all 0.15s;
}
.ag-nav-btn:hover { background: var(--cream-2); }
.ag-nav-label { font-size: 13.5px; font-weight: 600; color: var(--text-primary); min-width: 160px; text-align: center; }

.ag-grade-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.ag-hoje-btn {
  padding: 7px 14px; background: var(--white); border: 1px solid var(--border-2);
  border-radius: var(--r-sm); font-size: 13px; font-weight: 500;
  color: var(--text-secondary); cursor: pointer; font-family: var(--font-sans);
  transition: all 0.15s;
}
.ag-hoje-btn:hover { background: var(--cream-2); }

.ag-opcoes-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 13px; background: var(--white); border: 1px solid var(--border-2);
  border-radius: var(--r-sm); font-size: 13px; color: var(--text-secondary);
  cursor: pointer; font-family: var(--font-sans); transition: all 0.15s;
}
.ag-opcoes-btn:hover { background: var(--cream-2); }
.ag-bloquear-btn { font-size: 13px; }

/* ══════════════════════════════════════════
   WRAPPER DO CALENDÁRIO
══════════════════════════════════════════ */
.ag-calendar-wrap {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Loading */
.ag-loading { padding: 20px; }
.ag-loading-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }

/* ══════════════════════════════════════════
   GRADE SEMANAL
══════════════════════════════════════════ */
.ag-week-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Cabeçalho com dias */
.agw-header {
  display: grid;
  grid-template-columns: 56px repeat(7, 1fr);
  background: var(--white);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.agw-time-col { border-right: 1px solid var(--border); }
.agw-day-head {
  padding: 12px 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-right: 1px solid var(--border);
  background: var(--white);
}
.agw-day-head--today { background: var(--green-50); }
.agw-day-name {
  font-size: 11.5px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.6px; color: var(--text-muted);
}
.agw-day-num {
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  margin-top: 2px;
}
.agw-day-num--today {
  background: var(--green-800); color: white;
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}

/* Corpo da grade */
.agw-body {
  flex: 1;
  overflow-y: auto;
  position: relative;
  background: var(--cream);
}

/* Linha do horário atual */
.agw-now-line {
  position: absolute;
  left: 56px; right: 0;
  height: 2px;
  background: #EF4444;
  z-index: 20;
  pointer-events: none;
}
.agw-now-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #EF4444;
  position: absolute; left: -5px; top: -4px;
}

/* Linhas de hora */
.agw-row {
  display: grid;
  grid-template-columns: 56px repeat(7, 1fr);
  min-height: 64px;
  border-bottom: 1px solid var(--border);
}

.agw-time {
  padding: 10px 8px 0;
  font-size: 11px; font-weight: 500; color: var(--text-muted);
  text-align: right;
  border-right: 1px solid var(--border);
  background: var(--white);
  white-space: nowrap;
}

.agw-cell {
  border-right: 1px solid var(--border);
  padding: 2px;
  background: var(--white);
  min-height: 64px;
  cursor: pointer;
  transition: background 0.12s;
  position: relative;
}
.agw-cell:hover { background: var(--cream); }
.agw-cell--today { background: rgba(78,107,91,0.02); }

/* ══════════════════════════════════════════
   BLOCOS DE AGENDAMENTO
══════════════════════════════════════════ */
.agw-block {
  border-radius: 8px;
  padding: 6px 8px;
  margin: 1px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.18s var(--ease);
  overflow: hidden;
  position: relative;
}

/* Status colors — exatamente como na referência */
.agw-block--confirm {
  background: #EBF5EE;
  border-left-color: #4CAF78;
  color: #2D6B45;
}
.agw-block--pending {
  background: #FEF6E0;
  border-left-color: #F5A623;
  color: #8B6200;
}
.agw-block--active {
  background: #FEF0E0;
  border-left-color: #F07F2A;
  color: #8B4500;
}
.agw-block--done {
  background: #EBF5EE;
  border-left-color: #3DA05A;
  color: #2D5E3D;
  opacity: 0.75;
}
.agw-block--cancel {
  background: #FEF0F0;
  border-left-color: #E05252;
  color: #9B2C2C;
  opacity: 0.65;
  text-decoration: line-through;
}
.agw-block--absent {
  background: #F5F5F5;
  border-left-color: #9CA3AF;
  color: #6B7280;
  opacity: 0.6;
}
.agw-block--bloqueado {
  background: #F3F4F6;
  border-left-color: #9CA3AF;
  border-left-style: dashed;
  color: #6B7280;
  display: flex; align-items: center; gap: 5px;
}

.agw-block:hover:not(.agw-block--cancel):not(.agw-block--bloqueado) {
  transform: scale(1.01) translateY(-1px);
  box-shadow: 0 4px 12px rgba(44,59,45,0.14);
  z-index: 5;
}

.agwb-inner { display: flex; flex-direction: column; gap: 1px; }
.agwb-name  { font-size: 12px; font-weight: 700; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.agwb-svc   { font-size: 11px; line-height: 1.2; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.agwb-time  { font-size: 10.5px; opacity: 0.7; }
.agwb-status-icon { position: absolute; bottom: 4px; right: 5px; display: flex; align-items: center; }

/* Legenda inferior */
.agw-legend {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 20px;
  background: var(--white);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.agwl-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.agwl-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ══════════════════════════════════════════
   GRADE DIÁRIA (com profissionais como colunas)
══════════════════════════════════════════ */
.ag-day-grid {
  display: flex; flex-direction: column; flex: 1; overflow: hidden;
}
.agd-header {
  display: grid;
  border-bottom: 1px solid var(--border);
  background: var(--white);
  flex-shrink: 0;
  position: sticky; top: 0; z-index: 10;
}
.agd-time-col { width: 56px; border-right: 1px solid var(--border); }
.agd-prof-col { border-right: 1px solid var(--border); }
.agd-prof-head {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px;
}
.agd-prof-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.agd-prof-esp  { font-size: 11px; color: var(--text-muted); }
.agd-body { flex: 1; overflow-y: auto; }
.agd-row { display: grid; border-bottom: 1px solid var(--border); min-height: 64px; }
.agd-time { padding: 10px 8px 0; font-size: 11px; color: var(--text-muted); text-align: right; border-right: 1px solid var(--border); background: var(--white); width: 56px; }
.agd-cell { border-right: 1px solid var(--border); padding: 2px; min-height: 64px; cursor: pointer; transition: background 0.12s; }
.agd-cell:hover { background: var(--cream); }

/* ══════════════════════════════════════════
   GRADE MENSAL
══════════════════════════════════════════ */
.ag-month-grid {
  flex: 1; overflow-y: auto;
  background: var(--white);
}
.agm-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  background: var(--cream); border-bottom: 1px solid var(--border);
}
.agm-weekdays span {
  padding: 10px; text-align: center;
  font-size: 11.5px; font-weight: 600; color: var(--text-muted);
}
.agm-days {
  display: grid; grid-template-columns: repeat(7, 1fr);
}
.agm-cell {
  min-height: 100px; border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 8px; cursor: pointer; transition: background 0.12s;
  display: flex; flex-direction: column; gap: 4px;
}
.agm-cell:hover { background: var(--cream); }
.agm-cell--today { background: var(--green-50); }
.agm-cell--other { opacity: 0.4; }
.agm-cell--selected { background: rgba(78,107,91,0.06); }
.agm-cell-num {
  font-size: 13px; font-weight: 600; color: var(--text-secondary);
}
.agm-cell--today .agm-cell-num {
  background: var(--green-800); color: white;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
}
.agm-ag-pill {
  font-size: 11px; font-weight: 500; padding: 2px 6px;
  border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  cursor: pointer; transition: opacity 0.12s;
}
.agm-ag-pill:hover { opacity: 0.8; }
.agm-ag-pill--confirm { background: #EBF5EE; color: #2D6B45; }
.agm-ag-pill--pending { background: #FEF6E0; color: #8B6200; }
.agm-ag-pill--active  { background: #FEF0E0; color: #8B4500; }
.agm-ag-pill--done    { background: #EBF5EE; color: #2D5E3D; }
.agm-ag-pill--cancel  { background: #FEF0F0; color: #9B2C2C; }
.agm-ag-more { font-size: 11px; color: var(--text-muted); }

/* ══════════════════════════════════════════
   VISTA LISTA
══════════════════════════════════════════ */
.ag-lista { flex: 1; overflow-y: auto; }
.agl-wrap { overflow-x: auto; }

.agl-datetime { display: flex; align-items: center; gap: 10px; }
.agl-cal {
  width: 36px; height: 40px; border-radius: var(--r-sm);
  background: var(--cream); border: 1px solid var(--border-2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.agl-cal-day { font-size: 14px; font-weight: 700; color: var(--green-700); line-height: 1; }
.agl-cal-mon { font-size: 9.5px; text-transform: uppercase; color: var(--text-muted); }
.agl-time    { font-size: 13px; font-weight: 500; color: var(--text-secondary); font-variant-numeric: tabular-nums; }

.agl-status-sel {
  padding: 4px 10px; border: 1px solid var(--border-2);
  border-radius: var(--r-pill); font-size: 12px; font-weight: 500;
  cursor: pointer; background: var(--cream); color: var(--text-secondary);
  font-family: var(--font-sans); outline: none; 
  appearance: none;
  -webkit-appearance: none;
}

/* ══════════════════════════════════════════
   MODAL PREMIUM
══════════════════════════════════════════ */
.ag-modal { max-width: 620px; }
.ag-modal-body { display: flex; flex-direction: column; gap: 0; padding: 0; }
.ag-modal-section {
  padding: 18px 26px;
  border-bottom: 1px solid var(--border);
}
.ag-modal-section:last-child { border-bottom: none; }
.ag-modal-sec-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 11.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.7px; color: var(--text-muted);
  margin-bottom: 12px;
}
.ag-modal-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ag-modal-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

/* ══════════════════════════════════════════
   TOASTS
══════════════════════════════════════════ */
.ag-toast-wrap {
  position: fixed; top: 20px; right: 20px;
  z-index: 9999; display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
}
.ag-toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: var(--r-md);
  font-size: 13.5px; font-weight: 500;
  min-width: 280px; max-width: 380px;
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-lg);
  pointer-events: all;
}
.ag-toast--success { background: rgba(44,59,45,0.92); color: #A8E6C0; }
.ag-toast--error   { background: rgba(60,20,20,0.92); color: #FFACAC; }
.ag-toast--info    { background: rgba(20,40,80,0.92); color: #A8C8FF; }

.ag-toast-enter-active, .ag-toast-leave-active { transition: all 0.3s var(--ease); }
.ag-toast-enter-from, .ag-toast-leave-to { opacity: 0; transform: translateX(20px) scale(0.9); }
.ag-toast-move { transition: transform 0.3s var(--ease); }

/* ══════════════════════════════════════════
   RESPONSIVIDADE
══════════════════════════════════════════ */
@media (max-width: 1100px) {
  .ag-left-panel { display: none; }
  .agw-header { grid-template-columns: 48px repeat(7, 1fr); }
  .agw-row    { grid-template-columns: 48px repeat(7, 1fr); }
  .agw-time   { width: 48px; font-size: 10px; }
}

@media (max-width: 768px) {
  .ag-topbar { padding: 0 12px 0 52px; flex-wrap: wrap; height: auto; min-height: 60px; padding-top: 8px; padding-bottom: 8px; }
  .ag-topbar-center { display: none; }
  .ag-grade-controls { flex-wrap: wrap; gap: 8px; }
  .ag-grade-right { margin-left: 0; width: 100%; }
  .agw-header { grid-template-columns: 40px repeat(7, 1fr); }
  .agw-row    { grid-template-columns: 40px repeat(7, 1fr); }
  .agwb-svc, .agwb-time { display: none; }
  .agw-block { padding: 3px 4px; }
  .agwb-name { font-size: 10px; }
  .ag-modal-2col, .ag-modal-3col { grid-template-columns: 1fr; }
}
</style>