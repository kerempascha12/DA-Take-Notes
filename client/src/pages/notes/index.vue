<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const ytStore = useYTStore();

const router = useRouter();

const authStore = useAuthStore();
const userDetails = computed(() => authStore.userDetails);
const videoDetails = ref([]);
const likedVideos = ref(new Set());
const $q = useQuasar();
const loading = ref(false);
const filter = ref('');
const dialog = ref(false);
const ytLink = ref('');
const adding = ref(false);

// WICHTIG: Basis-URL setzen
axios.defaults.baseURL = 'http://localhost:3000';

// Fehlerbehandlung
const handleError = (error, defaultMessage = 'An error occurred.') => {
  const message = error.response?.data?.error || defaultMessage;
  $q.notify({ color: 'negative', message });
};

// Videos vom Server holen
const getVideosFromUser = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('/auth/user/video');
    videoDetails.value = data;

    likedVideos.value.clear();
    data.forEach((video) => {
      if (video.liked) {
        likedVideos.value.add(video.video_id);
      }
    });
  } catch (error) {
    if (userDetails.value) handleError(error, 'Failed to fetch video details.');
  } finally {
    loading.value = false;
  }
};

// Dialog öffnen/schließen
const openDialog = () => {
  dialog.value = true;
};
const closeDialog = () => {
  dialog.value = false;
  ytLink.value = '';
};

// Video ID aus YouTube Link extrahieren
const extractVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.pathname === '/watch') {
      return parsedUrl.searchParams.get('v');
    }
    const pathParts = parsedUrl.pathname.split('/');
    if (pathParts.length >= 2 && (pathParts[1] === 'embed' || pathParts[1] === 'shorts')) {
      return pathParts[2];
    }

    return null;
  } catch (e) {
    console.error('Ungültige URL:', e);
    return null;
  }
};

// Neues Video hinzufügen
const addNewVideo = async () => {
  if (!ytLink.value) {
    $q.notify({ type: 'negative', message: 'Please insert a YouTube link!' });
    return;
  }

  const videoId = extractVideoId(ytLink.value);

  if (!videoId) {
    $q.notify({ type: 'negative', message: 'Invalid YouTube link!' });
    return;
  }

  try {
    adding.value = true;

    // Statt Google direkt → EIGENER Server
    const { data } = await axios.get('/auth/user/youtube/video-info', {
      params: { videoId },
    });

    if (!data.items.length) {
      $q.notify({ type: 'negative', message: 'Video not found!' });
      return;
    }

    const title = data.items[0].snippet.title;

    // Speichern
    await axios.post('/auth/user/video', { videoId, title });

    $q.notify({ type: 'positive', message: 'Video successfully added!' });
    closeDialog();
    getVideosFromUser();
  } catch (error) {
    console.error('Error during addNewVideo:', error);
    handleError(error, 'Failed to add new video.');
  } finally {
    adding.value = false;
  }
};

const selectYouTube = async (id) => {
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/video/${id}`);
  let datei = tempDatei[0];
  ytStore.selectVideo(datei.id);
  router.push(`/notes/${datei.id}`);
};

// Beim Starten Videos laden
onMounted(() => {
  if (!userDetails.value) {
    console.warn('User details not found in store. Ensure they are set on login.');
  }
  getVideosFromUser();
  ytStore.state.currentVideo.value = {};
});

// Tabellen-Spalten
const columns = [
  {
    name: 'video_id',
    label: 'Video ID',
    align: 'left',
    field: (row) => row.video_id,
  },
  {
    name: 'title',
    label: 'Title',
    align: 'left',
    field: (row) => row.title,
  },
];

// Herz liken
const toggleLike = async (videoId) => {
  const isLiked = likedVideos.value.has(videoId);

  try {
    await axios.patch(`/auth/user/video/${videoId}/like`, {
      liked: !isLiked, // send the opposite because we're toggling
    });

    if (isLiked) {
      likedVideos.value.delete(videoId);
    } else {
      likedVideos.value.add(videoId);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    handleError(error, 'Failed to toggle like status.');
  }
};

// Teilen
const shareVideo = (videoId) => {
  navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`);
  $q.notify({ type: 'positive', message: 'Link copied to clipboard!' });
};

// Löschen (Dummy)
const deleteVideo = async (videoId) => {
  try {
    await axios.delete(`/auth/user/video/${videoId}`);
    $q.notify({ type: 'positive', message: 'Video deleted successfully!' });
    getVideosFromUser(); // neu laden
  } catch (error) {
    console.error('Error deleting video:', error);
    handleError(error, 'Failed to delete video.');
  }
};

// Gavrilos Teil, Upload von PDF Dateien

// PowerPoint Upload
</script>

<template>
  <div class="q-pa-lg flex flex-center">
    <div v-if="!userDetails" class="column items-center q-mt-xl">
      <q-img
        src="/img/monkey.webp"
        alt="No user available"
        spinner-color="grey-5"
        class="q-mt-md q-mb-xl rounded-borders gt-sm"
        width="35vw"
      />
      <q-img
        src="/img/monkey.webp"
        alt="No user available"
        spinner-color="grey-5"
        class="q-mt-md q-mb-xl rounded-borders lt-md"
        width="100vw"
      />
    </div>
    <div v-else>
      <div v-if="loading" class="q-pa-md flex flex-center column items-center">
        <q-spinner color="primary" size="30px" />
        <p class="q-mt-md">Loading video details...</p>
      </div>

      <q-table
        v-else
        grid
        card-class="bg-grey-2 text-black"
        :rows="videoDetails"
        :columns="columns"
        row-key="id"
        :filter="filter"
        style="width: 80vw"
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            filled
            v-model="filter"
            placeholder="Search videos..."
            class="q-ml-md bg-white"
            style="border-radius: 5px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- Eigene Gestaltung für jede Karte -->
        <template v-slot:item="props">
          <q-card class="my-card q-ma-md bg-secondary">
            <!-- Thumbnail -->
            <q-img
              @click="selectYouTube(props.row.id)"
              :src="`https://img.youtube.com/vi/${props.row.video_id}/hqdefault.jpg`"
              style="aspect-ratio: 16/9; object-fit: cover"
              spinner-color="primary"
              fit="cover"
            />

            <!-- Titel -->
            <q-card-section class="q-py-sm q-px-md">
              <div class="text-subtitle1 text-weight-bold">{{ props.row.title }}</div>
            </q-card-section>

            <q-card-actions align="right" class="q-gutter-sm q-px-md q-pb-md">
              <q-btn flat round dens icon="edit" @click="selectYouTube(props.row.id)"> </q-btn>
              <q-btn
                flat
                round
                dense
                :icon="likedVideos.has(props.row.video_id) ? 'favorite' : 'favorite_border'"
                color="red"
                @click="toggleLike(props.row.video_id)"
              />
              <q-btn
                flat
                round
                dense
                icon="share"
                color="primary"
                @click="shareVideo(props.row.video_id)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="deleteVideo(props.row.video_id)"
              />
            </q-card-actions>
          </q-card>
        </template>
      </q-table>

      <!-- Plus-Button -->
      <q-page-sticky position="bottom-right" :offset="[50, 50]">
        <q-btn size="lg" round push color="accent" icon="fa-solid fa-plus" @click="openDialog" />
      </q-page-sticky>

      <!-- Upload-Dialog -->
      <q-dialog v-model="dialog">
        <q-card class="bg-dark text-white q-px-md" style="min-width: 350px">
          <q-card-section class="text-h6 text-center q-pt-md">
            Upload a YouTube Video
          </q-card-section>

          <q-separator dark />

          <q-card-section class="q-pt-md column items-center">
            <q-input
              v-model="ytLink"
              outlined
              dark
              rounded
              label="Insert a YouTube Link"
              style="width: 90%"
              color="white"
              class="q-mb-md"
            />
          </q-card-section>

          <q-card-actions align="center" class="q-pb-md">
            <q-btn
              flat
              label="UPLOAD VIDEO"
              @click="addNewVideo"
              class="bg-accent text-white"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style scoped>
.my-card {
  width: 500px;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}
.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
}
</style>
