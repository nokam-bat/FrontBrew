<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive include="RechercheBrasseries">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>