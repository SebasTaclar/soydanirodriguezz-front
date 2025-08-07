<template>
  <main class="home-main">
    <section class="section">
      <MainBanner />
    </section>
    <section class="section offset">
      <Footer_ />
    </section>
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/MainBanner.vue';
import Footer_ from "@/components/Footer_.vue";

defineOptions({
  name: 'HomeView',
});

</script>

<style scoped>
.home-main {
  padding-top: 60px;
  background-color: var(--app-bg-primary);
  color: var(--app-text-primary);
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.section {
  padding: 0.1px 0 0 0;
  border-bottom: 1px solid var(--app-border-color);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.section:last-child {
  border-bottom: none;
}

.offset {
  padding-top: 60px;
  /* Adjust this value to match the height of your fixed navbar */
  margin-top: -60px;
  /* Negative margin to offset the added padding */
}
</style>
