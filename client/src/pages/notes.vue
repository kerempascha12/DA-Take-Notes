<script setup>
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const userDetails = computed(() => authStore.userDetails);
const videoDetails = ref(null);
const $q = useQuasar();
const loading = ref(false);
const dialog = ref(false);
const noteTab = ref('Youtube'); // Default tab
const ytLink = ref(''); // YouTube link input
const backdropFilter = ref('blur(4px)'); // Backdrop blur effect

axios.defaults.baseURL = 'http://localhost:3000';

const handleError = (error, defaultMessage = 'An error occurred.') => {
  const message = error.response?.data?.error || defaultMessage;
  $q.notify({ color: 'negative', position: 'top', icon: 'warning', timeout: 3000, message });
};
console.log(userDetails.value);
const getVideoFromUser = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('/auth/user/video');
    videoDetails.value = data;
    console.log(data);
  } catch (error) {
    handleError(error, 'Failed to fetch video details.');
  } finally {
    loading.value = false;
  }
};

const thumbnailUrl = computed(() =>
  videoDetails.value?.video_id
    ? `https://img.youtube.com/vi/${videoDetails.value.video_id}/maxresdefault.jpg`
    : null,
);

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  ytLink.value = ''; // Reset input field
};

onMounted(() => {
  if (userDetails.value == !null) {
    console.warn('User details not found in store. Ensure they are set on login.');
  }
  getVideoFromUser();
});
</script>

<template>
  <div v-if="!userDetails" class="row justify-center">
    <q-img width="35%" src="/img/monkey.webp" alt="No video available" />
  </div>

  <div v-else class="row q-ma-lg" style="width: 500px">
    <q-page>
      <q-card class="justify-center my-card" flat>
        <div v-if="loading" class="q-pa-md">
          <q-spinner color="primary" size="30px" />
          <p>Loading video details...</p>
        </div>

        <div v-else-if="videoDetails && videoDetails.title">
          <q-img :src="thumbnailUrl" alt="Video Thumbnail" />
          <q-card-actions class="justify-between">
            <span class="text-weight-bolder">{{ videoDetails.title }}</span>
            <div>
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="primary" icon="share" />
            </div>
          </q-card-actions>
        </div>
      </q-card>

      <q-page-sticky position="bottom-right" :offset="[50, 50]">
        <!-- Trigger Dialog with Blur -->
        <q-btn size="20px" round color="accent" icon="fa-solid fa-plus" @click="openDialog" />
      </q-page-sticky>
    </q-page>

    <!-- Dialog with Blur Effect -->
    <q-dialog v-model="dialog">
      <div :style="{ backdropFilter: backdropFilter }">
        <q-card>
          <q-card-section class="row items-center q-pb-none text-h6">
            <q-tabs v-model="noteTab" class="full-width">
              <q-tab name="Youtube" label="Youtube" />
              <q-tab name="PowerPoint" label="PowerPoint" />
              <q-tab name="PDF" label="PDF" />
            </q-tabs>
          </q-card-section>

          <q-card-section align="center" v-if="noteTab === 'Youtube'">
            <q-input
              v-model="ytLink"
              outlined
              rounded
              label="Insert a YouTube Link"
              style="width: 80%"
              color="negative"
            />
          </q-card-section>

          <q-card-section v-else-if="noteTab === 'PowerPoint'">
            <p>PowerPoint upload section will go here.</p>
          </q-card-section>

          <q-card-section v-else-if="noteTab === 'PDF'">
            <p>PDF upload section will go here.</p>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="Submit" class="bg-primary text-white" @click="closeDialog" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>
