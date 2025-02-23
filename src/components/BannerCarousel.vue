<template>
    <div class="relative w-full h-48 md:h-64 overflow-hidden">
      <transition name="fade" mode="out-in">
        <img
          :src="images[currentIndex]"
          :key="images[currentIndex]"
          alt="Banner Image"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BannerCarousel',
    data() {
      return {
        images: [
          'https://haventwined.com/assets/2-2aa4e5da.jpg',
          'https://haventwined.com/assets/1-914424ce.jpg'
        ],
        currentIndex: 0,
        intervalId: null
      }
    },
    mounted() {
      this.startCarousel();
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      startCarousel() {
        this.intervalId = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 3000); // Change image every 3 seconds
      }
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  