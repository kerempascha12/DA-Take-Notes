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
    <q-btn class="bg-accent text-white q-mt-lg" label="Upload a file" @click="ShowDialog"></q-btn>
    <div class="q-pa-md row">
      <q-card
        class="my-card bg-accent q-ma-lg cursor-pointer"
        style="width: 400px; height: 550px"
        v-for="pdf in allPDFs"
        :key="pdf"
        @click="selectPDF(pdf)"
      >
        <q-card-section class="column items-center">
          <p class="text-h6 row justify-center text-white">{{ pdf }}</p>
          <iframe width="300px" height="400px" :src="`http://localhost:3000/pdf/${pdf}`" />
          <q-btn class="bg-red" icon="delete" @click.stop="pdfStore.deletePDF(pdf)"></q-btn>
        </q-card-section>
      </q-card>
      <!-- <iframe
    v-for="pdf of pdfs"
    :key="pdf"
    :src="`http://localhost:4000/pdf/${pdf}`"
    width="500px"
    height="600px"-->
    </div>
  </div>
  <UploadDialog v-model="showDialog"></UploadDialog>
</template>
