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
    <q-dialog v-model="dialogModel">
      <q-card
        class="bg-dark text-white q-px-md"
        style="backdrop-filter: blur(8px); min-width: 350px"
      >
        <q-card-section class="text-h6 text-center"> Upload a PDF file </q-card-section>

        <q-separator dark />

        <q-card-section class="q-pt-md column items-center">
          <q-icon name="upload_file" size="64px" color="accent" class="q-mb-md" />
          <input
            type="file"
            accept="application/pdf"
            @change="selectPDF"
            class="q-mb-sm text-white"
          />
          <div v-if="tempPDF.name" class="text-accent text-subtitle2">{{ tempPDF.name }}</div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn flat label="Cancel" v-close-popup class="text-white" />
          <q-btn
            flat
            label="Upload PDF"
            @click="upload"
            class="bg-accent text-white"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>
