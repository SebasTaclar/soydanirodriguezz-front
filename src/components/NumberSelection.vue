<template>
  <section id="number-selection" class="number-selection-section">
    <div class="selection-container">
      <!-- Título y descripción -->
      <div class="selection-header">
        <h2>Elige tus Wallpapers NS200</h2>
        <p>Selecciona los números de wallpapers que quieres comprar. Cada wallpaper cuesta $5.000 COP.</p>
      </div>

      <!-- Sección ¿Cómo funciona? -->
      <div class="how-it-works-section">
        <h3 class="how-it-works-title">¿Cómo funciona?</h3>
        <div class="steps-container">
          <div class="step-card">
            <div class="step-icon">�️</div>
            <div class="step-content">
              <h4>1. Elige tus wallpapers</h4>
              <p>Selecciona los números de wallpapers NS200 que quieres comprar.</p>
            </div>
          </div>

          <div class="step-card">
                                    <div class="step-icon">1️⃣</div>
            <div class="step-content">
              <h4>2. Realiza el pago</h4>
              <p>Paga de forma segura con MercadoPago.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-icon">📱</div>
            <div class="step-content">
              <h4>3. Descarga inmediata</h4>
              <p>Recibe tus wallpapers en alta calidad.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="selection-content">
        <!-- Panel de números -->
        <div class="numbers-panel">
          <!-- Botones de control -->
          <div class="control-buttons">
            <button class="control-btn random-btn" @click="selectRandomNumbers(3)">
              Aleatorio x3
            </button>
            <button class="control-btn random-btn" @click="selectRandomNumbers(5)">
              Aleatorio x5
            </button>
            <button class="control-btn random-btn" @click="selectRandomNumbers(10)">
              Aleatorio x10
            </button>
            <button class="control-btn clear-btn" @click="clearSelection">
              Limpiar
            </button>
          </div>

          <!-- Buscador de número específico -->
          <div class="number-search">
            <div class="search-input-container">
              <input
                v-model="searchNumber"
                type="number"
                min="1"
                max="5000"
                placeholder="Buscar wallpaper (ej: 1234)"
                class="search-input"
                @keyup.enter="goToNumber"
              />
              <button class="search-btn" @click="goToNumber" :disabled="!searchNumber">
                🔍 Buscar
              </button>
            </div>
          </div>

          <!-- Grid de números -->
          <div class="numbers-grid">
            <button v-for="number in currentPageNumbers" :key="number" :class="[
              'number-btn',
              {
                'selected': selectedNumbers.includes(number),
                'taken': takenNumbers.includes(number),
                'reserved': isNumberReserved(number)
              }
            ]" @click="toggleNumber(number)" :disabled="takenNumbers.includes(number) || isNumberReserved(number)" :data-number="number">
              {{ number.toString().padStart(4, '0') }}
              <span v-if="selectedNumbers.includes(number)" class="selected-check">✓</span>
              <span v-if="isNumberReserved(number)" class="reservation-timer">
                {{ formatTimeLeft(getReservationTimeLeft(number)) }}
              </span>
            </button>
          </div>

          <!-- Paginación -->
          <div class="pagination-controls">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              ‹ Anterior
            </button>

            <div class="page-info">
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <span class="numbers-range">Números {{ firstNumberInPage }} - {{ lastNumberInPage }}</span>

              <!-- Selector de página -->
              <div class="page-selector">
                <label for="page-select">Ir a página:</label>
                <select id="page-select" v-model="currentPage" @change="goToPage(currentPage)" class="page-select">
                  <option v-for="page in totalPages" :key="page" :value="page">
                    {{ page }}
                  </option>
                </select>
              </div>
            </div>

            <button class="pagination-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
              Siguiente ›
            </button>
          </div>

          <!-- Controles de limpieza -->
          <div class="clean-controls">
            <button class="control-btn clear-all-btn" @click="clearAllNumbers">
              🧹 Limpiar selección
            </button>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="sidebar-panel">
          <!-- Tu selección -->
          <div class="selection-summary">
            <h3>Tu selección</h3>
            <span class="selection-count">{{ selectedNumbers.length }} seleccionados</span>

            <div class="selected-numbers">
              <span v-for="number in selectedNumbers" :key="number" class="selected-number-tag">
                #{{ number.toString().padStart(2, '0') }}
                <button @click="removeNumber(number)" class="remove-btn">×</button>
              </span>
            </div>
          </div>

          <!-- Total a pagar -->
          <div class="payment-summary">
            <h3>Total a pagar</h3>
            <div class="total-amount">${{ (selectedNumbers.length * 5000).toLocaleString() }} COP</div>
          </div>

          <!-- Formulario de datos del comprador -->
          <div class="user-form">
            <h4>Datos del comprador</h4>
            <input v-model="userForm.name" type="text" placeholder="Nombre completo *" class="form-input" required />
            <input v-model="userForm.email" type="email" placeholder="Email *" class="form-input" required />
            <input v-model="userForm.identificationNumber" type="text" placeholder="Número de identificación *"
              class="form-input" required />
            <p class="required-note">* Campos obligatorios</p>
          </div>

          <!-- Botones de pago -->
          <div class="payment-buttons">
            <button class="payment-btn mercadopago-payment" :disabled="!isFormValid || selectedNumbers.length === 0"
              @click="payWithMercadoPago">
              💳 Pagar con MercadoPago
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay de carga -->
    <div v-if="isProcessingPayment" class="payment-loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>Procesando pago...</h3>
        <p>Redirigiendo a MercadoPago</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted } from 'vue'
import { usePayments } from '@/composables/usePayments'
import { useNumbersAvailability } from '@/composables/useNumbersAvailability'

// Definir emits
interface Emits {
  (e: 'showRules'): void
}

const emit = defineEmits<Emits>()

// Payment composable
const { createPayment } = usePayments()

// Form refs
const userForm = ref({
  name: '',
  email: '',
  identificationType: 'CC',
  identificationNumber: ''
})

// Usar el composable de disponibilidad de números
const {
  takenNumbers,
  isNumberAvailableSync,
  isNumberReserved,
  getAvailableNumbersArraySync,
  reserveNumbers,
  confirmPayment,
  getReservationTimeLeft,
  clearAll,
  refreshTakenNumbers
} = useNumbersAvailability()

// Estado de números seleccionados localmente
const selectedNumbers = ref<number[]>([])

// Estado de paginación
const currentPage = ref<number>(1)
const numbersPerPage = 100
const totalNumbers = 5000

// Estado de búsqueda
const searchNumber = ref<string>('')

// Estado de reserva actual
const reservationExpiry = ref<number>(0)

// Estado de carga para el pago
const isProcessingPayment = ref<boolean>(false)

// Refrescar datos al cargar el componente
onMounted(async () => {
  console.log('🔄 Cargando datos de wallpapers desde API...')
  await refreshTakenNumbers()
  console.log('✅ Datos de wallpapers actualizados')
})

// Función para alternar selección de número
const toggleNumber = (number: number) => {
  if (takenNumbers.value.includes(number) || isNumberReserved(number)) return

  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    // Permitir múltiples selecciones
    selectedNumbers.value.push(number)
  }
}

// Función para remover número específico
const removeNumber = (number: number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  }
}

// Función para seleccionar números aleatorios
const selectRandomNumbers = (count: number = 3) => {
  // Usar el composable para obtener números disponibles (versión síncrona)
  const availableNumbers = getAvailableNumbersArraySync()

  // Seleccionar la cantidad especificada de números aleatorios
  const maxSelectable = Math.min(count, availableNumbers.length)
  for (let i = 0; i < maxSelectable; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const randomNumber = availableNumbers[randomIndex]

    if (!selectedNumbers.value.includes(randomNumber)) {
      selectedNumbers.value.push(randomNumber)
    }

    availableNumbers.splice(randomIndex, 1)
  }
}

// Funciones de paginación
const totalPages = computed(() => Math.ceil(totalNumbers / numbersPerPage))

const currentPageNumbers = computed(() => {
  const startNumber = (currentPage.value - 1) * numbersPerPage + 1
  const endNumber = Math.min(currentPage.value * numbersPerPage, totalNumbers)
  const numbers = []
  for (let i = startNumber; i <= endNumber; i++) {
    numbers.push(i)
  }
  return numbers
})

const firstNumberInPage = computed(() => (currentPage.value - 1) * numbersPerPage + 1)
const lastNumberInPage = computed(() => Math.min(currentPage.value * numbersPerPage, totalNumbers))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Función para buscar un número específico
const goToNumber = () => {
  const number = parseInt(searchNumber.value)
  if (number >= 1 && number <= totalNumbers) {
    // Calcular en qué página está el número
    const targetPage = Math.ceil(number / numbersPerPage)
    currentPage.value = targetPage

    // Seleccionar el número automáticamente si no está tomado o reservado
    if (!takenNumbers.value.includes(number) && !isNumberReserved(number)) {
      if (!selectedNumbers.value.includes(number)) {
        selectedNumbers.value.push(number)
      }
    }

    // Limpiar el campo de búsqueda
    searchNumber.value = ''

    // Resaltar el número encontrado por menos tiempo (500ms)
    setTimeout(() => {
      const button = document.querySelector(`button[data-number="${number}"]`) as HTMLElement
      if (button) {
        // Scroll al número
        button.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Guardar estilos originales
        const originalTransform = button.style.transform
        const originalBoxShadow = button.style.boxShadow
        const originalBorder = button.style.borderColor
        const originalBackground = button.style.background

        // Aplicar resaltado dorado más sutil
        button.style.transform = 'scale(1.2)'
        button.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.8), 0 0 40px rgba(255, 193, 7, 0.5)'
        button.style.borderColor = '#ffc107'
        button.style.background = 'linear-gradient(135deg, #ffc107, #ff8f00)'
        button.style.transition = 'all 0.2s ease'

        // Restaurar estilos después de 500ms
        setTimeout(() => {
          button.style.transform = originalTransform
          button.style.boxShadow = originalBoxShadow
          button.style.borderColor = originalBorder
          button.style.background = originalBackground
          button.style.transition = 'all 0.3s ease'
        }, 300)
      }
    }, 200)
  } else {
    alert('Número no válido. Ingresa un número entre 1 y 5000.')
  }
}

// Función para limpiar selección
const clearSelection = () => {
  selectedNumbers.value = []
}

// Función para limpiar todo
const clearAllNumbers = () => {
  clearAll()
  selectedNumbers.value = []
  reservationExpiry.value = 0
}

// Función para formatear tiempo restante
const formatTimeLeft = (timeLeft: number) => {
  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Computed properties
const totalAmount = computed(() => {
  return selectedNumbers.value.length * 5000
})

const isFormValid = computed(() => {
  return userForm.value.name.trim() !== '' &&
    userForm.value.email.trim() !== '' &&
    userForm.value.identificationNumber.trim() !== ''
})

// Payment methods
const payWithMercadoPago = async () => {
  if (selectedNumbers.value.length > 0 && isFormValid.value) {
    try {
      // Activar loading
      isProcessingPayment.value = true

      const { createPayment } = usePayments()

      // Enviar todos los números seleccionados como array
      const paymentData = {
        wallpaperNumbers: selectedNumbers.value,
        buyerEmail: userForm.value.email,
        buyerName: userForm.value.name,
        buyerIdentificationNumber: userForm.value.identificationNumber,
        amount: totalAmount.value
      }

      const response = await createPayment(paymentData)

      if (response?.payment?.paymentUrl) {
        // Redirect to MercadoPago
        window.open(response.payment.paymentUrl, '_blank')

        // Clear selection after successful initiation
        selectedNumbers.value = []
        userForm.value = {
          name: '',
          email: '',
          identificationType: 'CC',
          identificationNumber: ''
        }
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Error al procesar el pago. Intenta nuevamente.')
    } finally {
      // Desactivar loading después de 2 segundos para dar tiempo al redirect
      setTimeout(() => {
        isProcessingPayment.value = false
      }, 2000)
    }
  } else if (selectedNumbers.value.length === 0) {
    alert('Selecciona al menos un wallpaper para pagar')
  } else {
    alert('Completa todos los campos requeridos')
  }
}
</script>

<style scoped>
.number-selection-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  padding: 4rem 0;
  position: relative;
}

.selection-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.selection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.selection-header h2 {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.selection-header p {
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
}

/* Sección ¿Cómo funciona? */
.how-it-works-section {
  margin-bottom: 3rem;
  text-align: center;
}

.how-it-works-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.step-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  transition: all 0.3s ease;
  text-align: center;
}

.step-card:hover {
  transform: translateY(-5px);
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 10px 30px rgba(96, 165, 250, 0.2);
}

.step-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
  font-size: 1.8rem;
  line-height: 1;
}

.step-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.step-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.8rem;
}

.step-content p {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
}

.selection-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

/* Panel de números */
.numbers-panel {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.control-buttons {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.random-btn {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.random-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.clear-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.8rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.numbers-grid::-webkit-scrollbar {
  width: 6px;
}

.numbers-grid::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}

.numbers-grid::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.5);
  border-radius: 3px;
}

.number-btn {
  aspect-ratio: 1;
  border: 2px solid rgba(96, 165, 250, 0.3);
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.number-btn:hover:not(:disabled) {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
  transform: translateY(-2px);
}

.number-btn.selected {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  transform: scale(1.05);
  font-weight: 700;
}

.number-btn.selected:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.selected-check {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 255, 255, 0.9);
  color: #059669;
  font-size: 0.7rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.number-btn.taken {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  cursor: not-allowed;
  opacity: 0.5;
}

.number-btn.reserved {
  background: rgba(249, 115, 22, 0.2);
  border-color: rgba(249, 115, 22, 0.5);
  color: #fb923c;
  cursor: not-allowed;
  position: relative;
  animation: reservedPulse 2s ease-in-out infinite;
}

.reservation-timer {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  background: rgba(249, 115, 22, 0.9);
  color: white;
  padding: 1px 4px;
  border-radius: 4px;
  white-space: nowrap;
}

@keyframes reservedPulse {

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.9;
  }
}

@keyframes highlightFound {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  }
  20% {
    transform: scale(1.2);
    box-shadow: 0 8px 30px rgba(255, 193, 7, 0.8);
    border-color: #ffc107;
    background: linear-gradient(135deg, #ffc107, #ff8f00);
  }
  50% {
    transform: scale(1.25);
    box-shadow: 0 12px 40px rgba(255, 193, 7, 1);
    border-color: #ffc107;
    background: linear-gradient(135deg, #ffc107, #ff8f00);
  }
  80% {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(255, 193, 7, 0.6);
    border-color: #ffc107;
    background: linear-gradient(135deg, #ffc107, #ff8f00);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  }
}

/* Buscador de números */
.number-search {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
}

.search-input-container {
  display: flex;
  gap: 0.8rem;
  max-width: 400px;
  margin: 0;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  background: rgba(51, 65, 85, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(51, 65, 85, 0.6);
}

/* Controles de paginación */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
}

.pagination-btn {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(51, 65, 85, 0.6);
}

.page-info {
  text-align: center;
  color: #e2e8f0;
}

.page-info span {
  display: block;
  margin-bottom: 0.3rem;
}

.numbers-range {
  font-size: 0.8rem;
  color: #94a3b8;
}

.page-selector {
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.page-selector label {
  font-size: 0.85rem;
  color: #cbd5e1;
  font-weight: 600;
}

.page-select {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 6px;
  color: #e2e8f0;
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  max-height: 200px;
  overflow-y: auto;
}

.page-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1);
}

.page-select option {
  background: #334155;
  color: #e2e8f0;
  padding: 0.4rem;
}

/* Controles de limpieza */
.clean-controls {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(96, 165, 250, 0.1);
}

/* Controles de reserva */
.clear-all-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.clear-all-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

/* Panel lateral */
.sidebar-panel {
  background: rgba(30, 41, 59, 0.9);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  position: sticky;
  top: 2rem;
}

.selection-summary h3,
.payment-summary h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.selection-count {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.selected-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.selected-number-tag {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.total-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.payment-note {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.user-form {
  margin-bottom: 2rem;
}

.user-form h4 {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: rgba(96, 165, 250, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.required-note {
  color: #f59e0b;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin: 0.5rem 0 0 0;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  background: rgba(51, 65, 85, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(51, 65, 85, 0.8);
}

.form-input::placeholder {
  color: #94a3b8;
}

.payment-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.payment-btn {
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.payment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mercadopago-payment {
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  color: white;
  position: relative;
  overflow: hidden;
}

.mercadopago-payment:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.mercadopago-payment:hover:not(:disabled):before {
  left: 100%;
}

.mercadopago-payment:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 180, 216, 0.4);
}

.secondary-payment {
  background: rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.secondary-payment:hover:not(:disabled) {
  background: rgba(96, 165, 250, 0.1);
  border-color: #60a5fa;
}

.link-payment {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.link-payment:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.2);
}

/* Overlay de carga para pagos */
.payment-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 3rem 2rem;
  background: rgba(30, 41, 59, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(96, 165, 250, 0.3);
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem auto;
}

.loading-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.loading-content p {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: #60a5fa;
  border-radius: 50%;
  animation: loadingDots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .selection-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .sidebar-panel {
    position: static;
  }

  .numbers-grid {
    grid-template-columns: repeat(8, 1fr);
  }

  .steps-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .step-card:last-child {
    grid-column: 1 / -1;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .selection-header h2 {
    font-size: 2.5rem;
  }

  .numbers-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.6rem;
  }

  .control-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .control-buttons .clear-btn {
    grid-column: 1 / -1;
  }

  .sidebar-panel {
    padding: 1.5rem;
  }

  .how-it-works-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .step-card {
    padding: 1.5rem;
  }

  .step-card:last-child {
    grid-column: 1;
    max-width: none;
  }

  .step-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .step-icon svg {
    width: 24px;
    height: 24px;
  }

  .step-content h4 {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }

  .step-content p {
    font-size: 0.9rem;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .pagination-btn {
    width: 100%;
    max-width: 200px;
  }

  .search-input-container {
    flex-direction: column;
    max-width: 100%;
  }

  .search-btn {
    width: 100%;
  }

  .page-selector {
    flex-direction: column;
    gap: 0.3rem;
  }

  .reservation-controls {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
  }

  .reserve-btn,
  .clear-all-btn {
    width: 100%;
    max-width: 280px;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .selection-container {
    padding: 0 1rem;
  }

  .numbers-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .numbers-panel,
  .sidebar-panel {
    padding: 1rem;
  }

  .how-it-works-title {
    font-size: 1.5rem;
  }

  .steps-container {
    padding: 0 0.5rem;
    gap: 1rem;
  }

  .step-card {
    padding: 1.2rem 1rem;
  }

  .step-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .step-icon svg {
    width: 22px;
    height: 22px;
  }

  .reservation-timer {
    font-size: 0.5rem;
    bottom: -12px;
  }

  .reservation-controls {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }

  .reserve-btn,
  .clear-all-btn {
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
  }

  .pagination-controls {
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .pagination-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
