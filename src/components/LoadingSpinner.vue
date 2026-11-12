<script setup>
// US 06 – Indicateur de chargement
defineProps({
  label: { type: String, default: 'Recherche en cours…' },
})
</script>

<template>
  <div class="loader" role="status" data-test="loader">
    <span class="loader__spinner" aria-hidden="true"></span>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
  color: var(--muted);
}
.loader__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--line);
  border-top-color: var(--amber);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
