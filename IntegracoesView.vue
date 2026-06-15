<template>
  <div class="page-layout">
    <Sidebar />
    <div class="page-main">
      <TopBar title="Integrações" subtitle="Módulos e expansões do sistema" />
      <div class="page-content">

        <div class="integracoes-hero fade-in">
          <div class="ih-text">
            <h2>Ecossistema San Vitale</h2>
            <p>Expanda as funcionalidades do sistema com módulos premium projetados para studios de bem-estar.</p>
          </div>
          <div class="ih-badge">
            <span>🚀</span>
            <span>{{ modulos.length }} módulos disponíveis</span>
          </div>
        </div>

        <div class="modulos-grid">
          <div
            v-for="(m, i) in modulos"
            :key="m.title"
            class="modulo-card fade-in"
            :style="{ animationDelay: (i * 0.05) + 's', '--mc': m.color }"
            @click="showModal(m)"
          >
            <div class="mc-top">
              <div class="mc-icon" :style="{ background: m.iconBg }">
                <span v-html="m.icon"></span>
              </div>
              <span class="mc-badge">Em expansão</span>
            </div>
            <h4 class="mc-title">{{ m.title }}</h4>
            <p class="mc-desc">{{ m.desc }}</p>
            <div class="mc-footer">
              <span class="mc-cat">{{ m.cat }}</span>
              <button class="mc-btn">Saiba mais →</button>
            </div>
          </div>
        </div>

        <!-- Contact CTA -->
        <div class="cta-banner fade-in">
          <div>
            <h3>Quer ativar algum módulo?</h3>
            <p>Entre em contato com nossa equipe para personalizar o plano ideal para o San Vitale.</p>
          </div>
          <div class="cta-actions">
            <button class="cta-btn-wa" @click="contactWA">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar pelo WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const modulos = [
  {
    title: 'Pagamento Online',
    desc: 'Aceite pagamentos por cartão de crédito, débito e boleto diretamente pela plataforma com integração a gateways nacionais.',
    cat: 'Financeiro', color: '#1A6B3C', iconBg: '#E8F5EF',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  },
  {
    title: 'Pix Integrado',
    desc: 'Geração automática de QR Code Pix para pagamento instantâneo. Confirmação automática e notificação ao cliente.',
    cat: 'Financeiro', color: '#25D366', iconBg: '#E3F9EC',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
  },
  {
    title: 'Carrinho de Compras',
    desc: 'Loja online para venda de serviços, combos e produtos do studio. Integrada ao sistema de agendamento.',
    cat: 'E-commerce', color: '#92620A', iconBg: '#FFF8E7',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92620A" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
  },
  {
    title: 'WhatsApp Automático',
    desc: 'Envio automático de lembretes, confirmações e promoções via WhatsApp Business API. Reduza no-shows em até 70%.',
    cat: 'Comunicação', color: '#25D366', iconBg: '#E3F9EC',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>`
  },
  {
    title: 'E-mail Automático',
    desc: 'Campanhas de e-mail marketing e notificações transacionais. Aniversários, promoções e retorno de clientes inativos.',
    cat: 'Comunicação', color: '#1A56B8', iconBg: '#E8F0FE',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56B8" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  },
  {
    title: 'Agenda Inteligente',
    desc: 'IA para sugestão de horários, bloqueios automáticos, reagendamento e gestão de lista de espera.',
    cat: 'Produtividade', color: '#6F8F7B', iconBg: 'rgba(111,143,123,0.1)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 2v4M16 2v4"/></svg>`
  },
  {
    title: 'Área do Cliente',
    desc: 'Portal online onde o cliente agenda, cancela, visualiza histórico e recebe promoções personalizadas.',
    cat: 'Self-service', color: '#7B4EA8', iconBg: '#F3E8FF',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B4EA8" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    title: 'Relatórios Financeiros',
    desc: 'Dashboards avançados com DRE, fluxo de caixa, projeções e exportação para contabilidade.',
    cat: 'Financeiro', color: '#1A6B3C', iconBg: '#E8F5EF',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
  {
    title: 'Upload de Imagens',
    desc: 'Galeria de fotos para cada serviço com antes/depois, armazenamento em nuvem e otimização automática.',
    cat: 'Mídia', color: '#E67E22', iconBg: '#FEF3E7',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
]

function showModal(m) {
  alert(`ℹ️ Módulo "${m.title}" — Em desenvolvimento. Entre em contato para saber mais!`)
}

function contactWA() {
  window.open('https://wa.me/558699999999?text=Olá! Quero saber mais sobre as integrações do San Vitale Manager.', '_blank')
}
</script>

<style scoped>
.integracoes-hero {
  background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-primary) 100%);
  border-radius: var(--radius); padding: 28px 32px; margin-bottom: 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.ih-text h2 { font-family: 'Cormorant Garamond', serif; font-size: 26px; color: #fff; font-weight: 500; }
.ih-text p { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 6px; max-width: 500px; }
.ih-badge { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border-radius: 99px; padding: 8px 18px; font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; }

.modulos-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;
}

.modulo-card {
  background: var(--bg-card); border-radius: var(--radius);
  border: 1px solid var(--border-color); box-shadow: var(--shadow);
  padding: 22px; cursor: pointer;
  transition: var(--transition);
  animation: fadeInUp 0.4s ease forwards; opacity: 0;
  position: relative; overflow: hidden;
}
.modulo-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--mc); opacity: 0; transition: opacity 0.2s;
}
.modulo-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.modulo-card:hover::before { opacity: 1; }

.mc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.mc-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.mc-badge {
  font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--green-pale), var(--green-light));
  color: var(--green-dark); padding: 3px 10px; border-radius: 99px;
  border: 1px solid var(--green-light);
}
.mc-title { font-size: 15px; font-weight: 600; color: var(--text-dark); margin-bottom: 8px; }
.mc-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.55; margin-bottom: 16px; }
.mc-footer { display: flex; align-items: center; justify-content: space-between; }
.mc-cat { font-size: 10.5px; color: var(--text-muted); background: var(--bg-soft); padding: 3px 8px; border-radius: 99px; border: 1px solid var(--border-color); }
.mc-btn { background: none; border: none; cursor: pointer; font-size: 12px; color: var(--green-primary); font-weight: 600; font-family: 'DM Sans', sans-serif; transition: color 0.15s; }
.mc-btn:hover { color: var(--green-dark); }

.cta-banner {
  background: linear-gradient(135deg, var(--green-dark), var(--green-primary));
  border-radius: var(--radius); padding: 28px 32px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.cta-banner h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #fff; font-weight: 500; }
.cta-banner p { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.cta-btn-wa {
  display: flex; align-items: center; gap: 8px;
  background: #25D366; color: #fff;
  border: none; border-radius: var(--radius-sm); padding: 12px 22px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: var(--transition); white-space: nowrap;
  box-shadow: 0 4px 12px rgba(37,211,102,0.35);
}
.cta-btn-wa:hover { background: #1ebe5d; transform: translateY(-1px); }

@media (max-width: 1100px) { .modulos-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .modulos-grid { grid-template-columns: 1fr; } .cta-banner { flex-direction: column; } }
</style>