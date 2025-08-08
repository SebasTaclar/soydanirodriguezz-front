import { ref, computed, watch } from 'vue'
import { wallpaperService } from '@/services/api'

// Tipos para las reservas
interface ReservedNumber {
  number: number
  reservedAt: number
  expiresAt: number
  customerName?: string
  status: 'reserved' | 'paid'
}

// Estado global para los números
const totalNumbers = ref(200)
const takenNumbers = ref<number[]>([]) // Números pagados/confirmados (API data)
const reservedNumbers = ref<ReservedNumber[]>([]) // Números reservados temporalmente (local)
const selectedNumbers = ref<number[]>([]) // Números seleccionados actualmente
const isLoadingWallpapers = ref(false) // Estado de carga de datos de API

// Constante para tiempo de reserva (5 minutos)
const RESERVATION_TIME = 5 * 60 * 1000 // 5 minutos en millisegundos

// Cargar datos de números tomados desde la API
const loadTakenNumbersFromAPI = async () => {
  try {
    isLoadingWallpapers.value = true
    const unavailableNumbers = await wallpaperService.getUnavailableNumbers()
    takenNumbers.value = unavailableNumbers

    console.log('📡 Números tomados cargados desde API:', {
      count: unavailableNumbers.length,
      numbers: unavailableNumbers.slice(0, 10), // Solo mostrar primeros 10
    })
  } catch (error) {
    console.error('❌ Error cargando números desde API:', error)
    // Fallback a datos locales si la API falla
    const storedTaken = localStorage.getItem('rifa-taken-numbers')
    if (storedTaken) {
      takenNumbers.value = JSON.parse(storedTaken)
    }
  } finally {
    isLoadingWallpapers.value = false
  }
}

// Inicializar desde localStorage para reservas (solo reservas son locales)
const initializeFromStorage = () => {
  try {
    const storedReserved = localStorage.getItem('rifa-reserved-numbers')

    if (storedReserved) {
      reservedNumbers.value = JSON.parse(storedReserved)
      // Limpiar reservas expiradas al cargar
      cleanExpiredReservations()
    }

    console.log('📦 Reservas locales cargadas:', {
      reserved: reservedNumbers.value.length,
    })
  } catch (error) {
    console.error('Error cargando reservas desde localStorage:', error)
  }
}

// Limpiar reservas expiradas
const cleanExpiredReservations = () => {
  const now = Date.now()
  const initialCount = reservedNumbers.value.length

  reservedNumbers.value = reservedNumbers.value.filter((reservation) => {
    if (reservation.expiresAt > now) {
      return true
    } else {
      console.log(`⏰ Reserva expirada liberada: número ${reservation.number}`)
      return false
    }
  })

  const expiredCount = initialCount - reservedNumbers.value.length
  if (expiredCount > 0) {
    console.log(`🔄 Se liberaron ${expiredCount} números por expiración`)
  }
}

// Watchers para persistir solo las reservas en localStorage (números tomados vienen de la API)
watch(
  reservedNumbers,
  (newReservations) => {
    localStorage.setItem('rifa-reserved-numbers', JSON.stringify(newReservations))
  },
  { deep: true },
)

// Limpiar reservas expiradas cada 30 segundos
setInterval(cleanExpiredReservations, 30000)

// Función para refrescar datos desde la API
const refreshTakenNumbers = async () => {
  await loadTakenNumbersFromAPI()
}

// Composable para compartir el estado de disponibilidad de números
export function useNumbersAvailability() {
  // Inicializar solo una vez
  if (takenNumbers.value.length === 0 && reservedNumbers.value.length === 0) {
    initializeFromStorage()
    // Cargar números tomados desde la API
    loadTakenNumbersFromAPI()
  }

  // Computed para números disponibles (no tomados ni reservados)
  const availableNumbers = computed(() => {
    const taken = takenNumbers.value
    const reserved = reservedNumbers.value.map((r) => r.number)
    const unavailable = [...taken, ...reserved]
    return totalNumbers.value - unavailable.length
  })

  // Computed para el texto de disponibilidad
  const availabilityText = computed(() => {
    return `${availableNumbers.value} de ${totalNumbers.value}`
  })

  // Computed para obtener números reservados activos
  const activeReservations = computed(() => {
    cleanExpiredReservations()
    return reservedNumbers.value
  })

  // Función para reservar números temporalmente (usando verificación síncrona)
  const reserveNumbers = (numbers: number[], customerName: string = '') => {
    const now = Date.now()
    const expiresAt = now + RESERVATION_TIME

    numbers.forEach((number) => {
      // Verificar que el número esté disponible (usando datos actuales para performance)
      if (isNumberAvailableSync(number)) {
        reservedNumbers.value.push({
          number,
          reservedAt: now,
          expiresAt,
          customerName,
          status: 'reserved',
        })
      }
    })

    console.log(`⏱️ ${numbers.length} números reservados por 5 minutos`)
    return expiresAt
  }

  // Función para confirmar pago de números reservados
  const confirmPayment = (numbers: number[]) => {
    numbers.forEach((number) => {
      // Mover de reservado a tomado
      const reservationIndex = reservedNumbers.value.findIndex((r) => r.number === number)
      if (reservationIndex > -1) {
        reservedNumbers.value.splice(reservationIndex, 1)
        if (!takenNumbers.value.includes(number)) {
          takenNumbers.value.push(number)
        }
      }
    })

    console.log(`✅ Pago confirmado para ${numbers.length} números`)
  }

  // Función para liberar reservas específicas
  const releaseReservations = (numbers: number[]) => {
    numbers.forEach((number) => {
      const index = reservedNumbers.value.findIndex((r) => r.number === number)
      if (index > -1) {
        reservedNumbers.value.splice(index, 1)
      }
    })
  }

  // Función para verificar si un número está disponible (usando API + reservas locales)
  const isNumberAvailable = async (number: number) => {
    try {
      // Verificar primero en la API si está disponible
      const isAvailableInAPI = await wallpaperService.isNumberAvailable(number)

      // Si no está disponible en la API, no está disponible
      if (!isAvailableInAPI) {
        return false
      }

      // Si está disponible en la API, verificar reservas locales
      const isReserved = reservedNumbers.value.some((r) => r.number === number)
      return !isReserved
    } catch (error) {
      console.error('Error verificando disponibilidad:', error)
      // Fallback: usar datos locales
      const isTaken = takenNumbers.value.includes(number)
      const isReserved = reservedNumbers.value.some((r) => r.number === number)
      return !isTaken && !isReserved
    }
  }

  // Función síncrona para verificar disponibilidad con datos actuales
  const isNumberAvailableSync = (number: number) => {
    const isTaken = takenNumbers.value.includes(number)
    const isReserved = reservedNumbers.value.some((r) => r.number === number)
    return !isTaken && !isReserved
  }

  // Función para verificar si un número está reservado
  const isNumberReserved = (number: number) => {
    return reservedNumbers.value.some((r) => r.number === number)
  }

  // Función para obtener números disponibles como array (usando API)
  const getAvailableNumbersArray = async () => {
    try {
      // Refrescar datos desde la API
      await refreshTakenNumbers()

      // Usar el método del servicio que devuelve un rango de números disponibles
      const available = await wallpaperService.getAvailableNumbersInRange(1, totalNumbers.value)

      // Filtrar números reservados localmente
      return available.filter((number) => !isNumberReserved(number))
    } catch (error) {
      console.error('Error obteniendo números disponibles:', error)
      // Fallback: usar datos actuales
      const available = []
      for (let i = 1; i <= totalNumbers.value; i++) {
        if (isNumberAvailableSync(i)) {
          available.push(i)
        }
      }
      return available
    }
  }

  // Función síncrona para obtener números disponibles con datos actuales
  const getAvailableNumbersArraySync = () => {
    const available = []
    for (let i = 1; i <= totalNumbers.value; i++) {
      if (isNumberAvailableSync(i)) {
        available.push(i)
      }
    }
    return available
  }

  // Función para obtener tiempo restante de una reserva
  const getReservationTimeLeft = (number: number) => {
    const reservation = reservedNumbers.value.find((r) => r.number === number)
    if (!reservation) return 0

    const timeLeft = reservation.expiresAt - Date.now()
    return Math.max(0, timeLeft)
  }

  // Función para limpiar todo (útil para demo) - mantener solo reservas locales
  const clearAll = () => {
    reservedNumbers.value = []
    selectedNumbers.value = []
    localStorage.removeItem('rifa-reserved-numbers')
    console.log('🧹 Todas las reservas locales han sido liberadas')
    // Refrescar datos de la API
    refreshTakenNumbers()
  }

  // Función para resetear a estado inicial - solo refrescar desde API
  const resetToInitial = async () => {
    reservedNumbers.value = []
    selectedNumbers.value = []
    await refreshTakenNumbers()
    console.log('🔄 Estado reiniciado - datos actualizados desde API')
  }

  return {
    // Estado
    totalNumbers,
    takenNumbers,
    reservedNumbers,
    selectedNumbers,
    isLoadingWallpapers,

    // Computed
    availableNumbers,
    availabilityText,
    activeReservations,

    // Métodos principales
    reserveNumbers,
    confirmPayment,
    releaseReservations,
    isNumberAvailable, // Async - usa API
    isNumberAvailableSync, // Sync - usa datos actuales
    isNumberReserved,
    getAvailableNumbersArray, // Async - usa API
    getAvailableNumbersArraySync, // Sync - usa datos actuales
    getReservationTimeLeft,

    // Métodos de API
    refreshTakenNumbers,
    loadTakenNumbersFromAPI,

    // Métodos de gestión
    cleanExpiredReservations,
    clearAll,
    resetToInitial,
  }
}
