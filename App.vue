<template>
  <div v-if="loadingApp" class="app-loading">
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <h2>Carregando sistema...</h2>
      <p>Preparando experiência premium</p>
    </div>
  </div>

  <template v-else>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <ToastContainer />
  </template>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

import ToastContainer from '@/components/ToastContainer.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const loadingApp = ref(true)

onMounted(async () => {

  try {

    await authStore.checkSession()

    if (themeStore.applyTheme) {
      themeStore.applyTheme()
    }

    if (themeStore.apply) {
      themeStore.apply()
    }

  } catch (err) {

    console.error(err)

  } finally {

    setTimeout(() => {
      loadingApp.value = false
    }, 700)

  }

})
</script>

<style scoped>
.app-loading {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.loading-card {
  padding: 40px;
  border-radius: 24px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(18px);
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.loading-card h2 {
  margin-top: 20px;
  color: var(--text);
}

.loading-card p {
  margin-top: 8px;
  color: var(--text-2);
}

.loading-spinner {
  width: 52px;
  height: 52px;
  border: 4px solid rgba(111,143,123,0.2);
  border-top-color: var(--green);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>