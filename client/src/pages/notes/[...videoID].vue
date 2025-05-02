<!--BACKUP NICHT LÖSCHEN-->
<!--

<script setup>
const ytStore = useYTStore();
const route = useRoute();
const baseURL = 'http://localhost:3000';
const { currentVideo: myVid } = toRefs(ytStore.state);
const { videoNotizen: notes } = toRefs(ytStore.state);
const $q = useQuasar();

// Notiz Posten

const showAddDialog = ref(false);

const toggleAddDialog = () => {
  showAddDialog.value = !showAddDialog.value;
};

const addTitle = ref('');
const addContent = ref('');
const addTime = ref('00:00:00');

const postNote = async () => {
  await ytStore.postNote(addTitle.value, addContent.value, myVid.value.id, '00:00:00');
  addTitle.value = '';
  addContent.value = '';
};
// Patch Note

const showEditDialog = ref(false);

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid);
};

const editNid = ref(0);
const editTitle = ref('');
const editContent = ref('');

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/ytNote/${noteid}`);
  if (!data) return;
  editTitle.value = data[0].title;
  editContent.value = data[0].content;
  editNid.value = data[0].noteid;
};

//Misc

const shareVideo = (videoId) => {
  navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`);
  $q.notify({ type: 'positive', message: 'Link copied to clipboard!' });
};

function convertIsoToReadable(dateStr) {
  const date = new Date(dateStr);
  // Format as YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const lastSavedTime = ref(null);

//Andere sachen
onMounted(() => {
  ytStore.selectVideo(route.params.videoID);
});
</script>
-->

<script setup>
const ytStore = useYTStore();
const route = useRoute();
const baseURL = 'http://localhost:3000';
const { currentVideo: myVid } = toRefs(ytStore.state);
const { videoNotizen: notes } = toRefs(ytStore.state);
const $q = useQuasar();

watch(
  () => myVid.value.video_id,
  (newVideoId) => {
    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(newVideoId);
    } else {
      initYouTubePlayer(); // fallback: first init
    }
  },
);

// Notiz Posten

const showAddDialog = ref(false);

const toggleAddDialog = () => {
  showAddDialog.value = !showAddDialog.value;
  getCurrentTimestamp();
  if (showAddDialog.value && player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
};

const addTitle = ref('');
const addContent = ref('');

const postNote = async () => {
  await ytStore.postNote(addTitle.value, addContent.value, myVid.value.id, lastSavedTime.value);
  addTitle.value = '';
  addContent.value = '';
};

// Patch Note

const showEditDialog = ref(false);

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid);

  // Only pause when opening dialog
  if (showEditDialog.value && player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
};

const editNid = ref(0);
const editTitle = ref('');
const editContent = ref('');

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/ytNote/${noteid}`);
  if (!data) return;
  editTitle.value = data[0].title;
  editContent.value = data[0].content;
  editNid.value = data[0].noteid;
};

// Misc

const shareVideo = (videoId) => {
  navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`);
  $q.notify({ type: 'positive', message: 'Link kopiert!' });
};

function convertIsoToReadable(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// --- YouTube Player API Logic ---

const lastSavedTime = ref(null);
let player = null;

const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    }
  });
};

const initYouTubePlayer = async () => {
  await loadYouTubeAPI();

  if (player && typeof player.destroy === 'function') {
    player.destroy();
  }

  player = new window.YT.Player('player', {
    height: '432',
    width: '768',
    videoId: myVid.value.video_id,
    playerVars: {
      modestbranding: 1,
      rel: 0,
    },
  });
};

const formatSecondsToHMS = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
};

const getCurrentTimestamp = () => {
  if (player && typeof player.getCurrentTime === 'function') {
    const seconds = player.getCurrentTime();
    lastSavedTime.value = formatSecondsToHMS(seconds);
  }
};
// Zu einer bestimmten stelle skippen
const seekTo = (timeStr) => {
  const parts = timeStr.split(':').map(Number);
  let seconds = 0;

  if (parts.length === 3) {
    // HH:MM:SS
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  if (player && typeof player.seekTo === 'function') {
    player.seekTo(seconds, true);
    $q.notify({ type: 'information', message: `Gesprungen zu ${timeStr}`, timeout: 2000 });
  }
};

// Andere sachen
onMounted(() => {
  ytStore.selectVideo(route.params.videoID);
  initYouTubePlayer();
});
</script>

<template>
  <div class="q-pb-xl q-mt-xl" v-if="myVid">
    <div class="row justify-around">
      <div class="column">
        <div class="column">
          <div
            id="player"
            class="shadow-8"
            style="border-radius: 10px; width: 768px; height: 432px"
          ></div>

          <q-btn
            :href="`https://www.youtube.com/watch?v=${myVid.video_id}`"
            type="a"
            target="_blank"
            label="Auf YouTube Schauen"
            class="bg-red text-white q-mb-md q-mt-md"
          />
          <q-btn color="orange" @click="shareVideo(myVid.video_id)" label="Link Kopieren" />
        </div>
      </div>

      <div class="column justify-center items-center">
        <div
          class="column items-center text-h6 text-center cursor-pointer text-white"
          style="text-decoration: none; width: 70%"
        >
          <p>{{ myVid.title }}</p>
        </div>

        <q-separator class="bold bg-gray-4 self-center" style="width: 30vw; margin: 0 auto" />

        <div class="self-center" v-if="notes.length > 0">
          <div
            class="bg-accent rounded q-pb-none q-ma-md"
            style="width: 40vw; border-radius: 40px"
            :key="note.noteid"
            v-for="note of notes"
          >
            <p
              class="q-mx-lg text-white text-h5 q-my-auto cursor-pointer"
              style="opacity: 65%; text-decoration: underline"
              @click="seekTo(note.time)"
            >
              {{ note.time }}
            </p>
            <div class="bg-secondary rounded" style="width: 100%; border-radius: 35px">
              <div class="q-pa-md">
                <p class="q-mx-none text-h4">{{ note.title }}</p>
                <p style="opacity: 65%">
                  {{ note.content }}
                </p>
              </div>
              <div class="row justify-end">
                <q-btn
                  icon="edit"
                  @click="toggleEditDialog(note.noteid)"
                  flat
                  color="black"
                  class="q-mb-lg q-mr-lg"
                ></q-btn>
                <q-btn
                  icon="delete"
                  @click="ytStore.delNote(note.noteid, myVid.id)"
                  flat
                  color="black"
                  class="q-mb-lg q-mr-lg"
                ></q-btn>
              </div>
            </div>
            <div class="row justify-end">
              <p class="text-body1 text-white q-mr-md">
                {{ convertIsoToReadable(note.created_at) }}
              </p>
            </div>
          </div>
        </div>
        <div class="self-center column items-center" v-else>
          <h2 class="text-white" style="font-family: 'Shrikhand'">Keine Notizen vorhanden...</h2>
          <q-btn class="bg-accent text-white" @click="toggleAddDialog" round icon="add"></q-btn>
        </div>
      </div>
    </div>
  </div>

  <q-btn
    v-if="notes.length >= 1"
    class="fixed-bottom-button bg-accent"
    @click="toggleAddDialog"
    round
    icon="add"
  ></q-btn>

  <!-- Add Dialog -->

  <q-dialog v-model="showAddDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Deine Notiz:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-h5 text-bold">{{ lastSavedTime }}</p>
        <q-input dense v-model="addTitle" autofocus label="Titel..." />
        <q-input dense v-model="addContent" autofocus label="Inhalt..." />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="player.playVideo()"/>
        <q-btn flat @click="postNote(); player.playVideo()" label="Notiz hinzufügen" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Edit Dialog -->

  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Deine Notiz:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="editTitle" autofocus label="Titel..." />
        <q-input dense v-model="editContent" autofocus label="Inhalt..." />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="player.playVideo()" />
        <q-btn
          flat
          @click="ytStore.patchNote(editNid, editTitle, editContent, myVid.id); player.playVideo();"
          label="Notiz bearbeiten"
          v-close-popup
        />
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
