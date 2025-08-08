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

        <!-- Status Filter -->
        <div class="filter-section">
          <div class="filter-header">
            <h3>Filtrar por Estado</h3>
            <button
              @click="refreshData"
              :disabled="isLoadingPurchases || isRefreshingWallpapers"
              class="refresh-btn"
              title="Refrescar datos"
            >
              <span v-if="isRefreshingWallpapers">🔄</span>
              <span v-else>🔄</span>
              {{ isRefreshingWallpapers ? 'Actualizando...' : 'Refrescar' }}
            </button>
          </div>
          <div class="status-filters">
            <button
              @click="selectedStatus = 'ALL'"
              :class="['filter-btn', { active: selectedStatus === 'ALL' }]"
            >
              Todos ({{ purchases.length }})
            </button>
            <button
              @click="selectedStatus = 'PENDING'"
              :class="['filter-btn', 'pending', { active: selectedStatus === 'PENDING' }]"
            >
              Pendientes ({{ purchasesByStatus.PENDING.length }})
            </button>
            <button
              @click="selectedStatus = 'APPROVED'"
              :class="['filter-btn', 'approved', { active: selectedStatus === 'APPROVED' }]"
            >
              Aprobadas ({{ purchasesByStatus.APPROVED.length }})
            </button>
            <button
              @click="selectedStatus = 'REJECTED'"
              :class="['filter-btn', 'rejected', { active: selectedStatus === 'REJECTED' }]"
            >
              Rechazadas ({{ purchasesByStatus.REJECTED.length }})
            </button>
            <button
              @click="selectedStatus = 'CANCELLED'"
              :class="['filter-btn', 'cancelled', { active: selectedStatus === 'CANCELLED' }]"
            >
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
                  <th>Wallpapers</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="purchase in filteredPurchases" :key="purchase.id" :class="`purchase-row ${purchase.status.toLowerCase()}`">
                  <td class="purchase-id">#{{ purchase.id }}</td>
                  <td class="buyer-name">{{ purchase.buyerName }}</td>
                  <td class="buyer-email">{{ purchase.buyerEmail }}</td>
                  <td class="wallpapers">
                    <div class="wallpaper-numbers">
                      <span
                        v-for="number in purchase.wallpaperNumbers"
                        :key="number"
                        class="wallpaper-tag"
                      >
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
  isLoadingWallpapers
} = useNumbersAvailability()

// Estado local
const selectedStatus = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')
const isRefreshingWallpapers = ref(false)

// Compras filtradas
const filteredPurchases = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return purchases.value
  }
  return purchasesByStatus.value[selectedStatus.value] || []
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

    console.log('✅ Datos actualizados: compras y wallpapers')
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

// Cargar datos al montar el componente
onMounted(async () => {
  console.log('📊 Cargando dashboard admin...')
  await refreshData()
  console.log('✅ Dashboard admin cargado')
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
  space-y: 3rem;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.wallpapers {
  max-width: 200px;
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
}
</style>
