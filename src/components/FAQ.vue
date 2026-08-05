<template>
  <section class="faq-section" id="faq">
    <div class="faq-container">
      <div class="faq-header">
        <h2>Preguntas frecuentes</h2>
      </div>

      <div class="faq-grid">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ 'active': activeIndex === index }"
          @click="toggleFAQ(index)">
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </div>
          </div>

          <div class="faq-answer" v-if="activeIndex === index">
            <div class="faq-content">
              <p>{{ faq.answer }}</p>

              <!-- Barra de progreso solo para la primera pregunta -->

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wallpaperService } from '@/services/api'

const activeIndex = ref<number | null>(null)

// Estado para números aprobados/vendidos solamente
const approvedNumbers = ref<number[]>([])

// Configuración
const totalNumbers = 5000

// Computed properties - Solo números aprobados/vendidos
const soldNumbers = computed(() => approvedNumbers.value.length)
const progressPercentage = computed(() => (soldNumbers.value / totalNumbers) * 100)

// Función para obtener solo números aprobados
const loadApprovedNumbers = async () => {
  try {
    const response = await wallpaperService.getWallpaperStatus()
    if (response.success && response.data) {
      approvedNumbers.value = response.data.approved // Solo aprobados, no pendientes
    }
  } catch (error) {
    console.error('Error cargando números aprobados:', error)
    approvedNumbers.value = []
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await loadApprovedNumbers()
})

const faqs = ref([
  {
    question: "¿Cuándo se realiza la dinámica?",
    answer: "La dinámica se realizará una vez se alcance un límite de wallpapers vendidos. El límite y la fecha de la dinámica serán anunciados previamente a través de las redes sociales de @soydanirodriguezz."
  },
  {
    question: "¿Puedo comprar más de un número?",
    answer: "Sí, puedes comprar tantos números como desees, siempre y cuando estén disponibles."
  },
  {
    question: "¿Tienes problemas para realizar tu pago por el navegador Safari?",
    answer: "Si tienes inconvenientes con Safari, primero prueba actualizando el navegador. También puedes borrar la caché y las cookies. Si el problema continúa, te recomendamos intentar hacer el pago desde otro navegador como Google Chrome o Mozilla Firefox, o desde un computador. En caso de que aún persista, contáctanos y con gusto te ayudaremos."
  },
  {
    question: "¿Los fondos digitales se envían al correo electrónico?",
    answer: "Sí, una vez confirmado el pago, los fondos digitales de los wallpapers adquiridos se enviarán automáticamente al correo electrónico registrado durante la compra. Por favor, verifica que tu dirección de correo esté escrita correctamente y utiliza una cuenta con suficiente espacio de almacenamiento para recibir el archivo. Si el correo es incorrecto o no cuenta con espacio disponible, la entrega podría no completarse correctamente. Recibirás un correo con el archivo listo para descargar."
  },

  {
    question: "¿No me permite hacer el pago desde mi Iphone?",
    answer: "Si tienes problemas para realizar el pago desde tu iPhone, asegúrate de que tu navegador permita ventanas emergentes y que no haya extensiones bloqueando el proceso. (Si ya le diste bloquear a ventanas emergentes, intenta cerrar todas las pestañas en las que este abierta la pagina y vuelve a intentar el proceso).."
  },

  {
    question: "¿Cómo sé que mi pago fue exitoso?",
    answer: "Al realizar tu compra, recibirás un correo de Wompi confirmando que la transacción fue procesada. Dependiendo de tu entidad bancaria, también podrías recibir una notificación sobre el movimiento o la aprobación del pago. Una vez el pago sea confirmado, recibirás un correo por parte de nuestra plataforma con el wallpaper adquirido para su descarga. Si no encuentras el correo, revisa también las carpetas de spam o correo no deseado."
  },
  // {
  //   question: "¿Cómo puedo permitir o bloquear ventanas emergentes para sitios web específicos?",
  //   answer: "En Chrome, puedes administrar los permisos de ventanas emergentes para sitios web individuales en Configuración > Privacidad y seguridad > Configuración del sitio > Ventanas emergentes y redireccionamientos."
  // },
])

const toggleFAQ = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  padding: 4rem 0;
  position: relative;
}

.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.faq-item {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.faq-item:hover {
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.1);
}

.faq-item.active {
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.2);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.faq-icon {
  width: 24px;
  height: 24px;
  color: #60a5fa;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  border-top: 1px solid rgba(96, 165, 250, 0.1);
  animation: fadeIn 0.3s ease;
}

.faq-content {
  padding: 1.5rem 2rem;
}

.faq-content p {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
}

/* Estilos para la barra de progreso */
.progress-section {
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(96, 165, 250, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.progress-label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.progress-percentage {
  color: #60a5fa;
  font-weight: 700;
  font-size: 1.1rem;
}

.progress-bar {
  position: relative;
  background: rgba(51, 65, 85, 0.6);
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
  margin-bottom: 0.8rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 10px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

.progress-milestone {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  z-index: 2;
}

.milestone-line {
  width: 2px;
  height: 16px;
  background: #fbbf24;
  margin: 0 auto;
  border-radius: 1px;
}

.milestone-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #94a3b8;
}

.ready-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .faq-container {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .faq-container {
    padding: 0 1rem;
  }

  .faq-header h2 {
    font-size: 2rem;
  }

  .faq-question {
    padding: 1.2rem 1.5rem;
    font-size: 1rem;
  }

  .faq-content {
    padding: 1.2rem 1.5rem;
  }

  .faq-content p {
    font-size: 0.9rem;
  }

  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .progress-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .milestone-label {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
}

@media (max-width: 480px) {
  .faq-question {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .faq-content {
    padding: 1rem;
  }

  .faq-icon {
    margin-left: 0.5rem;
  }

  .progress-section {
    padding: 0.8rem 0;
  }

  .progress-label,
  .progress-percentage {
    font-size: 0.8rem;
  }

  .milestone-label {
    font-size: 0.6rem;
    padding: 0.15rem 0.3rem;
  }

  .ready-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>
