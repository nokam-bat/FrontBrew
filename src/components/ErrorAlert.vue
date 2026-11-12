<script setup>
// US 06 – Alerte d'erreur
defineProps({
  message: { type: String, required: true },
})
const emit = defineEmits(['close', 'retry'])
</script>

<template>
  <div class="alert" role="alert" data-test="error-alert">
    <p class="alert__msg">{{ message }}</p>
    <div class="alert__actions">
      <button type="button" class="btn btn--primary" data-test="retry" @click="emit('retry')">
        Réessayer
      </button>
      <button type="button" class="btn btn--outline" data-test="close" @click="emit('close')">
        Fermer
      </button>
    </div>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 620px;
  margin: 24px auto 0;
  padding: 14px 16px;
  text-align: left;
  background: rgba(60, 18, 10, 0.9);
  border: 1px solid rgba(242, 163, 149, 0.4);
  border-left-width: 4px;
  border-radius: 8px;
}
.alert__msg {
  flex: 1;
  min-width: 200px;
  margin: 0;
}
.alert__actions {
  display: flex;
  gap: 8px;
}
.alert .btn {
  padding: 7px 14px;
  font-size: 14px;
}
</style>
