<template>
  <section class="faq-section" id="faq">
    <div class="faq-container">
      <div class="faq-header">
        <h2>Preguntas frecuentes</h2>
      </div>

      <div class="faq-list">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ 'active': activeIndex === index }"
          @click="toggleFAQ(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <div class="faq-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </div>
          </div>

          <div class="faq-answer" v-if="activeIndex === index">
            <div class="faq-content">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeIndex = ref<number | null>(null)

const faqs = ref([
  {
    question: "¿Cuándo es el sorteo?",
    answer: "El sorteo se realizará el día 15 de cada mes a las 8:00 PM (hora Colombia). La transmisión será en vivo por nuestras redes sociales para garantizar total transparencia."
  },
  {
    question: "¿Cómo se elige al ganador?",
    answer: "Utilizamos un sistema de sorteo aleatorio certificado y transparente. El ganador se selecciona mediante un generador de números aleatorios auditado. Todo el proceso es transmitido en vivo."
  },
  {
    question: "¿Los pagos son reales?",
    answer: "Este sitio está en modo DEMO para fines de demostración. No se procesan pagos reales ni se entregan premios. Es únicamente para mostrar la funcionalidad del sistema."
  }
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
  max-width: 800px;
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin: 0;
  font-size: 0.95rem;
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
}
</style>
