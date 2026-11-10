<template>
  <div>
    <button @click="handleClick">Voir tout</button>

    <ul v-if="breweries.length > 0">
      <li
        v-for="brewery in breweries"
        :key="brewery.id"
      >
        {{ brewery.name }} - {{ brewery.city }} - {{ brewery.state }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      breweries: []
    }
  },

  methods: {
    async handleClick() {
      try {
        const response = await axios.get(
          'https://api.openbrewerydb.org/v1/breweries'
        )

        this.breweries = response.data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>