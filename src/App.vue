<script setup>
import Axios from './components/testAxios.vue'
import logo from './assets/beer_logo.png'
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <span class="header__brand">
        <img :src="logo" alt="" class="header__icon" />
        FrontBrew
      </span>
      <a class="header__link" href="https://www.openbrewerydb.org/" target="_blank" rel="noopener noreferrer">
        À propos des données
      </a>
    </div>
  </header>

  <main class="main">
    <Axios />
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
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(36, 23, 14, 0.92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(8px);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  height: 60px;
  margin: 0 auto;
  padding: 0 20px;
}
.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--beige);
}
.header__icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
.header__link {
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
}
.header__link:hover {
  color: var(--text);
}
.main {
  flex: 1;
  width: 100%;
  padding-bottom: 56px;
}
.footer {
  padding: 20px;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  background: #150e09;
  border-top: 1px solid var(--line);
}
</style>
