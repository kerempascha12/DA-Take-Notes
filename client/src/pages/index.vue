<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const wordsList = ['EASIER!', 'BETTER!', 'SIMPLER!', 'FASTER!', 'SMARTER!'];
const wordArray = ref([]);
let currentWord = ref(0);

function splitLetters(word) {
  const letters = [];
  for (let i = 0; i < word.length; i++) {
    letters.push({ char: word[i], class: 'letter' });
  }
  return letters;
}

function changeWord() {
  const cw = wordArray.value[currentWord.value];
  const nw =
    currentWord.value === wordArray.value.length - 1
      ? wordArray.value[0]
      : wordArray.value[currentWord.value + 1];

  cw.forEach((letter, i) => {
    setTimeout(() => (letter.class = 'letter out'), i * 80);
  });

  nw.forEach((letter, i) => {
    letter.class = 'letter behind';
    setTimeout(() => (letter.class = 'letter in'), 340 + i * 80);
  });

  currentWord.value = currentWord.value === wordArray.value.length - 1 ? 0 : currentWord.value + 1;
}

onMounted(() => {
  wordsList.forEach((word) => {
    wordArray.value.push(splitLetters(word));
  });

  setInterval(changeWord, 4000);
});

const isNavbarVisible = ref(true);
let lastScrollPosition = 0;

function handleScroll() {
  const currentScrollPosition = window.scrollY;

  if (currentScrollPosition > lastScrollPosition) {
    isNavbarVisible.value = false;
  } else {
    isNavbarVisible.value = true;
  }

  lastScrollPosition = currentScrollPosition;
}

// Scroll-based animation setup
const animateOnScroll = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('slide-in');
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(animateOnScroll, { threshold: 0.2 });

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  observer.disconnect();
});
</script>
<template>
  <div>
    <div class="column items-center">
      <div
        class="animate-on-scroll slide-in text-center column justify-center q-mt-sm animate-on-scroll"
        style="height: 80vh; display: flex; align-items: center; justify-content: center"
      >
        <q-img
          class="q-mt-md"
          src="/svg/bg.svg"
          height="100vh"
          width="60vw"
          style="position: relative"
        >
          <div
            style="
              position: absolute;
              top: 45%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              background: transparent;
            "
            class="text-dark"
          >
            <h1 class="first text-white">Take Notes</h1>
          </div>
        </q-img>
      </div>
    </div>
  </div>

  <div class="q-mt-sm" style="min-height: 75vh; background: #b79774">
    <div class="column items-center text-center text-white">
      <span class="first text-h5">with Friends & Colleagues!</span>
      <div
        class="animate-on-scroll row q-pt-lg"
        style="display: flex; justify-content: center; gap: 16px; margin-top: 24px; color: #b79774"
      >
        <div
          class="puffer q-mx-md"
          style="
            background: rgb(231, 213, 189);
            width: 256px;
            height: 290.563px;
            border-radius: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <span class="first text-h2">Create Notes</span>
        </div>
        <div
          class="puffer q-mx-md"
          style="
            background: rgb(231, 213, 189);
            width: 256px;
            height: 290.563px;
            border-radius: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <span class="first text-h2">Adjust Them</span>
        </div>
        <div
          class="puffer q-mx-md"
          style="
            background: rgb(231, 213, 189);
            width: 256px;
            height: 290.563px;
            border-radius: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <span class="first text-h2">Share Them</span>
        </div>
      </div>
    </div>
  </div>

  <div
    class="bg-secondary"
    style="height: 100vh; display: flex; justify-content: center; align-items: center"
  >
    <div class="row text-center text-accent justify-center q-ml-xl">
      <span class="first text-h2">
        MAKE YOUR LIFE
        <p class="animated-word">
          <span
            class="animated-word"
            v-for="(letter, index) in wordArray[currentWord]"
            :key="index"
          >
            <span class="first" :class="letter.class">{{ letter.char }}</span>
          </span>
        </p>
      </span>
      <span class="text-h5 q-mt-lg" style="max-width: 500px">
        by comparing notes, checking information, and saving your notes to your own cloud!
      </span>
    </div>
    <div style="position: relative; width: 800px; height: 500px">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <rect x="100" y="450" width="600" height="80" rx="15" fill="#444" />
        <rect x="120" y="460" width="560" height="50" rx="10" fill="#222" />
        <rect x="100" y="50" width="600" height="400" rx="20" fill="#333" />
        <rect x="120" y="70" width="560" height="360" rx="15" fill="#111" />
        <rect x="120" y="70" width="560" height="360" rx="15" fill="rgba(0, 0, 0, 0.1)" />
        <path
          d="M120,70 Q400,30 680,70 L680,90 Q400,50 120,90 Z"
          fill="rgba(255, 255, 255, 0.05)"
        />
        <ellipse cx="400" cy="240" rx="300" ry="10" fill="rgba(255, 255, 255, 0.02)" />
        <ellipse cx="400" cy="540" rx="320" ry="20" fill="rgba(0, 0, 0, 0.3)" />
      </svg>
      <div
        style="
          position: absolute;
          top: 70px;
          left: 120px;
          width: 560px;
          height: 360px;
          border-radius: 15px;
          overflow: hidden;
        "
      >
        <video autoplay loop muted style="width: 100%; height: 100%; object-fit: cover">
          <source src="/videos/notes_wallpaper.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<style>
.puffer {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.puffer:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.letter {
  display: inline-block;
  position: relative;
  float: center;
  transform: translateZ(25px);
  transform-origin: 50% 50% 25px;
}

.letter.out {
  transform: rotateX(90deg);
  transition: transform 0.32s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.letter.behind {
  transform: rotateX(-90deg);
}

.letter.in {
  transform: rotateX(0deg);
  transition: transform 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Scroll Animation Styles */
@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(100px);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.animate-on-scroll.slide-in {
  opacity: 1;
  transform: translateY(0);
  animation: slideIn 0.5s ease forwards;
}
</style>
