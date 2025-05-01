<script setup>
const pdfStore = usePdfStore();
const router = useRouter();

// const pdfs = ref([]);

const showDialog = ref(false);
const ShowDialog = () => {
  showDialog.value = true;
};

const { allPDFs } = toRefs(pdfStore.state);

const selectPDF = async (pdf) => {
  const { data: tempDatei } = await axios.get(`http://localhost:3000/database/pdf/${pdf}`);
  console.log(pdf);
  let datei = tempDatei[0];
  pdfStore.selectPDF(datei.id);
  router.push(`/pdf/${datei.id}`);
};

onMounted(() => {
  pdfStore.fetchPDFs();
  pdfStore.state.selectedPDF.value = {};
});
</script>

<template>
  <div class="q-mx-md column items-center">
    <h2
      v-if="allPDFs.length == 0"
      style="font-family: 'Shrikhand'"
      class="columnt items-center text-center text-white"
    >
      Keine PDFs Vorhanden
    </h2>
    <q-btn
      class="bg-accent text-white q-mt-lg"
      label="Eine PDF-Datei hochladen"
      @click="ShowDialog"
    ></q-btn>

    <div class="q-pa-md row justify-center" v-if="allPDFs.length > 0">
      <q-card
        class="my-card cursor-pointer q-ma-lg bg-dark"
        style="width: 400px; height: 550px"
        v-for="pdf in allPDFs"
        :key="pdf"
        @click="selectPDF(pdf)"
      >
        <!-- Header with PDF name -->
        <q-card-section class="bg-accent text-white">
          <div class="text-h6 text-center text-truncate" :title="pdf">
            {{ pdf }}
          </div>
        </q-card-section>

        <!-- PDF Preview -->
        <q-card-section class="column items-center q-pb-none">
          <div class="pdf-preview-container">
            <iframe
              width="100%"
              height="350px"
              :src="`http://localhost:3000/pdf/${pdf}`"
              class="pdf-iframe shadow-2"
            />
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="around" class="q-px-lg q-mt-lg q-pb-md">
          <q-btn
            round
            color="red"
            icon="delete"
            @click.stop="ppts.deletePDF(pdf)"
            class="shadow-1"
          >
            <q-tooltip>Delete PDF</q-tooltip>
          </q-btn>

          <q-btn round color="blue" icon="visibility" @click.stop="selectPDF(pdf)" class="shadow-1">
            <q-tooltip>View PDF</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <UploadDialog v-model="showDialog"></UploadDialog>
</template>
<style>
.my-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

.pdf-preview-container {
  position: relative;
  width: 100%;
  border: 1px solid #333333;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.pdf-iframe {
  border: none;
  border-radius: 8px;
}
</style>
