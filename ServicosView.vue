<template>
  <div class="layout">
    <Sidebar />
    <div class="layout__main">
      <header class="page-header">
        <div>
          <h1>Serviços</h1>
          <p class="page-subtitle">Gerencie o catálogo de serviços</p>
        </div>
        <AppButton @click="openModal(null)" :icon="iconPlus">Novo Serviço</AppButton>
      </header>

      <div class="page-content">
        <!-- Filtros -->
        <div class="filtros-bar">
          <div class="search-bar">
            <span class="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input v-model="busca" type="text" placeholder="Buscar serviço..." class="search-input" />
          </div>
          <select v-model="filtroCategoria" class="filter-select">
            <option value="">Todas as categorias</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <transition name="toast">
          <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">{{ toast.message }}</div>
        </transition>

        <div class="card">
          <DataTable :columns="columns" :rows="servicosFiltrados" :loading="loading" empty-text="Nenhum serviço cadastrado.">
            <template #default="{ row }">
              <td>
                <strong>{{ row.nome }}</strong>
                <span class="td-sub">{{ row.descricao || '—' }}</span>
              </td>
              <td><span class="cat-badge">{{ row.categoria }}</span></td>
              <td>{{ row.duracao }}</td>
              <td>R$ {{ Number(row.valor || 0).toFixed(2) }}</td>
              <td>
                <span class="status-pill" :class="row.ativo ? 'ativo' : 'inativo'">
                  {{ row.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <AppButton variant="ghost" :icon="iconEdit" @click="openModal(row)">Editar</AppButton>
                  <AppButton variant="danger" :icon="iconTrash" @click="confirmDelete(row)">Excluir</AppButton>
                </div>
              </td>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <AppModal :show="showModal" :title="editando ? 'Editar Serviço' : 'Novo Serviço'" @close="closeModal">
      <form @submit.prevent="salvar" class="form-grid">
        <AppInput v-model="form.nome" label="Nome do serviço *" placeholder="Ex: Massagem Relaxante" required style="grid-column: 1/-1" />
        <AppInput v-model="form.categoria" label="Categoria *" type="select" :options="categoriasOpts" placeholder="Selecione..." required />
        <AppInput v-model="form.duracao" label="Duração *" placeholder="Ex: 60 min" required />
        <AppInput v-model="form.valor" label="Valor (R$)" placeholder="0.00" type="number" />
        <AppInput v-model="form.ativo" label="Status" type="select" :options="statusOpts" />
        <div style="grid-column: 1/-1">
          <AppInput v-model="form.descricao" label="Descrição" type="textarea" placeholder="Descreva o serviço..." />
        </div>
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="closeModal">Cancelar</AppButton>
        <AppButton @click="salvar" :loading="saving">{{ editando ? 'Salvar alterações' : 'Cadastrar serviço' }}</AppButton>
      </template>
    </AppModal>

    <AppModal :show="showConfirm" title="Excluir serviço" @close="showConfirm = false" width="400px">
      <p style="font-size:14px;color:var(--text-muted)">
        Tem certeza que deseja excluir <strong>{{ servicoParaExcluir?.nome }}</strong>?
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="showConfirm = false">Cancelar</AppButton>
        <AppButton variant="danger" @click="excluir" :loading="deleting">Excluir</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/AppModal.vue'
import DataTable from '@/components/DataTable.vue'
import api from '@/services/api'

const servicos = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const busca = ref('')
const filtroCategoria = ref('')
const showModal = ref(false)
const showConfirm = ref(false)
const editando = ref(null)
const servicoParaExcluir = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })
const form = ref({ nome: '', categoria: '', duracao: '', valor: '', descricao: '', ativo: true })

const categorias = [
  'Alívio de dores', 'Relaxamento', 'Beleza', 'Cuidados com a face',
  'Cuidados com os pés', 'Drenagem e Modeladora', 'Premium',
  'Medicina Estética', 'Terapias Vibracionais'
]

const categoriasOpts = categorias.map(c => ({ value: c, label: c }))
const statusOpts = [{ value: true, label: 'Ativo' }, { value: false, label: 'Inativo' }]

const columns = [
  { key: 'nome', label: 'Serviço' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'duracao', label: 'Duração' },
  { key: 'valor', label: 'Valor' },
  { key: 'ativo', label: 'Status' },
  { key: 'acoes', label: 'Ações', style: 'width:200px' }
]

const iconPlus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const iconEdit = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
const iconTrash = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`

const servicosFiltrados = computed(() => {
  return servicos.value.filter(s => {
    const q = busca.value.toLowerCase()
    const matchBusca = !q || s.nome?.toLowerCase().includes(q) || s.categoria?.toLowerCase().includes(q)
    const matchCat = !filtroCategoria.value || s.categoria === filtroCategoria.value
    return matchBusca && matchCat
  })
})

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

async function loadServicos() {
  loading.value = true
  try {
    const res = await api.get('/servicos')
    servicos.value = res.data
  } catch (e) {
    showToast('Erro ao carregar serviços.', 'error')
  } finally {
    loading.value = false
  }
}

function openModal(servico) {
  editando.value = servico
  form.value = servico
    ? { ...servico }
    : { nome: '', categoria: '', duracao: '', valor: '', descricao: '', ativo: true }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editando.value = null
}

async function salvar() {
  saving.value = true
  try {
    const payload = { ...form.value, ativo: form.value.ativo === 'false' ? false : Boolean(form.value.ativo) }
    if (editando.value) {
      const res = await api.put(`/servicos/${editando.value.id}`, payload)
      const idx = servicos.value.findIndex(s => s.id === editando.value.id)
      if (idx !== -1) servicos.value[idx] = res.data
      showToast('Serviço atualizado!')
    } else {
      const res = await api.post('/servicos', payload)
      servicos.value.unshift(res.data)
      showToast('Serviço cadastrado!')
    }
    closeModal()
  } catch (e) {
    showToast('Erro ao salvar serviço.', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(servico) {
  servicoParaExcluir.value = servico
  showConfirm.value = true
}

async function excluir() {
  deleting.value = true
  try {
    await api.delete(`/servicos/${servicoParaExcluir.value.id}`)
    servicos.value = servicos.value.filter(s => s.id !== servicoParaExcluir.value.id)
    showToast('Serviço excluído.')
    showConfirm.value = false
  } catch (e) {
    showToast('Erro ao excluir.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(loadServicos)
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.layout__main { margin-left: var(--sidebar-width); flex: 1; }
.page-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(244, 247, 245, 0.9); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(168, 191, 176, 0.2);
  padding: 20px 32px; display: flex; align-items: center; justify-content: space-between;
}
.page-header h1 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; }
.page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.page-content { padding: 28px 32px; }

.filtros-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.search-bar { position: relative; flex: 1; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
.search-input {
  width: 100%; padding: 11px 14px 11px 42px;
  border: 1.5px solid var(--green-pale); border-radius: var(--radius-sm);
  background: white; font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: var(--text-dark); outline: none; transition: var(--transition);
}
.search-input:focus { border-color: var(--green-primary); box-shadow: 0 0 0 3px rgba(111, 143, 123, 0.12); }

.filter-select {
  padding: 10px 14px; border: 1.5px solid var(--green-pale); border-radius: var(--radius-sm);
  background: white; font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: var(--text-dark); outline: none; cursor: pointer; min-width: 200px;
}

.card {
  background: white; border-radius: var(--radius);
  box-shadow: var(--shadow); overflow: hidden;
  border: 1px solid rgba(168, 191, 176, 0.15);
}

.td-sub { display: block; font-size: 12px; color: var(--text-muted); margin-top: 2px; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.cat-badge {
  padding: 4px 10px; background: var(--bg-soft); border-radius: 99px;
  font-size: 11px; color: var(--text-muted); white-space: nowrap;
  border: 1px solid rgba(168, 191, 176, 0.3);
}

.status-pill {
  padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 600;
}
.ativo { background: #D1FAE5; color: #065F46; }
.inativo { background: #FEE2E2; color: #991B1B; }

.action-btns { display: flex; gap: 4px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.toast {
  position: fixed; bottom: 28px; right: 28px;
  padding: 14px 20px; border-radius: var(--radius-sm);
  font-size: 14px; font-weight: 500; z-index: 2000; box-shadow: var(--shadow-md);
}
.toast--success { background: var(--green-dark); color: white; }
.toast--error { background: #DC2626; color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-width: 768px) {
  .layout__main { margin-left: 0; }
  .page-content { padding: 20px 16px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>