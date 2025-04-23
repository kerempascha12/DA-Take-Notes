<script setup>
import { useRouter } from 'vue-router'; // Import router
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { googleSdkLoaded } from 'vue3-google-login';

const $q = useQuasar();
const authStore = useAuthStore();
const router = useRouter(); // Initialize router
const userDetails = ref(null);

const client_id = import.meta.env.VITE_APP_CLIENT_ID;
console.log('Client ID:', client_id); // Debug log

const getAuthorizationCode = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id,
        scope: 'email profile openid',
        callback(response) {
          console.log('Received authorization code:', response.code); // Debug log
          sendCodeToBackend(response.code);
        },
      })
      .requestCode();
  });
};

const sendCodeToBackend = async (code) => {
  console.log('Sending code to backend:', code); // Debug log
  try {
    const { data } = await axios.post('http://localhost:3000/auth/oauth2callback', { code });
    console.log('Backend response:', data); // Debug log
    authStore.setUserDetails(data); // Update the Pinia store with user data
    userDetails.value = data;

    router.push('/notes');
  } catch (error) {
    console.error('Error details:', error.response || error); // Debug log
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error.response?.data?.error || 'Login failed. Please try again.',
    });
  }
};

const tab = ref('login');

// login
const username = ref('');
const password = ref('');

// register
const firstName = ref('');
const lastName = ref('');
const EMail = ref('');
const regPassword = ref('');
const regPasswordRepeat = ref('');
</script>

<style scoped>
.google-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.line-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}

.line {
  flex-grow: 1;
  height: 1px;
  background-color: #d3d3d3; /* Light gray color */
}

.separator-text {
  margin: 0 1rem;
  font-weight: bold;
  color: #d3d3d3; /* Light gray color to match the lines */
}
</style>

<template>
  <div class="row justify-center items-center">
    <div class="col column justify-center items-center">
      <q-img src="/svg/logo.svg" style="width: 250px"></q-img>
    </div>
    <div
      class="col bg-dark q-pa-xl justify-center items-center column text-white"
      style="height: calc(100vh - 126px)"
    >
      <q-tabs v-model="tab">
        <q-tab name="login" label="Login"></q-tab>
        <q-tab name="register" label="Register"></q-tab>
      </q-tabs>
      <!-- Login -->
      <div v-if="tab == 'login'">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-ma-sm">
          <q-input dark filled v-model="username" rounded label="Your Username *" lazy-rules />

          <q-input
            style="width: 250px"
            dark
            filled
            rounded
            type="password"
            v-model="password"
            label="Your Password *"
            lazy-rules
          />
          <div class="row justify-center">
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>

          <div class="line-separator">
            <div class="line"></div>
            <span class="separator-text">OR</span>
            <div class="line"></div>
          </div>
        </q-form>
      </div>
      <!-- Register -->
      <div v-if="tab == 'register'">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-ma-sm">
          <div class="row items-center">
            <q-input
              class="q-px-sm"
              dark
              filled
              v-model="firstName"
              rounded
              label="Your Firstname *"
              lazy-rules
            />
            <q-input dark filled v-model="lastName" rounded label="Your Lastname *" lazy-rules />
          </div>
          <q-input dark filled v-model="EMail" rounded label="Your E-Mail *" lazy-rules />

          <q-input
            dark
            filled
            rounded
            type="password"
            v-model="regPassword"
            label="Your Password *"
            lazy-rules
          />
          <q-input
            dark
            filled
            rounded
            type="password"
            v-model="regPasswordRepeat"
            label="Repeate your Password *"
            lazy-rules
          />
          <div class="row justify-center">
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>

          <div class="line-separator">
            <div class="line"></div>
            <span class="separator-text">OR</span>
            <div class="line"></div>
          </div>
        </q-form>
      </div>
      <q-btn
        @click="getAuthorizationCode"
        class="q-mb-md google-btn"
        label="Login with Google"
        color="white"
        outline
        icon="fab fa-google"
      />
    </div>
  </div>
</template>
