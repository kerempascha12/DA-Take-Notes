<script setup>
const pdfStore = usePdfStore();
const router = useRouter();
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const userDetails = computed(() => authStore.userDetails);

// const pdfs = ref([]);

const showDialog = ref(false);
const ShowDialog = () => {
  showDialog.value = true;
};

const { allPDFs } = toRefs(pdfStore.state);

const selectPDF = async (pdf) => {
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/pdf/${pdf}`);
  let datei = tempDatei[0];
  pdfStore.selectPDF(datei.id);
  router.push(`/pdf/${datei.id}`);
};

onMounted(() => {
  pdfStore.fetchPDFs();
  pdfStore.state.selectedPDF.value = {};
});

const columns = [
  {
    name: 'pdf',
    label: 'PDF',
    field: (row) => row,
  },
];
</script>

<template>
  <div class="q-pa-md">
    <!-- Affe wenn nicht eingeloggt -->
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

    <!-- Alles andere nur wenn eingeloggt -->
    <div v-else class="q-pa-md">
      <!-- Leerer Zustand -->
      <h2
        v-if="allPDFs.length === 0"
        style="font-family: 'Shrikhand'"
        class="text-center text-white q-mt-xl"
      >
        Keine PDFs vorhanden
      </h2>

      <!-- PDF Grid mit q-table im Grid-Modus -->
      <q-table
        flat
        bordered
        :rows="allPDFs"
        :columns="columns"
        hide-header
        hide-pagination
        :rows-per-page-options="[0]"
        grid
        class="q-mt-md"
      >
        <template v-slot:item="props">
          <q-card
            class="my-card bg-dark text-white"
            style="width: 100%; max-width: 400px"
            @click="selectPDF(props.row)"
          >
            <!-- Header -->
            <q-card-section class="bg-accent text-white">
              <div class="text-h6 text-center text-truncate" :title="props.row">
                {{ props.row }}
              </div>
            </q-card-section>

            <!-- Vorschau -->
            <q-card-section class="column items-center q-pb-none">
              <div class="pdf-preview-container">
                <iframe
                  width="100%"
                  height="350px"
                  :src="`http://localhost:3000/pdf/${props.row}`"
                  class="pdf-iframe shadow-2"
                />
              </div>
            </q-card-section>

            <!-- Aktionen -->
            <q-card-actions align="around" class="q-px-lg q-mt-lg q-pb-md">
              <q-btn
                round
                color="red"
                icon="delete"
                @click.stop="pdfStore.deletePDF(props.row)"
                class="shadow-1"
              >
                <q-tooltip>Delete PDF</q-tooltip>
              </q-btn>
              <q-btn
                round
                color="blue"
                icon="visibility"
                @click.stop="selectPDF(props.row)"
                class="shadow-1"
              >
                <q-tooltip>View PDF</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </template>
      </q-table>

      <!-- Sticky Upload-Button -->
      <q-page-sticky position="bottom-right" :offset="[50, 50]" class="z-top">
        <q-btn size="lg" round push color="accent" icon="fa-solid fa-plus" @click="ShowDialog" />
      </q-page-sticky>

      <!-- Upload-Dialog -->
      <UploadDialog v-model="showDialog" />
    </div>
  </div>
</template>

<style scoped>
.my-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem auto;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
}

.pdf-preview-container {
  width: 100%;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  border: none;
  border-radius: 8px;
}

.z-top {
  z-index: 2000;
}
</style>
