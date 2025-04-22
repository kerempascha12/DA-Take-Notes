<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoUrl = ref('https://www.youtube.com/embed/QzJPdsGMuTU');
const videoTitle = ref('');
const isEditingTitle = ref(false); // Um den Bearbeitungsmodus umzuschalten

// Funktion zum Extrahieren der Video-ID aus der URL
const getVideoIdFromUrl = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

// Funktion zum Abrufen des Video-Titels ohne jQuery
const fetchVideoTitle = async () => {
  const videoId = getVideoIdFromUrl(videoUrl.value);
  if (videoId) {
    const ytApiKey = import.meta.env.VITE_YOUTUBE_API_KEY; // Ersetze dies mit deinem API-Schlüssel

    // Verwende fetch API, um den Video-Titel abzurufen
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${ytApiKey}`,
      );
      const data = await response.json();

      if (data.items && data.items[0]) {
        videoTitle.value = data.items[0].snippet.title;
      } else {
        videoTitle.value = 'Unbekannter Titel';
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Titels:', error);
      videoTitle.value = 'Fehler beim Abrufen des Titels';
    }
  } else {
    videoTitle.value = 'Ungültige Video-URL';
  }
};

// Video-Titel beim Laden der Komponente abrufen
onMounted(fetchVideoTitle);

// Scroll-basierte Animation
const animateOnScroll = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('slide-in'); // Animation anwenden
      observer.unobserve(entry.target); // Beobachtung beenden
    }
  });
};

const observer = new IntersectionObserver(animateOnScroll, { threshold: 0.2 });

onMounted(() => {
  const elements = document.querySelectorAll('.animate-on-scroll'); // Elemente auswählen
  elements.forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  observer.disconnect(); // Observer säubern
});
</script>

<template>
  <div class="q-pb-xl q-mt-xl">
    <div class="row justify-around animate-on-scroll">
      <!-- YouTube-Video -->
      <iframe
        style="border-radius: 10px"
        class="shadow-8"
        width="768px"
        height="432px"
        :src="videoUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      <div class="column justify-center items-center animate-on-scroll">
        <!-- Video-Titel -->
        <div
          v-if="!isEditingTitle"
          @click="isEditingTitle = true"
          class="text-h6 text-center cursor-pointer"
          style="width: 300px; text-decoration: none"
        >
          {{ videoTitle }}
        </div>

        <q-input
          v-else
          v-model="videoTitle"
          class="text-h6 text-center"
          dense
          filled
          style="width: 82.5%"
          @blur="isEditingTitle = false"
        />

        <q-separator class="bold bg-gray-4 self-center" style="width: 30vw; margin: 0 auto" />
        <!-- Zusätzliche Inhalte -->
        <div class="self-center">
          <div
            class="bg-accent rounded q-pb-none q-ma-md animate-on-scroll"
            style="width: 40vw; border-radius: 40px"
          >
            <p class="q-mx-lg text-white text-h5 q-my-auto" style="opacity: 65%">5:30</p>
            <div class="bg-secondary rounded" style="width: 100%; border-radius: 35px">
              <div class="q-pa-md">
                <p class="q-mx-none text-h4">Beispiel-Notiz</p>
                <p style="opacity: 65%">
                  Dies ist eine Beispiel-Notiz. Ersetze dies durch relevanten Inhalt.
                </p>
              </div>
              <p align="end" class="q-mx-lg q-pb-sm">▼</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
</style>
