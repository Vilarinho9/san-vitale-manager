<template>
  <div class="login-root">

    <!-- ══ LADO ESQUERDO — Visual premium ══ -->
    <div class="login-left" :class="{ 'left--ready': mounted }">
      <div class="left-pattern">
        <svg class="pattern-svg" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bgGrad" cx="35%" cy="25%" r="75%">
              <stop offset="0%" stop-color="#3D5240"/>
              <stop offset="100%" stop-color="#1C2B1C"/>
            </radialGradient>
          </defs>
          <rect width="600" height="900" fill="url(#bgGrad)"/>
          <!-- Botanical leaf forms -->
          <g opacity="0.07" fill="#C9A84C">
            <ellipse cx="80" cy="200" rx="160" ry="55" transform="rotate(-20 80 200)"/>
            <ellipse cx="520" cy="120" rx="130" ry="45" transform="rotate(15 520 120)"/>
            <ellipse cx="60" cy="700" rx="140" ry="50" transform="rotate(25 60 700)"/>
            <ellipse cx="550" cy="750" rx="110" ry="40" transform="rotate(-15 550 750)"/>
          </g>
          <!-- Circles -->
          <circle cx="480" cy="180" r="200" fill="none" stroke="#C9A84C" stroke-width="0.7" opacity="0.1"/>
          <circle cx="480" cy="180" r="140" fill="none" stroke="#C9A84C" stroke-width="0.7" opacity="0.07"/>
          <circle cx="480" cy="180" r="80"  fill="none" stroke="#C9A84C" stroke-width="0.7" opacity="0.05"/>
          <circle cx="100" cy="720" r="150" fill="none" stroke="#A3BFB2" stroke-width="0.7" opacity="0.08"/>
          <!-- Diagonal subtle lines -->
          <line x1="0" y1="0" x2="600" y2="900" stroke="#fff" stroke-width="0.5" opacity="0.03"/>
          <line x1="200" y1="0" x2="800" y2="900" stroke="#fff" stroke-width="0.5" opacity="0.03"/>
          <line x1="-200" y1="0" x2="400" y2="900" stroke="#fff" stroke-width="0.5" opacity="0.03"/>
        </svg>
      </div>
      <div class="left-overlay"></div>
      <div class="left-content">
        <!-- Logo -->
        <div class="left-logo">
          <div class="logo-mark">
            <svg width="26" height="32" viewBox="0 0 28 34" fill="none">
              <path d="M14 2C14 2 6 10 6 17C6 21.42 9.58 25 14 25C18.42 25 22 21.42 22 17C22 10 14 2 14 2Z" fill="#C9A84C"/>
              <path d="M14 8C14 8 10 14 10 18.5" stroke="rgba(201,168,76,0.35)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
              <path d="M7 16C4 16 2 18 2 18C2 18 4 20 7 20" stroke="rgba(201,168,76,0.45)" stroke-width="1" fill="none" stroke-linecap="round"/>
              <path d="M21 16C24 16 26 18 26 18C26 18 24 20 21 20" stroke="rgba(201,168,76,0.45)" stroke-width="1" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <p class="logo-name">SAN VITALE</p>
            <p class="logo-tag">BELEZA & BEM-ESTAR</p>
          </div>
        </div>
        <!-- Headline -->
        <div class="left-headline">
          <p class="left-eyebrow">Sistema de Gestão Premium</p>
          <h1 class="left-title">Gestão inteligente<br>para experiências<br>exclusivas.</h1>
          <div class="left-divider">
            <span class="div-line"></span>
            <span class="div-diamond"></span>
            <span class="div-line"></span>
          </div>
          <p class="left-desc">Controle total sobre sua agenda, clientes e financeiro em uma plataforma sofisticada e intuitiva.</p>
        </div>
        <!-- Features -->
        <div class="left-feats">
          <div v-for="f in features" :key="f" class="left-feat">
            <span class="feat-dot"></span>
            <span>{{ f }}</span>
          </div>
        </div>
        <p class="left-footer">Teresina, PI · Brasil</p>
      </div>
    </div>

    <!-- ══ LADO DIREITO — Formulário premium ══ -->
    <div class="login-right">
      <div class="login-card" :class="{ 'card--ready': mounted }" ref="cardRef">

        <div class="card-header">
          <!-- Logo só no mobile -->
          <div class="card-logo-mobile">
            <div class="logo-mark logo-mark--sm">
              <svg width="18" height="22" viewBox="0 0 28 34" fill="none">
                <path d="M14 2C14 2 6 10 6 17C6 21.42 9.58 25 14 25C18.42 25 22 21.42 22 17C22 10 14 2 14 2Z" fill="#C9A84C"/>
              </svg>
            </div>
            <div>
              <p class="logo-name logo-name--dk">SAN VITALE</p>
              <p class="logo-tag logo-tag--dk">BELEZA & BEM-ESTAR</p>
            </div>
          </div>
          <h2 class="card-title">Bem-vinda de volta</h2>
          <p class="card-sub">Acesse o painel administrativo da sua conta</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin" novalidate>

          <!-- Email -->
          <div class="ff" :class="{ 'ff--err': errors.email, 'ff--focus': focused==='email' }">
            <label class="ff-label">E-mail</label>
            <div class="ff-wrap">
              <span class="ff-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input
                ref="emailRef"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                autocomplete="email"
                :disabled="loading"
                @focus="focused='email'; errors.email=''; globalErr=''"
                @blur="focused=''; validateEmail()"
              />
            </div>
            <transition name="ferr">
              <p v-if="errors.email" class="ff-err-msg">{{ errors.email }}</p>
            </transition>
          </div>

          <!-- Senha -->
          <div class="ff" :class="{ 'ff--err': errors.password, 'ff--focus': focused==='password' }">
            <div class="ff-label-row">
              <label class="ff-label">Senha</label>
              <button type="button" class="forgot-btn" @click="showForgot=true">Esqueci minha senha</button>
            </div>
            <div class="ff-wrap">
              <span class="ff-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                :disabled="loading"
                @focus="focused='password'; errors.password=''; globalErr=''"
                @blur="focused=''; validatePassword()"
              />
              <button type="button" class="eye-btn" @click="showPass=!showPass">
                <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <transition name="ferr">
              <p v-if="errors.password" class="ff-err-msg">{{ errors.password }}</p>
            </transition>
          </div>

          <!-- Lembrar -->
          <label class="remember">
            <input type="checkbox" v-model="remember" class="remember-input" />
            <span class="remember-box">
              <svg v-if="remember" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="remember-lbl">Lembrar de mim neste dispositivo</span>
          </label>

          <!-- Erro global -->
          <transition name="fblock">
            <div v-if="globalErr" class="global-err">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ globalErr }}
            </div>
          </transition>

          <!-- Info esqueci senha -->
          <transition name="fblock">
            <div v-if="showForgot" class="forgot-info">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Entre em contato com o administrador do sistema para redefinir sua senha.
              <button type="button" class="info-close" @click="showForgot=false">✕</button>
            </div>
          </transition>

          <!-- Botão submit -->
          <button type="submit" class="btn-submit"
            :class="{ 'btn--loading': loading, 'btn--success': loginSuccess }"
            :disabled="loading || loginSuccess">
            <transition name="btxt" mode="out-in">
              <span v-if="loginSuccess" key="s" class="btn-inner">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Bem-vinda!
              </span>
              <span v-else-if="loading" key="l" class="btn-inner">
                <span class="spinner"></span>
                Verificando...
              </span>
              <span v-else key="i" class="btn-inner">
                Entrar no sistema
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </transition>
          </button>
        </form>

        <div class="card-footer">
          <div class="footer-div">
            <span></span><p>Plataforma segura e criptografada</p><span></span>
          </div>
          <div class="footer-badges">
            <span class="sec-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              SSL Seguro
            </span>
            <span class="sec-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Supabase Auth
            </span>
          </div>
        </div>
      </div>

      <p class="version">San Vitale Manager · v1.0</p>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth   = useAuthStore()

const email        = ref('')
const password     = ref('')
const remember     = ref(false)
const showPass     = ref(false)
const loading      = ref(false)
const loginSuccess = ref(false)
const globalErr    = ref('')
const showForgot   = ref(false)
const focused      = ref('')
const mounted      = ref(false)
const emailRef     = ref(null)
const cardRef      = ref(null)
const errors = reactive({ email: '', password: '' })

const features = [
  'Agenda visual inteligente em tempo real',
  'CRM completo de clientes e histórico',
  'Dashboard executivo com métricas',
  'Gestão financeira integrada',
  'Notificações automáticas via WhatsApp',
]

function validateEmail() {
  if (!email.value) { errors.email = 'O e-mail é obrigatório.'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { errors.email = 'Informe um e-mail válido.'; return false }
  errors.email = ''; return true
}
function validatePassword() {
  if (!password.value) { errors.password = 'A senha é obrigatória.'; return false }
  if (password.value.length < 6) { errors.password = 'Mínimo 6 caracteres.'; return false }
  errors.password = ''; return true
}

async function handleLogin() {
  const ok1 = validateEmail()
  const ok2 = validatePassword()
  if (!ok1 || !ok2) return

  loading.value = true
  globalErr.value = ''

  const result = await auth.login(email.value, password.value)

  if (result.success) {
    loginSuccess.value = true
    await new Promise(r => setTimeout(r, 700))
    router.push('/dashboard')
  } else {
    loading.value = false
    globalErr.value = 'E-mail ou senha incorretos. Verifique suas credenciais.'
    if (cardRef.value) {
      cardRef.value.classList.add('card--shake')
      setTimeout(() => cardRef.value.classList.remove('card--shake'), 600)
    }
  }
}

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 80)
  setTimeout(() => { emailRef.value?.focus() }, 500)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
</style>

<style scoped>
/* ════ ROOT ════ */
.login-root {
  display: flex;
  min-height: 100vh;
  background: #F5F0E8;
  font-family: 'DM Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ════ LADO ESQUERDO ════ */
.login-left {
  position: relative;
  width: 52%;
  flex-shrink: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
}
.login-left.left--ready { opacity: 1; transform: translateX(0); }

.left-pattern { position: absolute; inset: 0; z-index: 0; }
.pattern-svg  { width: 100%; height: 100%; display: block; }

.left-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(160deg, rgba(28,43,28,0.15) 0%, rgba(28,43,28,0) 40%, rgba(28,43,28,0.5) 100%);
}

.left-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; justify-content: space-between;
  height: 100%; padding: 44px 52px;
}

/* Logo */
.left-logo { display: flex; align-items: center; gap: 14px; }
.logo-mark {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.07);
  border-radius: 12px;
  border: 1px solid rgba(201,168,76,0.28);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(10px);
}
.logo-mark--sm {
  width: 32px; height: 32px;
  background: rgba(201,168,76,0.08);
  border: 1px solid rgba(201,168,76,0.22);
  border-radius: 8px;
}
.logo-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13.5px; font-weight: 600;
  color: #C9A84C; letter-spacing: 3px; line-height: 1;
}
.logo-name--dk { color: #2C3B2D; }
.logo-tag {
  font-size: 8px; color: rgba(201,168,76,0.5);
  letter-spacing: 2px; margin-top: 3px;
}
.logo-tag--dk { color: rgba(44,59,45,0.4); }

/* Headline */
.left-headline { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
.left-eyebrow {
  font-size: 10.5px; font-weight: 600; color: #C9A84C;
  letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 16px;
}
.left-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 44px; font-weight: 500; color: #FFFFFF;
  line-height: 1.18; letter-spacing: -0.3px; margin-bottom: 26px;
}
.left-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.div-line     { flex: 1; max-width: 48px; height: 1px; background: rgba(201,168,76,0.35); }
.div-diamond  { width: 5px; height: 5px; background: #C9A84C; transform: rotate(45deg); opacity: 0.65; }
.left-desc {
  font-size: 14.5px; color: rgba(255,255,255,0.58);
  line-height: 1.72; max-width: 360px;
}

/* Features */
.left-feats { display: flex; flex-direction: column; gap: 9px; }
.left-feat  { display: flex; align-items: center; gap: 11px; font-size: 13px; color: rgba(255,255,255,0.52); }
.feat-dot   { width: 5px; height: 5px; border-radius: 50%; background: #C9A84C; opacity: 0.65; flex-shrink: 0; }

.left-footer { font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 0.4px; }

/* ════ LADO DIREITO ════ */
.login-right {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 32px; background: #F5F0E8;
}

/* Card */
.login-card {
  width: 100%; max-width: 440px;
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow:
    0 0 0 1px rgba(44,59,45,0.055),
    0 4px 6px rgba(44,59,45,0.04),
    0 16px 48px rgba(44,59,45,0.09),
    0 32px 80px rgba(44,59,45,0.05);
  overflow: hidden;
  opacity: 0; transform: translateY(22px) scale(0.98);
  transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.15s,
              transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.15s;
}
.login-card.card--ready { opacity: 1; transform: translateY(0) scale(1); }

@keyframes shake {
  0%,100% { transform: translateX(0); }
  15%  { transform: translateX(-7px); }
  30%  { transform: translateX(7px); }
  45%  { transform: translateX(-4px); }
  60%  { transform: translateX(4px); }
  75%  { transform: translateX(-2px); }
}
.login-card.card--shake { animation: shake 0.55s cubic-bezier(0.36,0.07,0.19,0.97); }

/* Card header */
.card-header { padding: 36px 36px 0; }
.card-logo-mobile { display: none; align-items: center; gap: 10px; margin-bottom: 22px; }
.card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px; font-weight: 500; color: #1C2B1C;
  line-height: 1.2; margin-bottom: 6px;
}
.card-sub { font-size: 13.5px; color: #8A9E96; line-height: 1.5; }

/* Form */
.login-form {
  padding: 26px 36px 30px;
  display: flex; flex-direction: column; gap: 17px;
}

/* Form fields */
.ff { display: flex; flex-direction: column; gap: 6px; }
.ff-label { font-size: 12.5px; font-weight: 500; color: #4A5E56; letter-spacing: 0.1px; }
.ff-label-row { display: flex; align-items: center; justify-content: space-between; }

.ff-wrap { position: relative; display: flex; align-items: center; }
.ff-icon {
  position: absolute; left: 13px; color: #C8D8D0;
  display: flex; align-items: center; pointer-events: none;
  transition: color 0.15s;
}
.ff--focus .ff-icon { color: #4E6B5B; }

.ff-wrap input {
  width: 100%;
  padding: 11px 42px 11px 41px;
  border: 1.5px solid #D4C9B8;
  border-radius: 12px;
  background: #FDFAF6;
  color: #1C2B1C;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  appearance: none;
  -webkit-appearance: none;
}
.ff-wrap input::placeholder { color: #C8D8D0; }
.ff-wrap input:focus {
  border-color: #4E6B5B;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(78,107,91,0.11);
}
.ff-wrap input:disabled { opacity: 0.5; cursor: not-allowed; }
.ff--err .ff-wrap input {
  border-color: #E05252;
  box-shadow: 0 0 0 4px rgba(224,82,82,0.09);
}
.ff-err-msg { font-size: 11.5px; color: #E05252; }

.forgot-btn {
  font-size: 12px; color: #8A9E96; background: none; border: none;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  text-decoration: underline; text-decoration-color: transparent;
  transition: color 0.15s, text-decoration-color 0.15s; padding: 0;
}
.forgot-btn:hover { color: #4E6B5B; text-decoration-color: #4E6B5B; }

.eye-btn {
  position: absolute; right: 12px;
  background: none; border: none; cursor: pointer;
  color: #C8D8D0; display: flex; align-items: center;
  padding: 4px; border-radius: 6px; transition: all 0.15s;
}
.eye-btn:hover { color: #4E6B5B; background: rgba(78,107,91,0.07); }

/* Lembrar */
.remember { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.remember-input { display: none; }
.remember-box {
  width: 17px; height: 17px; border-radius: 5px;
  border: 1.5px solid #D4C9B8; background: #FDFAF6;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.15s; color: white;
}
.remember-input:checked ~ .remember-box { background: #2C3B2D; border-color: #2C3B2D; }
.remember-lbl { font-size: 12.5px; color: #8A9E96; user-select: none; }

/* Erro global */
.global-err {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 11px 13px;
  background: rgba(224,82,82,0.07);
  border: 1px solid rgba(224,82,82,0.18);
  border-radius: 10px;
  font-size: 13px; color: #C0392B; line-height: 1.5;
}
.global-err svg { flex-shrink: 0; margin-top: 1px; }

/* Info esqueci */
.forgot-info {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 11px 13px;
  background: rgba(201,168,76,0.07);
  border: 1px solid rgba(201,168,76,0.22);
  border-radius: 10px;
  font-size: 12.5px; color: #7A6020; line-height: 1.55; position: relative;
}
.forgot-info svg { flex-shrink: 0; margin-top: 1px; }
.info-close {
  position: absolute; top: 7px; right: 9px;
  background: none; border: none; cursor: pointer;
  color: rgba(122,96,32,0.4); font-size: 12px; padding: 2px 5px; border-radius: 4px;
}
.info-close:hover { background: rgba(122,96,32,0.08); color: rgba(122,96,32,0.8); }

/* Botão submit */
.btn-submit {
  width: 100%; padding: 13px 18px;
  background: #2C3B2D; color: #FFFFFF;
  border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 500;
  cursor: pointer; position: relative; overflow: hidden;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  box-shadow: 0 2px 4px rgba(28,43,28,0.18), 0 6px 20px rgba(28,43,28,0.16);
}
.btn-submit::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.13) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.2s;
}
.btn-submit:hover:not(:disabled)::before { opacity: 1; }
.btn-submit:hover:not(:disabled) {
  background: #1C2B1C;
  box-shadow: 0 4px 8px rgba(28,43,28,0.22), 0 12px 28px rgba(28,43,28,0.20);
  transform: translateY(-1px);
}
.btn-submit:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 6px rgba(28,43,28,0.18); }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.btn--loading { background: #3D5240 !important; }
.btn--success { background: #2D6B45 !important; box-shadow: 0 4px 16px rgba(45,107,69,0.32) !important; }

.btn-inner {
  display: flex; align-items: center; justify-content: center; gap: 9px;
}
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.22);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Card footer */
.card-footer {
  padding: 0 36px 28px;
  display: flex; flex-direction: column; gap: 13px;
}
.footer-div {
  display: flex; align-items: center; gap: 10px;
}
.footer-div span { flex: 1; height: 1px; background: #EDE8DC; }
.footer-div p    { font-size: 11px; color: #B5C4BC; white-space: nowrap; }
.footer-badges   { display: flex; align-items: center; justify-content: center; gap: 14px; }
.sec-badge       { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #8A9E96; }

/* Versão */
.version { margin-top: 18px; font-size: 11px; color: #B5C4BC; letter-spacing: 0.3px; }

/* ════ TRANSITIONS ════ */
.ferr-enter-active, .ferr-leave-active { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
.ferr-enter-from, .ferr-leave-to { opacity: 0; transform: translateY(-4px); }

.fblock-enter-active, .fblock-leave-active { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
.fblock-enter-from, .fblock-leave-to { opacity: 0; transform: translateY(-5px) scale(0.98); }

.btxt-enter-active, .btxt-leave-active { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
.btxt-enter-from { opacity: 0; transform: translateY(8px); }
.btxt-leave-to   { opacity: 0; transform: translateY(-8px); }

/* ════ RESPONSIVE ════ */
@media (max-width: 900px) {
  .login-left { display: none; }
  .login-right {
    padding: 28px 16px;
    background: linear-gradient(160deg, #F5F0E8 0%, #EDE8DC 100%);
  }
  .card-logo-mobile { display: flex; }
}
@media (max-width: 480px) {
  .login-card { border-radius: 20px; max-width: 100%; }
  .card-header { padding: 26px 22px 0; }
  .login-form  { padding: 20px 22px 24px; gap: 13px; }
  .card-footer { padding: 0 22px 22px; }
  .card-title  { font-size: 22px; }
}
</style>