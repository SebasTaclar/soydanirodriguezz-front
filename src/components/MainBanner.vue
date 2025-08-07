<template>
  <section class="hero">
    <!-- Carrusel de imágenes de fondo -->
    <div class="carousel-container">
      <div class="carousel-slide"
           v-for="(slide, index) in slides"
           :key="index"
           :class="{ 'active': currentSlide === index }"
           :style="{ backgroundImage: `url(${slide.image})` }">
        <div class="slide-overlay"></div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-title">
          <h1>{{ slides[currentSlide].title }}</h1>
        </div>

        <div class="hero-description">
          <p>{{ slides[currentSlide].description }}</p>
        </div>

        <!-- Sección de productos destacados -->
        <div class="tournaments-section">
          <h3 class="tournaments-title">Productos destacados</h3>
          <div class="tournaments-carousel-container">
            <div class="tournaments-carousel" :style="{ transform: `translateX(-${currentTournamentSlide * (100 / tournamentsPerView)}%)` }">
              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">🏍️</span>
                  <span class="tournament-league">NS200 Collection</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">Descarga inmediata</span>
                  <h4 class="tournament-name">Wallpapers NS200 de alta calidad</h4>
                </div>
                <button class="tournament-btn" @click="scrollToTournaments">Ver catálogo</button>
              </div>

              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">💎</span>
                  <span class="tournament-league">Premium Edition</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">Calidad superior</span>
                  <h4 class="tournament-name">Ediciones especiales NS200</h4>
                </div>
                <button class="tournament-btn">Ver más detalles</button>
              </div>

              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">📱</span>
                  <span class="tournament-league">Para Móviles</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">4K Resolution</span>
                  <h4 class="tournament-name">NS200 optimizado para smartphones</h4>
                </div>
                <button class="tournament-btn">Ver más detalles</button>
              </div>

              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">💻</span>
                  <span class="tournament-league">Para Escritorio</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">Ultra HD</span>
                  <h4 class="tournament-name">Wallpapers NS200 para PC</h4>
                </div>
                <button class="tournament-btn">Ver más detalles</button>
              </div>

              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">🎨</span>
                  <span class="tournament-league">Artísticos</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">Estilo único</span>
                  <h4 class="tournament-name">NS200 con diseños abstractos</h4>
                </div>
                <button class="tournament-btn">Ver más detalles</button>
              </div>

              <div class="tournament-card">
                <div class="tournament-badge">
                  <span class="tournament-icon">🌟</span>
                  <span class="tournament-league">Nuevos</span>
                </div>
                <div class="tournament-info">
                  <span class="tournament-time">Recién agregados</span>
                  <h4 class="tournament-name">Nuevos wallpapers NS200 disponibles</h4>
                </div>
                <button class="tournament-btn">Ver más detalles</button>
              </div>
            </div>

            <!-- Controles del carrusel de torneos -->
            <button class="tournament-carousel-control prev" @click="prevTournament" v-show="currentTournamentSlide > 0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            <button class="tournament-carousel-control next" @click="nextTournament" v-show="currentTournamentSlide < maxTournamentSlide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>

          <!-- Indicadores de torneos (solo en móvil) -->
          <div class="tournament-indicators">
            <button
              v-for="n in Math.ceil(totalTournaments / tournamentsPerView)"
              :key="n"
              :class="{ 'active': currentTournamentSlide === n - 1 }"
              @click="currentTournamentSlide = n - 1"
              :aria-label="`Ir a grupo ${n} de torneos`">
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores del carrusel -->
    <div class="carousel-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ 'active': currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`Ir a imagen ${index + 1}`">
      </button>
    </div>

    <!-- Controles de navegación -->
    <button class="carousel-control prev" @click="prevSlide" aria-label="Imagen anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15,18 9,12 15,6"></polyline>
      </svg>
    </button>
    <button class="carousel-control next" @click="nextSlideManual" aria-label="Siguiente imagen">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Configuración del carrusel principal
const slides = ref([
  {
    image: '/images/ns200_slide1.jpg',
    title: 'Wallpapers NS200 Premium',
    description: 'Descubre nuestra colección exclusiva de fondos digitales de la legendaria moto NS200. Diseños únicos que capturan la esencia deportiva y elegante de esta increíble motocicleta.'
  },
  {
    image: '/images/ns200_slide2.jpg',
    title: 'NS200: Potencia y Estilo Digital',
    description: 'Wallpapers profesionales en ultra alta resolución de la NS200. Perfectos para cualquier dispositivo. Captura la adrenalina y la velocidad en tu pantalla.'
  },
  {
    image: '/images/ns200_slide3.jpg',
    title: 'Diseños Deportivos Exclusivos',
    description: 'Cada wallpaper está cuidadosamente diseñado para mostrar la belleza deportiva de la NS200. Desde ángulos dinámicos hasta detalles impresionantes.'
  },
  {
    image: '/images/ns200_slide4.jpg',
    title: '¡La NS200 en tu Pantalla!',
    description: 'Colección completa de fondos NS200 en diferentes estilos y ángulos. Compra fácil, descarga inmediata. ¡Lleva la pasión motociclista a tu mundo digital!'
  }
])

const currentSlide = ref(0)
let intervalId: number | null = null

// Configuración del carrusel de torneos
const currentTournamentSlide = ref(0)
const totalTournaments = 6
const windowWidth = ref(window.innerWidth)

const tournamentsPerView = computed(() => {
  // En desktop mostrar 3, en tablet 2, en móvil 1
  if (windowWidth.value >= 1024) return 3
  if (windowWidth.value >= 768) return 2
  return 1
})

const maxTournamentSlide = computed(() => {
  return Math.max(0, Math.ceil(totalTournaments / tournamentsPerView.value) - 1)
})

// Funciones del carrusel principal
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

const nextSlideManual = () => {
  resetInterval()
  nextSlide()
  startInterval()
}

const goToSlide = (index: number) => {
  resetInterval()
  currentSlide.value = index
  startInterval()
}

// Funciones del carrusel de torneos
const nextTournament = () => {
  if (currentTournamentSlide.value < maxTournamentSlide.value) {
    currentTournamentSlide.value++
  }
}

const prevTournament = () => {
  if (currentTournamentSlide.value > 0) {
    currentTournamentSlide.value--
  }
}

// Función para hacer scroll a la sección de torneos
const scrollToTournaments = () => {
  const element = document.getElementById('ongoing_tournaments')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Control del auto-play
const startInterval = () => {
  intervalId = window.setInterval(nextSlide, 5000)
}

const resetInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Control del resize de ventana
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // Resetear posición si es necesario
  if (currentTournamentSlide.value > maxTournamentSlide.value) {
    currentTournamentSlide.value = maxTournamentSlide.value
  }
}

// Lifecycle hooks
onMounted(() => {
  startInterval()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  resetInterval()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Carrusel de fondo */
.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Contenido principal */
.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-logo {
  margin-bottom: 2rem;
}

.carousel-logo {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.hero-title h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-description p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  line-height: 1.6;
}

/* Sección de torneos */
.tournaments-section {
  margin-top: 4rem;
  max-width: 100%;
}

.tournaments-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.tournaments-carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.tournaments-carousel {
  display: flex;
  transition: transform 0.5s ease;
  gap: 1rem;
}

.tournament-card {
  flex: 0 0 calc(33.333% - 0.67rem);
  background: var(--app-surface-elevated);
  border-radius: 12px;
  padding: 1.5rem;
  color: var(--app-text-primary);
  backdrop-filter: blur(10px);
  box-shadow: var(--app-shadow);
  border: 1px solid var(--app-border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tournament-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.tournament-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tournament-icon {
  font-size: 1.5rem;
}

.tournament-league {
  font-weight: 600;
  color: var(--primary-blue);
}

.tournament-info {
  margin-bottom: 1.5rem;
}

.tournament-time {
  font-size: 0.9rem;
  color: var(--medium-gray);
  display: block;
  margin-bottom: 0.5rem;
}

.tournament-name {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

.tournament-btn {
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.tournament-btn:hover {
  background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
  transform: translateY(-2px);
}

/* Controles del carrusel de torneos */
.tournament-carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--app-surface-elevated);
  border: 2px solid var(--app-border-color);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-blue);
  transition: all 0.3s ease;
  z-index: 10;
}

.tournament-carousel-control:hover {
  background: var(--app-hover-bg);
  border-color: var(--primary-blue);
  transform: translateY(-50%) scale(1.1);
}

.tournament-carousel-control.prev {
  left: -25px;
}

.tournament-carousel-control.next {
  right: -25px;
}

.tournament-carousel-control svg {
  width: 20px;
  height: 20px;
}

/* Indicadores de torneos */
.tournament-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.tournament-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--app-border-color);
  background: var(--app-surface);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tournament-indicators button.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  transform: scale(1.2);
}

/* Indicadores del carrusel principal */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 3;
}

.carousel-indicators button {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators button.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  transform: scale(1.2);
}

.carousel-indicators button:hover {
  border-color: white;
}

/* Controles del carrusel principal */
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  z-index: 3;
  backdrop-filter: blur(10px);
}

.carousel-control:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.carousel-control.prev {
  left: 30px;
}

.carousel-control.next {
  right: 30px;
}

.carousel-control svg {
  width: 24px;
  height: 24px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tournament-card {
    flex: 0 0 calc(50% - 0.5rem);
  }

  .tournament-carousel-control {
    display: none;
  }

  .tournament-indicators {
    display: flex;
  }
}

@media (max-width: 768px) {
  .hero-title h1 {
    font-size: 2.5rem;
  }

  .hero-description p {
    font-size: 1.1rem;
  }

  .tournament-card {
    flex: 0 0 100%;
  }

  .tournaments-title {
    font-size: 1.6rem;
  }

  .carousel-control {
    width: 50px;
    height: 50px;
  }

  .carousel-control.prev {
    left: 15px;
  }

  .carousel-control.next {
    right: 15px;
  }
}

@media (max-width: 480px) {
  .hero-title h1 {
    font-size: 2rem;
  }

  .hero-description p {
    font-size: 1rem;
  }

  .carousel-logo {
    width: 100px;
  }

  .tournament-card {
    padding: 1rem;
  }

  .tournaments-section {
    margin-top: 2rem;
  }
}
</style>
