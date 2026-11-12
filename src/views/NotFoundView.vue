<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <h1>404 - Not found</h1>
    <p class="muted">Cette page n'existe pas.</p>
    <RouterLink to="/" class="btn btn--light">Retour à l'accueil</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  margin-top: 80px;
  text-align: center;
}
h1 {
  font-size: 34px;
}
p {
  margin: 12px 0 24px;
}
</style>
