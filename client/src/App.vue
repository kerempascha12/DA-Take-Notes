<script setup>
const pwaStore = usePWAStore();

/*onMounted(async () => {
  // Überprüfen, ob der Browser Service Worker unterstützt
  if ('serviceWorker' in navigator) {
    try {
      // Versuchen, die aktuelle Service Worker-Registrierung abzurufen
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        // Überprüfen, ob ein Update verfügbar ist
        if (registration.waiting) {
          update.value = true;
        }
        const updateFound = () => (update.value = true);

        // Fügt einen Event Listener hinzu, der auf das "updatefound"-Event reagiert
        registration.addEventListener('updatefound', () => (update.value = true));

        // Entfernt den Event Listener, wenn die Komponente zerstört wird,
        // um Speicherlecks zu vermeiden
        onUnmounted(() => registration.removeEventListener('updatefound', updateFound));
      }
      // Registriert die Event Listener für online/offline
      window.addEventListener('online', () => (pwaStore.state.isOnline = true));
      window.addEventListener('offline', () => (pwaStore.isOnline = false));
    } catch (error) {
      console.error('Error retrieving the Service Worker registration:', error);
    }
  }
  pwaStore.state.isOnline.addEventListener('change', () => {
    if ((pwaStore.state.isOnline = true)) alert('Online');
    else alert('Offline');
  });
});*/
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
