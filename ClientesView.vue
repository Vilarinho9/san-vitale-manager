<template>
  <div class="sv-layout">
    <Sidebar />
    <div class="sv-main cli-main">

      <!-- ╔══════════════════════════════════╗
           ║          TOPBAR                  ║
           ╚══════════════════════════════════╝ -->
      <header class="cli-topbar">
        <div>
          <h1 class="cli-h1">Clientes</h1>
          <p class="cli-sub">Gestão completa de relacionamento e histórico</p>
        </div>
        <div class="cli-topbar-actions">
          <div class="cli-total-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {{ clientes.length }} clientes
          </div>
          <button class="sv-btn sv-btn-secondary" style="font-size:13px" @click="exportarCSV">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar
          </button>
          <button class="sv-btn sv-btn-primary" @click="abrirCadastro">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Cliente
          </button>
        </div>
      </header>

      <div class="cli-content">

        <!-- ╔══════════════════════════════════╗
             ║     KPI CARDS PREMIUM            ║
             ╚══════════════════════════════════╝ -->
        <div class="cli-kpis anim-up">
          <div v-for="(k, i) in kpis" :key="k.label"
            class="cli-kpi-card"
            :class="`d-${i+1}`"
            :style="{'--kc': k.color, '--kb': k.iconBg}">
            <div class="ckc-left">
              <div class="ckc-icon-wrap">
                <span v-html="k.icon"></span>
              </div>
            </div>
            <div class="ckc-center">
              <p class="ckc-num">{{ k.value }}</p>
              <p class="ckc-label">{{ k.label }}</p>
            </div>
            <div class="ckc-right">
              <span class="ckc-sub">{{ k.sub }}</span>
            </div>
            <div class="ckc-accent"></div>
          </div>
        </div>

        <!-- ╔══════════════════════════════════╗
             ║     TOOLBAR: BUSCA + FILTROS     ║
             ╚══════════════════════════════════╝ -->
        <div class="cli-toolbar anim-up d-2">
          <div class="cli-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="cli-search-input" v-model="busca" placeholder="Buscar por nome, telefone ou e-mail..." />
            <button v-if="busca" class="cli-search-clear" @click="busca=''">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="cli-filters">
            <button v-for="f in filtros" :key="f.key"
              class="cli-filter-btn"
              :class="{ 'cli-filter-btn--active': filtroAtivo === f.key }"
              @click="filtroAtivo = filtroAtivo === f.key ? 'todos' : f.key">
              <span v-html="f.icon"></span>
              {{ f.label }}
              <span v-if="f.badge" class="cfb-badge">{{ f.badge }}</span>
            </button>
          </div>

          <div class="cli-view-btns">
            <button class="cli-view-btn" :class="{ active: viewMode==='grid' }" @click="viewMode='grid'" title="Cards">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button class="cli-view-btn" :class="{ active: viewMode==='lista' }" @click="viewMode='lista'" title="Lista">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- ╔══════════════════════════════════╗
             ║     ÁREA PRINCIPAL               ║
             ╚══════════════════════════════════╝ -->
        <div class="cli-main-area" :class="{ 'cli-main-area--panel': !!clienteSel }">

          <!-- ── Lista / Grid de clientes ── -->
          <div class="cli-list-col">

            <!-- Skeletons -->
            <div v-if="loading" :class="viewMode==='grid' ? 'cli-skel-grid' : 'cli-skel-list'">
              <div v-for="i in 8" :key="i" class="skel"
                :style="viewMode==='grid' ? 'height:180px;border-radius:18px' : 'height:68px;border-radius:12px'">
              </div>
            </div>

            <!-- Empty state -->
            <div v-else-if="!clientesFiltrados.length" class="cli-empty">
              <div class="cli-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h4>Nenhum cliente encontrado</h4>
              <p>{{ busca ? 'Tente outro termo de busca.' : 'Clique em "Novo Cliente" para começar.' }}</p>
              <button class="sv-btn sv-btn-primary" style="margin-top:14px" @click="abrirCadastro">
                Cadastrar primeiro cliente
              </button>
            </div>

            <!-- ════ MODO GRID: Cards ════ -->
            <div v-else-if="viewMode==='grid'" class="cli-grid">
              <div
                v-for="(c, idx) in clientesFiltrados" :key="c.id"
                class="cli-card anim-up"
                :class="{
                  'cli-card--selected': clienteSel?.id === c.id,
                  'cli-card--vip': c._vip
                }"
                :style="{ animationDelay: Math.min(idx,8)*0.04+'s' }"
                @click="selecionarCliente(c)"
              >
                <!-- Linha dourada VIP -->
                <div v-if="c._vip" class="cc-vip-line"></div>

                <div class="cc-header">
                  <div class="cc-avatar" :style="{ background: c._avatarBg }">{{ c._iniciais }}</div>
                  <div class="cc-header-info">
                    <div class="cc-nome">
                      {{ c.nome }}
                      <span v-if="c._vip" class="cc-vip-star">✦</span>
                    </div>
                    <div class="cc-telefone">{{ c.telefone }}</div>
                    <div class="cc-email-line">{{ c.email || 'sem e-mail' }}</div>
                  </div>
                  <div class="cc-top-actions" @click.stop>
                    <button class="cca-btn" @click="abrirEdicao(c)" title="Editar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="cca-btn cca-btn--del" @click.stop="confirmarDelete(c)" title="Excluir">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>

                <div class="cc-badges-row">
                  <span class="cli-status-badge" :class="`csb--${c._status}`">{{ c._statusLabel }}</span>
                  <span v-if="c._aniversMes" class="cc-aniv-badge">🎂 Aniversário</span>
                </div>

                <div class="cc-meta-row">
                  <div class="cc-meta-item" v-if="c.data_nascimento">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ fmtDate(c.data_nascimento) }}
                  </div>
                  <div class="cc-meta-item" v-if="c._ultimaVisita !== 'Nunca'">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Última: {{ c._ultimaVisita }}
                  </div>
                  <div class="cc-meta-item cc-meta-item--visits">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    {{ c._visitas }} atendimentos
                  </div>
                </div>

                <div class="cc-footer">
                  <div v-if="c.observacoes" class="cc-obs-snippet">{{ c.observacoes.slice(0,55) }}{{ c.observacoes.length>55?'…':'' }}</div>
                  <div v-else class="cc-obs-empty">Sem observações</div>
                  <button class="cc-ver-btn" @click.stop="selecionarCliente(c)">
                    Ver perfil →
                  </button>
                </div>
              </div>
            </div>

            <!-- ════ MODO LISTA: Tabela elegante ════ -->
            <div v-else class="cli-table-wrap">
              <table class="cli-table">
                <thead>
                  <tr>
                    <th style="width:260px">Cliente</th>
                    <th style="width:150px">Contato</th>
                    <th style="width:120px">Nascimento</th>
                    <th style="width:110px">Última visita</th>
                    <th>Observações</th>
                    <th style="width:110px">Status</th>
                    <th style="width:90px">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(c, idx) in clientesFiltrados" :key="c.id"
                    class="cli-tr anim-up"
                    :class="{ 'cli-tr--sel': clienteSel?.id === c.id }"
                    :style="{ animationDelay: Math.min(idx,8)*0.03+'s' }"
                    @click="selecionarCliente(c)"
                  >
                    <td>
                      <div class="clt-pessoa">
                        <div class="clt-ava" :style="{ background: c._avatarBg }">{{ c._iniciais }}</div>
                        <div class="clt-info">
                          <p class="clt-nome">
                            {{ c.nome }}
                            <span v-if="c._vip" class="clt-vip-star">✦</span>
                          </p>
                          <p class="clt-visitas-meta">{{ c._visitas }} atendimentos · {{ c._frequencia }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p class="clt-tel">{{ c.telefone }}</p>
                      <p class="clt-email">{{ c.email || '—' }}</p>
                    </td>
                    <td>
                      <span
                        v-if="c.data_nascimento"
                        class="clt-nasc"
                        :class="{ 'clt-nasc--aniv': c._aniversMes }"
                      >
                        {{ c._aniversMes ? '🎂 ' : '' }}{{ fmtDate(c.data_nascimento) }}
                      </span>
                      <span v-else class="clt-muted">—</span>
                    </td>
                    <td>
                      <span class="clt-visit">{{ c._ultimaVisita }}</span>
                    </td>
                    <td>
                      <span class="clt-obs-snippet">
                        {{ c.observacoes ? c.observacoes.slice(0,60)+(c.observacoes.length>60?'…':'') : '—' }}
                      </span>
                    </td>
                    <td>
                      <span class="cli-status-badge" :class="`csb--${c._status}`">{{ c._statusLabel }}</span>
                    </td>
                    <td @click.stop>
                      <div class="clt-actions">
                        <button class="cca-btn" title="Ver perfil" @click="selecionarCliente(c)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="cca-btn" title="Editar" @click="abrirEdicao(c)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="cca-btn cca-btn--del" title="Excluir" @click="confirmarDelete(c)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div><!-- /cli-list-col -->

          <!-- ╔══════════════════════════════════╗
               ║     DRAWER: PERFIL DO CLIENTE    ║
               ╚══════════════════════════════════╝ -->
          <transition name="panel-slide">
            <aside v-if="clienteSel" class="cli-panel">

              <!-- Header do perfil -->
              <div class="cp-header" :style="{ '--cpbg': clienteSel._avatarBg }">
                <button class="cp-close" @click="clienteSel = null" title="Fechar">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div class="cp-avatar-ring">
                  <div class="cp-avatar">{{ clienteSel._iniciais }}</div>
                </div>
                <h3 class="cp-name">{{ clienteSel.nome }}</h3>
                <p class="cp-since">Cliente desde {{ fmtDateFull(clienteSel.created_at) }}</p>
                <div class="cp-top-badges">
                  <span v-if="clienteSel._vip" class="cp-vip-badge">✦ VIP</span>
                  <span class="cli-status-badge" :class="`csb--${clienteSel._status}`">{{ clienteSel._statusLabel }}</span>
                  <span v-if="clienteSel._aniversMes" class="cp-aniv-badge">🎂 Aniversário este mês</span>
                </div>
                <!-- Quick stats no header -->
                <div class="cp-quick-stats">
                  <div class="cqs-item">
                    <span class="cqs-val">{{ clienteSel._visitas }}</span>
                    <span class="cqs-lbl">Visitas</span>
                  </div>
                  <div class="cqs-sep"></div>
                  <div class="cqs-item">
                    <span class="cqs-val">{{ clienteSel._frequencia }}</span>
                    <span class="cqs-lbl">Frequência</span>
                  </div>
                  <div class="cqs-sep"></div>
                  <div class="cqs-item">
                    <span class="cqs-val">{{ clienteSel._ultimaVisita }}</span>
                    <span class="cqs-lbl">Última visita</span>
                  </div>
                </div>
                <!-- Ações rápidas -->
                <div class="cp-header-actions">
                  <button class="cpha-btn cpha-btn--wa" @click="enviarWA(clienteSel)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12 12 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    WhatsApp
                  </button>
                  <button class="cpha-btn" @click="abrirEdicao(clienteSel)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar dados
                  </button>
                </div>
              </div>

              <!-- Tabs do painel -->
              <div class="cp-tabs">
                <button v-for="t in panelTabs" :key="t.k"
                  class="cp-tab"
                  :class="{ 'cp-tab--active': panelTab === t.k }"
                  @click="panelTab = t.k">
                  {{ t.label }}
                </button>
              </div>

              <div class="cp-body">

                <!-- ── Aba: INFORMAÇÕES ── -->
                <template v-if="panelTab === 'info'">
                  <div class="cp-section">
                    <p class="cp-sec-label">Dados pessoais</p>
                    <div class="cp-data-grid">
                      <div class="cpd-item" v-for="d in dadosPessoais" :key="d.l">
                        <span class="cpd-label">{{ d.l }}</span>
                        <span class="cpd-val" :class="{ 'cpd-val--muted': !d.v }">{{ d.v || 'Não informado' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="cp-section">
                    <div class="cp-sec-row">
                      <p class="cp-sec-label">Observações internas</p>
                      <button class="cp-obs-edit-btn" @click="toggleEditObs">
                        {{ editandoObs ? 'Salvar' : 'Editar' }}
                      </button>
                    </div>
                    <textarea
                      v-if="editandoObs"
                      class="sv-textarea cp-obs-textarea"
                      v-model="obsTemp"
                      rows="4"
                      placeholder="Preferências, alergias, atenções especiais da equipe..."
                      @blur="salvarObs"
                    ></textarea>
                    <div v-else class="cp-obs-box">
                      {{ clienteSel.observacoes || 'Nenhuma observação registrada.' }}
                    </div>
                  </div>

                  <div class="cp-section" v-if="proximoAg">
                    <p class="cp-sec-label">Próximo agendamento</p>
                    <div class="cp-prox-ag">
                      <div class="cppa-cal">
                        <span class="cppa-day">{{ fmtDay(proximoAg.data) }}</span>
                        <span class="cppa-mon">{{ fmtMon(proximoAg.data) }}</span>
                      </div>
                      <div class="cppa-info">
                        <p class="cppa-svc">{{ proximoAg.servicos?.nome || '—' }}</p>
                        <p class="cppa-hora">{{ proximoAg.horario?.slice(0,5) }} · {{ proximoAg.servicos?.duracao }}</p>
                      </div>
                      <span class="cli-status-badge csb--confirmado" style="font-size:11px">{{ proximoAg.status }}</span>
                    </div>
                  </div>
                </template>

                <!-- ── Aba: HISTÓRICO ── -->
                <template v-if="panelTab === 'historico'">
                  <div class="cp-section">
                    <p class="cp-sec-label">Histórico de atendimentos</p>

                    <div v-if="loadingAgs" style="display:flex;flex-direction:column;gap:8px">
                      <div v-for="i in 4" :key="i" class="skel" style="height:62px;border-radius:10px"></div>
                    </div>

                    <div v-else-if="!agCliente.length" class="cp-hist-empty">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <p>Nenhum atendimento registrado</p>
                    </div>

                    <div v-else class="cp-timeline">
                      <div v-for="ag in agCliente" :key="ag.id" class="cpt-item">
                        <div class="cpt-indicator">
                          <div class="cpt-dot" :class="`cptd--${statusKey(ag.status)}`"></div>
                          <div class="cpt-line-v"></div>
                        </div>
                        <div class="cpt-card">
                          <div class="cpt-card-top">
                            <div>
                              <p class="cpt-svc">{{ ag.servicos?.nome || 'Serviço' }}</p>
                              <p class="cpt-date-prof">{{ fmtDateFull(ag.data) }} · {{ ag.horario?.slice(0,5) }}</p>
                            </div>
                            <span class="cli-status-badge" :class="`csb--${statusKey(ag.status)}`" style="font-size:10.5px;flex-shrink:0">{{ ag.status }}</span>
                          </div>
                          <div class="cpt-card-foot">
                            <span class="cpt-cat">{{ ag.servicos?.categoria }}</span>
                            <span class="cpt-dur">{{ ag.servicos?.duracao }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Resumo numérico -->
                  <div class="cp-section" v-if="!loadingAgs && agCliente.length">
                    <p class="cp-sec-label">Resumo dos atendimentos</p>
                    <div class="cp-resumo-grid">
                      <div class="cpre-item">
                        <span class="cpre-num">{{ agCliente.length }}</span>
                        <span class="cpre-lbl">Total</span>
                      </div>
                      <div class="cpre-item">
                        <span class="cpre-num" style="color:#2D6B45">{{ agCliente.filter(a=>a.status==='Concluído').length }}</span>
                        <span class="cpre-lbl">Concluídos</span>
                      </div>
                      <div class="cpre-item">
                        <span class="cpre-num" style="color:#9B2C2C">{{ agCliente.filter(a=>a.status==='Cancelado').length }}</span>
                        <span class="cpre-lbl">Cancelados</span>
                      </div>
                      <div class="cpre-item">
                        <span class="cpre-num" style="color:#8B6200">{{ agCliente.filter(a=>a.status==='Pendente').length }}</span>
                        <span class="cpre-lbl">Pendentes</span>
                      </div>
                    </div>
                  </div>
                </template>

              </div><!-- /cp-body -->
            </aside>
          </transition>

        </div><!-- /cli-main-area -->
      </div><!-- /cli-content -->
    </div><!-- /sv-main -->

    <!-- ╔══════════════════════════════════╗
         ║   MODAL CADASTRO / EDIÇÃO        ║
         ╚══════════════════════════════════╝ -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showModal" class="sv-overlay" @click.self="fecharModal">
          <div class="sv-modal cli-modal">
            <div class="sv-modal-head">
              <div>
                <h2>{{ editandoCliente ? 'Editar cliente' : 'Novo cliente' }}</h2>
                <p class="cm-head-sub">{{ editandoCliente ? 'Atualize as informações abaixo' : `Etapa ${step} de 2` }}</p>
              </div>
              <button class="sv-modal-close" @click="fecharModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Steps -->
            <div v-if="!editandoCliente" class="cm-steps">
              <div class="cm-step" :class="{ 'cm-step--active': step >= 1, 'cm-step--done': step > 1 }">
                <div class="cms-num">{{ step > 1 ? '✓' : '1' }}</div>
                <span>Dados pessoais</span>
              </div>
              <div class="cms-connector"></div>
              <div class="cm-step" :class="{ 'cm-step--active': step >= 2 }">
                <div class="cms-num">2</div>
                <span>Informações extras</span>
              </div>
            </div>

            <div class="sv-modal-body">
              <!-- Passo 1 -->
              <div v-show="step === 1 || !!editandoCliente">
                <p class="cm-sec-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Dados pessoais
                </p>
                <div class="cm-grid">
                  <div class="sv-field" style="grid-column:1/-1">
                    <label class="sv-label">Nome completo *</label>
                    <input class="sv-input" v-model="form.nome" placeholder="Nome completo do cliente" :class="{ 'input-err': erros.nome }" />
                    <span v-if="erros.nome" class="cm-field-err">{{ erros.nome }}</span>
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Telefone / WhatsApp *</label>
                    <input class="sv-input" v-model="form.telefone" placeholder="(86) 9 9999-9999" :class="{ 'input-err': erros.telefone }" />
                    <span v-if="erros.telefone" class="cm-field-err">{{ erros.telefone }}</span>
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">E-mail</label>
                    <input class="sv-input" type="email" v-model="form.email" placeholder="email@exemplo.com" />
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Data de nascimento</label>
                    <input class="sv-input" type="date" v-model="form.data_nascimento" />
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Instagram</label>
                    <input class="sv-input" v-model="form.instagram" placeholder="@usuario" />
                  </div>
                </div>
              </div>

              <!-- Passo 2 -->
              <div v-show="step === 2 || !!editandoCliente">
                <p class="cm-sec-title" :class="{ 'cm-sec-title--sep': !!editandoCliente }">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Informações extras
                </p>
                <div class="cm-grid">
                  <div class="sv-field">
                    <label class="sv-label">Profissional favorita</label>
                    <select class="sv-select" v-model="form.profissional_favorito">
                      <option value="">Sem preferência</option>
                      <option v-for="p in profissionais" :key="p">{{ p }}</option>
                    </select>
                  </div>
                  <div class="sv-field">
                    <label class="sv-label">Perfil do cliente</label>
                    <select class="sv-select" v-model="form.vip">
                      <option :value="false">Cliente regular</option>
                      <option :value="true">Cliente VIP ✦</option>
                    </select>
                  </div>
                  <div class="sv-field" style="grid-column:1/-1">
                    <label class="sv-label">Observações internas</label>
                    <textarea class="sv-textarea" v-model="form.observacoes" rows="4" placeholder="Alergias, preferências, atenções especiais..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="sv-modal-foot">
              <button v-if="editandoCliente" class="sv-btn sv-btn-danger" style="margin-right:auto" @click="confirmarDelete(editandoCliente)">Excluir</button>
              <button class="sv-btn sv-btn-secondary" @click="step===2 && !editandoCliente ? step=1 : fecharModal()">
                {{ step===2 && !editandoCliente ? '← Voltar' : 'Cancelar' }}
              </button>
              <button class="sv-btn sv-btn-primary" @click="avancarOuSalvar" :disabled="saving">
                <span v-if="saving" class="sv-btn-spinner"></span>
                <span v-else-if="step===1 && !editandoCliente">Próximo →</span>
                <span v-else>{{ editandoCliente ? 'Salvar' : 'Cadastrar cliente' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal excluir -->
    <teleport to="body">
      <transition name="sv-modal">
        <div v-if="showDelete" class="sv-overlay" @click.self="showDelete=false">
          <div class="sv-modal" style="max-width:420px">
            <div class="sv-modal-head">
              <h2>Excluir cliente</h2>
              <button class="sv-modal-close" @click="showDelete=false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div class="sv-modal-body">
              <p style="font-size:14px;color:var(--text-secondary);line-height:1.65">
                Excluir permanentemente <strong style="color:var(--text-primary)">{{ clienteParaDel?.nome }}</strong>?<br>
                Todos os dados serão perdidos. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div class="sv-modal-foot">
              <button class="sv-btn sv-btn-secondary" @click="showDelete=false">Cancelar</button>
              <button class="sv-btn sv-btn-danger" @click="excluir" :disabled="deleting">
                <span v-if="deleting" class="sv-btn-spinner" style="border-color:rgba(155,44,44,.25);border-top-color:#9B2C2C"></span>
                <span v-else>Excluir definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toasts -->
    <teleport to="body">
      <div class="cli-toasts">
        <transition-group name="cli-toast">
          <div v-for="t in toasts" :key="t.id" class="cli-toast" :class="`ct--${t.type}`">
            <span v-html="toastIcons[t.type]"></span>{{ t.message }}
          </div>
        </transition-group>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import api from '@/services/api'

/* ── Constantes ── */
const profissionais = ['Patrícia Lima','Fernanda Costa','Mariana Oliveira','Beatriz Lima','Camila Silva']
const CORES = ['#4E6B5B','#7A9B89','#C9A84C','#5C7A69','#A3BFB2','#8B9B6A','#6B8A79','#2D5E3D']
const panelTabs = [{ k:'info', label:'Informações' },{ k:'historico', label:'Histórico' }]
const toastIcons = {
  success:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
}

/* ── Estado ── */
const clientes        = ref([])
const agendamentos    = ref([])
const loading         = ref(true)
const saving          = ref(false)
const deleting        = ref(false)
const showModal       = ref(false)
const showDelete      = ref(false)
const editandoCliente = ref(null)
const clienteParaDel  = ref(null)
const clienteSel      = ref(null)
const agCliente       = ref([])
const loadingAgs      = ref(false)
const panelTab        = ref('info')
const busca           = ref('')
const filtroAtivo     = ref('todos')
const viewMode        = ref('grid')
const step            = ref(1)
const editandoObs     = ref(false)
const obsTemp         = ref('')
const toasts          = ref([])
let   toastId         = 0
const erros           = ref({ nome:'', telefone:'' })
const form            = ref(formVazio())

function formVazio() {
  return { nome:'', telefone:'', email:'', data_nascimento:'', observacoes:'', instagram:'', profissional_favorito:'', vip: false }
}

/* ── Helpers ── */
function getAvaColor(nome) {
  let h = 0; for (const c of (nome||'')) h = (h*31 + c.charCodeAt(0)) % CORES.length
  return CORES[h]
}
function getIniciais(nome) {
  const p = (nome||'').trim().split(' ')
  return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase()
}
function fmtDate(d) {
  if (!d) return null; try { const [y,m,day]=d.split('-'); return `${day}/${m}/${y}` } catch { return d }
}
function fmtDateFull(d) {
  if (!d) return '—'; try { return new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'}) } catch { return d }
}
function fmtDay(d) { try { return new Date(d+'T12:00:00').getDate() } catch { return '' } }
function fmtMon(d) { try { return new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.','') } catch { return '' } }
function isAniversMes(d) {
  if (!d) return false; try { return parseInt(d.split('-')[1])===(new Date().getMonth()+1) } catch { return false }
}
function statusKey(s='') {
  return { 'Pendente':'pendente','Confirmado':'confirmado','Em atendimento':'ativo','Concluído':'concluido','Cancelado':'cancelado','Não compareceu':'ausente' }[s]||'pendente'
}

/* ── Enriquecer cliente ── */
function enriquecer(c, agsAll=[]) {
  const ags       = agsAll.filter(a => a.cliente_id===c.id || a.clientes?.id===c.id)
  const concluidos= ags.filter(a => a.status==='Concluído')
  const hoje      = new Date().toISOString().split('T')[0]
  const ultimos30 = ags.filter(a => { const d=new Date(a.data); return (new Date()-d)/(86400000)<=30 })
  const ultimaAg  = ags.filter(a=>a.data<=hoje).sort((a,b)=>b.data.localeCompare(a.data))[0]
  const proxAg    = ags.filter(a=>a.data>=hoje).sort((a,b)=>a.data.localeCompare(b.data))[0]

  const freqNum   = concluidos.length
  const freq      = freqNum >= 8 ? 'Semanal' : freqNum >= 4 ? 'Quinzenal' : freqNum >= 2 ? 'Mensal' : 'Esporádica'
  const vipFlag   = c.vip === true
  const statusC   = vipFlag ? 'vip' : freqNum >= 5 ? 'frequente' : ultimos30.length===0 && freqNum>0 ? 'inativo' : freqNum===0 ? 'novo' : 'frequente'
  const statusLbl = { vip:'VIP', frequente:'Frequente', novo:'Novo', inativo:'Inativo' }[statusC]

  return {
    ...c,
    _avatarBg:    getAvaColor(c.nome),
    _iniciais:    getIniciais(c.nome),
    _vip:         vipFlag,
    _aniversMes:  isAniversMes(c.data_nascimento),
    _visitas:     concluidos.length,
    _frequencia:  freq,
    _ultimaVisita:ultimaAg ? fmtDate(ultimaAg.data) : 'Nunca',
    _proxAg:      proxAg || null,
    _status:      statusC,
    _statusLabel: statusLbl,
  }
}

/* ── KPIs — SEM informações financeiras ── */
const kpis = computed(() => {
  const lista  = clientes.value
  const ags    = agendamentos.value
  const hoje   = new Date()
  const ini30  = new Date(); ini30.setDate(ini30.getDate()-30)
  const ativoIds = new Set(ags.filter(a=>new Date(a.data)>=ini30).map(a=>a.cliente_id))
  const retornoIds = new Set(
    ags.filter(a=>a.status==='Concluído')
       .reduce((acc,a) => { acc[a.cliente_id]=(acc[a.cliente_id]||0)+1; return acc }, {} )
    && Object.entries(ags.reduce((acc,a)=>{acc[a.cliente_id]=(acc[a.cliente_id]||0)+1;return acc},{}) ).filter(([,v])=>v>1).map(([k])=>k)
  )
  // Clientes com mais de 1 atendimento concluído = retorno
  const comRetorno = lista.filter(c => {
    const cc = ags.filter(a=>(a.cliente_id===c.id||a.clientes?.id===c.id) && a.status==='Concluído')
    return cc.length > 1
  }).length

  return [
    { label:'Total de clientes',  value: lista.length,                                              sub:'cadastrados',        color:'#4E6B5B', iconBg:'rgba(78,107,91,0.08)',   icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" stroke-width="1.7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { label:'Clientes VIP',       value: lista.filter(c=>c._vip).length,                            sub:'perfil premium',     color:'#C9A84C', iconBg:'rgba(201,168,76,0.08)',  icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    { label:'Aniversariantes',    value: lista.filter(c=>c._aniversMes).length,                     sub:'este mês',           color:'#F07F2A', iconBg:'rgba(240,127,42,0.08)',  icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07F2A" stroke-width="1.7"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M12 11V5"/><path d="M8 8l4-3 4 3"/></svg>` },
    { label:'Ativos (30 dias)',   value: ativoIds.size,                                              sub:'com visita recente', color:'#2D6B45', iconBg:'rgba(45,107,69,0.08)',   icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D6B45" stroke-width="1.7"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
    { label:'Novos este mês',     value: lista.filter(c=>{ try{const d=new Date(c.created_at);return d.getMonth()===hoje.getMonth()&&d.getFullYear()===hoje.getFullYear()}catch{return false}}).length, sub:'cadastros recentes', color:'#1D4ED8', iconBg:'rgba(29,78,216,0.08)', icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>` },
    { label:'Com retorno',        value: comRetorno,                                                 sub:'mais de 1 visita',   color:'#5C7A69', iconBg:'rgba(92,122,105,0.08)',  icon:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C7A69" stroke-width="1.7"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` },
  ]
})

/* ── Filtros ── */
const filtros = computed(() => [
  { key:'todos',       label:'Todos',           icon:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
  { key:'vip',         label:'VIP',             icon:`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, badge: clientes.value.filter(c=>c._vip).length },
  { key:'aniversario', label:'Aniversariantes', icon:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M12 11V5"/><path d="M8 8l4-3 4 3"/></svg>`, badge: clientes.value.filter(c=>c._aniversMes).length },
  { key:'inativo',     label:'Inativos',        icon:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>` },
  { key:'novo',        label:'Novos',           icon:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>` },
])

const clientesFiltrados = computed(() => {
  let list = clientes.value
  if (busca.value.trim()) {
    const q = busca.value.toLowerCase()
    list = list.filter(c => c.nome?.toLowerCase().includes(q)||c.telefone?.includes(q)||c.email?.toLowerCase().includes(q))
  }
  if (filtroAtivo.value==='vip')        list = list.filter(c=>c._vip)
  if (filtroAtivo.value==='aniversario')list = list.filter(c=>c._aniversMes)
  if (filtroAtivo.value==='inativo')    list = list.filter(c=>c._status==='inativo')
  if (filtroAtivo.value==='novo')       list = list.filter(c=>c._status==='novo')
  return list
})

/* ── Painel lateral ── */
const dadosPessoais = computed(() => {
  const c = clienteSel.value; if (!c) return []
  let idade = null
  if (c.data_nascimento) { try { const n=new Date(c.data_nascimento+'T12:00:00'); idade=Math.floor((new Date()-n)/(365.25*86400000))+' anos' } catch {} }
  return [
    { l:'Telefone',       v: c.telefone },
    { l:'E-mail',         v: c.email },
    { l:'Nascimento',     v: fmtDate(c.data_nascimento) },
    { l:'Idade',          v: idade },
    { l:'Instagram',      v: c.instagram },
    { l:'Prof. favorita', v: c.profissional_favorito },
    { l:'Cadastro',       v: fmtDateFull(c.created_at) },
    { l:'Última visita',  v: c._ultimaVisita },
  ]
})
const proximoAg = computed(() => clienteSel.value?._proxAg || null)

function selecionarCliente(c) {
  if (clienteSel.value?.id===c.id) { clienteSel.value=null; return }
  clienteSel.value = c; panelTab.value='info'; editandoObs.value=false; obsTemp.value=c.observacoes||''
  carregarAgsCliente(c.id)
}
async function carregarAgsCliente(id) {
  loadingAgs.value = true
  try {
    const res = await api.get('/agendamentos')
    agCliente.value = res.data.filter(a=>a.cliente_id===id||a.clientes?.id===id).sort((a,b)=>b.data.localeCompare(a.data))
  } catch { agCliente.value=[] } finally { loadingAgs.value=false }
}

/* ── Modal ── */
function abrirCadastro() { editandoCliente.value=null; form.value=formVazio(); step.value=1; erros.value={nome:'',telefone:''}; showModal.value=true }
function abrirEdicao(c) {
  editandoCliente.value=c
  form.value={ nome:c.nome||'', telefone:c.telefone||'', email:c.email||'', data_nascimento:c.data_nascimento||'', observacoes:c.observacoes||'', instagram:c.instagram||'', profissional_favorito:c.profissional_favorito||'', vip:c._vip||false }
  erros.value={nome:'',telefone:''}; step.value=1; showModal.value=true
}
function fecharModal() { showModal.value=false; editandoCliente.value=null; step.value=1 }

function avancarOuSalvar() {
  erros.value={nome:'',telefone:''}
  if (!form.value.nome?.trim())     { erros.value.nome='Nome é obrigatório.'; return }
  if (!form.value.telefone?.trim()) { erros.value.telefone='Telefone é obrigatório.'; return }
  if (!editandoCliente.value && step.value===1) { step.value=2; return }
  salvar()
}
async function salvar() {
  saving.value=true
  try {
    const payload={ nome:form.value.nome, telefone:form.value.telefone, email:form.value.email||null, data_nascimento:form.value.data_nascimento||null, observacoes:form.value.observacoes||null }
    if (editandoCliente.value) {
      const res=await api.put(`/clientes/${editandoCliente.value.id}`,payload)
      const enr=enriquecer({...editandoCliente.value,...res.data,instagram:form.value.instagram,profissional_favorito:form.value.profissional_favorito,vip:form.value.vip},agendamentos.value)
      const idx=clientes.value.findIndex(c=>c.id===editandoCliente.value.id)
      if (idx!==-1) clientes.value[idx]=enr
      if (clienteSel.value?.id===editandoCliente.value.id) clienteSel.value=enr
      toast('Cliente atualizado com sucesso!')
    } else {
      const res=await api.post('/clientes',payload)
      clientes.value.unshift(enriquecer({...res.data,instagram:form.value.instagram,profissional_favorito:form.value.profissional_favorito,vip:form.value.vip},agendamentos.value))
      toast('Cliente cadastrado com sucesso!')
    }
    fecharModal()
  } catch(e) { toast(e.response?.data?.error||'Erro ao salvar.','error') }
  finally { saving.value=false }
}

function confirmarDelete(c) { clienteParaDel.value=c; showDelete.value=true; if(showModal.value) fecharModal() }
async function excluir() {
  deleting.value=true
  try {
    await api.delete(`/clientes/${clienteParaDel.value.id}`)
    clientes.value=clientes.value.filter(c=>c.id!==clienteParaDel.value.id)
    if (clienteSel.value?.id===clienteParaDel.value.id) clienteSel.value=null
    toast('Cliente excluído.'); showDelete.value=false
  } catch { toast('Erro ao excluir.','error') } finally { deleting.value=false }
}

function toggleEditObs() {
  if (editandoObs.value) salvarObs()
  else { editandoObs.value=true; obsTemp.value=clienteSel.value?.observacoes||'' }
}
function salvarObs() {
  if (clienteSel.value) { clienteSel.value.observacoes=obsTemp.value; const idx=clientes.value.findIndex(c=>c.id===clienteSel.value.id); if(idx!==-1) clientes.value[idx].observacoes=obsTemp.value }
  editandoObs.value=false
}

function enviarWA(c) {
  const tel=(c.telefone||'').replace(/\D/g,'')
  if (!tel) { toast('Telefone não cadastrado.','error'); return }
  window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(`Olá, ${c.nome}! 🌿 Aqui é a *San Vitale Wellness Studio*. Como posso ajudar?`)}`,'_blank')
}
function exportarCSV() {
  const rows=[['Nome','Telefone','Email','Nascimento','Observações'],...clientes.value.map(c=>[c.nome,c.telefone,c.email||'',fmtDate(c.data_nascimento)||'',c.observacoes||''])]
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n')
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='clientes_sanvitale.csv'; a.click()
  toast('Exportação concluída!')
}

function toast(message,type='success') {
  const id=++toastId; toasts.value.push({id,message,type})
  setTimeout(()=>{ toasts.value=toasts.value.filter(t=>t.id!==id) },3500)
}

onMounted(async () => {
  try {
    const [cliRes,agRes]=await Promise.all([api.get('/clientes'),api.get('/agendamentos')])
    agendamentos.value=agRes.data
    clientes.value=cliRes.data.map(c=>enriquecer(c,agRes.data))
  } catch(e) { toast('Erro ao carregar clientes.','error'); console.error(e) }
  finally { loading.value=false }
})
</script>

<style scoped>
/* ══ ROOT ══ */
.cli-main { background: var(--cream); }

/* ══ TOPBAR ══ */
.cli-topbar {
  height: 70px; background: var(--white); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; gap: 16px; flex-shrink: 0;
}
.cli-h1   { font-family: var(--font-serif); font-size: 26px; font-weight: 400; color: var(--text-primary); line-height: 1; }
.cli-sub  { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
.cli-topbar-actions { display: flex; align-items: center; gap: 10px; }
.cli-total-pill {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  background: var(--cream-2); border: 1px solid var(--border); padding: 6px 14px; border-radius: var(--r-pill);
}

/* ══ CONTENT ══ */
.cli-content { padding: 22px 28px; display: flex; flex-direction: column; gap: 16px; }

/* ══════════════════════════════════════
   KPI CARDS — compactos, números elegantes
══════════════════════════════════════ */
.cli-kpis { display: grid; grid-template-columns: repeat(6,1fr); gap: 10px; }
.cli-kpi-card {
  background: var(--white); border-radius: 14px;
  border: 1px solid var(--border); box-shadow: var(--shadow-xs);
  padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  position: relative; overflow: hidden;
  transition: all 0.2s var(--ease);
  animation: fadeUp 0.38s var(--ease) both;
}
.cli-kpi-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }

/* Stripe colorida à esquerda */
.ckc-accent {
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--kc);
}

/* Ícone */
.ckc-left { flex-shrink: 0; }
.ckc-icon-wrap {
  width: 40px; height: 40px; border-radius: 11px;
  background: var(--kb);
  display: flex; align-items: center; justify-content: center;
}

/* Número e label centrais */
.ckc-center { flex: 1; min-width: 0; }
.ckc-num {
  /* ← Cormorant Garamond — tipografia premium do sistema */
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
  display: block;
  margin-bottom: 4px;
}
.ckc-label {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.7px; color: var(--text-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Sub à direita */
.ckc-right { flex-shrink: 0; text-align: right; }
.ckc-sub   { font-size: 10.5px; color: var(--text-light); white-space: nowrap; }

/* ══ TOOLBAR ══ */
.cli-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.cli-search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-pill);
  padding: 9px 14px; width: 300px; transition: all 0.15s;
}
.cli-search-wrap:focus-within { border-color: var(--green-400); box-shadow: var(--shadow-focus); }
.cli-search-wrap svg { color: var(--text-muted); flex-shrink: 0; }
.cli-search-input { border:none; outline:none; background:none; font-size:13.5px; color:var(--text-primary); width:100%; }
.cli-search-input::placeholder { color: var(--text-muted); }
.cli-search-clear { background:none; border:none; cursor:pointer; color:var(--text-muted); display:flex; align-items:center; padding:2px; border-radius:4px; }
.cli-search-clear:hover { color: var(--text-primary); }

.cli-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.cli-filter-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--r-pill); border: 1.5px solid var(--border);
  background: var(--white); font-size: 12.5px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s; font-family: var(--font-sans);
}
.cli-filter-btn:hover { border-color: var(--green-400); background: var(--green-50); color: var(--green-700); }
.cli-filter-btn--active { background: var(--green-800); border-color: var(--green-800); color: white; }
.cfb-badge {
  background: rgba(255,255,255,0.25); color: inherit; font-size: 10.5px; font-weight: 700;
  padding: 1px 6px; border-radius: 99px; min-width: 18px; text-align: center;
}
.cli-filter-btn--active .cfb-badge { background: rgba(255,255,255,0.2); }

.cli-view-btns { margin-left: auto; display: flex; background: var(--cream-2); border-radius: var(--r-sm); border: 1px solid var(--border); padding: 2px; }
.cli-view-btn { width:32px; height:28px; border:none; background:none; border-radius:calc(var(--r-sm)-2px); display:flex; align-items:center; justify-content:center; color:var(--text-muted); cursor:pointer; transition:all 0.15s; }
.cli-view-btn.active { background:var(--white); color:var(--text-primary); box-shadow:var(--shadow-xs); }

/* ══ MAIN AREA ══ */
.cli-main-area { display: grid; grid-template-columns: 1fr; gap: 14px; transition: grid-template-columns 0.3s var(--ease); }
.cli-main-area--panel { grid-template-columns: 1fr 370px; }
.cli-list-col { min-width: 0; }

/* Skeletons */
.cli-skel-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap: 12px; }
.cli-skel-list { display: flex; flex-direction: column; gap: 8px; }

/* Empty */
.cli-empty {
  background: var(--white); border-radius: 18px; border: 1px solid var(--border);
  display: flex; flex-direction: column; align-items: center; padding: 64px 20px; gap: 12px; text-align: center;
}
.cli-empty-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--cream-2); display: flex; align-items: center; justify-content: center; color: var(--green-300); }
.cli-empty h4 { font-family: var(--font-serif); font-size: 18px; font-weight: 400; color: var(--text-secondary); }
.cli-empty p  { font-size: 13px; color: var(--text-muted); max-width: 240px; line-height: 1.6; }

/* ══ GRID DE CARDS ══ */
.cli-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap: 12px; }
.cli-card {
  background: var(--white); border-radius: 18px; border: 1px solid var(--border);
  box-shadow: var(--shadow-xs); padding: 18px; cursor: pointer;
  transition: all 0.2s var(--ease); animation: fadeUp 0.38s var(--ease) both;
  display: flex; flex-direction: column; gap: 10px; position: relative;
}
.cli-card:hover  { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.cli-card--selected { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(78,107,91,0.12),var(--shadow-md); }
.cli-card--vip  { border-color: rgba(201,168,76,0.4); }
.cc-vip-line    { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--gold), rgba(201,168,76,0.3)); border-radius: 18px 18px 0 0; }

.cc-header { display: flex; align-items: flex-start; gap: 10px; }
.cc-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: white; }
.cc-header-info { flex: 1; min-width: 0; }
.cc-nome { font-size: 14px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-vip-star { color: var(--gold); font-size: 11px; flex-shrink: 0; }
.cc-telefone { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.cc-email-line { font-size: 11.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-top-actions { display: flex; gap: 4px; flex-shrink: 0; }

.cc-badges-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cc-aniv-badge { font-size: 11px; color: #F07F2A; font-weight: 500; }

.cc-meta-row { display: flex; flex-wrap: wrap; gap: 8px; }
.cc-meta-item { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: var(--text-muted); }
.cc-meta-item--visits { color: var(--green-600); font-weight: 500; }

.cc-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 2px; border-top: 1px solid var(--border); padding-top: 10px; }
.cc-obs-snippet { font-size: 11.5px; color: var(--text-muted); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: italic; }
.cc-obs-empty   { font-size: 11.5px; color: var(--text-light); flex: 1; }
.cc-ver-btn { background: none; border: none; cursor: pointer; font-size: 12px; color: var(--green-600); font-weight: 500; font-family: var(--font-sans); white-space: nowrap; padding: 0; flex-shrink: 0; }
.cc-ver-btn:hover { color: var(--green-800); }

/* ══ BOTÕES DE AÇÃO ══ */
.cca-btn {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border);
  background: none; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muted); transition: all 0.15s;
}
.cca-btn:hover { background: var(--green-50); color: var(--green-700); border-color: var(--green-300); }
.cca-btn--del:hover { background: #FEF0F0; color: #9B2C2C; border-color: #FECACA; }

/* ══ TABELA ══ */
.cli-table-wrap { background: var(--white); border-radius: 18px; border: 1px solid var(--border); box-shadow: var(--shadow-xs); overflow: hidden; }
.cli-table { width: 100%; border-collapse: collapse; }
.cli-table thead th {
  padding: 11px 16px; text-align: left;
  font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.7px;
  color: var(--text-muted); background: var(--cream); border-bottom: 1px solid var(--border);
}
.cli-tr td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.cli-tr:last-child td { border-bottom: none; }
.cli-tr { cursor: pointer; transition: background 0.12s; animation: fadeUp 0.35s var(--ease) both; }
.cli-tr:hover  { background: var(--cream); }
.cli-tr--sel   { background: var(--green-50) !important; }

.clt-pessoa { display: flex; align-items: center; gap: 10px; }
.clt-ava { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
.clt-info { min-width: 0; }
.clt-nome { font-weight: 600; font-size: 13.5px; color: var(--text-primary); display: flex; align-items: center; gap: 5px; }
.clt-vip-star { color: var(--gold); font-size: 11px; }
.clt-visitas-meta { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }
.clt-tel   { font-weight: 500; color: var(--text-primary); font-size: 13px; }
.clt-email { font-size: 11.5px; color: var(--text-muted); }
.clt-nasc  { font-size: 12.5px; color: var(--text-secondary); }
.clt-nasc--aniv { color: #F07F2A; font-weight: 500; }
.clt-muted { color: var(--text-muted); font-size: 12px; }
.clt-visit { font-size: 13px; color: var(--text-secondary); }
.clt-obs-snippet { font-size: 12px; color: var(--text-muted); font-style: italic; }
.clt-actions { display: flex; gap: 4px; }

/* ══ STATUS BADGES ══ */
.cli-status-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: var(--r-pill);
  font-size: 11.5px; font-weight: 500; white-space: nowrap;
}
.csb--vip       { background: rgba(201,168,76,0.12); color: #8B6200; }
.csb--frequente { background: var(--status-confirm-bg); color: var(--status-confirm-fg); }
.csb--novo      { background: #EFF6FF; color: #1D4ED8; }
.csb--inativo   { background: var(--status-cancel-bg); color: var(--status-cancel-fg); }
.csb--concluido { background: var(--status-done-bg); color: var(--status-done-fg); }
.csb--confirmado{ background: var(--status-confirm-bg); color: var(--status-confirm-fg); }
.csb--pendente  { background: var(--status-pending-bg); color: var(--status-pending-fg); }
.csb--cancelado { background: var(--status-cancel-bg); color: var(--status-cancel-fg); }
.csb--ativo     { background: var(--status-active-bg); color: var(--status-active-fg); }
.csb--ausente   { background: #F5F5F5; color: #6B7280; }

/* ══ PAINEL / DRAWER ══ */
.cli-panel {
  background: var(--white); border-radius: 18px; border: 1px solid var(--border);
  box-shadow: var(--shadow-sm); overflow: hidden;
  display: flex; flex-direction: column;
  max-height: calc(100vh - 175px); position: sticky; top: 80px;
}

/* Header do perfil — gradiente com cor do avatar */
.cp-header {
  padding: 20px; position: relative;
  background: linear-gradient(160deg, color-mix(in srgb, var(--cpbg,#4E6B5B) 80%, #1C2B1C 20%) 0%, var(--cpbg,#4E6B5B) 100%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  flex-shrink: 0;
}
.cp-close {
  position: absolute; top: 12px; right: 12px;
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,0.12); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.75); transition: all 0.15s;
}
.cp-close:hover { background: rgba(255,255,255,0.22); color: #fff; }

.cp-avatar-ring {
  width: 68px; height: 68px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35);
  padding: 2px; flex-shrink: 0;
}
.cp-avatar {
  width: 100%; height: 100%; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700; color: #fff;
}
.cp-name   { font-family: var(--font-serif); font-size: 19px; font-weight: 500; color: #fff; text-align: center; }
.cp-since  { font-size: 11.5px; color: rgba(255,255,255,0.55); text-align: center; }
.cp-top-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.cp-vip-badge  { background: rgba(201,168,76,0.22); color: var(--gold-light,#E8D5A3); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; letter-spacing: 0.5px; }
.cp-aniv-badge { background: rgba(240,127,42,0.18); color: #FFD6A5; font-size: 11px; padding: 3px 9px; border-radius: 99px; }

/* Quick stats no header */
.cp-quick-stats { display: flex; gap: 0; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
.cqs-item  { flex: 1; padding: 10px 8px; text-align: center; }
.cqs-sep   { width: 1px; background: rgba(255,255,255,0.12); }
.cqs-val   { display: block; font-family: var(--font-serif); font-size: 17px; font-weight: 600; color: #fff; line-height: 1; }
.cqs-lbl   { display: block; font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 3px; }

/* Ações do header */
.cp-header-actions { display: flex; gap: 8px; }
.cpha-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--r-sm);
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 12.5px; font-weight: 500; cursor: pointer;
  transition: all 0.15s; font-family: var(--font-sans);
}
.cpha-btn:hover { background: rgba(255,255,255,0.22); }
.cpha-btn--wa { background: rgba(37,211,102,0.2); border-color: rgba(37,211,102,0.3); }
.cpha-btn--wa:hover { background: rgba(37,211,102,0.3); }

/* Tabs */
.cp-tabs { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.cp-tab {
  flex: 1; padding: 11px; text-align: center;
  font-size: 12.5px; font-weight: 500; color: var(--text-muted);
  background: none; border: none; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: all 0.15s; font-family: var(--font-sans);
}
.cp-tab:hover { color: var(--text-primary); }
.cp-tab--active { color: var(--green-700); border-bottom-color: var(--green-700); }

/* Corpo do painel */
.cp-body { flex: 1; overflow-y: auto; }

/* Seções */
.cp-section { padding: 16px 18px; border-bottom: 1px solid var(--border); }
.cp-section:last-child { border-bottom: none; }
.cp-sec-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 12px; }
.cp-sec-row   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cp-obs-edit-btn { font-size: 12px; color: var(--green-600); background: none; border: none; cursor: pointer; font-family: var(--font-sans); }
.cp-obs-edit-btn:hover { color: var(--green-800); }

/* Data grid */
.cp-data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; }
.cpd-item     { display: flex; flex-direction: column; gap: 2px; }
.cpd-label    { font-size: 10.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.cpd-val      { font-size: 13px; font-weight: 500; color: var(--text-primary); }
.cpd-val--muted { color: var(--text-muted); font-weight: 400; }

/* Observações */
.cp-obs-textarea { font-size: 13px; }
.cp-obs-box { font-size: 13px; color: var(--text-secondary); line-height: 1.65; padding: 10px 12px; background: var(--cream); border-radius: 10px; min-height: 56px; white-space: pre-wrap; }

/* Próximo agendamento */
.cp-prox-ag { display: flex; align-items: center; gap: 12px; background: var(--cream); border-radius: 12px; padding: 11px 13px; border: 1px solid var(--border); }
.cppa-cal { width: 42px; height: 46px; background: var(--white); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border); flex-shrink: 0; }
.cppa-day { font-size: 16px; font-weight: 700; color: var(--green-700); line-height: 1; }
.cppa-mon { font-size: 9px; text-transform: uppercase; color: var(--text-muted); }
.cppa-info { flex: 1; min-width: 0; }
.cppa-svc  { font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
.cppa-hora { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* Timeline histórico */
.cp-hist-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px; }
.cp-timeline { display: flex; flex-direction: column; gap: 0; }
.cpt-item { display: flex; gap: 10px; }
.cpt-indicator { display: flex; flex-direction: column; align-items: center; padding-top: 14px; flex-shrink: 0; }
.cpt-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; border: 2px solid var(--white); }
.cptd--concluido  { background: var(--status-done-dot); }
.cptd--confirmado { background: var(--status-confirm-dot); }
.cptd--pendente   { background: var(--status-pending-dot); }
.cptd--cancelado  { background: var(--status-cancel-dot); }
.cptd--ativo      { background: var(--status-active-dot); }
.cptd--ausente    { background: #9CA3AF; }
.cpt-line-v { flex: 1; width: 1px; background: var(--border); margin: 4px 0; min-height: 8px; }
.cpt-card { flex: 1; background: var(--cream); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; border: 1px solid var(--border); }
.cpt-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.cpt-svc { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.cpt-date-prof { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
.cpt-card-foot { display: flex; gap: 10px; margin-top: 6px; }
.cpt-cat  { font-size: 11px; color: var(--text-muted); background: var(--white); border: 1px solid var(--border); padding: 2px 8px; border-radius: 99px; }
.cpt-dur  { font-size: 11px; color: var(--text-muted); }

/* Resumo de atendimentos */
.cp-resumo-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.cpre-item { background: var(--cream); border-radius: 10px; padding: 10px 8px; text-align: center; border: 1px solid var(--border); }
.cpre-num  { display: block; font-family: var(--font-serif); font-size: 22px; font-weight: 600; color: var(--text-primary); line-height: 1; }
.cpre-lbl  { display: block; font-size: 10px; color: var(--text-muted); margin-top: 3px; }

/* ══ MODAL ══ */
.cli-modal { max-width: 600px; }
.cm-head-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }

/* Steps */
.cm-steps { display: flex; align-items: center; padding: 14px 26px; border-bottom: 1px solid var(--border); }
.cm-step  { display: flex; align-items: center; gap: 8px; flex: 1; }
.cms-num  { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; transition: all 0.2s; }
.cm-step--active .cms-num { border-color: var(--green-700); color: var(--green-700); background: var(--green-50); }
.cm-step--done   .cms-num { border-color: var(--green-700); background: var(--green-700); color: white; }
.cm-step span { font-size: 12.5px; color: var(--text-muted); }
.cm-step--active span { color: var(--green-700); font-weight: 500; }
.cms-connector { flex: 1; height: 1px; background: var(--border); margin: 0 8px; }

/* Form fields */
.cm-sec-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.8px; color: var(--text-muted);
  margin-bottom: 14px;
}
.cm-sec-title--sep { margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--border); }
.cm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cm-field-err { font-size: 11.5px; color: #9B2C2C; }
.input-err { border-color: #E05252 !important; }

/* ══ TOASTS ══ */
.cli-toasts { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.cli-toast  { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; font-size: 13.5px; font-weight: 500; backdrop-filter: blur(16px); box-shadow: var(--shadow-lg); pointer-events: all; min-width: 280px; }
.ct--success { background: rgba(44,59,45,0.92); color: #A8E6C0; }
.ct--error   { background: rgba(60,20,20,0.92); color: #FFACAC; }
.ct--info    { background: rgba(20,40,80,0.92); color: #A8C8FF; }
.cli-toast-enter-active,.cli-toast-leave-active { transition: all 0.3s var(--ease); }
.cli-toast-enter-from,.cli-toast-leave-to { opacity: 0; transform: translateX(20px) scale(0.92); }

/* ══ PANEL TRANSITION ══ */
.panel-slide-enter-active,.panel-slide-leave-active { transition: all 0.3s var(--ease); }
.panel-slide-enter-from { opacity: 0; transform: translateX(20px); }
.panel-slide-leave-to   { opacity: 0; transform: translateX(20px); }

/* ══ ANIMATIONS ══ */
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
.anim-up { animation: fadeUp 0.38s var(--ease) both; }
.d-1{animation-delay:0.04s} .d-2{animation-delay:0.08s} .d-3{animation-delay:0.12s}
.d-4{animation-delay:0.16s} .d-5{animation-delay:0.20s} .d-6{animation-delay:0.24s}

/* ══ RESPONSIVE ══ */
@media (max-width:1500px) { .cli-kpis { grid-template-columns: repeat(3,1fr); } }
@media (max-width:1200px) {
  .cli-main-area--panel { grid-template-columns: 1fr; }
  .cli-panel { position: relative; top: 0; max-height: none; }
}
@media (max-width:900px)  { .cli-kpis { grid-template-columns: repeat(2,1fr); } .cm-grid { grid-template-columns: 1fr; } }
@media (max-width:768px)  {
  .cli-topbar { padding: 0 12px 0 50px; height: auto; min-height: 60px; padding-top: 8px; padding-bottom: 8px; flex-wrap: wrap; }
  .cli-content { padding: 14px; }
  .cli-kpis { grid-template-columns: 1fr 1fr; }
  .cli-toolbar { flex-direction: column; align-items: flex-start; }
  .cli-search-wrap { width: 100%; }
  .cli-grid { grid-template-columns: 1fr 1fr; }
  .cp-data-grid { grid-template-columns: 1fr; }
  .cp-resumo-grid { grid-template-columns: repeat(2,1fr); }
}
@media (max-width:500px) { .cli-grid { grid-template-columns: 1fr; } .cli-kpis { grid-template-columns: 1fr 1fr; } }
</style>