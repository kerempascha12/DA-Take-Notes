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
const noteTab = ref('Youtube');
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

// Selektieren Video
/*
const selectVideo = (id) => {
  ytStore.selectVideo(id);
  const { currentVideo } = toRefs(ytStore.state);
  router.push(`/notes/${currentVideo.value[0].id}`);
  console.log(currentVideo.value)
};
*/

const selectYouTube = async (id) => {
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/video/${id}`);
  console.log(id);
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
const toggleLike = (videoId) => {
  if (likedVideos.value.has(videoId)) {
    likedVideos.value.delete(videoId);
  } else {
    likedVideos.value.add(videoId);
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

const pdfStore = usePdfStore();

const dialogModel = defineModel();

const emit = defineEmits(['uploaded']);

const selectPDF = (event) => {
  const maxSize = 20 * 1024 * 1024; // 5 MB in bytes
  pdf = event.target.files[0];

  if (pdf) {
    if (pdf.size > maxSize) {
      $q.notify({
        type: 'negative',
        message: 'Die Datei ist zu groß. Maximal erlaubt sind 20 MB.',
        timeout: 3000,
      });
      pdf = null; // clear the file
      return;
    }

    tempPDF.value.name = pdf.name;
    const reader = new FileReader();
    reader.readAsDataURL(pdf);
    reader.onload = (event) => (previewPDF.value = event.target.result);
  }
};

let pdf = null;
const previewPDF = ref(null);
const tempPDF = ref({
  name: null,
});

const upload = async () => {
  if (!pdf) return;

  let formData = new FormData();
  formData.append('pdfdatei', pdf);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    pdfStore.postPDF(formData, config, tempPDF.value);
    previewPDF.value = null;
    emit('uploaded');
    router.push('/pdf');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// PowerPoint Upload

const pptStore = usePPTStore();

const powerPointLink = ref('');

const tempSrc = ref('');
const tempWidth = ref(0);
const tempHeight = ref(0);

function extractIframeAttributes(htmlString) {
  // Accept the HTML string as parameter
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const iframe = doc.querySelector('iframe');
  if (!iframe) {
    return { src: null, width: null, height: null };
  }
  return {
    src: iframe.getAttribute('src'),
    width: iframe.getAttribute('width'),
    height: iframe.getAttribute('height'),
  };
}

const postPPT = () => {
  // Pass powerPointLink.value (the actual string) instead of the ref object
  const { src, width, height } = extractIframeAttributes(powerPointLink.value);

  tempSrc.value = src ?? '';
  tempWidth.value = width ? parseInt(width) : 0; // Changed null to 0 for consistency
  tempHeight.value = height ? parseInt(height) : 0; // Changed null to 0 for consistency

  // Only proceed if we have a valid src
  if (tempSrc.value) {
    pptStore.insertPPT(tempSrc.value, tempWidth.value, tempHeight.value);
    tempSrc.value = '';
    tempWidth.value = 0;
    tempHeight.value = 0;
    powerPointLink.value = '';
  } else {
    console.error('No valid iframe found in the input');
  }
};
</script>

<template>
  <div class="q-pa-lg flex flex-center">
    <q-img v-if="!userDetails" width="35%" src="/img/monkey.webp" alt="No user available" />

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
          <q-card
            class="my-beautiful-card q-ma-md"
            style="width: 500px; border-radius: 12px; overflow: hidden"
          >
            <!-- Thumbnail -->
            <q-img
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
        <q-card style="backdrop-filter: blur(8px)" class="bg-primary text-white">
          <q-card-section class="q-pb-none">
            <q-tabs v-model="noteTab" class="full-width">
              <q-tab name="Youtube" label="Youtube" />
              <q-tab name="PowerPoint" label="PowerPoint" />
              <q-tab name="PDF" label="PDF" />
            </q-tabs>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-md" align="center">
            <template v-if="noteTab === 'Youtube'">
              <q-input
                v-model="ytLink"
                outlined
                rounded
                label="Insert a YouTube Link"
                style="width: 80%"
                color="negative"
              />
            </template>

            <template v-else-if="noteTab === 'PowerPoint'">
              <div class="column items-center">
                <q-input outlined v-model="powerPointLink" label="PDF-Bindelink" />
                <div class="row justify-end">
                  <q-btn class="bg-accent" flat label="Upload PowerPoint" @click="postPPT"></q-btn>
                </div>
              </div>
            </template>

            <template v-else-if="noteTab === 'PDF'">
              <div>
                <div class="column">
                  <h3 class="text-success text-center mt-4">Lade ein PDF-File hoch</h3>
                  <div class="row items-center">
                    <input type="file" accept="application/pdf" @change="selectPDF" class="my-3" />
                  </div>
                </div>
                <div class="justify-end row">
                  <q-btn flat class="bg-accent q-mr-md" label="Cancel" v-close-popup />
                  <q-btn @click="upload" class="bg-accent" flat label="Upload PDF" v-close-popup />
                </div>
              </div>
            </template>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              flat
              label="Submit"
              color="primary"
              class="bg-primary text-white"
              @click="addNewVideo"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style scoped>
.my-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
