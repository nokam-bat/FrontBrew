<script setup>
// US 04 – Barre de recherche
import { ref, watch } from 'vue'
import { sanitizeQuery, MAX_QUERY_LENGTH } from '../utils/sanitizeQuery'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  initialQuery: { type: String, default: '' },
})

const emit = defineEmits(['search'])

const keyword = ref(props.initialQuery)
// Si le mot-clé change dans l'URL (bouton « retour »), on met le champ à jour.
watch(
  () => props.initialQuery,
  (value) => {
    keyword.value = value
  },
)

const validationMessage = ref('')

function onSubmit() {
  const { valid, query, message } = sanitizeQuery(keyword.value)
  validationMessage.value = message
  if (!valid) return
  keyword.value = query
  emit('search', query)
}

/** Permet au parent de lancer une recherche (ex. suggestions). */
function setAndSubmit(value) {
  keyword.value = value
  onSubmit()
}
defineExpose({ setAndSubmit })
</script>

<template>
  <form class="search" role="search" @submit.prevent="onSubmit">
    <div class="search__field">
      <label for="search-input" class="sr-only">Rechercher une brasserie</label>
      <input
        id="search-input"
        v-model="keyword"
        type="search"
        placeholder="Nom, ville, mot-clé…"
        autocomplete="off"
        enterkeyhint="search"
        :maxlength="MAX_QUERY_LENGTH"
        :aria-invalid="validationMessage ? 'true' : 'false'"
        aria-describedby="search-help"
        data-test="search-input"
      />
      <button type="submit" class="btn btn--primary" :disabled="disabled" data-test="search-button">
        Rechercher
      </button>
    </div>
    <p
      v-if="validationMessage"
      id="search-help"
      class="search__error"
      role="alert"
      data-test="validation-message"
    >
      {{ validationMessage }}
    </p>
  </form>
</template>

<style scoped>
.search {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}
.search__field {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  min-width: 0;
  height: 48px;
  padding: 0 16px;
  font: inherit;
  font-size: 16px; /* évite le zoom auto sur iPhone */
  color: #1c130c;
  background: #fbf6ee;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
}
input:focus {
  border-color: var(--amber);
}
input::placeholder {
  color: #8a7a68;
}
.btn {
  height: 48px;
  padding: 0 20px;
}
.search__error {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--danger);
  text-align: left;
}
@media (max-width: 420px) {
  .btn {
    padding: 0 14px;
  }
}
</style>
