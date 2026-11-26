<!-- US 04 : Créer un composant de barre de recherche -->
<template>
  <form class="search-bar" role="search" @submit.prevent="submitSearch">
    <label>
      Nom de la brasserie
      <input
        v-model="query"
        type="search"
        placeholder="Ex. : Alpine"
        :disabled="disabled"
        @keydown.enter.prevent="submitSearch"
      />
    </label>
    <button type="submit" :disabled="disabled">Rechercher</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

// Le parent peut bloquer la recherche pendant une requête (US 06).
const props = defineProps({ disabled: Boolean })
const emit = defineEmits(['search'])
const query = ref('') // La saisie appartient à ce composant.

function submitSearch(event) {
  // Ne pas valider pendant la composition d'un caractère au clavier.
  if (event?.isComposing || props.disabled) return
  const term = query.value.trim() // Retire les espaces aux extrémités.
  if (!term) return              // Bloque '' et '   '.
  emit('search', term)           // Transmet le texte nettoyé au parent.
}
</script>

<style scoped>
.search-bar { display: flex; align-items: end; gap: .5rem; text-align: left; }
label { display: grid; gap: .4rem; flex: 1; min-width: 0; }
input { width: 100%; height: 52px; padding: 0 1rem; font-size: 1rem; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .25); }
button { height: 52px; padding: 0 1.4rem; border: 0; border-radius: 10px; background: var(--brown);
  color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 8px 24px rgba(0, 0, 0, .25); }
button:hover:not(:disabled) { background: var(--brown-hover); }
button:disabled { opacity: .5; cursor: wait; }
:focus-visible { outline: 2px solid var(--amber); outline-offset: 2px; }
@media (max-width: 600px) {
  .search-bar { flex-direction: column; align-items: stretch; }
}
</style>