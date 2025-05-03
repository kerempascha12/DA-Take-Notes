<script setup>
import { ref, onMounted, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const baseURL = 'http://localhost:3000';
const route = useRoute();
const pptStore = usePPTStore();
const { selectedPPT: myPPT } = toRefs(pptStore.state);
const { pptNotizen: notes } = toRefs(pptStore.state);

const showAddDialog = ref(false);
const title = ref('');
const content = ref('');

const showEditDialog = ref(false);
const editNid = ref(0);
const editTitle = ref('');
const editContent = ref('');

const addNotiz = () => {
  pptStore.postPPTNote(title.value, content.value, route.params.pptID);
  clearAddDialog();
};

const toggleEditDialog = (noteid) => {
  showEditDialog.value = true;
  selectNote(noteid);
};

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/pptNotiz/${noteid}`);
  if (!data) return;
  editTitle.value = data[0].title;
  editContent.value = data[0].content;
  editNid.value = data[0].noteid;
};

const clearAddDialog = () => {
  title.value = '';
  content.value = '';
};

const clearEditDialog = () => {
  editTitle.value = '';
  editContent.value = '';
  editNid.value = 0;
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

onMounted(() => {
  pptStore.selectPPT(route.params.pptID);
});
</script>

<template>
  <q-page class="bg-page q-pa-md">
    <div class="row q-col-gutter-md wrap justify-center items-start">
      <!-- PowerPoint-Anzeige -->
      <div class="col-12 col-md-7">
        <div class="pdf-wrapper shadow-2">
          <iframe v-if="myPPT && myPPT.src" :src="myPPT.src" class="pdf-frame" />
          <div v-else class="text-center q-pa-md bg-grey-3 rounded-borders">
            <q-spinner color="primary" size="2em" />
            <p class="q-mt-sm">PowerPoint wird geladen...</p>
          </div>
        </div>
      </div>

      <!-- Notizenbereich -->
      <div class="col-12 col-md-4">
        <div class="notes-container">
          <!-- Wenn Notizen vorhanden -->
          <template v-if="notes.length > 0">
            <div class="notes-header row justify-between items-center q-mb-sm">
              <p class="text-h5 q-ma-none" style="font-family: Shrikhand">Notizen</p>
              <q-btn
                icon="add"
                dense
                color="accent"
                label="Notiz hinzufügen"
                @click="showAddDialog = true"
                class="q-ml-sm"
              />
            </div>

            <div class="notes-scroll q-pr-sm">
              <transition-group name="fade" mode="out-in" tag="div">
                <div v-for="note in notes" :key="note.noteid" class="note-card q-pa-md q-mb-md">
                  <div class="q-mb-xs text-subtitle2 text-weight-bold">{{ note.title }}</div>
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
                        @click="pptStore.delNote(note.noteid, route.params.pptID)"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </template>

          <!-- Wenn keine Notizen vorhanden -->
          <template v-else>
            <div class="no-notes-container column items-center justify-center q-pa-xl">
              <h5 class="no-notes-text q-mb-md">Keine Notizen vorhanden...</h5>
              <q-btn round icon="add" color="brown" size="lg" @click="showAddDialog = true" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Dialoge -->
    <q-dialog v-model="showAddDialog" @hide="clearAddDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Neue Notiz</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="title" autofocus label="Titel..." />
          <q-input dense v-model="content" type="textarea" label="Inhalt..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn flat label="Hinzufügen" v-close-popup @click="addNotiz" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialog" @hide="clearEditDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Notiz bearbeiten</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="editTitle" autofocus label="Titel..." />
          <q-input dense v-model="editContent" type="textarea" label="Inhalt..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn
            flat
            label="Speichern"
            v-close-popup
            @click="pptStore.patchNote(editNid, editTitle, editContent, route.params.pptID)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.pdf-wrapper {
  border-radius: 12px;
}

.pdf-frame {
  width: 100%;
  height: 44vh;
  border: none;
  border-radius: 8px;
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
  font-family: 'Shrikhand';
  font-size: 1.8rem;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
