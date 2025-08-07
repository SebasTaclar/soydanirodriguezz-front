<template>
  <section class="tournaments-section">
    <div class="tournaments-header">
      <div class="header-content">
        
        <div class="header-text">
          <h2 class="section-title">Torneos Finalizados</h2>
          <p class="section-subtitle">Celebrando nuestros campeones y momentos épicos</p>
        </div>
      </div>
    </div>

    <div class="tournaments-grid">
      <div class="tournament-card featured">
        <div class="card-background">
          <div class="trophy-bg">🏆</div>
        </div>
        <div class="card-content">
          <div class="tournament-status">
            <span class="status-badge completed">Finalizado</span>
            <div class="tournament-date">15 Feb 2025</div>
          </div>
          <h3 class="tournament-title">Final Copa Verano 2025</h3>
          <p class="tournament-description">
            Una final épica donde Parcelona FC se coronó campeón.
          </p>
          <div class="tournament-stats">
            <div class="stat-item">
              <div class="stat-number">200+</div>
              <div class="stat-label">Espectadores</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">8</div>
              <div class="stat-label">Equipos</div>
            </div>
          </div>
          <div class="tournament-highlights">
            <div class="highlight champion">
              <i class="fas fa-crown"></i>
              <span>Campeón: Tigres FC</span>
            </div>
            <div class="highlight scorer">
              <i class="fas fa-futbol"></i>
              <span>Goleador: Carlos Mendez (3 goles)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tournament-card">
        <div class="card-background">
          <div class="trophy-bg">⚽</div>
        </div>
        <div class="card-content">
          <div class="tournament-status">
            <span class="status-badge completed">Finalizado</span>
            <div class="tournament-date">28 Feb 2025</div>
          </div>
          <h3 class="tournament-title">Torneo Apertura 2025</h3>
          <p class="tournament-description">
            El torneo más competitivo del año con 16 equipos luchando por la gloria.
          </p>
          <div class="tournament-stats">
            <div class="stat-item">
              <div class="stat-number">16</div>
              <div class="stat-label">Equipos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">45</div>
              <div class="stat-label">Partidos</div>
            </div>
          </div>
          <div class="tournament-highlights">
            <div class="highlight revelation">
              <i class="fas fa-star"></i>
              <span>Revelación: Barcelona 7</span>
            </div>
            <div class="highlight duration">
              <i class="fas fa-calendar"></i>
              <span>2 meses de competencia</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tournament-card">
        <div class="card-background">
          <div class="trophy-bg">🥇</div>
        </div>
        <div class="card-content">
          <div class="tournament-status">
            <span class="status-badge completed">Finalizado</span>
            <div class="tournament-date">Dic 2024</div>
          </div>
          <h3 class="tournament-title">Copa de Navidad 2024</h3>
          <p class="tournament-description">
            Torneo especial navideño que reunió a las mejores promesas del fútbol local.
          </p>
          <div class="tournament-stats">
            <div class="stat-item">
              <div class="stat-number">12</div>
              <div class="stat-label">Equipos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">150</div>
              <div class="stat-label">Asistentes</div>
            </div>
          </div>
          <div class="tournament-highlights">
            <div class="highlight special">
              <i class="fas fa-gift"></i>
              <span>Evento especial</span>
            </div>
            <div class="highlight family">
              <i class="fas fa-heart"></i>
              <span>Torneo familiar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente de torneos finalizados
defineOptions({
  name: 'TournamentsFinished'
})
</script>

<style scoped>
.tournaments-section {
  padding: 5rem 2rem;
  width: 100%;
  background: linear-gradient(135deg, #002366 0%, #031633 50%, #002366 100%);
  position: relative;
  overflow: hidden;
}

.tournaments-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.tournaments-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-box {
  background: linear-gradient(135deg, #FFA500, #FF8533);
  padding: 1.5rem;
  border-radius: 50%;
  color: #002366;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.header-text {
  text-align: center;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.tournaments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.tournament-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 165, 0, 0.2);
  transition: all 0.4s ease;
  cursor: pointer;
}

.tournament-card.featured {

  border: 2px solid rgba(255, 165, 0, 0.4);
  transform: scale(1.02);
}

.tournament-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(255, 165, 0, 0.2);
  border-color: rgba(255, 165, 0, 0.5);
}

.card-background {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
  pointer-events: none;
}

.trophy-bg {
  font-size: 4rem;
  transform: rotate(15deg);
}

.card-content {
  position: relative;
  z-index: 2;
}

.tournament-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-badge {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.tournament-date {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  background: rgba(0, 35, 102, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tournament-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.tournament-description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.tournament-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #FFA500;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
}

.tournament-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.highlight i {
  width: 20px;
  text-align: center;
}

.highlight.champion {
  background: rgba(7, 7, 7, 0.404);
  color: white;
  border: 1px solid #a1b4d8;
}

.highlight.scorer {
  background: rgba(7, 7, 7, 0.404);
  color: white;
  border: 1px solid #a1b4d8;
}

.highlight.revelation {
  background: rgba(7, 7, 7, 0.404);
  color: white;
  border: 1px solid #a1b4d8;
}

.highlight.duration {
  background: rgba(7, 7, 7, 0.404);
  color: white;
  border: 1px solid #a1b4d8;
}

.highlight.special {
  background: rgba(7, 7, 7, 0.404); 
  color: white;
  border: 1px solid #a1b4d8;
}

.highlight.family {
  background: rgba(7, 7, 7, 0.404);
  color: white; 
  border: 1px solid #a1b4d8;
}

.highlight:hover {
  transform: translateX(5px);
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .tournaments-section {
    padding: 3rem 1rem;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .tournaments-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .tournament-card {
    padding: 1.5rem;
  }
  
  .tournament-stats {
    gap: 1rem;
  }
  
  .header-content {
    gap: 1rem;
  }
  
  .icon-box {
    padding: 1rem;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }
  
  .tournament-title {
    font-size: 1.5rem;
  }
  
  .tournament-stats {
    justify-content: space-around;
  }
}
</style>

