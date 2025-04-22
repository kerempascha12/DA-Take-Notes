<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const pdfStore = usePdfStore();
const baseURL = 'http://localhost:3000';

const { lastPDF: myPDF } = toRefs(pdfStore.state);
const { PDFNotizen } = toRefs(pdfStore.state);

onMounted(async () => {
  const pdfId = route.params.pdfId;
  await pdfStore.selectPDF(pdfId);
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

const tempNote = ref({
  title: "",
  content: "",
});

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/PDFnote/${noteid}`);
  if (!data) return;
  tempNote.value = data[0];
}

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid)
};

</script>

<template>
  <div class="row">
    <iframe :src="`http://localhost:3000/pdf/${myPDF[0]?.name}`" width="50%" height="1000px" />
    <div class="column q-ml-lg q-mt-md" style="width: 45%">
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
          @click="pdfStore.addNotiz(title, content, myPDF[0].id)"
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
        <q-input dense v-model="tempNote.title" autofocus/>
        <q-input dense v-model="tempNote.content" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Abbrechen" v-close-popup />
        <q-btn flat label="Notiz bearbeiten" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style></style>
