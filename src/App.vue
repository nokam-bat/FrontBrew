<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <main class="app">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <footer class="footer">
    Données :
    <a href="https://www.openbrewerydb.org/" target="_blank" rel="noopener noreferrer">
      Open Brewery DB
    </a>
    · Projet FrontBrew, CPNV
  </footer>
</template>

<style scoped>
.app {
  flex: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 20px 64px;
}
.footer {
  padding: 16px 20px;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  background: #150e09;
  border-top: 1px solid var(--line);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (max-width: 600px) {
  .app {
    padding: 24px 16px 40px;
  }
}
</style>
