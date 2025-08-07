<template>
 <section class="outsourcing-section">
  <div class="outsourcing-container">
   <div class="outsourcing-text">
    <h2 class="outsourcing-title">EXPERTOS EN OUTSOURCING</h2>
    <div class="outsourcing-tags">
     <span class="tag">INNOVATIVE DESIGN</span>
     <span class="tag">TECHNICAL EXPERTISE</span>
     <span class="tag">CLIENT-FOCUSED</span>
    </div>
    <div class="outsourcing-contact">
     <span>📞 123-456-7890</span>
     <span>🌐 www.fodiservices.com</span>
     <span>📍 Bogotá-Colombia</span>
    </div>
   </div>
   <div class="outsourcing-images">
    <img src="/images/mainBanner1.jpg" alt="FODISERVICES - Equipo profesional" class="circle-img top-left">
    <img src="/images/mainBanner2.png" alt="FODISERVICES - Outsourcing experto" class="circle-img top-right">
    <img src="/images/mainBanner3.jpg" alt="FODISERVICES - Soluciones empresariales" class="circle-img bottom">
   </div>
  </div>
 </section>
</template>

<script setup lang="ts">
defineOptions({
 name: 'OutsourcingSectionComponent',
});
</script>

<style scoped>
.outsourcing-section {
 background-color: #031633;
 padding: 4rem 2rem;
 color: white;
 font-family: 'Montserrat', sans-serif;
 overflow: hidden;
}

.outsourcing-container {
 display: flex;
 flex-wrap: wrap;
 justify-content: space-between;
 align-items: center;
 max-width: 1200px;
 margin: 0 auto;
}

.outsourcing-text {
 flex: 1 1 45%;
 padding-right: 2rem;
}

.outsourcing-title {
 font-size: 3rem;
 font-weight: 800;
 margin-bottom: 1.5rem;
 letter-spacing: -2px;
}

.outsourcing-tags {
 display: flex;
 gap: 1rem;
 flex-wrap: wrap;
 margin-bottom: 2rem;
}

.tag {
 background-color: #FFA500;
 color: #031633;
 font-weight: bold;
 padding: 0.5rem 1rem;
 border-radius: 5px;
 font-size: 1rem;
 transition: all 0.3s ease;
 cursor: pointer;
}

.tag:hover {
 background-color: #E6940A;
 transform: translateY(-2px);
 box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

.outsourcing-contact {
 display: flex;
 flex-direction: column;
 gap: 0.5rem;
 font-size: 1rem;
}

.outsourcing-contact span {
 transition: all 0.3s ease;
}

.outsourcing-contact span:hover {
 color: #FFA500;
 transform: translateX(5px);
}

.outsourcing-images {
 flex: 1 1 45%;
 position: relative;
 display: flex;
 flex-wrap: wrap;
 justify-content: center;
 gap: 1rem;
}

.circle-img {
 border-radius: 50%;
 width: 160px;
 height: 160px;
 object-fit: cover;
 border: 5px solid #FFA500;
 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
 transition: all 0.3s ease;
}

.circle-img:hover {
 transform: scale(1.05);
 box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
}

.top-left {
 position: relative;
 top: 0;
 left: 0;
}

.top-right {
 position: relative;
 top: -40px;
}

.bottom {
 position: relative;
 top: -20px;
}

@media (max-width: 768px) {
 .outsourcing-container {
  flex-direction: column;
  text-align: center;
 }

 .outsourcing-text {
  padding-right: 0;
  margin-bottom: 2rem;
 }

 .outsourcing-title {
  font-size: 2rem;
 }

 .outsourcing-tags {
  justify-content: center;
 }

 .circle-img {
  width: 120px;
  height: 120px;
 }

 .top-right,
 .bottom {
  top: 0;
 }
}
</style>
