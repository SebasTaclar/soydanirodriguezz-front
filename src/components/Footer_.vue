<template>
    <!-- FOOTER -->
    <section class="footer">
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>DigitalWallpaper</h3>
                    <p class="footer-description">
                        Compra los mejores fondos digitales y wallpapers premium. Calidad garantizada y descarga instantánea.
                    </p>
                </div>

                <div class="footer-section">
                    <h3>Enlaces Rápidos</h3>
                    <ul class="footer-links">
                        <li><a href="#ongoing_tournaments">Catálogo</a></li>
                        <li><a href="#our_work">Nuestros Productos</a></li>
                        <li><a href="#contact">Contacto</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2025 DigitalWallpaper. Todos los derechos reservados.</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
    /* FOOTER */
    .footer {
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
        color: white;
        padding: 4rem 2rem 1rem;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 3rem;
        margin-bottom: 3rem;
    }

    .footer-section {
        text-align: left;
    }

    .footer-section h3 {
        color: #FFA500;
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        font-weight: 600;
    }

    .logo-img {
        max-width: 150px;
        height: auto;
        margin-bottom: 1rem;
    }

    .footer-description {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .footer-links {
        list-style: none;
        padding: 0;
    }

    .footer-links li {
        margin-bottom: 0.8rem;
    }

    .footer-links a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .footer-links a:hover {
        color: #FFA500;
    }

    .social-cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }

    .social-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }

    .social-card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(5px);
    }

    .social-card.facebook {
        border-left-color: #1877F2;
    }

    .social-card.facebook:hover {
        box-shadow: 0 5px 15px rgba(24, 119, 242, 0.3);
    }

    .social-card.instagram {
        border-left-color: #E4405F;
    }

    .social-card.instagram:hover {
        box-shadow: 0 5px 15px rgba(228, 64, 95, 0.3);
    }

    .social-icon {
        width: 50px;
        height: 50px;
        background: rgba(255, 165, 0, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        flex-shrink: 0;
    }

    .social-card.facebook .social-icon {
        background: rgba(24, 119, 242, 0.1);
    }

    .social-card.instagram .social-icon {
        background: rgba(228, 64, 95, 0.1);
    }

    .social-info h4 {
        color: #ffffff;
        font-size: 1rem;
        margin: 0 0 0.25rem 0;
        font-weight: 600;
    }

    .social-info p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
        margin: 0;
        line-height: 1.2;
    }

    .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 1.5rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
    }

    @media (max-width: 768px) {
        .footer {
            padding: 3rem 1.5rem 1rem;
        }

        .footer-grid {
            gap: 2rem;
        }

        .footer-section {
            text-align: center;
        }

        .social-cards {
            align-items: center;
        }

        .social-card {
            max-width: 300px;
            margin: 0 auto;
        }
    }

</style>
