import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ClientesView from '@/views/ClientesView.vue'
import ServicosView from '@/views/ServicosView.vue'
import AgendaView from '@/views/AgendaView.vue'
import FinanceiroView from '@/views/FinanceiroView.vue'
import IntegracoesView from '@/views/IntegracoesView.vue'
import PerfilView from '@/views/PerfilView.vue'
import SobreView from '@/views/SobreView.vue'
import RecepcaoView from '@/views/RecepcaoView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },

  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView
  },

  {
    path: '/servicos',
    name: 'Servicos',
    component: ServicosView
  },

  {
    path: '/agendamentos',
    name: 'Agendamentos',
    component: AgendaView
  },

  {
    path: '/financeiro',
    name: 'Financeiro',
    component: FinanceiroView
  },

  {
    path: '/integracoes',
    name: 'Integracoes',
    component: IntegracoesView
  },

  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView
  },

  {
    path: '/sobre',
    name: 'Sobre',
    component: SobreView
  },

  {
    path: '/recepcao',
    name: 'Recepcao',
    component: RecepcaoView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  await authStore.checkSession()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router