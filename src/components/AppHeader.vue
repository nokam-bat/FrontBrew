<script setup>
// En-tête : logo, « Tout voir » et « Au hasard »
import { RouterLink } from 'vue-router'
import logoMark from '../assets/logo-mark.svg'
import { useRandomBrewery } from '../composables/useRandomBrewery'

const { openRandom, isRolling } = useRandomBrewery()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="brand" aria-label="FrontBrew – accueil">
        <img :src="logoMark" alt="" width="26" height="32" />
        <span>FrontBrew</span>
      </RouterLink>

      <nav class="nav" aria-label="Navigation principale">
        <button
          type="button"
          class="nav__random"
          :disabled="isRolling"
          data-test="random-header"
          @click="openRandom"
        >
          Au hasard
        </button>
        <RouterLink :to="{ name: 'all' }" class="btn btn--light">Tout voir</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #24170e;
  border-bottom: 1px solid var(--line);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1080px;
  height: 64px;
  margin: 0 auto;
  padding: 0 20px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--serif);
  font-size: 21px;
  font-weight: 600;
  text-decoration: none;
}
.nav {
  display: flex;
  align-items: center;
  gap: 18px;
}
.nav__random {
  padding: 0;
  font: inherit;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
}
.nav__random:hover:not(:disabled) {
  color: var(--text);
}
.nav__random:disabled {
  cursor: wait;
}
@media (max-width: 480px) {
  .header__inner {
    padding: 0 16px;
  }
  .brand {
    font-size: 19px;
  }
  .nav {
    gap: 14px;
  }
}
</style>
