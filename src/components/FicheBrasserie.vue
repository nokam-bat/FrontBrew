<script setup>
defineProps({
  brewery: { type: Object, required: true },
})
</script>

<template>
  <article>
    <h1>{{ brewery.name }} - {{ brewery.brewery_type }}</h1>
      <div class="brewery">
        <div class="brewery-info">
          <h2>Adresse :</h2>
          <p>
            {{ brewery.address_1 }}
            <br v-if="brewery.address_2">
            {{ brewery.address_2 }}
            <br v-if="brewery.address_3">
            {{ brewery.address_3 }}
            <br>
            {{ brewery.postal_code }} {{ brewery.city }}
            <br>
            {{ brewery.state_province }}, {{ brewery.country }}
          </p>
          <h2 v-if="brewery.phone">Contact :</h2>
          <p v-if="brewery.phone">{{ brewery.phone }}</p>
          <h2 v-if="brewery.website_url">Site web :</h2>
          <!-- Pour l'instant le lien ne fonctionne pas -->
          <a :href="brewery.website_url" target="_blank" rel="noopener noreferrer" v-if="brewery.website_url">
            {{ brewery.website_url }}
          </a>
        </div>
        <div class="brewery-map">
          <iframe v-if="brewery.latitude && brewery.longitude" width="600" height="450" style="border:0" loading="lazy" allowfullscreen :src="`https://maps.google.com/maps?q=${brewery.latitude},${brewery.longitude}&z=15&output=embed`"></iframe>
        </div>
      </div>
  </article>
</template>

<style scoped>

h1 {
  text-align: center;
  margin-bottom: 2rem;

  font-size: 2rem;
  font-weight: 600;

  color: white;
}

h2 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  font-size: 1.2rem;
  font-weight: 600;
}

p {
  line-height: 1.6;
  margin: 0;
}

a {
  color: #ffd92f;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:visited {
  color: #f1e9c5
}

iframe {
  width: 500px;
  height: 350px;

  border: none;
  border-radius: 20px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.brewery-info{
  width: 400px;

  color: white;

  background: #381210a6;
  backdrop-filter: blur(4px);

  padding: 2rem;
  border-radius: 25px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  flex: 1;
}

.brewery-map{
  flex-shrink: 0;
}

.brewery {
  display: flex;
  gap: 3rem;
  align-items: center;
}
</style>