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
.search-bar { display: flex; align-items: end; gap: .75rem; }
label { display: grid; gap: .35rem; flex: 1; min-width: 0; }
input, button { font: inherit; padding: .7rem; border-radius: .4rem; }
input { width: 100%; box-sizing: border-box; border: 1px solid #71877b; }
button { border: 0; background: #173d34; color: white; cursor: pointer; }
button:disabled { opacity: .5; cursor: wait; }
:focus-visible { outline: 3px solid #b67a13; outline-offset: 3px; }
@media (max-width: 600px) {
  .search-bar { flex-direction: column; align-items: stretch; }
}
</style>