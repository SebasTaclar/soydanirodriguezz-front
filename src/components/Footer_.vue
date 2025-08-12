<template>
    <footer class="modern-footer">
        <!-- Sección principal del footer -->
        <div class="footer-main">
            <div class="footer-container">
                <!-- Columna 1: Logo y descripción -->
                <div class="footer-column brand-column">
                    <div class="brand-section">
                        <h2 class="brand-title">FondosDigitales<span class="highlight">Moto</span></h2>
                        <p class="brand-description">
                            Tu oportunidad de comprar tus fondos digitales y ganar la moto de tus sueños.
                        </p>
                    </div>

                </div>

                <!-- Columna 2: Enlaces rápidos -->
                <div class="footer-column">
                    <h3 class="column-title">Enlaces Rápidos</h3>
                    <ul class="footer-links">
                        <li><a href="#ganadores">Ganadores</a></li>
                        <li><a href="#como-funciona">¿Cómo Funciona?</a></li>
                        <li><a href="#reglamento">Reglamento</a></li>
                    </ul>
                </div>

                <!-- Columna 3: Soporte -->
                <div class="footer-column">
                    <h3 class="column-title">Soporte</h3>
                    <ul class="footer-links">
                        <!-- <li><a href="#ayuda">Centro de Ayuda</a></li> -->
                        <li><a href="#contacto">Contacto</a></li>
                        <li><a href="#preguntas">Preguntas Frecuentes</a></li>
                        <li><a href="#terminos">Términos y Condiciones</a></li>
                        <!-- <li><a href="#privacidad">Política de Privacidad</a></li> -->
                    </ul>
                </div>

                <!-- Columna 4: Contacto -->
                <div class="footer-column contact-column">
                    <h3 class="column-title">Contacto</h3>
                    <div class="contact-info">


                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                            </div>
                            <div class="contact-text">
                                <span>Teléfono</span>
                                <p>+57 (1) 234-5678</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <div class="contact-text">
                                <span>Email</span>
                                <p>info@rifasmoto.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Barra inferior -->
        <div class="footer-bottom">
            <div class="footer-container">
                <!-- Copyright centrado -->
                <div class="copyright-section">
                    <p>&copy; 2025 FondosDigitalesMoto. Todos los derechos reservados.</p>
                </div>

                <!-- Enlaces centrados en su propio div -->
                <div class="links-section">
                    <div class="bottom-links">
                        <a href="#privacidad">Privacidad</a>
                        <a href="#terminos">Términos</a>
                        <a href="#cookies">Cookies</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Elementos decorativos -->
        <div class="footer-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
        </div>
    </footer>
</template>

<style scoped>
.modern-footer {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #ffffff;
  overflow: hidden;
}

.footer-main {
  padding: 4rem 0 2rem;
  position: relative;
  z-index: 2;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 3rem;
}

/* Columna de marca */
.brand-column {
  padding-right: 2rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.brand-title .highlight {
  color: #60a5fa;
  text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
}

.brand-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #cbd5e1;
  margin-bottom: 2rem;
  max-width: 350px;
}

.social-networks h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f1f5f9;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.social-icon:hover::before {
  transform: translateX(100%);
}

.social-icon svg {
  width: 20px;
  height: 20px;
  z-index: 1;
}

.social-icon.facebook {
  background: linear-gradient(135deg, #1877F2, #0C63D4);
}

.social-icon.instagram {
  background: linear-gradient(135deg, #E4405F, #C13584, #833AB4);
}

.social-icon.twitter {
  background: linear-gradient(135deg, #1DA1F2, #0C7FC7);
}

.social-icon.youtube {
  background: linear-gradient(135deg, #FF0000, #CC0000);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Columnas de enlaces */
.footer-column {
  padding-top: 0.5rem;
}

.column-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #60a5fa;
  position: relative;
}

.column-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
}

.footer-links a::before {
  content: '';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #60a5fa;
  transition: width 0.3s ease;
}

.footer-links a:hover {
  color: #ffffff;
  padding-left: 15px;
}

.footer-links a:hover::before {
  width: 8px;
}

/* Columna de contacto */
.contact-column {
  padding-left: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.contact-text span {
  font-size: 0.85rem;
  color: #60a5fa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-text p {
  margin: 0.3rem 0 0 0;
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Barra inferior */
.footer-bottom {
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  padding: 1.5rem 0;
  position: relative;
  z-index: 2;
}

/* Sección del copyright */
.copyright-section {
  text-align: center;
  margin-bottom: 1rem;
}

.copyright-section p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Sección de enlaces */
.links-section {
  text-align: center;
}

.bottom-links {
  display: inline-flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.bottom-links {
  display: flex;
  gap: 2rem;
}

.bottom-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.bottom-links a:hover {
  color: #60a5fa;
}

/* Elementos decorativos */
.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 5%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-container {
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    gap: 2rem;
  }

  .brand-column {
    padding-right: 1rem;
  }
}

@media (max-width: 968px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .brand-column {
    grid-column: 1 / -1;
    text-align: center;
    padding-right: 0;
    margin-bottom: 1rem;
  }

  .contact-column {
    grid-column: 1 / -1;
    padding-left: 0;
    text-align: center;
  }

  .contact-info {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .footer-main {
    padding: 3rem 0 1.5rem;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-description {
    max-width: none;
  }

  .footer-column {
    text-align: center;
  }

  .column-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .social-icons {
    justify-content: center;
  }

  .copyright-section {
    margin-bottom: 1rem;
  }

  .links-section {
    text-align: center;
  }

  .bottom-links {
    justify-content: center;
    gap: 1.5rem;
  }

  .decoration-circle {
    display: none;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 0.5rem;
  }

  .social-icons {
    gap: 0.5rem;
  }

  .social-icon {
    width: 40px;
    height: 40px;
  }

  .contact-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .contact-icon {
    margin-bottom: 0.5rem;
  }
}
</style>
