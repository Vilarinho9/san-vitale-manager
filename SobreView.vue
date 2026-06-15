<template>
  <div class="page-layout">
    <Sidebar />
    <div class="page-main">
      <TopBar title="Sobre o sistema" subtitle="Documentação e roadmap" />
      <div class="page-content">

        <!-- Header -->
        <div class="sobre-hero fade-in">
          <div class="sh-logo">
            <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="rgba(255,255,255,0.1)"/>
              <circle cx="28" cy="28" r="18" fill="rgba(255,255,255,0.15)"/>
              <circle cx="28" cy="28" r="10" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
          <div>
            <h2>San Vitale Manager <span class="version-chip">v1.0.0</span></h2>
            <p>Sistema administrativo completo para o San Vitale Wellness Studio — Teresina, PI</p>
            <div class="sh-tags">
              <span>Vue 3</span><span>Node.js</span><span>Express</span><span>Supabase</span><span>Pinia</span>
            </div>
          </div>
        </div>

        <div class="sobre-grid">

          <!-- Features -->
          <div class="card fade-in fade-in-delay-1">
            <div class="card-header"><h3>Funcionalidades atuais</h3></div>
            <div class="feature-list">
              <div class="feat-item" v-for="f in features" :key="f">
                <span class="feat-check">✓</span>
                <span>{{ f }}</span>
              </div>
            </div>
          </div>

          <!-- Roadmap -->
          <div class="card fade-in fade-in-delay-2">
            <div class="card-header"><h3>Futuras integrações</h3></div>
            <div class="roadmap-list">
              <div class="rm-item" v-for="r in roadmap" :key="r.label">
                <div class="rm-dot" :style="{ background: r.color }"></div>
                <div>
                  <p class="rm-label">{{ r.label }}</p>
                  <p class="rm-q">{{ r.q }}</p>
                </div>
                <span class="rm-badge" :style="{ background: r.color + '20', color: r.color }">{{ r.status }}</span>
              </div>
            </div>
          </div>

          <!-- Stack -->
          <div class="card fade-in fade-in-delay-3">
            <div class="card-header"><h3>Tecnologias utilizadas</h3></div>
            <div class="stack-list">
              <div class="stack-item" v-for="s in stack" :key="s.name">
                <div class="si-icon" :style="{background: s.color + '18', color: s.color}" v-html="s.icon"></div>
                <div>
                  <p class="si-name">{{ s.name }}</p>
                  <p class="si-desc">{{ s.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Diferenciais -->
          <div class="card fade-in fade-in-delay-4">
            <div class="card-header"><h3>Diferenciais do sistema</h3></div>
            <div class="diff-grid">
              <div class="diff-item" v-for="d in diferenciais" :key="d.title">
                <span class="diff-icon">{{ d.icon }}</span>
                <h5>{{ d.title }}</h5>
                <p>{{ d.desc }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Version info -->
        <div class="version-footer fade-in">
          <p>San Vitale Manager © {{ new Date().getFullYear() }} · Desenvolvido para trabalho acadêmico de Programação Web · Teresina, PI</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const features = [
  'Autenticação segura com Supabase Auth',
  'CRUD completo de Clientes com busca e tags',
  'CRUD completo de Serviços por categoria',
  'CRUD completo de Agendamentos com filtros',
  'Dashboard executivo com métricas em tempo real',
  'Módulo financeiro com gráficos e histórico',
  'Envio de WhatsApp com mensagem personalizada',
  'Agenda do dia em linha do tempo',
  'Dark mode / Light mode persistente',
  'Sistema de notificações internas',
  'Perfil de administrador com preferências',
  'Tela de integrações e módulos futuros',
  'Exportação simulada PDF e Excel',
  'Layout responsivo mobile-first',
  'Animações e microinterações premium',
]

const roadmap = [
  { label: 'Pagamento Online (Pix, cartão)', q: 'Q3 2025', color: '#1A6B3C', status: 'Planejado' },
  { label: 'Área do Cliente (portal)', q: 'Q3 2025', color: '#1A56B8', status: 'Planejado' },
  { label: 'WhatsApp Business API', q: 'Q4 2025', color: '#25D366', status: 'Em análise' },
  { label: 'App mobile (React Native)', q: 'Q1 2026', color: '#7B4EA8', status: 'Roadmap' },
  { label: 'IA para agenda inteligente', q: 'Q2 2026', color: '#E67E22', status: 'Roadmap' },
]

const stack = [
  { name: 'Vue 3 + Vite', desc: 'Framework front-end reativo', color: '#4FC08D', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3z"/></svg>` },
  { name: 'Pinia', desc: 'Gerenciamento de estado global', color: '#FFD859', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>` },
  { name: 'Vue Router 4', desc: 'Roteamento com proteção de rotas', color: '#6F8F7B', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>` },
  { name: 'Node.js + Express', desc: 'API REST robusta e escalável', color: '#339933', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
  { name: 'Supabase', desc: 'Banco de dados e autenticação', color: '#3ECF8E', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.33 12.594.736 13.39 1.424 13.39h9.026l.45 9.573c.015.987 1.26 1.41 1.874.638l9.262-11.652c.434-.543.028-1.34-.66-1.34h-9.026l-.45-9.573z"/></svg>` },
  { name: 'Axios', desc: 'Cliente HTTP para a API', color: '#671DDF', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>` },
]

const diferenciais = [
  { icon: '🎨', title: 'Design Premium', desc: 'Interface refinada com tipografia editorial e paleta exclusiva San Vitale.' },
  { icon: '🔐', title: 'Segurança', desc: 'Autenticação JWT com Supabase Auth e proteção por Row Level Security.' },
  { icon: '📱', title: 'Responsivo', desc: 'Funciona perfeitamente em desktop, tablet e mobile.' },
  { icon: '⚡', title: 'Escalável', desc: 'Arquitetura preparada para novos módulos sem refatoração.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Tema escuro premium com preferência salva automaticamente.' },
  { icon: '🤖', title: 'Automações', desc: 'Base para integração com WhatsApp, e-mail e IA no futuro.' },
]
</script>

<style scoped>
.sobre-hero {
  background: linear-gradient(135deg, var(--green-dark), var(--green-primary));
  border-radius: var(--radius); padding: 32px 36px; margin-bottom: 24px;
  display: flex; align-items: center; gap: 24px;
}
.sobre-hero h2 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 12px; }
.sobre-hero p { font-size: 13px; color: rgba(255,255,255,0.7); }
.version-chip { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.15); padding: 3px 10px; border-radius: 99px; }
.sh-tags { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.sh-tags span { font-size: 11px; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.15); }

.sobre-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }

.card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border-color); }
.card-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--text-dark); }

.feature-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 8px; }
.feat-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-dark); padding: 4px 0; }
.feat-check { color: var(--green-primary); font-weight: 700; font-size: 14px; flex-shrink: 0; }

.roadmap-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 0; }
.rm-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
.rm-item:last-child { border-bottom: none; }
.rm-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.rm-label { font-size: 13px; font-weight: 500; color: var(--text-dark); }
.rm-q { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.rm-badge { margin-left: auto; font-size: 10px; font-weight: 600; padding: 2px 9px; border-radius: 99px; flex-shrink: 0; }

.stack-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 12px; }
.stack-item { display: flex; align-items: center; gap: 12px; }
.si-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.si-name { font-size: 13px; font-weight: 600; color: var(--text-dark); }
.si-desc { font-size: 11.5px; color: var(--text-muted); }

.diff-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: var(--border-color); }
.diff-item { background: var(--bg-card); padding: 18px 16px; }
.diff-icon { font-size: 20px; display: block; margin-bottom: 8px; }
.diff-item h5 { font-size: 13px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
.diff-item p { font-size: 11.5px; color: var(--text-muted); line-height: 1.5; }

.version-footer { text-align: center; font-size: 12px; color: var(--text-muted); padding: 20px 0; }

@media (max-width: 900px) { .sobre-grid { grid-template-columns: 1fr; } .diff-grid { grid-template-columns: 1fr 1fr; } }
</style>