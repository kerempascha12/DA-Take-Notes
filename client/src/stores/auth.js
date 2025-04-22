import { defineStore } from 'pinia';
import { ref, computed, watchEffect } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userDetails = ref(JSON.parse(localStorage.getItem('userDetails')) || null);
  const videoDetails = ref(null);

  const setUserDetails = (details) => {
    userDetails.value = details;
    try {
      localStorage.setItem('userDetails', JSON.stringify(details));
    } catch (error) {
      console.error('Error saving user details to localStorage:', error);
    }
  };

  const clearUserDetails = () => {
    userDetails.value = null;
    localStorage.removeItem('userDetails');
  };

  const setVideoDetails = (videoData) => {
    videoDetails.value = videoData;
  };

  const clearVideoDetails = () => {
    videoDetails.value = null;
  };

  const isLoggedIn = computed(() => userDetails.value !== null);

  watchEffect(() => {
    if (userDetails.value) {
      localStorage.setItem('userDetails', JSON.stringify(userDetails.value));
    } else {
      localStorage.removeItem('userDetails');
    }
  });

  // Add fetchUserDetails action
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/auth/user/details'); // Update endpoint as needed
      setUserDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  return {
    userDetails,
    videoDetails,
    setUserDetails,
    clearUserDetails,
    setVideoDetails,
    clearVideoDetails,
    isLoggedIn,
    fetchUserDetails, // Export fetchUserDetails
  };
});
