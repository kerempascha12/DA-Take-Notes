<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const pdfStore = usePdfStore();
const baseURL = 'http://localhost:3000';

const { selectedPDF: myPDF } = toRefs(pdfStore.state);
const { PDFNotizen } = toRefs(pdfStore.state);

onMounted(() => {
  pdfStore.selectPDF(route.params.pdfID);
});

// Hinzufügen einer Notiz

const showAddDialog = ref(false);
const title = ref('');
const content = ref('');

// Löschen einer Notiz

const deleteNote = (noteid) => {
  pdfStore.delNote(noteid, route.params.pdfID);
};

// Bearbeiten einer Notiz

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
</script>

<template>
  <div class="row">
    <iframe
      v-if="myPDF && myPDF.name"
      :src="`http://localhost:3000/pdf/${myPDF.name}`"
      width="50%"
      height="1000px"
    />
    <div v-else class="text-left" style="width: 50%">Loading PDF...</div>

    <div class="column q-ml-lg q-mt-md" style="width: 45%" v-if="PDFNotizen.length > 0">
      <!--Hier startet die Notiz-->

      <div
        class="bg-secondary rounded q-mb-md"
        style="width: 100%; border-radius: 35px"
        v-for="notiz in PDFNotizen"
        :key="notiz.noteid"
      >
        <div class="q-pa-md">
          <p class="q-mx-none text-h4">{{ notiz.title }}</p>
          <p style="opacity: 65%">
            {{ notiz.content }}
          </p>
        </div>
        <div class="row justify-end">
          <q-btn
            flat
            round
            icon="edit"
            @click="toggleEditDialog(notiz.noteid)"
            class="q-mb-lg q-mr-lg"
            color="dark"
          >
          </q-btn>
          <q-btn
            flat
            round
            icon="delete"
            @click="deleteNote(notiz.noteid)"
            class="q-mb-lg q-mr-lg"
            color="dark"
          ></q-btn>
        </div>
      </div>

      <!--Hier endet die Notiz-->

      <q-btn color="accent" icon="add" @click="showAddDialog = true"></q-btn>
    </div>
    <div class="self-center column items-center" style="width: 45%;" v-else>
    <h2 class="text-white text-h3" style="font-family: 'Shrikhand'">Keine Notizen vorhanden...</h2>
    <q-btn class="bg-accent text-white" @click="showAddDialog = true" round icon="add"></q-btn>
  </div>
  </div>

  <!-- Dialog zum Hinzufügen einer Notiz -->

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
        <q-btn
          flat
          label="Add address"
          v-close-popup
          @click="
            pdfStore.addNotiz(title, content, route.params.pdfID);
            title = '';
            content = '';
            pdfStore.selectPDF(route.params.pdfID);
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog zum Bearbeiten einer Notiz -->

  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Your address</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="tempTitle" autofocus />
        <q-input dense v-model="tempContent" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Abbrechen" v-close-popup />
        <q-btn
          flat
          label="Notiz bearbeiten"
          @click="pdfStore.patchNote(tempTitle, tempContent, tempNoteID, route.params.pdfID)"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style></style>
