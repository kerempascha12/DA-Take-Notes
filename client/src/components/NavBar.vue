<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const drawer = ref(false);

const menuItems = [
  { to: '/notes', label: 'Notes', icon: 'description' },
  { to: '/video_note', label: 'Video', icon: 'videocam' },
  { to: '/pdf', label: 'PDF', icon: 'picture_as_pdf' },
  { to: '/groups', label: 'Groups', icon: 'groups' },
];

const logout = async () => {
  try {
    await axios.get('/auth/logout');
    authStore.clearUserDetails();
    window.location.reload();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<template>
  <header class="row justify-between q-pt-md text-white" style="margin: 0 5vw 0 3vw">
    <div class="row items-center space">
      <!-- Desktop: Logo + Tabs -->
      <template v-if="!$q.screen.lt.md">
        <router-link to="/" class="row items-center no-link">
          <q-img
            src="/svg/logo.svg"
            height="100%"
            width="80px"
            style="position: relative; filter: invert(1)"
          ></q-img>
        </router-link>
        <q-separator class="q-ma-md bold bg-white q-pt-xl" style="height: 30px" vertical />
        <q-tabs>
          <q-route-tab style="font-size: large" to="/notes">Notes</q-route-tab>
          <q-route-tab style="font-size: large" to="/video_note">Video</q-route-tab>
          <q-route-tab style="font-size: large" to="/pdf">PDF</q-route-tab>
          <q-route-tab style="font-size: large" to="/groups">Groups</q-route-tab>
        </q-tabs>
      </template>

      <!-- Mobile: Burger-Menü -->
      <template v-else>
        <div class="row items-center justify-between full-width">
          <!-- Burger Menü Button -->
          <q-btn dense flat round icon="menu" @click="drawer = !drawer" class="q-ml-sm" />

          <!-- Logo schön zentriert -->
          <div class="absolute-center">
            <router-link to="/" class="no-link">
              <q-img src="/svg/logo.svg" style="filter: invert(1)" width="80px" />
            </router-link>
          </div>
        </div>

        <q-drawer
          v-model="drawer"
          side="left"
          overlay
          :width="250"
          :breakpoint="768"
          class="bg-primary text-white shadow-2"
        >
          <q-scroll-area class="fit q-mt-xl">
            <q-list padding>
              <q-item-label header class="text-h3 text-white q-ml-sm q-mb-md first">
                Menü
              </q-item-label>

              <router-link v-for="item in menuItems" :key="item.to" :to="item.to" class="no-link">
                <q-item clickable v-ripple @click="drawer = false" class="q-py-md">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" size="28px" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </router-link>
            </q-list>
          </q-scroll-area>
        </q-drawer>
      </template>
    </div>

    <!-- Login / Logout Button -->
    <div>
      <router-link v-if="!authStore.userDetails" to="/loreg">
        <q-btn
          icon="fa-solid fa-user"
          outline
          rounded
          size="md"
          class="q-my-lg q-ml-md q-pa-md text-white"
          ><span class="q-ml-sm gt-md">Anmelden</span></q-btn
        >
      </router-link>
      <q-btn
        v-else
        @click="logout"
        icon="fa-solid fa-sign-out-alt"
        outline
        rounded
        size="md"
        class="q-my-lg q-ml-md q-pa-md text-white"
      >
        <span class="q-ml-sm gt-sm lt-xs">Logout</span>
      </q-btn>
    </div>
  </header>
</template>

<style scoped>
.no-link {
  text-decoration: none;
  color: inherit;
}
</style>
