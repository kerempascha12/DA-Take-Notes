<script setup>
import { ref, onMounted, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const pdfStore = usePdfStore();
const baseURL = 'http://localhost:3000';

const { selectedPDF: myPDF } = toRefs(pdfStore.state);
const { PDFNotizen } = toRefs(pdfStore.state);

onMounted(() => {
  pdfStore.selectPDF(route.params.pdfID);
});

const showAddDialog = ref(false);
const title = ref('');
const content = ref('');
const showEditDialog = ref(false);
const tempTitle = ref('');
const tempContent = ref('');
const tempNoteID = ref(0);

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/PDFnote/${noteid}`);
  if (!data) return;
  tempTitle.value = data[0].title;
  tempContent.value = data[0].content;
  tempNoteID.value = data[0].noteid;
};

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid);
};

const deleteNote = (noteid) => {
  pdfStore.delNote(noteid, route.params.pdfID);
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

function saveSelection() {
  // Auswahl im PDF speichern (optional)
}
</script>

<template>
  <q-page class="bg-page q-pa-md">
    <div class="row q-col-gutter-md wrap justify-center items-start">
      <!-- PDF-Anzeige -->
      <div class="col-12 col-md-7">
        <div class="pdf-wrapper shadow-2">
          <iframe
            v-if="myPDF && myPDF.name"
            :src="`http://localhost:3000/pdf/${myPDF.name}`"
            class="pdf-frame"
          />
          <div v-else class="text-center q-pa-md bg-grey-3 rounded-borders">
            <q-spinner color="primary" size="2em" />
            <p class="q-mt-sm">PDF wird geladen...</p>
          </div>
        </div>
      </div>

      <!-- Notizenbereich -->
      <div class="col-12 col-md-4">
        <div class="notes-container">
          <!-- Wenn Notizen vorhanden -->
          <template v-if="PDFNotizen.length > 0">
            <div class="notes-header row justify-between items-center q-mb-sm">
              <p class="text-h5 q-ma-none" style="font-family: Shrikhand">Notizen</p>
              <q-btn
                icon="add"
                dense
                color="accent"
                label="Notiz hinzufügen"
                @click="
                  showAddDialog = true;
                  saveSelection();
                "
                class="q-ml-sm"
              />
            </div>

            <div class="notes-scroll q-pr-sm">
              <transition-group name="fade" mode="out-in" tag="div">
                <div
                  v-for="notiz in PDFNotizen"
                  :key="notiz.noteid"
                  class="note-card q-pa-md q-mb-md"
                >
                  <div class="q-mb-xs text-subtitle2 text-weight-bold">{{ notiz.title }}</div>
                  <div class="text-body2 q-mb-sm" style="opacity: 0.85">{{ notiz.content }}</div>

                  <div class="row justify-between items-center">
                    <div class="text-caption">{{ convertIsoToReadable(notiz.created_at) }}</div>
                    <div>
                      <q-btn
                        flat
                        round
                        icon="edit"
                        @click="toggleEditDialog(notiz.noteid)"
                        size="sm"
                      />
                      <q-btn flat round icon="delete" @click="deleteNote(notiz.noteid)" size="sm" />
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
    <q-dialog v-model="showAddDialog" persistent>
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
          <q-btn
            flat
            label="Hinzufügen"
            v-close-popup
            @click="
              () => {
                pdfStore.addNotiz(title, content, route.params.pdfID);
                title = '';
                content = '';
                pdfStore.selectPDF(route.params.pdfID);
              }
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Notiz bearbeiten</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="tempTitle" autofocus label="Titel..." />
          <q-input dense v-model="tempContent" type="textarea" label="Inhalt..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn
            flat
            label="Speichern"
            v-close-popup
            @click="pdfStore.patchNote(tempTitle, tempContent, tempNoteID, route.params.pdfID)"
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
  height: 85vh;
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
