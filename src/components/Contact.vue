<template>
  <!-- SECCIÓN CONTACTO -->
  <section class="contact-section">
    <div v-if="showContactSection" class="contact-section-1">
      <div class="section-container">
        <div class="section-header">
          <h1 class="section-title">Contáctanos</h1>
          <p class="section-subtitle">
            Estamos listos para ayudarte a transformar tu negocio.
            Conversemos sobre cómo podemos impulsar tu éxito.
          </p>
        </div>
        <div class="contact-container">
          <div class="contact-info">
            <div>
              <h3 style="text-align: center;">Información de Contacto</h3>
              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <div>
                  <strong>Email</strong><br>
                  info@fodiservices.com<br>
                  ventas@fodiservices.com
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <div>
                  <strong>Teléfono</strong><br class="info-strong">
                  +57 XXX XXX-XXXX<br>
                  +57 XXX XXX-XXXX
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">✉️</div>
                <div>
                  <strong>Horario de Atención</strong><br>
                  Lunes a Viernes: 8:00 AM - 6:00 PM<br>
                  Sábados: 9:00 AM - 2:00 PM
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">🕒</div>
                <div>
                  <strong>Dirección</strong><br>
                  Tv 76 # 46 - 01<br>
                  Bogotá, Colombia
                </div>
              </div>
            </div>
            <div class="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5564182413054!2d-74.11462499999999!3d4.672877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b7a28d7b4ed%3A0x3a0409f4e27b1280!2sTv.%2076%20%2346-01%2C%20Bogot%C3%A1!5e0!3m2!1sen!2sco!4v1753769783954!5m2!1sen!2sco"
                width="100%" height="350" style="border:0;" referrerpolicy="no-referrer-when-downgrade" loading="lazy">
              </iframe>
            </div>
          </div>
          <form class="contact-form">
            <h3 class="form-title">Déjanos tu mensaje</h3>
            <div class="form-group">
              <label for="name">Nombre Completo</label>
              <input type="text" id="name" name="name" placeholder="Ingresa tu Nombre" required>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Ingresa tu Email" required>
            </div>

            <div class="form-group">
              <label for="company">Empresa</label>
              <input type="text" id="company" name="company" placeholder="Ingresa tu Empresa" required>
            </div>

            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" name="phone" placeholder="Ingresa tu Teléfono" required>
            </div>

            <div class="form-group">
              <label for="service">Servicio de Interés</label>
              <select id="service" name="service" placeholder="Selecciona un servicio"
                style="width: 100%; color: #021f3a; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 0.85rem;">
                <option value="">Selecciona un servicio</option>
                <option value="gestion-administrativa">Ensable</option>
                <option value="desarrollo-tecnologico">Pintura</option>
                <option value="consultoria-estrategica">Queja / Reclamo</option>
                <option value="marketing-digital">Mejora Continua</option>
                <option value="seguridad-compliance">Producción</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">Mensaje</label>
              <textarea id="message" name="message" rows="5" placeholder="Cuéntanos sobre tu proyecto o necesidades..."
                required></textarea>
            </div>
            <button type="submit" class="submit-btn">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </div>


    <!-- Botón flotante de WhatsApp -->
    <a href="https://wa.me/+573103608519?text=Estoy%20interesado%20en%3A%20" target="_blank" class="whatsapp-float">
      <div class="whatsapp-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </div>
      <span class="whatsapp-text">¡Envianos un SMS!</span>
    </a>
    <!------------------------------------------------------------- -->
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContactSection' });
import { ref } from 'vue';

const showContactSection = ref(true);

</script>

<style scoped>
/* SECCIÓN CONTACTO */

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a237e;
  margin-bottom: 1.5rem;
  margin-top: -1.2rem;
  text-transform: uppercase;
  position: relative;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #ffa000, #ff8f00);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.3rem;
  color: #000000;
  max-width: 600px;
  margin: auto auto 3.5rem auto;
  text-align: center;
  font-weight: bold;
}

.contact-item strong {
  font-size: 1.3rem;
  /* Título más grande */
  color: #ffa000;
  /* Naranja o blanco según prefieras */
  font-weight: 700;
  /* Bien definido, no exagerado */
  margin-bottom: 0.9rem;
}

.contact-section {
  background: linear-gradient(45deg, #fafafa, #f7f7f7);
  padding: 5rem 2rem;
  position: relative;
}

.contact-section-1 {
  background: linear-gradient(45deg, #ebedee98, #d9dde2);
  padding: 5rem 2rem;
  position: relative;
  border-radius: 16px;
}

.contact-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin: 0 auto;
  /* Centrado sin desbalance */
  max-width: 1400px;
  /* ancho máximo uniforme */
  width: 100%;
  /* ajustable a pantalla */
  padding: 0 2rem;
  /* espaciado lateral */
}

.contact-info,
.contact-form {
  flex: 1 1 100%;
  max-width: 650px;
  /* antes 500px */
}


.contact-info {
  background: linear-gradient(135deg, #031633, #031633);
  padding: 3rem;
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  width: max-content;

}

.contact-info::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 160, 0, 0.3), transparent);
  border-radius: 50%;
}

.contact-info h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ffa000;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: #ffa000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  color: #021f3a;
}

.form-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #021f3a;
  font-weight: 800;
  text-align: center;
  position: relative;
}

.form-title::after {
  content: '';
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #ffa000, #ff8f00);
  display: block;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}



.contact-form {
  background: #ffffff;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* separa cada form-group automáticamente */
}


.contact-form input,
.contact-form select,
.contact-form textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.contact-form ::placeholder {
  font-size: 1.1rem;
  color: #999;
}


.contact-form input:focus,
.contact-form select:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #ffa000;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #021f3a;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  color: #021f3a;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffa000;
}

.submit-btn {
  background: linear-gradient(135deg, #021f3a, #021f3a);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(255, 160, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(255, 160, 0, 0.4);
}


.contact-map {
  flex: 1 1 100%;
  max-width: 500px;
  height: 350px;
  margin-top: 2rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.map-container {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border: 3px solid #ffa000;
  height: 100%;
  min-height: 350px;
}

/* Estilos para el botón flotante de WhatsApp */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  background-color: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.whatsapp-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.whatsapp-icon {
  font-size: 24px;
  margin-right: 8px;
}

.whatsapp-text {
  font-size: 16px;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}


/* 📱 Responsive para pantallas medianas y pequeñas */
@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    padding: 0 1rem;
    gap: 3rem;
  }

  .contact-info,
  .contact-form {
    max-width: 100%;
    width: 100%;
    padding: 2rem;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0;
    background: linear-gradient(135deg, #031633, #031633);
    padding: 0.4rem;
  }

  .contact-section-1 {
    background: linear-gradient(45deg, #ebedee98, #d9dde2);
    padding: 0;
    position: relative;
    border-radius: 16px;

  }

  .form-group {
    margin-bottom: 0;
  }

  .contact-icon {
    margin-bottom: 0.5rem;
    margin-right: 0;
    display: none;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  .map-container {
    min-height: 60px;
  }

  .map-container iframe {
    width: 100%;
    height: 60%;
    /* se adapta al alto del contenedor */
    border: 0;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .contact-map {
    max-width: 100%;
    height: 300px;
  }

  /* WhatsApp flotante: solo ícono */
  .whatsapp-float {
    padding: 14px;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    justify-content: center;
  }

  .whatsapp-float .whatsapp-text {
    display: none;
  }

  .whatsapp-icon {
    margin-right: 0;
    font-size: 24px;
  }
}
</style>
