<script setup>

</script>

<template>
  <q-layout>
    <q-header reveal elevated>
      <q-toolbar class="bg-dark">
        <q-toolbar-title>
          <NavBar />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <RouterView />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
body
  background-color: $primary

  @font-face
  font-family: 'Arimo'
  src: url('/fonts/Arimo/Arimo-Regular.ttf') format('truetype')

@font-face
  font-family: 'Shrikhand'
  src: url('/fonts/Shrikhand/Shrikhand-Regular.ttf') format('truetype')

.first
  font-family: 'Shrikhand'

*
  font-family: 'Arimo'
</style>
