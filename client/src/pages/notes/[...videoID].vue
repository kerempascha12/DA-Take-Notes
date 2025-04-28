<script setup>
const ytStore = useYTStore();
const route = useRoute();
const baseURL = 'http://localhost:3000';
const { currentVideo: myVid } = toRefs(ytStore.state);
const showAddDialog = ref(false);

const toggleAddDialog = () => {
  showAddDialog.value = !showAddDialog.value;
};

const title = ref('');
const content = ref('');

onMounted(() => {
  ytStore.selectVideo(route.params.videoID);
});
</script>

<template>
  {{ myVid }}
  <div class="q-pb-xl q-mt-xl" v-if="myVid">
    <div class="row justify-around">
      <iframe
        style="border-radius: 10px"
        class="shadow-8"
        width="768"
        height="432"
        :src="`https://www.youtube.com/embed/${myVid.video_id}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      <div class="column justify-center items-center">
        <div
          class="column items-center text-h6 text-center cursor-pointer"
          style="text-decoration: none; width: 70%"
        >
          <p>{{ myVid.title }}</p>
          <q-btn
            :href="`https://www.youtube.com/watch?v=${myVid.video_id}`"
            type="a"
            target="_blank"
            label="Auf YouTube Schauen"
            class="bg-red text-white q-mb-md"
          />
        </div>

        <q-separator class="bold bg-gray-4 self-center" style="width: 30vw; margin: 0 auto" />

        <div class="self-center">
          <div class="bg-accent rounded q-pb-none q-ma-md" style="width: 40vw; border-radius: 40px">
            <p class="q-mx-lg text-white text-h5 q-my-auto" style="opacity: 65%">5:30</p>
            <div class="bg-secondary rounded" style="width: 100%; border-radius: 35px">
              <div class="q-pa-md">
                <p class="q-mx-none text-h4">Beispiel-Notiz</p>
                <p style="opacity: 65%">
                  Dies ist eine Beispiel-Notiz. Ersetze dies durch relevanten Inhalt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-btn class="fixed-bottom-button bg-accent" @click="toggleAddDialog" round icon="add"></q-btn>

  <q-dialog v-model="showAddDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Deine Notiz:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="title" autofocus label="Titel..." />
        <q-input dense v-model="content" autofocus label="Inhalt..." />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Notiz hinzufügen" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
/* Animation definieren */
@keyframes slideIn {
  from {
    transform: translateY(100px); /* Startpunkt unterhalb */
    opacity: 0; /* Unsichtbar */
  }
  to {
    transform: translateY(0); /* Endposition */
    opacity: 1; /* Sichtbar */
  }
}

/* Initialer Zustand */
.animate-on-scroll {
  opacity: 0; /* Versteckt */
  transform: translateY(100px); /* Position unterhalb */
  transition: transform 0.3s ease, opacity 0.3s ease; /* Sanfter Übergang */
}

/* Zustand nach der Animation */
.animate-on-scroll.slide-in {
  opacity: 1;
  transform: translateY(0); /* Zielposition */
  animation: slideIn 0.5s ease forwards; /* Animation anwenden */
}

.fixed-bottom-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
</style>
