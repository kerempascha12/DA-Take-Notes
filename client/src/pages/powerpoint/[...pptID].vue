<script setup>
const baseURL = 'http://localhost:3000';
const route = useRoute();
const pptStore = usePPTStore();
const { selectedPPT: myPPT } = toRefs(pptStore.state);
const { pptNotizen: notes } = toRefs(pptStore.state);

//Hinzufügen
const showAddDialog = ref(false);
const title = ref('');
const content = ref('');

const toggleAddDialog = () => (showAddDialog.value = !showAddDialog.value);

const addNotiz = () => {
  pptStore.postPPTNote(title.value, content.value, route.params.pptID);
  title.value = '';
  content.value = '';
};

// Bearbeiten

const showEditDialog = ref(false);

const toggleEditDialog = (noteid) => {
  showEditDialog.value = !showEditDialog.value;
  selectNote(noteid);
};

const editNid = ref(0);
const editTitle = ref('');
const editContent = ref('');

const selectNote = async (noteid) => {
  const { data } = await axios.get(`${baseURL}/database/pptNotiz/${noteid}`);
  if (!data) return;
  editTitle.value = data[0].title;
  editContent.value = data[0].content;
  editNid.value = data[0].noteid;
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
  <div class="q-pb-xl q-mt-xl" v-if="myPPT">
    <div class="row justify-around">
      <div class="column">
        <iframe
          style="border-radius: 10px"
          class="shadow-8"
          width="768"
          height="432"
          :src="myPPT.src"
          frameborder="0"
        ></iframe>
      </div>

      <div class="column justify-center items-center">
        <div
          class="column items-center text-h6 text-center cursor-pointer text-white"
          style="text-decoration: none; width: 70%"
        >
          <p class="text-h2">{{ myPPT.name }}</p>
        </div>

        <q-separator class="bold bg-gray-4 self-center" style="width: 30vw; margin: 0 auto" />

        <div class="self-center" v-if="notes.length > 0">
          <div
            class="bg-accent rounded q-pb-none q-ma-md"
            style="width: 40vw; border-radius: 40px"
            :key="note.noteid"
            v-for="note of notes"
          >
            <p class="q-mx-lg text-white text-h5 q-my-auto" style="opacity: 65%">{{ note.time }}</p>
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
                  flat
                  color="black"
                  @click="toggleEditDialog(note.noteid)"
                  class="q-mb-lg q-mr-lg"
                ></q-btn>
                <q-btn
                  icon="delete"
                  flat
                  color="black"
                  class="q-mb-lg q-mr-lg"
                  @click="pptStore.delNote(note.noteid, route.params.pptID)"
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
          <q-btn class="bg-accent text-white" round icon="add" @click="toggleAddDialog"></q-btn>
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
        <q-btn flat label="Notiz hinzufügen" v-close-popup @click="addNotiz()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

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
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Notiz bearbeiten"
          v-close-popup
          @click="pptStore.patchNote(editNid, editTitle, editContent, route.params.pptID)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
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
