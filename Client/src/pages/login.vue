<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';

const $q = useQuasar();

const userDetails = ref(null);

const client_id = import.meta.env.VITE_APP_CLIENT_ID;
  
const notifyDefault = {
  color: 'negative',
  position: 'top',
  icon: 'warning',
  timeout: 3000,
};

const getAuthorizationCode = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id,
        scope: 'email profile openid',
        callback(response) {
          sendCodeToBackend(response.code);
        },
      })
      .requestCode();
  });
};

const sendCodeToBackend = async (code) => {
  try {
    const { data } = await axios.post('/auth/oauth2callback', { code });
    userDetails.value = data;
  } catch (error) {
    console.log(error);
    $q.notify({
      ...notifyDefault,
      message: 'Network error!',
    });
  }
};

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    const errorMessages = {
      400: 'Bad request',
      401: 'You are not logged in!',
      403: 'Forbidden!',
      404: 'User not found!',
      500: 'Server not available or server error!',
    };
    const message = error.response ? errorMessages[error.response.status] : 'Unknown error!';
    $q.notify({
      ...notifyDefault,
      message,
    });
    return null;
  }
  $q.notify({
    ...notifyDefault,
    message: 'An unexpected error occurred!',
  });
  return null;
};

const clearUserData = () => {
  userDetails.value = null;
};

const logout = async () => {
  await axios.get('/auth/logout');
  clearUserData();
};

const getUser = async () => {
  try {
    const { data } = await axios.get('/auth/user/');
    userDetails.value = data;
  } catch (error) {
    handleError(error);
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
