import "bootstrap";
import { audioEngine } from "./audio-engine.js";
import { navigate } from "astro:transitions/client";

window.__gjAudioEngine = audioEngine;

// ============================================================================
// 1. ESTADO GLOBAL & CONTROLADOR DE AURA AMBIENTAL
// ============================================================================
let activeLayer = "A";
let auraTimeout = null;

window.setAuraGradient = (gradientString) => {
    const layerA = document.getElementById("gjShiningLayerA");
    const layerB = document.getElementById("gjShiningLayerB");
    if (!layerA || !layerB) return;

    if (auraTimeout) {
        clearTimeout(auraTimeout);
        auraTimeout = null;
    }

    if (activeLayer === "A") {
        layerB.style.background = gradientString;
        layerB.classList.add("gj:active");
        layerA.classList.remove("gj:active");
        activeLayer = "B";
    } else {
        layerA.style.background = gradientString;
        layerA.classList.add("gj:active");
        layerB.classList.remove("gj:active");
        activeLayer = "A";
    }
};

window.resetAura = (delay = 300) => {
    const layerA = document.getElementById("gjShiningLayerA");
    const layerB = document.getElementById("gjShiningLayerB");
    if (!layerA || !layerB) return;
    if (auraTimeout) clearTimeout(auraTimeout);
    auraTimeout = setTimeout(() => {
        layerA.classList.remove("gj:active");
        layerB.classList.remove("gj:active");
    }, delay);
};

// ============================================================================
// 2. CONTROL GLOBAL DE TEMA (DARK / LIGHT) + META THEME-COLOR
// ============================================================================
const getSavedTheme = () => {
    try {
        const saved = localStorage.getItem("dark-mode");
        if (saved !== null) return saved === "true";
    } catch (e) {}
    return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const applyTheme = (isDark, save = false) => {
    document.documentElement.setAttribute("dark-mode", isDark ? "true" : "false");
    const switchTheme = document.getElementById("gjSwitchTheme");
    if (switchTheme) switchTheme.checked = isDark;

    const metaThemeColor = document.getElementById("metaThemeColor");
    if (metaThemeColor) {
        metaThemeColor.setAttribute("content", isDark ? "#121214" : "#F4F5F7");
    }
    if (save) {
        try {
            localStorage.setItem("dark-mode", isDark ? "true" : "false");
        } catch (e) {}
        audioEngine.playThemeToggle(isDark);
    }
};

window.toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.getAttribute("dark-mode") === "true";
    applyTheme(!isCurrentlyDark, true);
};

// ============================================================================
// 3. MENÚ GLOBAL PARA COMPARTIR (SHARE MENU)
// ============================================================================
const toggleShare = (forceState) => {
    const shareContainer = document.getElementById("headerShareContainer") || document.querySelector(".gj\\:layout\\:header-share");
    const shareButton = document.getElementById("gjShareButton");
    if (!shareContainer || !shareButton) return;

    const isCurrentlyClosed = shareContainer.classList.contains("gj:layout:header-share-close");
    const shouldOpen = forceState !== undefined ? forceState : isCurrentlyClosed;

    shareContainer.classList.toggle("gj:layout:header-share-close", !shouldOpen);
    shareButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
};

window.closeShareMenu = () => toggleShare(false);

const updateShareLinks = () => {
    const shareWhatsApp = document.getElementById("shareWhatsApp");
    const shareFacebook = document.getElementById("shareFacebook");
    const shareLinkedIn = document.getElementById("shareLinkedIn");

    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("¡Hola! Te comparto el portafolio de Guillermo Jiménez, Desarrollador Web Frontend:");

    if (shareWhatsApp) {
        shareWhatsApp.href = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
    }
    if (shareFacebook) {
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    }
    if (shareLinkedIn) {
        shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    }
};

// ============================================================================
// 4. ACTUALIZACIÓN DE UI DEL BOTÓN DE SONIDO HUD
// ============================================================================
const updateSoundBtnUi = (isEnabled) => {
    const soundBtn = document.getElementById("gjSoundToggle");
    if (!soundBtn) return;
    soundBtn.setAttribute("data-sound-state", isEnabled ? "on" : "off");
    soundBtn.setAttribute("aria-label", isEnabled ? "Silenciar efectos de sonido [M]" : "Activar efectos de sonido [M]");
    soundBtn.title = isEnabled ? "Silenciar efectos de sonido [M]" : "Activar efectos de sonido [M]";
};

// ============================================================================
// 5. REGISTRO DE EVENTOS GLOBALES (SE EJECUTA SOLO UNA VEZ AL CARGAR EL MÓDULO)
// ============================================================================
let globalListenersRegistered = false;

const initGlobalListeners = () => {
    if (globalListenersRegistered) return;
    globalListenersRegistered = true;

    // A. Suscribir UI al estado del motor de audio
    audioEngine.onStateChange(updateSoundBtnUi);

    // B. Delegación de clic para alternar sonido HUD
    document.addEventListener("click", (e) => {
        if (e.target.closest("#gjSoundToggle")) {
            audioEngine.toggleSound();
        }
    });

    // C. Escuchar cambios de Switch de Tema
    document.addEventListener("change", (e) => {
        if (e.target && e.target.id === "gjSwitchTheme") {
            applyTheme(e.target.checked, true);
        }
    });

    // D. Escuchar cambios del sistema operativo para modo oscuro
    if (typeof window !== "undefined" && window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (localStorage.getItem("dark-mode") === null) {
                applyTheme(e.matches, false);
            }
        });
    }

    // E. Delegación de eventos del Menú Compartir
    document.addEventListener("click", async (e) => {
        const copyBtn = e.target.closest("#shareCopyLink");
        if (copyBtn) {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(window.location.href);
                copyBtn.classList.add("gj:copied");
                audioEngine.playSuccess();
                setTimeout(() => {
                    copyBtn.classList.remove("gj:copied");
                }, 2000);
            } catch (err) {
                console.error("Error al copiar enlace", err);
            }
            return;
        }

        const shareBtn = e.target.closest("#gjShareButton");
        if (shareBtn) {
            e.stopPropagation();
            audioEngine.playLaserClick();
            toggleShare();
            return;
        }

        const shareContainer = document.getElementById("headerShareContainer") || document.querySelector(".gj\\:layout\\:header-share");
        if (shareContainer && !shareContainer.contains(e.target)) {
            toggleShare(false);
        }
    });

    // F. Delegación reactiva de hover sónico para elementos interactivos
    const soundHoverSelectors = ".gj\\:home\\:tech-chip, .gj\\:modal\\:projects\\:tech-chip, .gj\\:projects\\:card, .gj\\:home\\:btn-primary, .gj\\:home\\:btn-cv, .gj\\:home\\:btn-secondary, .gj\\:projects\\:dock-item, .gj\\:layout\\:header-share-button, .gj\\:layout\\:header-sound-btn, .gj\\:skills\\:tab-btn, .gj\\:skills\\:dock-item, .gj\\:skills\\:topic-chip, .gj\\:ide\\:tab, .gj\\:ide\\:quick-cmd, .gj\\:layout\\:footer-menu-button, .gj\\:layout\\:header-menu-button, .gj\\:modal\\:projects\\:action-button, .gj\\:modal\\:projects\\:footer-close-btn";

    let lastHoverTarget = null;
    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest(soundHoverSelectors);
        if (target && target !== lastHoverTarget) {
            lastHoverTarget = target;
            audioEngine.playHoverTick();
        }
    }, { passive: true });

    // G. Delegación acústica para navegación (Footer y Logo del Header)
    // El sonido arranca en pointerdown inmediatamente antes del cambio de ruta de ClientRouter
    document.addEventListener("pointerdown", (e) => {
        const navBtn = e.target.closest(".gj\\:layout\\:footer-menu-button, .gj\\:layout\\:header-menu-button");
        if (navBtn) {
            audioEngine.playNavPulse();
        }
    }, { passive: true });

    document.addEventListener("click", (e) => {
        const navBtn = e.target.closest(".gj\\:layout\\:footer-menu-button, .gj\\:layout\\:header-menu-button");
        if (navBtn && e.detail === 0) {
            // Activación por teclado / accesibilidad
            audioEngine.playNavPulse();
        }
    });

    // H. Eventos de Sonido para Modales Bootstrap
    document.addEventListener("show.bs.modal", () => {
        audioEngine.playModalOpen();
    });
    document.addEventListener("hide.bs.modal", () => {
        audioEngine.playModalClose();
    });

    // I. Atajos Globales de Teclado con Navegación SPA Fluida (Astro ClientRouter)
    document.addEventListener("keydown", (e) => {
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || (document.activeElement && document.activeElement.isContentEditable)) {
            return;
        }

        const routes = {
            "1": "/",
            "2": "/habilidades",
            "3": "/proyectos",
            "4": "/experiencia",
            "5": "/acerca-de-mi"
        };

        if (routes[e.key]) {
            e.preventDefault();
            audioEngine.playNavPulse();
            const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
            if (currentPath !== routes[e.key]) {
                setTimeout(() => {
                    navigate(routes[e.key]);
                }, 85);
            }
        } else if (e.key === "t" || e.key === "T" || e.key === "d" || e.key === "D") {
            e.preventDefault();
            window.toggleTheme();
        } else if (e.key === "m" || e.key === "M") {
            e.preventDefault();
            audioEngine.toggleSound();
        } else if (e.key === "Escape") {
            window.closeShareMenu();
            if (typeof window.closeProjectModal === "function") {
                window.closeProjectModal();
            }
        }
    });

    // J. Respaldo de arranque de audio en la primera interacción si la política de autoplay lo bloqueó
    const triggerFirstInteractionBoot = () => {
        if (!window.__gjBootSoundPlayed && audioEngine.enabled) {
            window.__gjBootSoundPlayed = true;
            audioEngine.initContext();
            audioEngine.playBoot();
        }
    };
    window.addEventListener("pointerdown", triggerFirstInteractionBoot, { once: true, passive: true });
    window.addEventListener("keydown", triggerFirstInteractionBoot, { once: true, passive: true });

    // K. Manejador Global de Imágenes (Placeholder & Prevención de ALT Roto)
    document.addEventListener("error", (e) => {
        const img = e.target;
        if (img && img.tagName === "IMG") {
            if (!img.dataset.fallbackApplied) {
                img.dataset.fallbackApplied = "true";
                img.classList.add("gj:img-fallback");
                img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23121214'/%3E%3Cstop offset='100%25' stop-color='%231E1E24'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='250' fill='url(%23g)'/%3E%3Ccircle cx='200' cy='110' r='24' fill='%236366F1' opacity='0.25'/%3E%3Cpath d='M192 110a8 8 0 1 0 16 0 8 8 0 0 0-16 0z' fill='%2300F0FF' opacity='0.6'/%3E%3Cpath d='M150 170l35-35 25 25 35-40 45 50z' fill='%236366F1' opacity='0.2'/%3E%3C/svg%3E";
            }
        }
    }, true);

    document.addEventListener("load", (e) => {
        const img = e.target;
        if (img && img.tagName === "IMG") {
            img.classList.add("gj:img-loaded");
        }
    }, true);
};

// ============================================================================
// 6. ACTUALIZACIÓN POR CADA TRANSICIÓN DE VISTA (ASTRO CLIENTROUTER: astro:page-load)
// ============================================================================
const updatePageNavigation = () => {
    const pathname = window.location.pathname.replace(/\/$/, "") || "/";

    // 1. Sincronizar clases en <html>
    const viewClasses = [
        "gj:path:home",
        "gj:path:skills",
        "gj:path:projects",
        "gj:path:experience",
        "gj:path:about-me"
    ];
    document.documentElement.classList.remove(...viewClasses);

    switch (pathname) {
        case "/":
            document.documentElement.classList.add("gj:path:home");
            break;
        case "/habilidades":
            document.documentElement.classList.add("gj:path:skills");
            break;
        case "/proyectos":
            document.documentElement.classList.add("gj:path:projects");
            break;
        case "/experiencia":
            document.documentElement.classList.add("gj:path:experience");
            break;
        case "/acerca-de-mi":
            document.documentElement.classList.add("gj:path:about-me");
            break;
        default:
            break;
    }

    // 2. Resaltar enlace activo en el menú de navegación inferior
    const navButtons = document.querySelectorAll(".gj\\:layout\\:footer-menu-button");
    navButtons.forEach((btn) => {
        const targetPath = (btn.getAttribute("href") || "").replace(/\/$/, "") || "/";
        const isActive = (pathname === targetPath) || (targetPath !== "/" && pathname.startsWith(targetPath));
        btn.classList.toggle("gj:layout:footer-menu-active", isActive);
        if (isActive) {
            btn.setAttribute("aria-current", "page");
        } else {
            btn.removeAttribute("aria-current");
        }
    });

    // 3. Sincronizar enlaces del menú para compartir
    updateShareLinks();

    // 4. Sincronizar estado visual del botón de audio HUD
    updateSoundBtnUi(audioEngine.enabled);

    // 5. Sincronizar switch de tema con el tema preferido
    const preferredDark = getSavedTheme();
    applyTheme(preferredDark, false);

    // 6. Auto-cierre de cortesía del menú para compartir al navegar
    window.closeShareMenu();

    // 7. Marcar imágenes que ya estén cargadas en caché/memoria
    document.querySelectorAll("img").forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add("gj:img-loaded");
        }
    });
};

// Registrar listeners globales (una sola vez)
initGlobalListeners();

// Re-sincronizar tema de forma inmediata tras el swap de Astro para evitar cualquier discrepancia
document.addEventListener("astro:after-swap", () => {
    applyTheme(getSavedTheme(), false);
});

// Ejecutar en la carga inicial y en cada transición de ClientRouter
document.addEventListener("astro:page-load", updatePageNavigation);
