<script setup>
const pdfStore = usePdfStore();

const $q = useQuasar();

const dialogModel = defineModel();

const emit = defineEmits(['uploaded']);

const selectPDF = (event) => {
  const maxSize = 20 * 1024 * 1024; // 20MB
  pdf = event.target.files[0];

  if (pdf) {
    if (pdf.size > maxSize) {
      $q.notify({
        type: 'negative',
        message: 'Die Datei ist zu groß. Maximal erlaubt sind 20 MB.',
        timeout: 3000,
      });
      pdf = null;
      return;
    }

    tempPDF.value.name = pdf.name;
    const reader = new FileReader();
    reader.readAsDataURL(pdf);
    reader.onload = (event) => (previewPDF.value = event.target.result);
  }
};

let pdf = null;
const previewPDF = ref(null);
const tempPDF = ref({
  name: null,
});

const upload = async () => {
  if (!pdf) return;

  let formData = new FormData();
  formData.append('pdfdatei', pdf);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    pdfStore.postPDF(formData, config, tempPDF.value);
    previewPDF.value = null;
    emit('uploaded');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
</script>

<template>
  <div>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="column">
          <h3 class="text-success text-center mt-4" >Lade eine PDF-Datei hoch</h3>
          <div class="row items-center">
            <input type="file" accept="application/pdf" @change="selectPDF" class="my-3" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn @click="upload" flat label="Upload PDF" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>
