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
            <div class="step-icon">💳</div>
            <div class="step-content">
              <h4>2. Realiza el pago</h4>
              <p>Paga de forma segura con MercadoPago.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-icon">📱</div>
            <div class="step-content">
              <h4>3. Descarga inmediata</h4>
              <p>Recibe tus wallpapers en alta calidad 4K.</p>
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

          <!-- Grid de números -->
          <div class="numbers-grid">
            <button v-for="number in 200" :key="number" :class="[
              'number-btn',
              {
                'selected': selectedNumbers.includes(number),
                'taken': takenNumbers.includes(number),
                'reserved': isNumberReserved(number)
              }
            ]" @click="toggleNumber(number)" :disabled="takenNumbers.includes(number) || isNumberReserved(number)">
              {{ number.toString().padStart(2, '0') }}
              <span v-if="isNumberReserved(number)" class="reservation-timer">
                {{ formatTimeLeft(getReservationTimeLeft(number)) }}
              </span>
            </button>
          </div>

          <!-- Controles de reserva -->
          <div class="reservation-controls">
            <button class="control-btn reserve-btn" :disabled="selectedNumbers.length === 0"
              @click="reserveSelectedNumbers">
              ⏱️ Reservar números (5 min)
            </button>
            <button class="control-btn clear-all-btn" @click="clearAllNumbers">
              🧹 Limpiar todo
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
            <p class="payment-note">Cada wallpaper NS200 en alta calidad 4K.</p>
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
            <button class="payment-btn primary-payment" :disabled="!isFormValid || selectedNumbers.length === 0"
              @click="payWithPayPal">
              Pagar con PayPal (demo)
            </button>
          </div>

          <!-- Sorteo seguro -->
          <div class="security-section">
            <div class="security-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
            </div>
            <div class="security-content">
              <h4>Sorteo seguro</h4>
              <p>Revisa las reglas y condiciones del sorteo.</p>
              <button class="rules-btn" @click="showRules">Ver reglas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits } from 'vue'
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


  isNumberReserved,
  getAvailableNumbersArray,
  reserveNumbers,
  confirmPayment,
  getReservationTimeLeft,
  clearAll,

} = useNumbersAvailability()

// Estado de números seleccionados localmente
const selectedNumbers = ref<number[]>([])

// Estado de reserva actual
const reservationExpiry = ref<number>(0)

// Función para alternar selección de número
const toggleNumber = (number: number) => {
  if (takenNumbers.value.includes(number) || isNumberReserved(number)) return

  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    // Allow only one wallpaper selection for now
    selectedNumbers.value = [number]
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
const selectRandomNumbers = (count: number = 1) => {
  selectedNumbers.value = []

  // Usar el composable para obtener números disponibles
  const availableNumbers = getAvailableNumbersArray()

  // Seleccionar un wallpaper aleatorio
  if (availableNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    selectedNumbers.value.push(availableNumbers[randomIndex])
  }
}

// Función para limpiar selección
const clearSelection = () => {
  selectedNumbers.value = []
}

// Función para reservar números seleccionados
const reserveSelectedNumbers = () => {
  if (selectedNumbers.value.length > 0) {
    const expiresAt = reserveNumbers(selectedNumbers.value, userForm.value.name)
    reservationExpiry.value = expiresAt

    alert(`🔒 ${selectedNumbers.value.length} números reservados por 5 minutos. ¡Completa el pago antes de que expire!`)
    selectedNumbers.value = [] // Limpiar selección después de reservar
  }
}

// Función para limpiar todo
const clearAllNumbers = () => {
  clearAll()
  selectedNumbers.value = []
  reservationExpiry.value = 0
  alert('🧹 Todos los números han sido liberados')
}

// Función para formatear tiempo restante
const formatTimeLeft = (timeLeft: number) => {
  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Computed properties
const totalAmount = computed(() => {
  return selectedNumbers.value.length > 0 ? 5000 : 0
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
      const { createPayment } = usePayments()

      // For now, handle one wallpaper at a time
      // TODO: Update backend to handle multiple wallpapers in one transaction
      const wallpaperNumber = selectedNumbers.value[0]

      const paymentData = {
        wallpaperNumber: wallpaperNumber,
        buyerEmail: userForm.value.email,
        buyerName: userForm.value.name,
        buyerIdentificationNumber: userForm.value.identificationNumber
      }

      const response = await createPayment(paymentData)

      if (response?.payment?.paymentUrl) {
        // Redirect to MercadoPago
        window.open(response.payment.paymentUrl, '_blank')

        // Show success message
        alert(`✅ Redirigiendo a MercadoPago para completar el pago del wallpaper #${wallpaperNumber} por $${(5000).toLocaleString()} COP`)

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
    }
  } else if (selectedNumbers.value.length === 0) {
    alert('Selecciona al menos un wallpaper para pagar')
  } else {
    alert('Completa todos los campos requeridos')
  }
}

// Funciones de pago (demo) - ahora confirman la reserva
const payWithPayPal = () => {
  if (selectedNumbers.value.length > 0) {
    // Confirmar pago de números seleccionados
    confirmPayment(selectedNumbers.value)

    alert(`Demo: Pago con PayPal completado. Se compraron ${selectedNumbers.value.length} números.`)
    selectedNumbers.value = [] // Limpiar selección después del "pago"
  } else {
    alert('Demo: Selecciona al menos un número para pagar')
  }
}

const payWithTransfer = () => {
  if (selectedNumbers.value.length > 0) {
    // Confirmar pago de números seleccionados
    confirmPayment(selectedNumbers.value)

    alert(`Demo: Pago por transferencia procesado. Se compraron ${selectedNumbers.value.length} números.`)
    selectedNumbers.value = [] // Limpiar selección después del "pago"
  } else {
    alert('Demo: Selecciona al menos un número para pagar')
  }
}

const generatePaymentLink = () => {
  if (selectedNumbers.value.length > 0) {
    // Confirmar pago de números seleccionados
    confirmPayment(selectedNumbers.value)

    alert(`Demo: Link de pago generado y procesado. Se compraron ${selectedNumbers.value.length} números.`)
    selectedNumbers.value = [] // Limpiar selección después del "pago"
  } else {
    alert('Demo: Selecciona al menos un número para generar el link')
  }
}

const showRules = () => {
  emit('showRules')
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
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
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

/* Controles de reserva */
.reservation-controls {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  justify-content: center;
}

.reserve-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.reserve-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.reserve-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

.primary-payment {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.primary-payment:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
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

.security-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.security-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.security-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.security-content h4 {
  color: #10b981;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.security-content p {
  color: #94a3b8;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0 0 0.8rem 0;
}

.rules-btn {
  background: none;
  border: none;
  color: #10b981;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.rules-btn:hover {
  color: #059669;
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
}
</style>
