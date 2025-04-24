<template>
  <header
    class="row justify-between q-pt-md text-white"
    style="margin-left: 3vw; margin-right: 5vw"
  >
    <div class="row items-center space">
      <router-link to="/" class="row items-center no-link">
        <q-img
          src="/svg/logo_white.svg"
          height="100%"
          width="80px"
          style="position: relative"
        ></q-img>
      </router-link>
      <q-separator class="q-ma-md bold bg-white q-pt-xl" style="height: 30px" vertical />
      <q-tabs>
        <q-route-tab style="font-size: large" to="/">Home</q-route-tab>
        <q-route-tab style="font-size: large" to="/notes">Notes</q-route-tab>
        <q-route-tab style="font-size: large" to="/video_note">Video</q-route-tab>
        <q-route-tab style="font-size: large" to="/pdf">PDF</q-route-tab>
        <q-route-tab style="font-size: large" to="/groups">Groups</q-route-tab>
      </q-tabs>
    </div>
    <template v-if="!authStore.userDetails">
      <router-link to="/loreg">
        <q-btn
          style="text-decoration: none; color: white"
          icon="fa-solid fa-user"
          outline
          rounded
          size="15px"
          class="q-my-lg q-ml-md q-pa-md"
          label="Anmelden"
        ></q-btn>
      </router-link>
    </template>
    <template v-else>
      <q-btn
        @click="logout"
        style="text-decoration: none; color: white"
        icon="fa-solid fa-sign-out-alt"
        outline
        rounded
        size="15px"
        class="q-my-lg q-ml-md q-pa-md"
        label="Logout"
      ></q-btn>
    </template>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();

const logout = async () => {
  try {
    await axios.get('/auth/logout');
    authStore.clearUserDetails(); // Clear user details from the store and localStorage
    window.location.reload(); // Refresh the page after logging out
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>
