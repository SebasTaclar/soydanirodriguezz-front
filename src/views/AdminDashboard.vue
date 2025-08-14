<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- Header -->
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestión de compras de wallpapers NS200</p>
        <button @click="refreshData" :disabled="isLoadingPurchases || isRefreshingWallpapers" class="refresh-btn">
          <span v-if="isLoadingPurchases || isRefreshingWallpapers">🔄</span>
          <span v-else>↻</span>
          {{ isRefreshingWallpapers ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="error = null" class="close-error">×</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingPurchases && purchases.length === 0" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando compras...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Total Compras</h3>
              <p class="stat-number">{{ stats.totalPurchases }}</p>
            </div>
          </div>

          <div class="stat-card revenue">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>Ingresos Aprobados</h3>
              <p class="stat-number">${{ stats.totalRevenue.toLocaleString() }} COP</p>
            </div>
          </div>

          <div class="stat-card wallpapers">
            <div class="stat-icon">🖼️</div>
            <div class="stat-content">
              <h3>Wallpapers</h3>
              <p class="stat-number">{{ stats.totalWallpapersSold }}</p>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3>Pendientes</h3>
              <p class="stat-number">{{ stats.pendingPurchases }}</p>
            </div>
          </div>
        </div>

        <!-- Winner Selection Section -->
        <div class="winner-selection-section">
          <div class="winner-header">
            <h3>🎯 Selección del Número Ganador</h3>
            <p>Genera el número ganador de entre los wallpapers pagados/aprobados</p>
          </div>

          <div class="winner-stats">
            <div class="eligible-numbers">
              <span class="stat-label">Wallpapers Vendidos - Números Elegibles:</span>
              <span class="stat-value">{{ eligibleNumbers.length }}</span>
            </div>

          </div>

          <div class="winner-game-container">
            <div v-if="!isGameStarted && !winnerNumber" class="game-start">
              <button
                @click="startWinnerGame"
                :disabled="eligibleNumbers.length === 0 || isGameRunning"
                class="start-game-btn"
              >
                🎲 Iniciar Dinámica
              </button>
              <p class="game-hint">
                Se realizarán 5 intentos antes de revelar el ganador
                <br>
                <small v-if="eligibleNumbers.length < 5" class="warning-text">
                  ⚠️ Solo hay {{ eligibleNumbers.length }} números únicos - algunos números pueden repetirse
                </small>
                <small v-else class="success-text">
                  ✅ {{ eligibleNumbers.length }} números únicos disponibles
                </small>
              </p>
            </div>

            <div v-if="isGameStarted" class="game-active">
              <div class="attempts-container">
                <h4>Intentos: {{ currentAttempt }}/5</h4>
                <div class="attempts-display">
                  <div
                    v-for="(attempt, index) in attempts"
                    :key="index"
                    class="attempt-number"
                    :class="{
                      'current': index === currentAttempt - 1 && !isGameComplete,
                      'revealed': index < currentAttempt - 1 || isGameComplete,
                      'spinning': isShowingSpinEffect && index === currentAttempt - 1
                    }"
                  >
                    {{ isShowingSpinEffect && index === currentAttempt - 1 ? (spinningNumbers[index] || '?') : (attempt || '?') }}
                  </div>
                </div>
              </div>

              <div class="game-controls">
                <button
                  v-if="currentAttempt <= 5 && !isGameComplete"
                  @click="nextAttempt"
                  :disabled="isProcessingAttempt"
                  class="next-attempt-btn"
                >
                  {{ isProcessingAttempt ? '🎯 Generando...' : (currentAttempt === 5 ? '🏆 Revelar Ganador' : `🎯 Intento ${currentAttempt}`) }}
                </button>
              </div>

              <div v-if="isGameComplete && winnerNumber" class="winner-reveal">
                <div class="winner-announcement">
                  <h2>🎉 ¡NÚMERO GANADOR! 🎉</h2>
                  <div class="winner-number-display">
                    #{{ winnerNumber }}
                  </div>
                  <div v-if="winnerPurchase" class="winner-details">
                    <h4>Detalles del Ganador:</h4>
                    <p><strong>Cliente:</strong> {{ winnerPurchase.buyerName }}</p>
                    <p><strong>Email:</strong> {{ winnerPurchase.buyerEmail }}</p>
                    <p><strong>Fecha de Compra:</strong> {{ formatDate(winnerPurchase.createdAt) }}</p>
                  </div>
                </div>

                <button @click="resetGame" class="reset-game-btn">
                  🔄 Nueva Dinámica
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Filter -->
        <div class="filter-section">
          <div class="filter-header">
            <h3>Filtrar por Estado</h3>
            <button @click="refreshData" :disabled="isLoadingPurchases || isRefreshingWallpapers" class="refresh-btn"
              title="Refrescar datos">
              <span v-if="isRefreshingWallpapers">🔄</span>
              <span v-else>🔄</span>
              {{ isRefreshingWallpapers ? 'Actualizando...' : 'Refrescar' }}
            </button>
          </div>
          <div class="status-filters">
            <button @click="selectedStatus = 'ALL'" :class="['filter-btn', { active: selectedStatus === 'ALL' }]">
              Todos ({{ purchases.length }})
            </button>
            <button @click="selectedStatus = 'PENDING'"
              :class="['filter-btn', 'pending', { active: selectedStatus === 'PENDING' }]">
              Pendientes ({{ purchasesByStatus.PENDING.length }})
            </button>
            <button @click="selectedStatus = 'APPROVED'"
              :class="['filter-btn', 'approved', { active: selectedStatus === 'APPROVED' }]">
              Aprobadas ({{ purchasesByStatus.APPROVED.length }})
            </button>
            <button @click="selectedStatus = 'REJECTED'"
              :class="['filter-btn', 'rejected', { active: selectedStatus === 'REJECTED' }]">
              Rechazadas ({{ purchasesByStatus.REJECTED.length }})
            </button>
            <button @click="selectedStatus = 'CANCELLED'"
              :class="['filter-btn', 'cancelled', { active: selectedStatus === 'CANCELLED' }]">
              Canceladas ({{ purchasesByStatus.CANCELLED.length }})
            </button>
          </div>
        </div>

        <!-- Purchases Table -->
        <div class="purchases-section">
          <h3>Lista de Compras</h3>

          <div v-if="filteredPurchases.length === 0" class="no-purchases">
            <p>No hay compras {{ selectedStatus === 'ALL' ? '' : selectedStatus.toLowerCase() }} para mostrar.</p>
          </div>

          <div v-else class="purchases-table-container">
            <table class="purchases-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Contacto</th>
                  <th>Wallpapers</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="purchase in filteredPurchases" :key="purchase.id"
                  :class="`purchase-row ${purchase.status.toLowerCase()}`">
                  <td class="purchase-id">#{{ purchase.id }}</td>
                  <td class="buyer-name">{{ purchase.buyerName }}</td>
                  <td class="buyer-email">{{ purchase.buyerEmail }}</td>
                  <td class="buyer-contact">{{ purchase.buyerContactNumber || 'No proporcionado' }}</td>
                  <td class="wallpapers">
                    <div class="wallpaper-numbers">
                      <span v-for="number in purchase.wallpaperNumbers" :key="number" class="wallpaper-tag">
                        #{{ number }}
                      </span>
                    </div>
                    <small class="wallpaper-count">{{ purchase.wallpaperNumbers.length }} wallpaper(s)</small>
                  </td>
                  <td class="amount">${{ purchase.amount.toLocaleString() }} {{ purchase.currency }}</td>
                  <td class="status">
                    <span :class="`status-badge ${purchase.status.toLowerCase()}`">
                      {{ getStatusText(purchase.status) }}
                    </span>
                  </td>
                  <td class="date">{{ formatDate(purchase.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminPurchases } from '@/composables/useAdminPurchases'
import { useNumbersAvailability } from '@/composables/useNumbersAvailability'
import { authService } from '@/services/api/authService'
import { useRouter } from 'vue-router'

const router = useRouter()

// Verificar permisos de administrador
if (!authService.isAdmin()) {
  router.push('/')
}

// Admin purchases composable
const {
  isLoading: isLoadingPurchases,
  error,
  purchases,
  purchasesByStatus,
  stats,
  getAllPurchases
} = useAdminPurchases()

// Numbers availability composable
const {
  refreshTakenNumbers,
} = useNumbersAvailability()

// Estado local
const selectedStatus = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')
const isRefreshingWallpapers = ref(false)

// Winner game state
const isGameStarted = ref(false)
const currentAttempt = ref(0)
const attempts = ref<(number | null)[]>([null, null, null, null, null])
const winnerNumber = ref<number | null>(null)
const isGameComplete = ref(false)
const isGameRunning = ref(false)
const isProcessingAttempt = ref(false)
const isShowingSpinEffect = ref(false)
const spinningNumbers = ref<(number | null)[]>([null, null, null, null, null])

// Compras filtradas
const filteredPurchases = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return purchases.value
  }
  return purchasesByStatus.value[selectedStatus.value] || []
})

// Números elegibles para el sorteo (solo aprobados)
const eligibleNumbers = computed(() => {
  const approvedPurchases = purchasesByStatus.value.APPROVED || []
  const numbers: number[] = []

  approvedPurchases.forEach(purchase => {
    if (purchase.wallpaperNumbers && Array.isArray(purchase.wallpaperNumbers)) {
      numbers.push(...purchase.wallpaperNumbers)
    }
  })

  return Array.from(new Set(numbers)).sort((a, b) => a - b) // Remove duplicates and sort
})

// Encontrar la compra ganadora
const winnerPurchase = computed(() => {
  if (!winnerNumber.value) return null

  const approvedPurchases = purchasesByStatus.value.APPROVED || []
  return approvedPurchases.find(purchase =>
    purchase.wallpaperNumbers && purchase.wallpaperNumbers.includes(winnerNumber.value!)
  )
})

// Métodos
const refreshData = async () => {
  try {
    isRefreshingWallpapers.value = true

    // Refrescar compras y wallpapers en paralelo
    await Promise.all([
      getAllPurchases(),
      refreshTakenNumbers()
    ])

  } catch (error) {
    console.error('❌ Error actualizando datos:', error)
  } finally {
    isRefreshingWallpapers.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: string) => {
  const statusMap = {
    'PENDING': 'Pendiente',
    'APPROVED': 'Aprobada',
    'REJECTED': 'Rechazada',
    'CANCELLED': 'Cancelada'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// Winner game methods
const startWinnerGame = () => {
  if (eligibleNumbers.value.length === 0) return

  // Check if we have enough numbers for a complete game (at least 5 unique numbers recommended)
  if (eligibleNumbers.value.length < 5) {
    // Still allow the game but show a warning in console
    console.warn(`⚠️ Solo hay ${eligibleNumbers.value.length} números elegibles. Se pueden repetir números en los intentos.`)
  }

  isGameStarted.value = true
  isGameRunning.value = true
  currentAttempt.value = 0
  attempts.value = [null, null, null, null, null]
  winnerNumber.value = null
  isGameComplete.value = false
  isShowingSpinEffect.value = false
  spinningNumbers.value = [null, null, null, null, null]

  // Pre-select the winner number (will be revealed on 5th attempt)
  const randomIndex = Math.floor(Math.random() * eligibleNumbers.value.length)
  winnerNumber.value = eligibleNumbers.value[randomIndex]
}

const nextAttempt = async () => {
  if (currentAttempt.value >= 5 || isProcessingAttempt.value) return

  isProcessingAttempt.value = true
  currentAttempt.value++

  // Get numbers that have already been used in previous attempts
  const usedNumbers = attempts.value.filter(num => num !== null) as number[]

  // Start spinning effect
  isShowingSpinEffect.value = true

  // Spin numbers for dramatic effect (2 seconds)
  const spinDuration = 2000
  const spinInterval = 100
  const spinTimes = spinDuration / spinInterval

  // Create a pool of available numbers for spinning effect (excluding used ones and winner)
  const availableForSpinning = eligibleNumbers.value.filter(num =>
    num !== winnerNumber.value && !usedNumbers.includes(num)
  )

  for (let i = 0; i < spinTimes; i++) {
    // If we have available unique numbers, use them; otherwise use all eligible except winner
    const spinPool = availableForSpinning.length > 0 ? availableForSpinning :
                     eligibleNumbers.value.filter(num => num !== winnerNumber.value)

    if (spinPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * spinPool.length)
      spinningNumbers.value[currentAttempt.value - 1] = spinPool[randomIndex]
    }
    await new Promise(resolve => setTimeout(resolve, spinInterval))
  }

  // Stop spinning effect
  isShowingSpinEffect.value = false

  if (currentAttempt.value === 5) {
    // Reveal the winner on 5th attempt
    attempts.value[4] = winnerNumber.value
    isGameComplete.value = true
    isGameRunning.value = false
  } else {
    // Generate a random number from eligible numbers (excluding winner and previously used numbers)
    let randomNumber
    let availableNumbers = eligibleNumbers.value.filter(num =>
      num !== winnerNumber.value && !usedNumbers.includes(num)
    )

    // If we don't have enough unique numbers (excluding the winner),
    // allow previously used numbers but still exclude the winner
    if (availableNumbers.length === 0) {
      availableNumbers = eligibleNumbers.value.filter(num => num !== winnerNumber.value)
    }

    // Select a random number from available numbers
    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      randomNumber = availableNumbers[randomIndex]
    } else {
      // Fallback: use any eligible number except the winner
      do {
        const randomIndex = Math.floor(Math.random() * eligibleNumbers.value.length)
        randomNumber = eligibleNumbers.value[randomIndex]
      } while (randomNumber === winnerNumber.value && eligibleNumbers.value.length > 1)
    }

    attempts.value[currentAttempt.value - 1] = randomNumber
  }

  isProcessingAttempt.value = false
}

const resetGame = () => {
  isGameStarted.value = false
  currentAttempt.value = 0
  attempts.value = [null, null, null, null, null]
  winnerNumber.value = null
  isGameComplete.value = false
  isGameRunning.value = false
  isProcessingAttempt.value = false
  isShowingSpinEffect.value = false
  spinningNumbers.value = [null, null, null, null, null]
}

// Cargar datos al montar el componente
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
}

.refresh-btn {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message p {
  color: #ef4444;
  margin: 0;
}

.close-error {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #cbd5e1;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1.2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  min-height: auto;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.2);
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.stat-card.revenue .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.wallpapers .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.pending .stat-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.stat-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.3rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
}

/* Winner Selection Styles */
.winner-selection-section {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.winner-header {
  text-align: center;
  margin-bottom: 2rem;
}

.winner-header h3 {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.winner-header p {
  color: #cbd5e1;
  font-size: 1rem;
}

.winner-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  gap: 2rem;
}

.eligible-numbers,
.total-revenue {
  text-align: center;
  background: rgba(15, 23, 42, 0.4);
  padding: 1rem;
  border-radius: 12px;
  flex: 1;
}

.stat-label {
  display: block;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #60a5fa;
  font-size: 1.5rem;
  font-weight: 700;
}

.winner-game-container {
  text-align: center;
}

.game-start {
  padding: 2rem;
}

.start-game-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.start-game-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.start-game-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none;
}

.game-hint {
  color: #94a3b8;
  font-style: italic;
}

.warning-text {
  color: #f59e0b;
  font-weight: 600;
}

.success-text {
  color: #10b981;
  font-weight: 600;
}

.game-active {
  padding: 2rem;
}

.attempts-container h4 {
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.attempts-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.attempt-number {
  width: 80px;
  height: 80px;
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.attempt-number.current {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  animation: pulse 2s infinite;
}

.attempt-number.revealed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  color: #ffffff;
}

.attempt-number.spinning {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.2);
  color: #ffffff;
  animation: spin-effect 0.1s linear infinite;
  transform-origin: center;
}

@keyframes spin-effect {
  0% {
    transform: rotateY(0deg) scale(1);
    background: rgba(245, 158, 11, 0.2);
  }
  25% {
    transform: rotateY(90deg) scale(1.1);
    background: rgba(239, 68, 68, 0.2);
  }
  50% {
    transform: rotateY(180deg) scale(1);
    background: rgba(139, 92, 246, 0.2);
  }
  75% {
    transform: rotateY(270deg) scale(1.1);
    background: rgba(34, 197, 94, 0.2);
  }
  100% {
    transform: rotateY(360deg) scale(1);
    background: rgba(245, 158, 11, 0.2);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.next-attempt-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-attempt-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.next-attempt-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.winner-reveal {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.winner-announcement h2 {
  color: #10b981;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.winner-number-display {
  font-size: 4rem;
  font-weight: 900;
  color: #ffffff;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 20px;
  padding: 1rem 2rem;
  margin: 1rem 0;
  display: inline-block;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
  to { box-shadow: 0 0 30px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6); }
}

.winner-details {
  margin-top: 2rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.winner-details h4 {
  color: #60a5fa;
  margin-bottom: 1rem;
}

.winner-details p {
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.reset-game-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.reset-game-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.filter-section {
  margin-bottom: 3rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-section h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.refresh-btn {
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857, #065f46);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn span {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.status-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.8rem 1.2rem;
  border: 2px solid rgba(96, 165, 250, 0.3);
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.filter-btn.active {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-color: #60a5fa;
  color: white;
}

.filter-btn.pending.active {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-color: #f97316;
}

.filter-btn.approved.active {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

.filter-btn.rejected.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #ef4444;
}

.filter-btn.cancelled.active {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  border-color: #6b7280;
}

.purchases-section h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.no-purchases {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
}

.purchases-table-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.purchases-table {
  width: 100%;
  border-collapse: collapse;
}

.purchases-table th {
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-weight: 700;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  font-size: 0.9rem;
}

.purchases-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.1);
  color: #cbd5e1;
  vertical-align: top;
}

.purchase-row:hover {
  background: rgba(96, 165, 250, 0.05);
}

.purchase-id {
  font-weight: 700;
  color: #60a5fa;
}

.buyer-name {
  font-weight: 600;
  color: #ffffff;
}

.buyer-email {
  font-size: 0.9rem;
  color: #94a3b8;
}

.buyer-contact {
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
}

.wallpapers {
  max-width: 400px;
}

.wallpaper-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.wallpaper-tag {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.wallpaper-count {
  color: #94a3b8;
  font-size: 0.8rem;
}

.amount {
  font-weight: 700;
  color: #10b981;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.status-badge.approved {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-badge.cancelled {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.date {
  font-size: 0.9rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .purchases-table-container {
    overflow-x: auto;
  }

  .purchases-table {
    min-width: 800px;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1rem;
  }

  .winner-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .attempts-display {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .attempt-number {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }

  .winner-number-display {
    font-size: 3rem;
    padding: 0.8rem 1.5rem;
  }

  .winner-selection-section {
    padding: 1.5rem;
  }


  .dashboard-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .status-filters {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .attempts-display {
    gap: 0.5rem;
  }

  .attempt-number {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .winner-number-display {
    font-size: 2.5rem;
    padding: 0.6rem 1rem;
  }

  .start-game-btn,
  .next-attempt-btn,
  .reset-game-btn {
    width: 100%;
    padding: 1rem;
  }

  .winner-header h3 {
    font-size: 1.5rem;
  }
}
</style>
