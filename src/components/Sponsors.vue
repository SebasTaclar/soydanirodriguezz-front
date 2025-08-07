<template>
    <section class="sponsors-wrapper">
    <div class="sponsors-header">
      <h2 class="sponsors-title">Nuestros Socios</h2>
      <p class="sponsors-subtitle">Orgullosos de colaborar con las mejores marcas del mundo motociclista</p>
    </div>

    <div class="sponsors-container">
      <div class="sponsors-track">
        <div class="sponsors-content">
          <div class="sponsor-item">
            <a href="https://www.bajaj.com" target="_blank" rel="noopener noreferrer" class="sponsor-link">
              <div class="sponsor-inner">
                <img src="/images/bajaj_logo.jpg" alt="Bajaj" class="sponsor-image">
                <div class="sponsor-overlay">
                  <i class="fas fa-external-link-alt"></i>
                  <span>Visitar Bajaj</span>
                </div>
              </div>
            </a>
          </div>
          <div class="sponsor-item">
            <a href="#" target="_blank" rel="noopener noreferrer" class="sponsor-link">
              <div class="sponsor-inner">
                <img src="/images/moto_accessories.jpg" alt="Accesorios Moto" class="sponsor-image">
                <div class="sponsor-overlay">
                  <i class="fas fa-external-link-alt"></i>
                  <span>Accesorios NS200</span>
                </div>
              </div>
            </a>
          </div>
          <div class="sponsor-item">
            <a href="#" target="_blank" rel="noopener noreferrer" class="sponsor-link">
              <div class="sponsor-inner">
                <img src="/images/oil_brand.jpg" alt="Lubricantes" class="sponsor-image">
                <div class="sponsor-overlay">
                  <i class="fas fa-external-link-alt"></i>
                  <span>Lubricantes Premium</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="sponsors-cta">
      <h3>Únete a la Comunidad NS200</h3>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SponsorsComponent',
});

// Duración de la animación en segundos (más lenta para mejor efecto)
const duration = 30;
</script>

<style scoped>
.sponsors-wrapper {
  background: linear-gradient(135deg, #a1b4d8 0%, #a1b4d8 50%, #002366 100%);
  padding: 4rem 0;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  width: 100%;
}

.sponsors-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 15% 25%, rgba(255, 165, 0, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 85% 75%, rgba(255, 165, 0, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%),
    linear-gradient(45deg, transparent 30%, rgba(255, 165, 0, 0.05) 50%, transparent 70%);
  pointer-events: none;
  animation: backgroundShift 15s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% {
    background:
      radial-gradient(circle at 15% 25%, rgba(255, 165, 0, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 85% 75%, rgba(255, 165, 0, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%),
      linear-gradient(45deg, transparent 30%, rgba(255, 165, 0, 0.05) 50%, transparent 70%);
  }
  50% {
    background:
      radial-gradient(circle at 85% 25%, rgba(255, 165, 0, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 15% 75%, rgba(255, 165, 0, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 60%),
      linear-gradient(-45deg, transparent 30%, rgba(255, 165, 0, 0.05) 50%, transparent 70%);
  }
}

.sponsors-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right,
    transparent,
    rgba(255, 165, 0, 0.3),
    #FFA500,
    rgba(255, 165, 0, 0.3),
    transparent
  );
  box-shadow: 0 3px 15px rgba(255, 165, 0, 0.3);
}

.sponsors-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  padding: 0 1rem;
}

.sponsors-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #002366;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.3);
  position: relative;
  display: inline-block;
}

.sponsors-subtitle {
  color: #002366;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.2);
}

.sponsors-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #FFA500, #FF8533);
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(255, 165, 0, 0.3);
}

.sponsors-container {
  width: 100%;
  max-width: 1200px;
  position: relative;
  overflow: visible;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin: 2rem auto;
  border: 2px solid rgba(255, 165, 0, 0.4);
  box-shadow: 0 15px 40px rgba(0, 35, 102, 0.3);
}

.sponsors-track {
  display: flex;
  width: 100%;
  position: relative;
  justify-content: center;
  align-items: center;
}

.sponsors-content {
  display: flex;
  gap: 4rem;
  padding: 1rem 0;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.sponsor-item {
  flex: 0 0 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sponsor-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sponsor-inner {
  width: 100%;
  border-radius: 50%;
  box-shadow: 0 12px 35px rgba(0, 35, 102, 0.3);
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  border: 4px solid #FFA500;
  transition: all 0.4s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
}

.sponsor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 35, 102, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 700;
  gap: 0.5rem;
}

.sponsor-overlay i {
  font-size: 1.5rem;
  color: #FFA500;
}

.sponsor-overlay span {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sponsor-link:hover .sponsor-overlay {
  opacity: 1;
}

.sponsor-inner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent 30%, rgba(255, 165, 0, 0.3), transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.sponsor-inner:hover {
  transform: translateY(-15px);
  box-shadow: 0 20px 50px rgba(0, 35, 102, 0.4);
  border-color: #FF8533;
  background: rgba(255, 255, 255, 1);
}

.sponsor-link:hover .sponsor-inner {
  transform: translateY(-15px);
  box-shadow: 0 20px 50px rgba(0, 35, 102, 0.4);
  border-color: #FF8533;
  background: rgba(255, 255, 255, 1);
}

.sponsor-inner:hover::after,
.sponsor-link:hover .sponsor-inner::after {
  transform: translateX(100%);
}

.sponsor-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  border-radius: 50%;
  object-position: center;
  transform: scale(1.02); /* Asegura que no haya bordes blancos */
}

.sponsor-inner:hover .sponsor-image,
.sponsor-link:hover .sponsor-image {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .sponsors-wrapper {
    padding: 3rem 1rem;
  }

  .sponsors-container {
    padding: 2rem 1rem;
    margin: 1.5rem auto;
    border-radius: 15px;
  }

  .sponsors-content {
    gap: 2rem;
    padding: 1.5rem 0;
  }

  .sponsor-item {
    flex: 0 0 150px;
    height: 150px;
  }

  .sponsor-inner {
    border: 3px solid #FFA500;
    width: 100%;
    box-shadow: 0 8px 25px rgba(0, 35, 102, 0.25);
    background: rgba(255, 255, 255, 0.95);
  }

  .sponsor-image {
    padding: 0;
    object-position: center;
    transform: scale(1.0);
  }

  .sponsor-overlay {
    gap: 0.4rem;
  }

  .sponsor-overlay i {
    font-size: 1.3rem;
  }

  .sponsor-overlay span {
    font-size: 0.85rem;
  }

  .sponsors-title {
    font-size: 2rem;
    color: #002366;
  }

  .sponsors-subtitle {
    font-size: 1rem;
    color: #002366;
  }
}

@media (max-width: 480px) {
  .sponsors-wrapper {
    padding: 2.5rem 0.5rem;
  }

  .sponsors-container {
    padding: 1.5rem 0.5rem;
    margin: 1rem auto;
    border-radius: 12px;
  }

  .sponsors-content {
    gap: 1.5rem;
    padding: 1rem 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .sponsor-item {
    flex: 0 0 100px;
    height: 100px;
  }

  .sponsor-inner {
    border-width: 3px;
    border-color: #FFA500;
    width: 100%;
    box-shadow: 0 6px 20px rgba(0, 35, 102, 0.2);
    background: rgba(255, 255, 255, 0.9);
  }

  .sponsor-image {
    transform: scale(1.0);
  }

  .sponsor-overlay i {
    font-size: 1.1rem;
  }

  .sponsor-overlay span {
    font-size: 0.75rem;
  }

  .sponsors-title {
    font-size: 1.8rem;
    letter-spacing: 1px;
    color: #002366;
  }

  .sponsors-subtitle {
    font-size: 0.95rem;
    color: #002366;
  }

  .sponsors-cta {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .sponsors-cta h3 {
    font-size: 1.6rem;
  }

  .sponsors-cta p {
    font-size: 1rem;
    padding: 0.4rem 1.2rem;
  }
}

.sponsor-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.sponsor-item:hover img {
  opacity: 1;
  transform: scale(1.05);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(calc(-50% - 15px));
  }

  100% {
    transform: translateX(0);
  }
}

.offerings:hover {
  animation-play-state: paused;
}

/* Pausa la animación cuando el usuario pasa el mouse por encima */
.sponsors-container:hover .sponsors-content {
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .sponsor-item {
    flex: 0 0 130px;
    height: 80px;
  }

  .sponsors-section {
    padding: 2rem 0;
  }

.sponsors-content{
  padding: 1.5rem 0;
      gap: 0.5rem;
}

}



.offerings {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  gap: 30px;
  padding: 20px;
  width: max-content;
  margin: 0 auto;
  animation: scroll var(--duration) linear infinite;
}

.brand {
  flex: 1;
  position: relative;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.9) 80%),
    var(--bg) center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px;
  min-height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.brand:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.brand img {
  width: 150px;
  z-index: 1;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
  border-radius: 50%;
}

.brand:hover img {
  transform: scale(1.1);
}

.sponsors-cta {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.sponsors-cta h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #002366;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3);
}

.sponsors-cta p {
  font-size: 1.1rem;
  color: #FFA500;
  margin: 0;
  cursor: pointer;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 2px solid #FFA500;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sponsors-cta p:hover {
  background: #FFA500;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

@media (max-width: 1024px) {
  .offerings {
    flex-direction: column;
    padding: 10px;
  }

  .brand {
    min-height: 300px;
  }

  .sponsors-title {
    font-size: 2.0rem;
  }

  .sponsors-cta h3 {
    font-size: 2rem;
  }
}
</style>
