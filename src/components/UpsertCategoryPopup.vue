<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          <i class="fas fa-tag"></i>
          {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h3>
        <button @click="closeModal" class="btn-close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-body">
          <!-- Campo Nombre -->
          <div class="form-group">
            <label for="category-name" class="form-label">
              <i class="fas fa-tag"></i>
              Nombre de la Categoría
            </label>
            <input id="category-name" v-model="formData.name" type="text" class="form-input"
              :class="{ 'error': errors.name }" placeholder="Ej: Adultos Masculino, Juvenil, etc." autocomplete="off" />
            <span v-if="errors.name" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.name }}
            </span>
          </div>

          <!-- Campo Descripción -->
          <div class="form-group">
            <label for="category-description" class="form-label">
              <i class="fas fa-align-left"></i>
              Descripción
              <span class="optional">(Opcional)</span>
            </label>
            <textarea id="category-description" v-model="formData.description" class="form-textarea"
              :class="{ 'error': errors.description }" placeholder="Describe brevemente esta categoría..."
              rows="3"></textarea>
            <span v-if="errors.description" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.description }}
            </span>
          </div>

          <!-- Información adicional para edición -->
          <div v-if="isEditing && category" class="info-section">
            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-info-circle"></i>
                <span>Información de la Categoría</span>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="info-label">ID:</span>
                  <span class="info-value">{{ category.id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Equipos asociados:</span>
                  <span class="info-value">{{ getTeamsCount() }} equipos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error general -->
          <div v-if="generalError" class="general-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ generalError }}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-cancel">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="!isFormValid || isSubmitting">
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCategories } from '@/composables/useCategories';
import type { Category, CreateCategoryRequest } from '@/types/CategoryType';

// Props
interface Props {
  category?: Category | null;
}

const props = withDefaults(defineProps<Props>(), {
  category: null
});

// Emits
const emit = defineEmits<{
  close: [];
  save: [];
}>();

// Usar el composable de categorías
const { categories, createCategory, updateCategory } = useCategories();

// Estados reactivos
const formData = ref<CreateCategoryRequest>({
  name: '',
  description: ''
});

const errors = ref({
  name: '',
  description: ''
});

const generalError = ref('');
const isSubmitting = ref(false);

// Computed properties
const isEditing = computed(() => !!props.category);

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' &&
    !errors.value.name &&
    !errors.value.description;
});

// Funciones de validación
const validateName = () => {
  const name = formData.value.name.trim();

  if (!name) {
    errors.value.name = 'El nombre es requerido';
    return false;
  }

  if (name.length < 2) {
    errors.value.name = 'El nombre debe tener al menos 2 caracteres';
    return false;
  }

  if (name.length > 50) {
    errors.value.name = 'El nombre no puede exceder 50 caracteres';
    return false;
  }

  // Verificar que no exista otra categoría con el mismo nombre (solo en creación o diferente ID en edición)
  const existingCategory = categories.value.find(cat =>
    cat.name.toLowerCase() === name.toLowerCase() &&
    (!isEditing.value || cat.id !== props.category?.id)
  );

  if (existingCategory) {
    errors.value.name = 'Ya existe una categoría con este nombre';
    return false;
  }

  errors.value.name = '';
  return true;
};

const validateDescription = () => {
  const description = formData.value.description?.trim() || '';

  if (description.length > 200) {
    errors.value.description = 'La descripción no puede exceder 200 caracteres';
    return false;
  }

  errors.value.description = '';
  return true;
};

const validateForm = () => {
  const nameValid = validateName();
  const descriptionValid = validateDescription();

  return nameValid && descriptionValid;
};

// Funciones de datos
const getTeamsCount = (): number => {
  // Por ahora retornar 0, ya que eliminaremos el servicio mock
  // TODO: Integrar con el servicio real de teams cuando esté disponible
  return 0;
};

// Handlers
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  generalError.value = '';

  try {
    let result;

    if (isEditing.value && props.category) {
      // Actualizar categoría existente
      result = await updateCategory(props.category.id, formData.value);
    } else {
      // Crear nueva categoría
      result = await createCategory(formData.value);
    }

    if (result.success) {
      emit('save');
    } else {
      generalError.value = result.message || 'Error al guardar la categoría';
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error inesperado al guardar la categoría';
    generalError.value = errorMessage;
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

// Watchers para validación en tiempo real
watch(() => formData.value.name, validateName, { flush: 'post' });
watch(() => formData.value.description, validateDescription, { flush: 'post' });

// Inicialización
onMounted(() => {
  if (props.category) {
    formData.value = {
      name: props.category.name,
      description: props.category.description || ''
    };
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: var(--app-bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--app-shadow);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid var(--app-border-color);
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--app-border-color);
  background: var(--app-bg-secondary);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title i {
  color: var(--app-primary);
}

.btn-close {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--app-text-secondary);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.btn-close:hover {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Form */
.modal-form {
  display: flex;
  flex-direction: column;
  height: auto;
}

.form-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--app-text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-label i {
  color: var(--app-primary);
  font-size: 0.9rem;
}

.optional {
  font-weight: 400;
  color: var(--app-text-secondary);
  font-size: 0.85rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--app-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--app-surface);
  color: var(--app-text-primary);
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--app-primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.error-message i {
  font-size: 0.8rem;
}

/* Info Section */
.info-section {
  margin-top: 1rem;
}

.info-card {
  background: var(--app-surface-elevated);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  overflow: hidden;
}

.info-header {
  background: rgba(25, 118, 210, 0.1);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--app-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--app-text-primary);
  font-size: 0.9rem;
}

.info-header i {
  color: var(--app-primary);
}

.info-content {
  padding: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: var(--app-text-secondary);
  font-size: 0.9rem;
}

.info-value {
  color: var(--app-text-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

/* General Error */
.general-error {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #f44336;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--app-border);
  background: var(--app-surface-elevated);
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.btn-cancel {
  background: var(--app-surface);
  color: var(--app-text-secondary);
  border: 2px solid var(--app-border);
}

.btn-cancel:hover {
  background: var(--app-surface-elevated);
  color: var(--app-text-primary);
}

.btn-save {
  background: linear-gradient(135deg, var(--app-primary), #1976d2);
  color: white;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.fa-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    max-width: 100%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .form-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 1rem;
  }

  .form-body {
    padding: 1rem;
  }

  .modal-footer {
    padding: 1rem;
  }
}
</style>
