<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const $q = useQuasar();
const userDetails = ref(null);

const client_id = import.meta.env.VITE_APP_CLIENT_ID;
if (!client_id) {
  console.error('Missing VITE_APP_CLIENT_ID in environment variables.');
}

console.log('Client ID:', client_id); // Debug log (toggle off in production)

axios.defaults.baseURL = 'http://localhost:3000';

const notifyDefault = {
  color: 'negative',
  position: 'top',
  icon: 'warning',
  timeout: 3000,
};

const handleError = (error, defaultMessage = 'An error occurred.') => {
  console.error('Error details:', error.response || error); // Debug log
  const message = error.response?.data?.error || error.response?.statusText || defaultMessage;
  $q.notify({ ...notifyDefault, message });
};

const getAuthorizationCode = () => {
  if (!client_id) {
    $q.notify({
      ...notifyDefault,
      message: 'Missing client configuration. Contact support.',
    });
    return;
  }

  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id,
        scope: 'email profile openid',
        callback: (response) => {
          if (response.code) {
            sendCodeToBackend(response.code);
          } else {
            handleError(null, 'Failed to get authorization code.');
          }
        },
      })
      .requestCode();
  });
};

const sendCodeToBackend = async (code) => {
  console.log('Sending code to backend:', code); // Debug log
  try {
    const { data } = await axios.post('/auth/oauth2callback', { code });
    console.log('Backend response:', data); // Debug log
    userDetails.value = data;
  } catch (error) {
    handleError(error, 'Authorization failed.');
  }
};

const clearUserData = () => {
  userDetails.value = null;
};

const logout = async () => {
  try {
    await axios.get('/auth/logout');
    authStore.clearUserDetails(); // Clear user details from store and localStorage
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Logged out successfully.',
    });
  } catch (error) {
    handleError(error, 'Logout failed.');
  }
};

const getUser = async () => {
  try {
    const { data } = await axios.get('/auth/user/video');
    userDetails.value = data;
  } catch (error) {
    handleError(error, 'Failed to fetch user details.');
  }
};
</script>

<template>
  <div class="column items-center">
    <q-btn-group push class="q-mt-xl">
      <q-btn @click="getAuthorizationCode" color="primary" glossy label="Login" icon="key" />
      <q-btn @click="clearUserData" color="negative" glossy label="Clear" icon="image" />
      <q-btn @click="getUser" color="secondary" glossy label="Get Data" icon="image" />
      <q-btn @click="logout" color="primary" glossy label="Logout" icon="logout" />
    </q-btn-group>
    <div v-if="userDetails" class="text-center q-mt-lg">
      <h4>User Details</h4>
      <p class="q-mt-lg">
        Name:<span class="text-bold"> {{ userDetails.name }}</span>
      </p>
      <p>
        Email: <span class="text-bold">{{ userDetails.email }}</span>
      </p>
      <q-img width="120px" height="120px" :src="userDetails.picture"></q-img>
    </div>
  </div>
</template>
