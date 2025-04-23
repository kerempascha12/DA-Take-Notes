<script setup>
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const userDetails = computed(() => authStore.userDetails); // Computed property to get user details
const videoDetails = ref(null); // Holds video details
const $q = useQuasar();
const loading = ref(false); // Loading state
const dialog = ref(false); // Dialog visibility state
const noteTab = ref('Youtube'); // Default tab
const ytLink = ref(''); // YouTube link input
const backdropFilter = ref('blur(4px)'); // Backdrop blur effect

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:3000';

// Error handling function
const handleError = (error, defaultMessage = 'An error occurred.') => {
  const message = error.response?.data?.error || defaultMessage;
  $q.notify({ color: 'negative', position: 'top', icon: 'warning', timeout: 3000, message });
};

// Check if userDetails exists
onMounted(() => {
  if (!userDetails.value) {
    console.warn('User details not found in store. Ensure they are set on login.');
  }
  getVideoFromUser(); // Load video details
});

// Fetch video details from the server
const getVideoFromUser = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('/auth/user/video');
    videoDetails.value = data;
    console.log('Video data:', data); // Log the video data
  } catch (error) {
    handleError(error, 'Failed to fetch video details.');
  } finally {
    loading.value = false;
  }
};

// Compute thumbnail URL for the video
const thumbnailUrl = computed(() =>
  videoDetails.value?.video_id
    ? `https://img.youtube.com/vi/${videoDetails.value.video_id}/maxresdefault.jpg`
    : null,
);

// Open the dialog to add a new video
const openDialog = () => {
  dialog.value = true;
};

// Close the dialog
const closeDialog = () => {
  dialog.value = false;
  ytLink.value = ''; // Reset input field
};
</script>

<template>
  <!-- Check if userDetails is available, if not show a fallback image -->
  <div v-if="!userDetails" class="row justify-center">
    <q-img width="35%" src="/img/monkey.webp" alt="No video available" />
  </div>

  <!-- If userDetails exist, display video details -->
  <div v-else class="row q-ma-lg">
    <q-page>
      <q-card class="justify-center my-card" flat style="width: 400px">
        <div v-if="loading" class="q-pa-md">
          <q-spinner color="primary" size="30px" />
          <p>Loading video details...</p>
        </div>

        <div v-else-if="videoDetails && videoDetails.title">
          <q-img :src="thumbnailUrl" alt="Video Thumbnail" style="width: 100%" />
          <q-card-actions class="justify-between">
            <span class="text-weight-bolder">{{ videoDetails.title }}</span>
            <div>
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="primary" icon="share" />
            </div>
          </q-card-actions>
        </div>
      </q-card>

      <!-- Floating button to open the dialog -->
      <q-page-sticky position="bottom-right" :offset="[50, 50]">
        <q-btn size="20px" round color="accent" icon="fa-solid fa-plus" @click="openDialog" />
      </q-page-sticky>
    </q-page>

    <!-- Dialog for adding new video -->
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

          <!-- YouTube Tab Section -->
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

          <!-- PowerPoint Tab Section (for future functionality) -->
          <q-card-section v-else-if="noteTab === 'PowerPoint'">
            <p>PowerPoint upload section will go here.</p>
          </q-card-section>

          <!-- PDF Tab Section (for future functionality) -->
          <q-card-section v-else-if="noteTab === 'PDF'">
            <p>PDF upload section will go here.</p>
          </q-card-section>

          <!-- Submit Button to add a new video -->
          <q-card-actions align="center">
            <q-btn flat label="Submit" class="bg-primary text-white" @click="closeDialog" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>
