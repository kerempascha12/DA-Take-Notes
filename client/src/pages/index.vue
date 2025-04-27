<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Wörter Animation
const wordsList = ['EASIER!', 'BETTER!', 'SIMPLER!', 'FASTER!', 'SMARTER!'];
const wordArray = ref([]);
let currentWord = ref(0);

function splitLetters(word) {
  return [...word].map((char) => ({ char, class: 'letter' }));
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

// Scroll Animation
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
  wordsList.forEach((word) => wordArray.value.push(splitLetters(word)));
  setInterval(changeWord, 4000);

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="column items-center">
      <div class="animate-on-scroll slide-in text-center column justify-center">
        <q-img class="q-mt-md hero-image" src="/svg/bg.svg" style="position: relative">
          <div class="text-overlay text-white">
            <h1 class="first">Take Notes</h1>
          </div>
        </q-img>
      </div>
    </div>

    <!-- Features Section -->
    <div class="q-mt-md features-section">
      <div class="column items-center text-center text-white">
        <span class="first text-h5">with Friends & Colleagues!</span>

        <div class="animate-on-scroll row q-pt-lg cards-container">
          <div class="puffer"><span class="first text-h2 text-accent">Create Notes</span></div>
          <div class="puffer"><span class="first text-h2 text-accent">Adjust Them</span></div>
          <div class="puffer"><span class="first text-h2 text-accent">Share Them</span></div>
        </div>
      </div>
    </div>

    <!-- Video Bereich -->
    <div class="bg-secondary justify-between video-section">
      <div class="column text-center text-accent">
        <span class="first text-h2">
          MAKE YOUR LIFE
          <p class="animated-word">
            <span
              v-for="(letter, index) in wordArray[currentWord]"
              :key="index"
              :class="letter.class"
              class="first"
            >
              {{ letter.char }}
            </span>
          </p>
        </span>
        <span class="text-h5 q-mt-lg" style="max-width: 500px">
          by comparing notes, checking information, and saving your notes to your own cloud!
        </span>
      </div>

      <!-- Desktop: Laptop -->
      <div v-if="!$q.screen.lt.md" class="laptop-mockup float-animation fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
          <rect x="100" y="450" width="600" height="80" rx="15" fill="#444" />
          <rect x="120" y="460" width="560" height="50" rx="10" fill="#222" />
          <rect x="100" y="50" width="600" height="400" rx="20" fill="#333" />
          <rect x="120" y="70" width="560" height="360" rx="15" fill="#111" />
          <rect x="120" y="70" width="560" height="360" rx="15" fill="rgba(255, 255, 255, 0.05)" />
          <path
            d="M120,70 Q400,30 680,70 L680,90 Q400,50 120,90 Z"
            fill="rgba(255, 255, 255, 0.05)"
          />
          <ellipse cx="400" cy="240" rx="300" ry="10" fill="rgba(255, 255, 255, 0.02)" />
          <ellipse cx="400" cy="540" rx="320" ry="20" fill="rgba(0, 0, 0, 0.3)" />
        </svg>

        <div class="laptop-screen">
          <video autoplay loop muted playsinline>
            <source src="/videos/notes_wallpaper.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <!-- Mobile: Handy -->
      <div v-else class="phone-mockup float-animation zoom-on-scroll">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="300" height="200">
          <rect x="20" y="20" width="560" height="360" rx="40" ry="40" fill="#333" />
          <rect x="50" y="50" width="500" height="300" rx="20" ry="20" fill="#111" />
          <rect
            x="50"
            y="50"
            width="500"
            height="300"
            rx="20"
            ry="20"
            fill="rgba(255,255,255,0.04)"
          />
          <circle cx="300" cy="40" r="5" fill="#666" />
          <ellipse cx="300" cy="390" rx="250" ry="20" fill="rgba(0,0,0,0.2)" />
        </svg>

        <div class="phone-screen">
          <video autoplay loop muted playsinline>
            <source src="/videos/notes_wallpaper.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>

    <div class="text-center text-white items-center q-pa-xl">
      <p class="first text-h3">Ready to Take Notes Like Never Before?</p>
      <q-btn
        color="primary"
        label="Get Started Now"
        class="q-mt-md text-weight-bolder"
        to="/loreg"
      />
    </div>
  </div>
</template>

<style scoped>
/* 📽 Schwebebewegung für Handy und Laptop */
.float-animation {
  animation: float 3s ease-in-out infinite;
}

/* Keyframes für sanftes Hoch- und Runtergleiten */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.hero-image {
  width: 80vw;
  min-width: 300px;
  max-width: 1000px;
  height: auto;
}

.text-overlay {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  text-align: center;
}

.features-section {
  min-height: 70vh;
  background: #b79774;
  padding: 2rem 1rem;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.puffer {
  background: rgb(231, 213, 189);
  width: 256px;
  height: 290px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.puffer:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* Video Section */
.video-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 100vh;
  padding: 3rem 5rem;
}

.laptop-mockup {
  position: relative;
  width: 800px;
  height: 600px;
}

.laptop-screen {
  position: absolute;
  top: 70px;
  left: 120px;
  width: 560px;
  height: 360px;
  border-radius: 15px;
  overflow: hidden;
}

.laptop-screen video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.phone-mockup {
  position: relative;
  width: 300px;
  height: 200px;
  margin-top: 40px;
}

.phone-screen {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 200px;
  height: 100px;
  overflow: hidden;
  border-radius: 15px;
}

.phone-screen video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 📽 Fade-In Animation */
.fade-in {
  opacity: 0;
  animation: fadeInAnimation 1s ease forwards;
  animation-delay: 0.3s;
}

@keyframes fadeInAnimation {
  to {
    opacity: 1;
  }
}

/* Buchstaben Animation */
.letter {
  display: inline-block;
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

/* Scroll Animation */
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

/* 📱 Mobile Anpassungen */
@media (max-width: 768px) {
  .video-section {
    flex-direction: column;
    padding: 3rem 1rem;
  }

  .laptop-mockup {
    display: none;
  }

  .phone-mockup {
    width: 300px;
    height: 600px;
  }

  .phone-screen {
    margin-top: -25px;
    margin-left: -25px;
    width: 250px;
    height: 150px;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
  }

  .puffer {
    width: 80vw;
    height: 200px;
  }

  .hero-image {
    width: 90vw;
  }
}
</style>
