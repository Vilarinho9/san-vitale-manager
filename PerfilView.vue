<template>
  <div class="page-layout">
    <Sidebar />
    <div class="page-main">
      <TopBar title="Perfil" subtitle="Configurações da conta" />
      <div class="page-content">

        <div class="perfil-grid fade-in">

          <!-- Profile card -->
          <div class="card perfil-card">
            <div class="perfil-hero">
              <div class="avatar-big">{{ initial }}</div>
              <div class="avatar-edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
            </div>
            <h2 class="perfil-name">{{ displayName }}</h2>
            <p class="perfil-email">{{ authStore.user?.email }}</p>
            <div class="perfil-badge">Administrador</div>

            <div class="perfil-meta">
              <div class="pm-item">
                <span class="pm-label">Cargo</span>
                <span class="pm-val">Gerente de Studio</span>
              </div>
              <div class="pm-item">
                <span class="pm-label">Empresa</span>
                <span class="pm-val">San Vitale Wellness Studio</span>
              </div>
              <div class="pm-item">
                <span class="pm-label">Localização</span>
                <span class="pm-val">Teresina, PI</span>
              </div>
              <div class="pm-item">
                <span class="pm-label">Último acesso</span>
                <span class="pm-val">{{ lastAccess }}</span>
              </div>
              <div class="pm-item">
                <span class="pm-label">Membro desde</span>
                <span class="pm-val">{{ memberSince }}</span>
              </div>
            </div>

            <button class="btn-senha" @click="mockSenha">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Alterar senha
            </button>
          </div>

          <!-- Right side -->
          <div class="perfil-right">

            <!-- Preferences -->
            <div class="card pref-card">
              <div class="card-header"><h3>Preferências do sistema</h3></div>
              <div class="pref-list">
                <div class="pref-item" v-for="p in prefs" :key="p.label">
                  <div class="pref-left">
                    <div class="pref-icon" v-html="p.icon"></div>
                    <div>
                      <p class="pref-label">{{ p.label }}</p>
                      <p class="pref-desc">{{ p.desc }}</p>
                    </div>
                  </div>
                  <div class="toggle" :class="{ active: p.on }" @click="p.on = !p.on">
                    <div class="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats personal -->
            <div class="card">
              <div class="card-header"><h3>Sua atividade</h3></div>
              <div class="activity-stats">
                <div class="as-item" v-for="a in actStats" :key="a.label">
                  <span class="as-val">{{ a.val }}</span>
                  <span class="as-label">{{ a.label }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const displayName = computed(() => (authStore.user?.email || '').split('@')[0] || 'Admin')
const initial = computed(() => displayName.value.charAt(0).toUpperCase())
const lastAccess = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const memberSince = new Date(authStore.user?.created_at || '2024-01-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

const prefs = ref([
  { label: 'Notificações push', desc: 'Receber alertas de novos agendamentos', on: true, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>` },
  { label: 'E-mail diário', desc: 'Resumo dos agendamentos do dia', on: true, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
  { label: 'WhatsApp automático', desc: 'Enviar lembrete automático 24h antes', on: false, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` },
  { label: 'Modo escuro', desc: 'Tema escuro permanente na interface', on: false, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` },
])

const actStats = [
  { val: '142', label: 'Ações realizadas' },
  { val: '38', label: 'Clientes criados' },
  { val: '87', label: 'Agendamentos' },
  { val: '12', label: 'Dias no sistema' },
]

function mockSenha() {
  alert('🔐 Redefinição de senha: funcionalidade disponível via e-mail Supabase Auth.')
}
</script>

<style scoped>
.perfil-grid { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }

.perfil-card { padding: 0; overflow: visible; }
.perfil-hero {
  background: linear-gradient(135deg, var(--green-dark), var(--green-primary));
  border-radius: var(--radius) var(--radius) 0 0;
  height: 100px; position: relative;
  display: flex; align-items: flex-end; justify-content: center;
}
.avatar-big {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--green-primary);
  color: #fff; font-size: 28px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 4px solid var(--bg-card);
  position: absolute; bottom: -36px;
  box-shadow: var(--shadow-md);
}
.avatar-edit {
  position: absolute; bottom: -28px; right: calc(50% - 48px);
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--green-primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid var(--bg-card);
}
.perfil-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 600; color: var(--text-dark);
  text-align: center; margin-top: 48px; margin-bottom: 4px;
}
.perfil-email { font-size: 12.5px; color: var(--text-muted); text-align: center; }
.perfil-badge {
  margin: 10px auto 0; display: block; width: fit-content;
  background: var(--green-pale); color: var(--green-dark);
  font-size: 11px; font-weight: 600; padding: 3px 14px; border-radius: 99px;
}
.perfil-meta { padding: 20px; border-top: 1px solid var(--border-color); margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.pm-item { display: flex; justify-content: space-between; align-items: center; }
.pm-label { font-size: 12px; color: var(--text-muted); }
.pm-val { font-size: 12.5px; font-weight: 500; color: var(--text-dark); }

.btn-senha {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  width: calc(100% - 40px); margin: 0 20px 20px;
  padding: 10px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border-color);
  background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
  color: var(--text-dark); transition: var(--transition);
}
.btn-senha:hover { background: var(--green-pale); border-color: var(--green-primary); color: var(--green-dark); }

.perfil-right { display: flex; flex-direction: column; gap: 16px; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border-color); }
.card-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--text-dark); }

.pref-list { display: flex; flex-direction: column; }
.pref-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
}
.pref-item:last-child { border-bottom: none; }
.pref-item:hover { background: var(--bg-soft); }
.pref-left { display: flex; align-items: center; gap: 12px; }
.pref-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-soft); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.pref-label { font-size: 13px; font-weight: 500; color: var(--text-dark); }
.pref-desc { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }

.toggle {
  width: 40px; height: 22px; border-radius: 11px;
  background: var(--border-color); cursor: pointer;
  position: relative; transition: background 0.2s;
}
.toggle.active { background: var(--green-primary); }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #fff; transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle.active .toggle-thumb { transform: translateX(18px); }

.activity-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--border-color);
}
.as-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 20px 10px; background: var(--bg-card);
}
.as-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--green-700);
}
.as-label { font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 3px; }

@media (max-width: 900px) { .perfil-grid { grid-template-columns: 1fr; } .activity-stats { grid-template-columns: repeat(2, 1fr); } }
</style>