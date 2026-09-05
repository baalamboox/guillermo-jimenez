import { Modal } from "bootstrap";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import data from "../data/data.js";
import { audioEngine } from "./audio-engine.js";

let projectsAbortController = null;
let autoplayInterval = null;
let lightbox = null;

const cleanupProjects = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    if (lightbox) {
        try {
            lightbox.destroy();
        } catch (e) {}
        lightbox = null;
    }
    if (projectsAbortController) {
        projectsAbortController.abort();
        projectsAbortController = null;
    }
};

document.addEventListener("astro:before-swap", cleanupProjects);

const initProjects = () => {
    cleanupProjects();

    // Elementos del DOM
    const wrapper = document.getElementById("gjProjectsWrapper");
    const stage = document.getElementById("gjProjectsStage");
    const deck = document.getElementById("gjDeckStack");
    if (!deck) return;

    projectsAbortController = new AbortController();
    const { signal } = projectsAbortController;

    const projectKeys = Object.keys(data.projects);
    const totalProjects = projectKeys.length;
    let currentIndex = 0;
    let isAutoplayRunning = false;
    let currentViewMode = "deck"; // "deck" | "grid"

    const cards = Array.from(deck.querySelectorAll(".gj\\:projects\\:card") || []);
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
    try {
        lightbox = new PhotoSwipeLightbox({
            gallery: "#gjModalProjectsGallery",
            children: "a",
            pswpModule: PhotoSwipe,
            wheelToZoom: true,
            bgOpacity: 0.9,
            padding: { top: 20, bottom: 20, left: 20, right: 20 }
        });

        // Asegurar que la relación de aspecto siempre respete las dimensiones naturales de la imagen
        lightbox.addFilter("domItemData", (itemData, element, linkEl) => {
            const img = linkEl?.querySelector("img");
            if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
                itemData.w = img.naturalWidth;
                itemData.h = img.naturalHeight;
                itemData.width = img.naturalWidth;
                itemData.height = img.naturalHeight;
            }
            return itemData;
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
                card.style.pointerEvents = "auto";
            } else {
                // Tarjetas anteriores en el mazo (salen hacia la izquierda con perspectiva)
                card.classList.remove("gj:projects:card-active");
                const offsetX = Math.max(diff * 50, -220);
                const offsetY = Math.abs(diff) * -12;
                const offsetZ = diff * 65;
                const scale = Math.max(0.65, 1 - Math.abs(diff) * 0.08);
                const opacity = Math.max(0, 1 - Math.abs(diff) * 0.35);

                card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${offsetZ}px) scale(${scale}) rotateY(12deg)`;
                card.style.opacity = `${opacity}`;
                card.style.filter = "blur(3px) grayscale(50%)";
                card.style.zIndex = `${10 + diff}`;
                card.style.pointerEvents = "none";
            }
        });

        // 2. Actualizar HUD de Telemetría Numérica
        if (currentNumEl) {
            currentNumEl.textContent = String(currentIndex + 1).padStart(2, "0");
        }

        // 3. Sincronizar Dock de Miniaturas
        thumbnailItems.forEach((thumb, i) => {
            const isActive = i === currentIndex;
            thumb.classList.toggle("gj:projects:dock-item-active", isActive);
            thumb.setAttribute("aria-selected", isActive ? "true" : "false");

            if (isActive && !isInitial && thumbnailsContainer) {
                // Scroll horizontal ÚNICAMENTE dentro del contenedor del dock
                // NUNCA usar scrollIntoView porque desplaza el contenedor vertical de la página o ventana
                const thumbLeft = thumb.offsetLeft;
                const thumbWidth = thumb.offsetWidth;
                const containerWidth = thumbnailsContainer.clientWidth;
                thumbnailsContainer.scrollTo({
                    left: thumbLeft - (containerWidth / 2) + (thumbWidth / 2),
                    behavior: "smooth"
                });
            }
        });

        // 4. Sincronizar Aura Ambiental con el color de marca del proyecto
        if (window.setAuraGradient && currentProject && currentProject.brand_color) {
            const color = currentProject.brand_color;
            const gradient = `radial-gradient(circle, ${color}DD 0%, ${color}44 45%, transparent 75%)`;
            window.setAuraGradient(gradient);
        }
    };

    const nextProject = () => {
        updateDeck(currentIndex + 1);
    };

    const prevProject = () => {
        updateDeck(currentIndex - 1);
    };

    // --------------------------------------------------------------------------
    // Controlador de Modos de Visualización (3D Deck vs Matriz Grid)
    // --------------------------------------------------------------------------
    const setViewMode = (mode) => {
        currentViewMode = mode;

        if (mode === "grid") {
            stopAutoplay();
            stage?.setAttribute("data-view-mode", "grid");
            wrapper?.classList.add("gj:projects:mode-grid");
            switchGridBtn?.classList.add("gj:projects:switch-active");
            switchGridBtn?.setAttribute("aria-pressed", "true");
            switchDeckBtn?.classList.remove("gj:projects:switch-active");
            switchDeckBtn?.setAttribute("aria-pressed", "false");

            // Limpiar transforms en línea para que el Grid CSS controle el layout
            cards.forEach((card) => {
                card.style.transform = "";
                card.style.opacity = "";
                card.style.filter = "";
                card.style.zIndex = "";
                card.style.pointerEvents = "";
            });
        } else {
            stage?.setAttribute("data-view-mode", "deck");
            wrapper?.classList.remove("gj:projects:mode-grid");
            switchDeckBtn?.classList.add("gj:projects:switch-active");
            switchDeckBtn?.setAttribute("aria-pressed", "true");
            switchGridBtn?.classList.remove("gj:projects:switch-active");
            switchGridBtn?.setAttribute("aria-pressed", "false");

            updateDeck(currentIndex);
        }
    };

    // Eventos de Selector de Vista
    switchDeckBtn?.addEventListener("click", () => {
        audioEngine.playLaserClick();
        setViewMode("deck");
    }, { signal });

    switchGridBtn?.addEventListener("click", () => {
        audioEngine.playLaserClick();
        setViewMode("grid");
    }, { signal });

    // Eventos de Navegación del Deck
    prevBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        audioEngine.playLaserClick();
        prevProject();
    }, { signal });

    nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        audioEngine.playLaserClick();
        nextProject();
    }, { signal });

    // Navegación por Dock de Miniaturas
    thumbnailItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            audioEngine.playNavPulse();
            if (currentViewMode === "grid") {
                setViewMode("deck");
            }
            updateDeck(index);
        }, { signal });
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
        }, { signal });
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
    }, { signal });

    // Gestos Táctiles Swipe en Modo 3D
    let touchStartX = 0;
    if (stage) {
        stage.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { signal, passive: true });

        stage.addEventListener("touchend", (e) => {
            if (modalProjects && modalProjects.classList.contains("show")) return;
            if (currentViewMode === "grid") return;

            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 45) {
                if (diff > 0) nextProject();
                else prevProject();
            }
        }, { signal, passive: true });
    }

    // Autoplay Controller
    const startAutoplay = () => {
        isAutoplayRunning = true;
        playPauseBtn?.classList.add("gj:projects:autoplay-active");
        playPauseBtn?.setAttribute("aria-pressed", "true");
        playPauseBtn?.setAttribute("aria-label", "Pausar presentación automática");
        const autoplayText = playPauseBtn?.querySelector(".gj\\:projects\\:autoplay-text");
        if (autoplayText) autoplayText.textContent = "Pausa";
        autoplayInterval = setInterval(nextProject, 4500);
    };

    const stopAutoplay = () => {
        isAutoplayRunning = false;
        playPauseBtn?.classList.remove("gj:projects:autoplay-active");
        playPauseBtn?.setAttribute("aria-pressed", "false");
        playPauseBtn?.setAttribute("aria-label", "Reproducir presentación automática");
        const autoplayText = playPauseBtn?.querySelector(".gj\\:projects\\:autoplay-text");
        if (autoplayText) autoplayText.textContent = "Autoplay";
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", () => {
            audioEngine.playLaserClick();
            if (currentViewMode === "grid") {
                setViewMode("deck");
                startAutoplay();
                return;
            }
            if (isAutoplayRunning) stopAutoplay();
            else startAutoplay();
        }, { signal });
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
        const headerTitleLabel = modalEl.querySelector("#gjModalProjectsLabel");
        const titleEl = modalEl.querySelector("#gjModalProjectTitle") || modalEl.querySelector(".gj\\:modal\\:projects\\:title");
        const catBadge = modalEl.querySelector("#gjModalCategoryBadge");
        const expBadge = modalEl.querySelector("#gjModalExpBadge");
        const bannerContainer = modalEl.querySelector(".gj\\:modal\\:projects\\:banner");
        const bannerEl = modalEl.querySelector("#gjModalProjectsBanner");
        const paragraphsEl = modalEl.querySelector(".gj\\:modal\\:projects\\:paragraphs");
        const techListEl = modalEl.querySelector("#gjModalProjectsTechList");
        const gallerySection = modalEl.querySelector("#gjModalProjectsGallerySection");
        const galleryGrid = modalEl.querySelector("#gjModalProjectsGallery");

        // Inyectar color de marca dinámico al modal
        modalEl.style.setProperty("--modal-brand-color", currentProject.brand_color || "#00F0FF");

        if (headerTitleLabel) headerTitleLabel.textContent = currentProject.title;
        if (titleEl) titleEl.textContent = currentProject.title;
        
        if (catBadge) {
            const content = catBadge.querySelector(".gj\\:modal\\:projects\\:badge-content");
            if (content) content.textContent = currentProject.category;
            else catBadge.textContent = currentProject.category;
        }

        if (expBadge) {
            const content = expBadge.querySelector(".gj\\:modal\\:projects\\:badge-content");
            if (content) content.textContent = currentProject.experience_time;
            else expBadge.textContent = currentProject.experience_time;
        }
        
        if (bannerEl) {
            // Obtener imagen de la tarjeta activa en el DOM o fallback estático en public/
            const targetCard = cards.find(c => c.getAttribute("data-id-project") === idProject);
            const optimizedSrc = targetCard?.getAttribute("data-img-src");
            bannerEl.src = optimizedSrc || `/img/projects/${idProject}/${currentProject.screenshot}.png`;
            bannerEl.alt = `Captura de pantalla de ${currentProject.title}`;
            if (bannerContainer) {
                bannerContainer.classList.add("gj:modal:projects:banner-show");
            }
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
                        href="${item.src}" 
                        data-pswp-width="${item.width || 1200}" 
                        data-pswp-height="${item.height || 800}" 
                        target="_blank" 
                        rel="noreferrer"
                        class="gj:modal:projects:gallery-item"
                        title="${item.title}"
                        aria-label="Ver captura completa: ${item.title}"
                    >
                        <img 
                            src="${item.src}" 
                            alt="${item.title}" 
                            loading="lazy" 
                            class="gj:modal:projects:gallery-img"
                        />
                        <div class="gj:modal:projects:gallery-overlay">
                            <div class="gj:modal:projects:gallery-caption-wrapper">
                                <span class="gj:modal:projects:gallery-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/>
                                    </svg>
                                </span>
                                <span class="gj:modal:projects:gallery-caption">${item.title}</span>
                            </div>
                        </div>
                    </a>
                `)
                .join("");

            // Sincronizar dinámicamente dimensiones naturales en caso de que alguna imagen cargue asíncronamente
            galleryGrid.querySelectorAll(".gj\\:modal\\:projects\\:gallery-item").forEach((link) => {
                const img = link.querySelector("img");
                if (!img) return;
                const updateNaturalDimensions = () => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        link.setAttribute("data-pswp-width", String(img.naturalWidth));
                        link.setAttribute("data-pswp-height", String(img.naturalHeight));
                    }
                };
                if (img.complete) {
                    updateNaturalDimensions();
                } else {
                    img.addEventListener("load", updateNaturalDimensions, { once: true });
                }
            });
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
        const bannerContainer = modalEl.querySelector(".gj\\:modal\\:projects\\:banner");
        const bannerEl = modalEl.querySelector("#gjModalProjectsBanner");
        if (bannerContainer) {
            bannerContainer.classList.remove("gj:modal:projects:banner-show");
        }
        if (bannerEl) {
            bannerEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E";
        }
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
        }, { signal });
    });

    if (modalProjects) {
        modalProjects.addEventListener("hidden.bs.modal", () => {
            modalProjects.querySelector(".modal-dialog")?.classList.remove("modal-lg");
            modalProjects.classList.remove("gj:modal:projects-resize");
            const bannerContainer = modalProjects.querySelector(".gj\\:modal\\:projects\\:banner");
            const bannerEl = modalProjects.querySelector("#gjModalProjectsBanner");
            if (bannerContainer) {
                bannerContainer.classList.remove("gj:modal:projects:banner-show");
            }
            if (bannerEl) {
                bannerEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E";
            }
            if (currentViewMode === "deck") {
                updateDeck(currentIndex);
            }
        }, { signal });
    }

    // Soporte para scroll horizontal con rueda del ratón en el dock de miniaturas
    if (thumbnailsContainer) {
        thumbnailsContainer.addEventListener("wheel", (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                thumbnailsContainer.scrollLeft += e.deltaY;
            }
        }, { signal, passive: false });
    }

    // Garantizar que el contenedor principal de la vista comience siempre en el tope (sin auto-scroll residual)
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    if (thumbnailsContainer) {
        thumbnailsContainer.scrollLeft = 0;
    }

    // Inicialización del Deck (posicionamiento inicial estático sin animación ni salto)
    updateDeck(0, true);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            deck.classList.add("gj:projects:deck-ready");
        });
    });
};

document.addEventListener("astro:page-load", initProjects);
