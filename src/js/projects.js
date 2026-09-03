import { Modal } from "bootstrap";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import data from "../data/data.js";

const initProjects = () => {
    const projectKeys = Object.keys(data.projects);
    const totalProjects = projectKeys.length;
    let currentIndex = 0;
    let autoplayInterval = null;
    let isAutoplayRunning = false;
    let currentViewMode = "deck"; // "deck" | "grid"

    // Elementos del DOM
    const wrapper = document.getElementById("gjProjectsWrapper");
    const stage = document.getElementById("gjProjectsStage");
    const deck = document.getElementById("gjDeckStack");
    const cards = Array.from(deck?.querySelectorAll(".gj\\:projects\\:card") || []);
    const prevBtn = document.getElementById("deckPrevBtn");
    const nextBtn = document.getElementById("deckNextBtn");
    const currentNumEl = document.getElementById("deckCurrentNum");
    const playPauseBtn = document.getElementById("deckPlayPauseBtn");
    const thumbnailsContainer = document.getElementById("gjDeckThumbnails");
    const thumbnailItems = Array.from(thumbnailsContainer?.querySelectorAll(".gj\\:projects\\:dock-item") || []);
    const modalProjects = document.getElementById("gjModalProjects");
    const ctaButtons = Array.from(document.querySelectorAll(".gj\\:projects\\:card-cta") || []);

    const switchDeckBtn = document.getElementById("switchDeckBtn");
    const switchGridBtn = document.getElementById("switchGridBtn");

    // Inicializar PhotoSwipe 5 Lightbox para el Modal
    let lightbox = null;
    try {
        lightbox = new PhotoSwipeLightbox({
            gallery: "#gjModalProjectsGallery",
            children: "a",
            pswpModule: PhotoSwipe,
            wheelToZoom: true,
            bgOpacity: 0.9,
            padding: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        lightbox.init();
    } catch (err) {
        console.warn("PhotoSwipe init warning:", err);
    }

    // --------------------------------------------------------------------------
    // Controlador de Posicionamiento 3D (3D Depth Stack)
    // --------------------------------------------------------------------------
    const updateDeck = (index, isInitial = false) => {
        if (currentViewMode === "grid") return;

        if (index < 0) index = totalProjects - 1;
        if (index >= totalProjects) index = 0;
        currentIndex = index;

        const currentKey = projectKeys[currentIndex];
        const currentProject = data.projects[currentKey];

        // 1. Posicionamiento 3D en Profundidad de cada tarjeta
        cards.forEach((card, i) => {
            const diff = i - currentIndex;

            if (diff === 0) {
                // Tarjeta Activa (Al frente)
                card.classList.add("gj:projects:card-active");
                card.setAttribute("data-id-project", currentKey);
                card.style.transform = "translate3d(0, 0, 0) scale(1) rotateY(0deg)";
                card.style.opacity = "1";
                card.style.filter = "none";
                card.style.zIndex = "25";
                card.style.pointerEvents = "auto";
            } else if (diff > 0) {
                // Tarjetas siguientes en el mazo (hacia la derecha y fondo Z)
                card.classList.remove("gj:projects:card-active");
                const offsetX = Math.min(diff * 38, 160);
                const offsetY = diff * -10;
                const offsetZ = -diff * 75;
                const scale = Math.max(0.68, 1 - diff * 0.07);
                const opacity = Math.max(0, 1 - diff * 0.24);
                const blur = diff * 2.2;

                card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${offsetZ}px) scale(${scale})`;
                card.style.opacity = `${opacity}`;
                card.style.filter = `blur(${blur}px) grayscale(35%)`;
                card.style.zIndex = `${20 - diff}`;
                card.style.pointerEvents = diff === 1 ? "auto" : "none";
            } else {
                // Tarjetas anteriores (salen por la izquierda)
                card.classList.remove("gj:projects:card-active");
                const offsetX = diff * 90;
                card.style.transform = `translate3d(${offsetX}px, 15px, -180px) scale(0.7) rotateY(-12deg)`;
                card.style.opacity = "0";
                card.style.filter = "blur(8px)";
                card.style.zIndex = "0";
                card.style.pointerEvents = "none";
            }
        });

        // 2. Actualizar Contador Superior
        if (currentNumEl) {
            currentNumEl.textContent = String(currentIndex + 1).padStart(2, "0");
        }

        // 3. Actualizar Dock de Miniaturas
        thumbnailItems.forEach((item, i) => {
            const isMatch = i === currentIndex;
            item.setAttribute("aria-selected", isMatch ? "true" : "false");
            if (isMatch) {
                item.classList.add("gj:projects:dock-item-active");
                item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            } else {
                item.classList.remove("gj:projects:dock-item-active");
            }
        });

        // 4. Aura ambiental reactiva
        if (typeof window !== "undefined" && window.setAuraGradient && currentProject?.brand_color) {
            window.setAuraGradient(currentProject.brand_color);
        }
    };

    const nextProject = () => updateDeck(currentIndex + 1);
    const prevProject = () => updateDeck(currentIndex - 1);

    // --------------------------------------------------------------------------
    // Conmutador de Modo de Vista (Hybrid View Switcher: Deck vs Matriz Grid)
    // --------------------------------------------------------------------------
    const setViewMode = (mode) => {
        currentViewMode = mode;

        if (mode === "grid") {
            wrapper?.classList.add("gj:projects:mode-grid");
            stage?.setAttribute("data-view-mode", "grid");
            switchGridBtn?.classList.add("gj:projects:switch-active");
            switchGridBtn?.setAttribute("aria-pressed", "true");
            switchDeckBtn?.classList.remove("gj:projects:switch-active");
            switchDeckBtn?.setAttribute("aria-pressed", "false");

            stopAutoplay();

            // Limpiar estilos inline 3D para que la cuadrícula CSS tome el control pleno
            cards.forEach((card) => {
                card.style.transform = "";
                card.style.opacity = "";
                card.style.filter = "";
                card.style.zIndex = "";
                card.style.pointerEvents = "";
                card.classList.remove("gj:projects:card-active");
            });
        } else {
            wrapper?.classList.remove("gj:projects:mode-grid");
            stage?.setAttribute("data-view-mode", "deck");
            switchDeckBtn?.classList.add("gj:projects:switch-active");
            switchDeckBtn?.setAttribute("aria-pressed", "true");
            switchGridBtn?.classList.remove("gj:projects:switch-active");
            switchGridBtn?.setAttribute("aria-pressed", "false");

            // Recalcular mazo 3D en la posición actual
            updateDeck(currentIndex);
        }
    };

    if (switchDeckBtn) {
        switchDeckBtn.addEventListener("click", () => setViewMode("deck"));
    }
    if (switchGridBtn) {
        switchGridBtn.addEventListener("click", () => setViewMode("grid"));
    }

    // Navegación por flechas en el mazo 3D
    prevBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        prevProject();
    });

    nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        nextProject();
    });

    // Navegación por Dock de Miniaturas
    thumbnailItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentViewMode === "grid") {
                setViewMode("deck");
            }
            updateDeck(index);
        });
    });

    // Clic en tarjetas
    cards.forEach((card, index) => {
        card.addEventListener("click", (e) => {
            // Si hace clic en el botón CTA, se gestiona independientemente
            if (e.target.closest(".gj\\:projects\\:card-cta")) return;

            if (currentViewMode === "grid") {
                // En modo matriz, hacer clic en cualquier tarjeta abre su ficha técnica
                const key = card.getAttribute("data-id-project") || projectKeys[index];
                openProjectModal(key);
            } else {
                // En modo mazo 3D
                if (index === currentIndex) {
                    const key = card.getAttribute("data-id-project") || projectKeys[currentIndex];
                    openProjectModal(key);
                } else {
                    updateDeck(index);
                }
            }
        });
    });

    // Navegación por Teclado
    window.addEventListener("keydown", (e) => {
        if (modalProjects && modalProjects.classList.contains("show")) return;
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

        if (currentViewMode === "deck") {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                nextProject();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                prevProject();
            } else if (e.key === "Enter") {
                const activeCard = cards[currentIndex];
                const key = activeCard?.getAttribute("data-id-project") || projectKeys[currentIndex];
                openProjectModal(key);
            }
        }
    });

    // Gestos Táctiles Swipe en Modo 3D
    let touchStartX = 0;
    if (stage) {
        stage.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        stage.addEventListener("touchend", (e) => {
            if (modalProjects && modalProjects.classList.contains("show")) return;
            if (currentViewMode === "grid") return;

            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 45) {
                if (diff > 0) nextProject();
                else prevProject();
            }
        }, { passive: true });
    }

    // Autoplay Controller
    const startAutoplay = () => {
        isAutoplayRunning = true;
        playPauseBtn?.classList.add("gj:projects:autoplay-active");
        autoplayInterval = setInterval(nextProject, 4500);
    };

    const stopAutoplay = () => {
        isAutoplayRunning = false;
        playPauseBtn?.classList.remove("gj:projects:autoplay-active");
        if (autoplayInterval) clearInterval(autoplayInterval);
    };

    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", () => {
            if (currentViewMode === "grid") {
                setViewMode("deck");
                startAutoplay();
                return;
            }
            if (isAutoplayRunning) stopAutoplay();
            else startAutoplay();
        });
    }

    // --------------------------------------------------------------------------
    // Apertura y Poblamiento del Modal de Detalles
    // --------------------------------------------------------------------------
    const openProjectModal = (idProject) => {
        const modalEl = document.getElementById("gjModalProjects");
        if (!modalEl) {
            console.error("Modal #gjModalProjects no encontrado en el DOM");
            return;
        }
        stopAutoplay();

        const currentProject = data.projects[idProject];
        if (!currentProject) {
            console.warn(`No se encontraron datos para el proyecto "${idProject}"`);
            return;
        }

        // Elementos del Modal
        const titleEl = modalEl.querySelector(".gj\\:modal\\:projects\\:title");
        const catEl = modalEl.querySelector(".gj\\:modal\\:projects\\:category");
        const expEl = modalEl.querySelector(".gj\\:modal\\:projects\\:experience");
        const bannerEl = modalEl.querySelector("#gjModalProjectsBanner");
        const paragraphsEl = modalEl.querySelector(".gj\\:modal\\:projects\\:paragraphs");
        const techListEl = modalEl.querySelector("#gjModalProjectsTechList");
        const gallerySection = modalEl.querySelector("#gjModalProjectsGallerySection");
        const galleryGrid = modalEl.querySelector("#gjModalProjectsGallery");

        if (titleEl) titleEl.textContent = currentProject.title;
        if (catEl) catEl.innerHTML = `<span class="gj:modal:projects:prefix-cat-exp">Categoría: </span>${currentProject.category}`;
        if (expEl) expEl.innerHTML = `<span class="gj:modal:projects:prefix-cat-exp">Experiencia: </span>${currentProject.experience_time}`;
        if (bannerEl) {
            bannerEl.src = `./src/assets/img/projects/${idProject}/${currentProject.screenshot}.png`;
            bannerEl.alt = `Captura de pantalla de ${currentProject.title}`;
        }

        // Párrafos dinámicos de descripción
        if (paragraphsEl && currentProject.description) {
            paragraphsEl.innerHTML = currentProject.description
                .split("\n")
                .filter((p) => p.trim() !== "")
                .map((p) => `<p class="gj:modal:projects:paragraph">${p.trim()}</p>`)
                .join("");
        }

        // Chips de tecnologías
        if (techListEl && currentProject.technologies) {
            techListEl.innerHTML = currentProject.technologies
                .map((tech) => `
                    <span class="gj:modal:projects:tech-chip" style="--chip-brand: ${currentProject.brand_color};">
                        <span class="gj:modal:projects:tech-dot"></span>
                        <span>${tech}</span>
                    </span>
                `)
                .join("");
        }

        // Galería PhotoSwipe 5 de Capturas de Pantalla
        if (galleryGrid && currentProject.screenshots_gallery && currentProject.screenshots_gallery.length > 0) {
            if (gallerySection) gallerySection.style.display = "block";
            galleryGrid.innerHTML = currentProject.screenshots_gallery
                .map((item) => `
                    <a 
                        href="./src/assets/img/projects/${idProject}${item.src}" 
                        data-pswp-width="${item.width || 1200}" 
                        data-pswp-height="${item.height || 800}" 
                        target="_blank" 
                        rel="noreferrer"
                        class="gj:modal:projects:gallery-item"
                        title="${item.title}"
                        aria-label="Ver captura completa: ${item.title}"
                    >
                        <img 
                            src="./src/assets/img/projects/${idProject}${item.src}" 
                            alt="${item.title}" 
                            loading="lazy" 
                            class="gj:modal:projects:gallery-img"
                        />
                        <div class="gj:modal:projects:gallery-overlay">
                            <div class="gj:modal:projects:gallery-caption-wrapper">
                                <span class="gj:modal:projects:gallery-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/>
                                    </svg>
                                </span>
                                <span class="gj:modal:projects:gallery-caption">${item.title}</span>
                            </div>
                        </div>
                    </a>
                `)
                .join("");
        } else if (gallerySection) {
            gallerySection.style.display = "none";
        }

        // Aura de Marca
        if (window.setAuraGradient && currentProject.brand_color) {
            window.setAuraGradient(currentProject.brand_color);
        }

        // Abrir Modal de Bootstrap
        try {
            const modalInstance = Modal.getOrCreateInstance(modalEl);
            modalInstance.show();
        } catch (err) {
            console.warn("Bootstrap Modal fallback triggered:", err);
            modalEl.classList.add("show");
            modalEl.style.display = "block";
            modalEl.removeAttribute("aria-hidden");
            modalEl.setAttribute("aria-modal", "true");
            document.body.classList.add("modal-open");
        }
    };

    window.openProjectModal = openProjectModal;

    window.closeProjectModal = () => {
        const modalEl = document.getElementById("gjModalProjects");
        if (!modalEl) return;
        try {
            const modalInstance = Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
                return;
            }
        } catch (e) {}
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        modalEl.removeAttribute("aria-modal");
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
    };

    window.actionButtonResize = () => {
        const modalEl = document.getElementById("gjModalProjects");
        if (!modalEl) return;
        const dialog = modalEl.querySelector(".modal-dialog");
        if (dialog) {
            dialog.classList.toggle("modal-lg");
            modalEl.classList.toggle("gj:modal:projects-resize");
        }
    };

    // Bind directo en cada botón CTA
    ctaButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const idProject = btn.getAttribute("data-id-project") || projectKeys[currentIndex];
            openProjectModal(idProject);
        });
    });

    if (modalProjects) {
        modalProjects.addEventListener("hidden.bs.modal", () => {
            modalProjects.querySelector(".modal-dialog")?.classList.remove("modal-lg");
            modalProjects.classList.remove("gj:modal:projects-resize");
            if (currentViewMode === "deck") {
                updateDeck(currentIndex);
            }
        });
    }

    // Inicialización del Deck
    updateDeck(0, true);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjects);
} else {
    initProjects();
}
