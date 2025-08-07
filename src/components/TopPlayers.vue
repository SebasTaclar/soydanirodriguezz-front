<template>
  <section class="top-players-section">
    <div class="section-title">
      <h2>Colecciones Destacadas</h2>
      <p>Los mejores wallpapers NS200 de la temporada</p>
    </div>
    <div class="top-players-container">
      <div class="players-scroll">
        <div v-for="(collection, index) in topCollections" :key="index" class="player-card">
          <div class="player-image" :style="{ backgroundImage: `url(${collection.image})` }">
            <div class="player-overlay"></div>
          </div>
          <div class="player-info">
            <span class="player-name">{{ collection.name }}</span>
            <span class="player-stats">{{ collection.stats }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const topCollections = ref([
  {
    name: 'NS200 Sport',
    image: '/images/rider1.png',
    stats: '25 Wallpapers • 4K Quality'
  },
  {
    name: 'NS200 Classic',
    image: '',
    stats: '18 Wallpapers • HD Quality'
  },
  {
    name: 'NS200 Racing',
    image: '',
    stats: '30 Wallpapers • Ultra HD'
  },
  {
    name: 'NS200 Street',
    image: '',
    stats: '22 Wallpapers • Premium'
  },
  {
    name: 'NS200 Night',
    image: '',
    stats: '20 Wallpapers • Dark Theme'
  },
  {
    name: 'NS200 Adventure',
    image: '',
    stats: '15 Wallpapers • Landscape'
  },
  {
    name: 'Kevin De Bruyne',
    image: '',
    stats: '8 Goles • 20 Asistencias'
  },
  {
    name: 'Kylian Mbappé',
    image: '',
    stats: '17 Goles • 9 Asistencias'
  },
  {
    name: 'Erling Haaland',
    image: '',
    stats: '22 Goles • 4 Asistencias'
  },
  {
    name: 'Mohamed Salah',
    image: '',
    stats: '19 Goles • 7 Asistencias'
  }
])
</script>

<style scoped>
.top-players-section {
  padding: 4rem 0;
  background: var(--bg-color);
  color: var(--text-color);
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.top-players-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  overflow: hidden;
}

.players-scroll {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0.5rem;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.players-scroll::-webkit-scrollbar {
  display: none;
}

.player-card {
  flex: 0 0 auto;
  width: 120px;
  text-align: center;
  transition: transform 0.3s ease;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px var(--shadow-primary);
}

.player-image {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  border: 3px solid var(--primary-blue);
  position: relative;
  overflow: hidden;
}

.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 100%);
}

.player-info {
  margin-top: 1rem;
}

.player-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
}

.player-stats {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
}

@media (max-width: 768px) {
  .section-title h2 {
    font-size: 2rem;
  }

  .player-card {
    width: 100px;
  }

  .player-image {
    width: 70px;
    height: 70px;
  }

  .player-name {
    font-size: 0.8rem;
  }

  .player-stats {
    font-size: 0.7rem;
  }
}
</style>
