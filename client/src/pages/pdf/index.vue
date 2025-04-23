<script setup>
const pdfStore = usePdfStore();
const router = useRouter();

// const pdfs = ref([]);

const showDialog = ref(false);
const ShowDialog = () => {
  showDialog.value = true;
};

const { allPDFs } = toRefs(pdfStore.state);

const selectPDF = (name) => {
  pdfStore.selectPDF(name);
  router.push(`/pdf/${pdfStore.state.lastPDF[0].id}`);
};

onMounted(() => pdfStore.fetchPDFs());
</script>

<template>
  <div class="q-mx-md column items-center">
    <q-btn class="bg-accent text-white q-mt-lg" label="Upload a file" @click="ShowDialog"></q-btn>
    <UploadDialog v-model="showDialog"></UploadDialog>
    <h3 class="text-primary" v-if="allPDFs.length > 0">Meine PDFs</h3>
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
</template>
