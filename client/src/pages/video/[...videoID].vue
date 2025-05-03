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
import { ref, onMounted, watch, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

const ytStore = useYTStore();
const route = useRoute();
const baseURL = 'http://localhost:3000';
const { currentVideo: myVid } = toRefs(ytStore.state);
const { videoNotizen: notes } = toRefs(ytStore.state);
const $q = useQuasar();

const player = ref(null);
const lastSavedTime = ref(null);
let isYTApiLoaded = false;

const showAddDialog = ref(false);
const addTitle = ref('');
const addContent = ref('');

const showEditDialog = ref(false);
const editNid = ref(0);
const editTitle = ref('');
const editContent = ref('');

watch(
  () => myVid.value.video_id,
  (newVideoId) => {
    if (player.value && typeof player.value.loadVideoById === 'function') {
      player.value.loadVideoById(newVideoId);
    } else {
      initYouTubePlayer(); // fallback
    }
  },
);

const toggleAddDialog = () => {
  showAddDialog.value = !showAddDialog.value;
  getCurrentTimestamp();
  if (showAddDialog.value && player.value?.pauseVideo) {
    player.value.pauseVideo();
  }
};

const postNote = async () => {
  await ytStore.postNote(addTitle.value, addContent.value, myVid.value.id, lastSavedTime.value);
  addTitle.value = '';
  addContent.value = '';
};

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid);
  if (showEditDialog.value && player.value?.pauseVideo) {
    player.value.pauseVideo();
  }
};

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/ytNote/${noteid}`);
  if (!data) return;
  editTitle.value = data[0].title;
  editContent.value = data[0].content;
  editNid.value = data[0].noteid;
};

const shareVideo = (videoId) => {
  navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`);
  $q.notify({ type: 'positive', message: 'Link kopiert!' });
};

const convertIsoToReadable = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (isYTApiLoaded || (window.YT && window.YT.Player)) {
      isYTApiLoaded = true;
      resolve();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        isYTApiLoaded = true;
        resolve();
      };
    }
  });
};

const initYouTubePlayer = async () => {
  await loadYouTubeAPI();
  if (player.value && typeof player.value.destroy === 'function') {
    player.value.destroy();
  }

  player.value = new window.YT.Player('player', {
    width: '100%',
    height: '100%',
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
  if (player.value?.getCurrentTime) {
    const seconds = player.value.getCurrentTime();
    lastSavedTime.value = formatSecondsToHMS(seconds);
  }
};

const seekTo = (timeStr) => {
  const parts = timeStr.split(':').map(Number);
  let seconds = 0;

  if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  if (player.value?.seekTo) {
    player.value.seekTo(seconds, true);
    $q.notify({ type: 'info', message: `Gesprungen zu ${timeStr}`, timeout: 2000 });
  }
};

onMounted(() => {
  ytStore.selectVideo(route.params.videoID);
  initYouTubePlayer();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg wrap justify-center items-start">
      <!-- VIDEO -->
      <div class="col-12 col-md-6">
        <div class="yt-wrapper">
          <div class="yt-player-wrapper">
            <div id="player" class="yt-player shadow-8"></div>
          </div>
          <div class="text-h6 text-white q-mt-md">{{ myVid.title }}</div>

          <div class="row q-mt-sm q-gutter-sm">
            <q-btn
              :href="`https://www.youtube.com/watch?v=${myVid.video_id}`"
              type="a"
              target="_blank"
              label="Auf YouTube schauen"
              icon="ondemand_video"
              class="bg-red text-white"
            />
            <q-btn
              color="orange"
              icon="share"
              label="Link kopieren"
              @click="shareVideo(myVid.video_id)"
            />
          </div>
        </div>
      </div>

      <!-- NOTIZEN -->
      <div class="col-12 col-md-4">
        <div class="notes-container">
          <template v-if="notes.length > 0">
            <div class="notes-header row justify-between items-center q-mb-sm">
              <p class="text-h5 q-ma-none" style="font-family: Shrikhand">Notizen</p>
              <q-btn
                icon="add"
                dense
                color="accent"
                label="Notiz hinzufügen"
                @click="toggleAddDialog"
                class="q-ml-sm"
              />
            </div>

            <div class="notes-scroll q-pr-sm">
              <transition-group name="fade" mode="out-in" tag="div">
                <div v-for="note in notes" :key="note.noteid" class="note-card q-pa-md q-mb-md">
                  <div class="row items-center justify-between q-mb-xs">
                    <div class="text-subtitle1 text-weight-bold">{{ note.title }}</div>
                    <q-badge
                      @click="seekTo(note.time)"
                      class="cursor-pointer text-subtitle2"
                      color="black"
                      outline
                    >
                      {{ note.time }}
                    </q-badge>
                  </div>

                  <div class="text-body2 q-mb-sm" style="opacity: 0.85">{{ note.content }}</div>

                  <div class="row justify-between items-center">
                    <div class="text-caption">{{ convertIsoToReadable(note.created_at) }}</div>
                    <div>
                      <q-btn
                        flat
                        round
                        icon="edit"
                        @click="toggleEditDialog(note.noteid)"
                        size="sm"
                      />
                      <q-btn
                        flat
                        round
                        icon="delete"
                        @click="ytStore.delNote(note.noteid, myVid.id)"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </template>

          <template v-else>
            <div class="no-notes-container column items-center justify-center q-pa-xl">
              <h5 class="no-notes-text q-mb-md">Keine Notizen vorhanden...</h5>
              <q-btn round icon="add" color="brown" size="lg" @click="toggleAddDialog" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ADD-DIALOG -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Neue Notiz</div>
        </q-card-section>
        <q-card-section>
          <p class="text-h5 text-bold">{{ lastSavedTime }}</p>
          <q-input dense v-model="addTitle" autofocus label="Titel..." />
          <q-input dense v-model="addContent" type="textarea" label="Inhalt..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup @click="player.value?.playVideo()" />
          <q-btn
            flat
            label="Speichern"
            @click="
              postNote();
              player.value?.playVideo();
            "
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDIT-DIALOG -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Notiz bearbeiten</div>
        </q-card-section>
        <q-card-section>
          <q-input dense v-model="editTitle" autofocus label="Titel..." />
          <q-input dense v-model="editContent" type="textarea" label="Inhalt..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup @click="player.value?.playVideo()" />
          <q-btn
            flat
            label="Speichern"
            @click="
              ytStore.patchNote(editNid, editTitle, editContent, myVid.id);
              player.value?.playVideo();
            "
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.yt-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.yt-player-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
}

.yt-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.notes-container {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: #dec1a1;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notes-header {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
}

.notes-scroll {
  overflow-y: auto;
  flex-grow: 1;
  max-height: 80vh;
  padding-right: 4px;
}

.note-card {
  background-color: #f3e2c7;
  border-radius: 12px;
  transition: 0.2s ease-in-out;
}
.note-card:hover {
  transform: scale(1.01);
}

.no-notes-container {
  height: 80vh;
  text-align: center;
}

.no-notes-text {
  font-family: 'Shrikhand', cursive;
  font-size: 1.8rem;
  color: white;
}
</style>
