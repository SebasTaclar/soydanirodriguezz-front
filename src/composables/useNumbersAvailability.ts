import { ref, computed, watch } from 'vue'

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
const takenNumbers = ref<number[]>([]) // Números pagados/confirmados
const reservedNumbers = ref<ReservedNumber[]>([]) // Números reservados temporalmente
const selectedNumbers = ref<number[]>([]) // Números seleccionados actualmente

// Constante para tiempo de reserva (5 minutos)
const RESERVATION_TIME = 5 * 60 * 1000 // 5 minutos en millisegundos

// Inicializar desde localStorage
const initializeFromStorage = () => {
  try {
    const storedTaken = localStorage.getItem('rifa-taken-numbers')
    const storedReserved = localStorage.getItem('rifa-reserved-numbers')

    if (storedTaken) {
      takenNumbers.value = JSON.parse(storedTaken)
    } else {
      // Números iniciales de ejemplo
      takenNumbers.value = [14, 27, 33, 45, 78, 99, 123, 156, 189]
    }

    if (storedReserved) {
      reservedNumbers.value = JSON.parse(storedReserved)
      // Limpiar reservas expiradas al cargar
      cleanExpiredReservations()
    }

    console.log('📦 LocalStorage cargado:', {
      taken: takenNumbers.value.length,
      reserved: reservedNumbers.value.length
    })
  } catch (error) {
    console.error('Error cargando desde localStorage:', error)
    takenNumbers.value = [14, 27, 33, 45, 78, 99, 123, 156, 189]
  }
}

// Limpiar reservas expiradas
const cleanExpiredReservations = () => {
  const now = Date.now()
  const initialCount = reservedNumbers.value.length

  reservedNumbers.value = reservedNumbers.value.filter(reservation => {
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

// Watchers para persistir en localStorage
watch(takenNumbers, (newNumbers) => {
  localStorage.setItem('rifa-taken-numbers', JSON.stringify(newNumbers))
}, { deep: true })

watch(reservedNumbers, (newReservations) => {
  localStorage.setItem('rifa-reserved-numbers', JSON.stringify(newReservations))
}, { deep: true })

// Limpiar reservas expiradas cada 30 segundos
setInterval(cleanExpiredReservations, 30000)

// Composable para compartir el estado de disponibilidad de números
export function useNumbersAvailability() {
  // Inicializar solo una vez
  if (takenNumbers.value.length === 0 && reservedNumbers.value.length === 0) {
    initializeFromStorage()
  }

  // Computed para números disponibles (no tomados ni reservados)
  const availableNumbers = computed(() => {
    const taken = takenNumbers.value
    const reserved = reservedNumbers.value.map(r => r.number)
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

  // Función para reservar números temporalmente
  const reserveNumbers = (numbers: number[], customerName: string = '') => {
    const now = Date.now()
    const expiresAt = now + RESERVATION_TIME

    numbers.forEach(number => {
      // Verificar que el número esté disponible
      if (isNumberAvailable(number)) {
        reservedNumbers.value.push({
          number,
          reservedAt: now,
          expiresAt,
          customerName,
          status: 'reserved'
        })
      }
    })

    console.log(`⏱️ ${numbers.length} números reservados por 5 minutos`)
    return expiresAt
  }

  // Función para confirmar pago de números reservados
  const confirmPayment = (numbers: number[]) => {
    numbers.forEach(number => {
      // Mover de reservado a tomado
      const reservationIndex = reservedNumbers.value.findIndex(r => r.number === number)
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
    numbers.forEach(number => {
      const index = reservedNumbers.value.findIndex(r => r.number === number)
      if (index > -1) {
        reservedNumbers.value.splice(index, 1)
      }
    })
  }

  // Función para verificar si un número está disponible
  const isNumberAvailable = (number: number) => {
    const isTaken = takenNumbers.value.includes(number)
    const isReserved = reservedNumbers.value.some(r => r.number === number)
    return !isTaken && !isReserved
  }

  // Función para verificar si un número está reservado
  const isNumberReserved = (number: number) => {
    return reservedNumbers.value.some(r => r.number === number)
  }

  // Función para obtener números disponibles como array
  const getAvailableNumbersArray = () => {
    const available = []
    for (let i = 1; i <= totalNumbers.value; i++) {
      if (isNumberAvailable(i)) {
        available.push(i)
      }
    }
    return available
  }

  // Función para obtener tiempo restante de una reserva
  const getReservationTimeLeft = (number: number) => {
    const reservation = reservedNumbers.value.find(r => r.number === number)
    if (!reservation) return 0

    const timeLeft = reservation.expiresAt - Date.now()
    return Math.max(0, timeLeft)
  }

  // Función para limpiar todo (útil para demo)
  const clearAll = () => {
    takenNumbers.value = []
    reservedNumbers.value = []
    selectedNumbers.value = []
    localStorage.removeItem('rifa-taken-numbers')
    localStorage.removeItem('rifa-reserved-numbers')
    console.log('🧹 Todos los números han sido liberados')
  }

  // Función para resetear a estado inicial
  const resetToInitial = () => {
    takenNumbers.value = [14, 27, 33, 45, 78, 99, 123, 156, 189]
    reservedNumbers.value = []
    selectedNumbers.value = []
    console.log('🔄 Estado reiniciado a valores iniciales')
  }

  return {
    // Estado
    totalNumbers,
    takenNumbers,
    reservedNumbers,
    selectedNumbers,

    // Computed
    availableNumbers,
    availabilityText,
    activeReservations,

    // Métodos principales
    reserveNumbers,
    confirmPayment,
    releaseReservations,
    isNumberAvailable,
    isNumberReserved,
    getAvailableNumbersArray,
    getReservationTimeLeft,

    // Métodos de gestión
    cleanExpiredReservations,
    clearAll,
    resetToInitial
  }
}
