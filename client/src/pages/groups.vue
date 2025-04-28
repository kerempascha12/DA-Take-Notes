<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();
const groups = ref([]);
const filter = ref('');
const newGroupName = ref('');
const selectedVideoCode = ref('');
const userVideos = ref([]);
const createDialog = ref(false);
const joinDialog = ref(false);
const joinGroupCode = ref('');

const fetchGroups = async () => {
  try {
    const { data } = await axios.get('/groups', { withCredentials: true });
    groups.value = Array.isArray(data) ? data : [];
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to load groups' });
  }
};

const fetchUserVideos = async () => {
  try {
    const { data } = await axios.get('/auth/user/video', { withCredentials: true });
    userVideos.value = Array.isArray(data)
      ? data.map((video) => ({
          label: video.title,
          value: video.random_code,
        }))
      : [];
  } catch (error) {
    console.warn('No videos found or failed to load videos.'); // Nur Warnung
    userVideos.value = []; // Leeres Array setzen, damit kein Fehler passiert!
  }
};

const createGroup = async () => {
  if (!newGroupName.value.trim() || !selectedVideoCode.value) {
    $q.notify({ type: 'warning', message: 'Please enter a group name and select a video' });
    return;
  }
  try {
    console.log(selectedVideoCode.value.value);
    await axios.post(
      '/groups',
      {
        name: newGroupName.value,
        videoId: selectedVideoCode.value.value,
      },
      { withCredentials: true },
    );
    newGroupName.value = '';
    selectedVideoCode.value = '';
    createDialog.value = false;
    fetchGroups();
    $q.notify({ type: 'positive', message: 'Group created!' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to create group' });
  }
};

const joinGroup = async () => {
  if (joinGroupCode.value.length < 6) {
    $q.notify({ type: 'warning', message: 'Enter a valid group code' });
    return;
  }
  try {
    console.log('Sending join request for code:', joinGroupCode.value);
    const response = await axios.post(
      `/groups/join/${joinGroupCode.value}`,
      {}, // Keine Daten nötig
      { withCredentials: true },
    );

    console.log('Join response:', response.data);

    joinGroupCode.value = '';
    joinDialog.value = false;
    fetchGroups();
    $q.notify({ type: 'positive', message: 'Joined group successfully!' });
  } catch (error) {
    console.error('Join group failed:', error.response?.data || error.message);

    if (error.response) {
      if (error.response.status === 400) {
        $q.notify({
          type: 'negative',
          message: error.response.data.error || 'Invalid group code.',
        });
      } else if (error.response.status === 401) {
        $q.notify({ type: 'negative', message: 'You must be logged in.' });
      } else {
        $q.notify({ type: 'negative', message: 'Failed to join group. Try again.' });
      }
    } else {
      $q.notify({ type: 'negative', message: 'No response from server.' });
    }
  }
};

const deleteGroup = async (groupId) => {
  try {
    await axios.delete(`/groups/${groupId}`, { withCredentials: true });
    fetchGroups();
    $q.notify({ type: 'positive', message: 'Group deleted' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to delete group' });
  }
};

const copyGroupCode = (code) => {
  navigator.clipboard.writeText(code);
  $q.notify({ type: 'positive', message: 'Group code copied to clipboard!' });
};

onMounted(() => {
  fetchGroups();
  fetchUserVideos();
});

const columns = [
  { name: 'name', label: 'Group Name', field: 'name', align: 'center' },
  { name: 'randomCode', label: 'Group Code', field: 'random_code', align: 'center' },
  { name: 'videoId', label: 'Video Code', field: 'video_id', align: 'center' },
  { name: 'createdAt', label: 'Created At', field: 'created_at', align: 'center' },
];
</script>

<template>
  <div class="q-pa-md" style="min-height: 100vh">
    <div class="row justify-end q-gutter-md q-mb-md">
      <q-btn label="➕ Create Group" color="primary" @click="createDialog = true" unelevated />
      <q-btn label="🔗 Join Group" color="primary" @click="joinDialog = true" unelevated />
    </div>

    <q-table
      flat
      bordered
      grid
      title="My Groups"
      :rows="groups"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search Groups"
          class="q-ml-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="full-width flex flex-center">
          <q-card
            class="q-ma-sm q-pa-md bg-grey-2 text-dark"
            style="min-width: 250px; max-width: 300px"
          >
            <q-card-section class="q-pa-none">
              <div class="row items-center justify-between">
                <div class="text-h6 q-pa-md">{{ props.row.name }}</div>
                <q-btn flat dense round icon="more_vert" color="dark" class="q-mr-sm">
                  <q-menu>
                    <q-list style="min-width: 120px">
                      <q-item clickable v-close-popup @click="deleteGroup(props.row.id)">
                        <q-item-section avatar>
                          <q-icon name="delete" color="negative" />
                        </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="copyGroupCode(props.row.random_code)">
                        <q-item-section avatar>
                          <q-icon name="share" />
                        </q-item-section>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="text-center">
              <div class="text-caption">Group ID: {{ props.row.id }}</div>
              <div class="text-caption">Group Code: {{ props.row.random_code }}</div>
              <div class="text-caption">Video Code: {{ props.row.video_id || 'None' }}</div>
              <div class="text-caption">Created: {{ props.row.created_at }}</div>
              <q-btn
                v-if="props.row.video_id"
                label="▶ Watch Video"
                :to="`/watch/${props.row.video_id}`"
                color="primary"
                flat
                class="q-mt-md"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>

    <!-- Create Group Dialog -->
    <q-dialog v-model="createDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Create a New Group</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newGroupName" label="Group Name" filled class="q-mb-md" />
          <q-select filled v-model="selectedVideoCode" :options="userVideos" label="Select Video" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Join Group Dialog -->
    <q-dialog v-model="joinDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Join a Group</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="joinGroupCode" label="Group Code" filled />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Join" color="secondary" @click="joinGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>
