<script setup>
// Pagination de la page « Tout voir »
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, default: null }, // null = inconnu
  hasNext: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['change'])

function go(page) {
  if (page < 1 || props.disabled) return
  emit('change', page)
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      class="btn btn--outline"
      :disabled="disabled || page <= 1"
      data-test="prev"
      @click="go(page - 1)"
    >
      ‹ Précédente
    </button>
    <span class="muted" data-test="page-info">
      Page {{ page }}<template v-if="totalPages"> / {{ totalPages }}</template>
    </span>
    <button
      type="button"
      class="btn btn--outline"
      :disabled="disabled || !hasNext"
      data-test="next"
      @click="go(page + 1)"
    >
      Suivante ›
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  font-size: 14px;
}
.btn {
  padding: 7px 14px;
  font-size: 14px;
}
</style>
