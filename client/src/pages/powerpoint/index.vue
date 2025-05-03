<script setup>
const pptStore = usePPTStore();
const { allePPTs: powerPoints } = toRefs(pptStore.state);
const router = useRouter();
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const userDetails = computed(() => authStore.userDetails);

//PPT Hinzufügen
const toggleAddDialog = () => (showAddDialog.value = !showAddDialog.value);
const showAddDialog = ref(false);

const powerPointLink = ref('');

const tempSrc = ref('');
const tempWidth = ref(0);
const tempHeight = ref(0);
const tempName = ref('');

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
const clearAddDialog = () => {
  tempName.value = null;
  powerPointLink.value = null;
  tempSrc.value = null;
};

const postPPT = () => {
  // Pass powerPointLink.value (the actual string) instead of the ref object
  const { src, width, height } = extractIframeAttributes(powerPointLink.value);

  tempSrc.value = src ?? '';
  tempWidth.value = width ? parseInt(width) : 0; // Changed null to 0 for consistency
  tempHeight.value = height ? parseInt(height) : 0; // Changed null to 0 for consistency

  // Only proceed if we have a valid src
  if (tempSrc.value) {
    pptStore.insertPPT(tempSrc.value, tempWidth.value, tempHeight.value, tempName.value);
    tempSrc.value = '';
    tempWidth.value = 0;
    tempHeight.value = 0;
    tempName.value = '';
    powerPointLink.value = '';
  } else {
    console.error('No valid iframe found in the input');
  }
};

// PowerPoint Datei selektieren

const selectPPT = async (ppt) => {
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/pptDatei/${ppt}`);
  let datei = tempDatei[0];
  pptStore.selectPPT(datei.powerpoint_id);
  router.push(`/powerpoint/${datei.powerpoint_id}`);
};

// Edit PowerPoint

const editID = ref(0);
const editName = ref('');
const showEditDialog = ref(false);
const toggleEditDialog = async (id) => {
  showEditDialog.value = true;
  editID.value = id;
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/pptDatei/${id}`);
  editName.value = tempDatei[0].name;
};

const renamePPT = () => {
  pptStore.renamePPT(editID.value, editName.value);
  editID.value = 0;
  editName.value = '';
};

onMounted(() => {
  pptStore.getPPTs();
  pptStore.state.selectedPPT.value = {};
});
</script>

<template>
  <div class="q-pa-md">
    <!-- 🐵 Affe wenn NICHT eingeloggt -->
    <div v-if="!userDetails" class="column items-center q-mt-xl">
      <q-img
        src="/img/monkey.webp"
        alt="No user available"
        spinner-color="grey-5"
        class="q-mt-md q-mb-xl rounded-borders gt-sm"
        width="35vw"
        style="max-width: 400px"
      />
      <q-img
        src="/img/monkey.webp"
        alt="No user available"
        spinner-color="grey-5"
        class="q-mt-md q-mb-xl rounded-borders lt-md"
        width="100vw"
        style="max-width: 100%"
      />
      <div class="text-h6 text-white text-center q-mt-md">
        Bitte melde dich an, um deine PowerPoints zu sehen.
      </div>
      <q-btn
        label="Zum Login"
        color="accent"
        icon="login"
        class="q-mt-md"
        @click="router.push('/login')"
      />
    </div>

    <!-- 📂 Inhalte wenn eingeloggt -->
    <div v-else>
      <!-- Keine PowerPoints -->
      <div class="q-mx-md column items-center" v-if="powerPoints.length < 1">
        <h2 style="font-family: 'Shrikhand'" class="column items-center text-center text-white">
          Keine PowerPoints vorhanden
        </h2>
      </div>

      <!-- Upload Button -->
      <div class="column items-center q-mb-lg">
        <q-btn
          class="bg-accent text-white q-mt-lg"
          label="Eine PPT-Datei hochladen"
          @click="toggleAddDialog"
        />
      </div>

      <!-- PowerPoint Karten -->
      <div class="q-mx-md row justify-center" v-if="powerPoints.length >= 1">
        <q-card
          class="my-card cursor-pointer q-ma-lg bg-dark"
          style="width: 400px"
          v-for="ppt in powerPoints"
          :key="ppt.powerpoint_id"
          @click="selectPPT(ppt.powerpoint_id)"
        >
          <!-- Header -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6 text-center text-truncate" :title="ppt.name">
              {{ ppt.name }}
            </div>
          </q-card-section>

          <!-- Vorschau -->
          <q-card-section class="column items-center q-pb-none">
            <div class="pdf-preview-container">
              <iframe width="100%" height="250px" :src="ppt.src" class="pdf-iframe shadow-2" />
            </div>
          </q-card-section>

          <!-- Aktionen -->
          <q-card-actions align="around" class="q-px-lg q-pb-md">
            <q-btn
              round
              color="red"
              icon="delete"
              @click.stop="pptStore.delPPT(ppt.powerpoint_id)"
              class="shadow-1"
            >
              <q-tooltip>Delete PPT</q-tooltip>
            </q-btn>
            <q-btn
              round
              color="yellow"
              icon="edit"
              @click.stop="toggleEditDialog(ppt.powerpoint_id)"
              class="shadow-1"
            />
            <q-btn
              round
              color="blue"
              icon="visibility"
              @click.stop="selectPPT(ppt.powerpoint_id)"
              class="shadow-1"
            >
              <q-tooltip>View PPT</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <!-- ➕ Floating Add Button -->
      <q-page-sticky position="bottom-right" :offset="[50, 50]">
        <q-btn
          size="lg"
          round
          push
          color="accent"
          icon="fa-solid fa-plus"
          @click="toggleAddDialog"
        />
      </q-page-sticky>

      <!-- 📥 Upload-Dialog -->
      <q-dialog v-model="showAddDialog" @hide="clearAddDialog">
        <q-card class="bg-dark text-white" style="min-width: 350px">
          <q-card-section class="text-h6 text-center"> Upload a PowerPoint </q-card-section>

          <q-separator dark />

          <q-card-section class="q-pt-md column items-center">
            <q-input
              v-model="tempName"
              outlined
              dark
              rounded
              label="Name der Datei"
              style="width: 90%"
              class="q-mb-md"
            />
            <q-input
              v-model="powerPointLink"
              outlined
              dark
              rounded
              label="Einbettungs-Link (iframe)"
              style="width: 90%"
            />
          </q-card-section>

          <q-card-actions align="center" class="q-pb-md">
            <q-btn
              flat
              label="Submit"
              class="bg-accent text-white"
              @click="postPPT"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- ✏️ Edit Dialog -->
      <q-dialog v-model="showEditDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">PowerPoint-Datei umbenennen</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="editName" autofocus />
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Umbenennen" @click="renamePPT()" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style></style>
