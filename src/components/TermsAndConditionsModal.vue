<template>
  <div class="modal-backdrop" @click="handleBackdropClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>Términos y Condiciones</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="terms-text">
          <p>
            Al marcar la casilla de aceptación, declaro que he leído y acepto los presentes términos y condiciones. Autorizo el tratamiento de mis datos personales (nombre, correo electrónico, número de celular y demás información suministrada) para la gestión de mi compra, el registro en la base de datos, la participación en la dinámica y las comunicaciones relacionadas con esta actividad, de conformidad con la legislación vigente sobre protección de datos personales.
          </p>
          <p>
            Entiendo y acepto que la compra corresponde a un wallpaper digital, el cual será entregado por los medios establecidos y no es reembolsable una vez realizada la compra.
          </p>
          <p>Asimismo, acepto que mi participación en el sorteo estará sujeta a las siguientes condiciones:</p>
          <ul>
            <li>El sorteo se realizará en la fecha y hora que anuncie previamente Daniel a través de sus redes sociales oficiales, mediante una transmisión en vivo.</li>
            <li>Se seleccionará un (1) ganador de forma pública durante la transmisión.</li>
            <li>El organizador realizará hasta dos (2) intentos de contacto con el posible ganador utilizando el número telefónico y/o correo electrónico registrados al momento de la compra.</li>
            <li>Entre el primer y el segundo intento habrá un tiempo máximo de 10 minutos para obtener respuesta.</li>
            <li>Si transcurrido ese tiempo no es posible establecer contacto con el participante, este perderá su derecho al premio y se procederá inmediatamente a seleccionar un nuevo ganador durante la misma transmisión en vivo.</li>
            <li>Es responsabilidad de cada participante suministrar datos de contacto correctos y mantenerse atento a las redes sociales oficiales de Daniel, donde se informarán oportunamente la fecha, la hora del sorteo y cualquier información relacionada con la actividad.</li>
          </ul>
          <p>
            Al aceptar estos términos y condiciones, manifiesto que comprendo y acepto íntegramente las reglas aquí establecidas para participar en la dinámica.
          </p>
        </div>

        <div class="checkbox-container">
          <label class="checkbox-label">
            <input type="checkbox" v-model="accepted" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">Acepto los términos y condiciones</span>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-cancel">
          Cancelar
        </button>
        <button @click="handleAccept" :disabled="!accepted" class="btn-accept" :class="{ 'disabled': !accepted }">
          Continuar con el pago
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Emits
const emit = defineEmits<{
  close: []
  accept: []
}>()

// Estado
const accepted = ref(false)

// Métodos
const handleBackdropClick = () => {
  emit('close')
}

const handleAccept = () => {
  if (accepted.value) {
    emit('accept')
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: linear-gradient(145deg, #1e293b, #334155);
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(96, 165, 250, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(96, 165, 250, 0.1);
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.terms-text {
  color: #cbd5e1;
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: justify;
}

.terms-text p {
  margin: 0 0 0.75rem;
}

.terms-text ul {
  margin: 0.5rem 0 0.75rem;
  padding-left: 1.25rem;
}

.terms-text li {
  margin-bottom: 0.4rem;
}

.checkbox-container {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(96, 165, 250, 0.15);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #64748b;
  border-radius: 4px;
  background: transparent;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 1px;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.3);
  flex-shrink: 0;
}

.btn-cancel,
.btn-accept {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.btn-cancel:hover {
  background: rgba(96, 165, 250, 0.1);
  border-color: #60a5fa;
}

.btn-accept {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  min-width: 160px;
}

.btn-accept:not(.disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-accept.disabled {
  background: rgba(71, 85, 105, 0.5);
  color: rgba(226, 232, 240, 0.5);
  cursor: not-allowed;
  border: 1px solid rgba(71, 85, 105, 0.3);
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-accept {
    width: 100%;
  }
}
</style>
