import "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Detección de vista actual por pathname
    let currentView = "";
    const pathname = window.location.pathname.replace(/\/$/, "") || "/";

    switch (pathname) {
        case "/":
            currentView = "gj:path:home";
            break;
        case "/habilidades":
            currentView = "gj:path:skills";
            break;
        case "/proyectos":
            currentView = "gj:path:projects";
            break;
        case "/experiencia":
            currentView = "gj:path:experience";
            break;
        case "/acerca-de-mi":
            currentView = "gj:path:about-me";
            break;
        default:
            break;
    }

    document.documentElement.classList.add("gj:content-loaded");
    if (currentView) {
        document.documentElement.classList.add(currentView);
    }

    // Resaltar enlace activo en el menú de navegación inferior
    const navButtons = document.querySelectorAll(".gj\\:layout\\:footer-menu-button");
    navButtons.forEach((btn) => {
        const targetPath = (btn.getAttribute("href") || "").replace(/\/$/, "") || "/";
        const isActive = (pathname === targetPath) || (targetPath !== "/" && pathname.startsWith(targetPath));
        if (isActive) {
            btn.classList.add("gj:layout:footer-menu-active");
            btn.setAttribute("aria-current", "page");
        }
    });

    // 2. Lógica robusta de cambio de tema (Dark / Light) + Meta Theme-Color
    const initTheme = () => {
        const switchTheme = document.getElementById("gjSwitchTheme");
        const metaThemeColor = document.getElementById("metaThemeColor");

        const applyTheme = (isDark, save = false) => {
            document.documentElement.setAttribute("dark-mode", isDark ? "true" : "false");
            if (switchTheme) switchTheme.checked = isDark;
            if (metaThemeColor) {
                metaThemeColor.setAttribute("content", isDark ? "#121214" : "#F4F5F7");
            }
            if (save) {
                localStorage.setItem("dark-mode", isDark ? "true" : "false");
            }
        };

        // Leer estado actual de :root (configurado previamente en <head>)
        const currentDark = document.documentElement.getAttribute("dark-mode") === "true";
        applyTheme(currentDark, false);

        // Escuchar interacción del usuario con el switch
        if (switchTheme) {
            switchTheme.addEventListener("change", (e) => {
                applyTheme(e.target.checked, true);
            });
        }

        // Escuchar cambios del sistema operativo si no se ha configurado manualmente
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (localStorage.getItem("dark-mode") === null) {
                applyTheme(e.matches, false);
            }
        });

        window.toggleTheme = () => {
            const isDark = document.documentElement.getAttribute("dark-mode") === "true";
            applyTheme(!isDark, true);
        };
    };

    initTheme();

    // 3. Menú inteligente para compartir (Share menu)
    const initShare = () => {
        const shareContainer = document.getElementById("headerShareContainer") || document.querySelector(".gj\\:layout\\:header-share");
        const shareButton = document.getElementById("gjShareButton");
        const copyLinkBtn = document.getElementById("shareCopyLink");
        const shareWhatsApp = document.getElementById("shareWhatsApp");
        const shareFacebook = document.getElementById("shareFacebook");
        const shareLinkedIn = document.getElementById("shareLinkedIn");

        if (!shareContainer || !shareButton) return;

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

        // Copiar enlace al portapapeles con confirmación visual
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    copyLinkBtn.classList.add("gj:copied");
                    setTimeout(() => {
                        copyLinkBtn.classList.remove("gj:copied");
                    }, 2000);
                } catch (err) {
                    console.error("Error al copiar enlace", err);
                }
            });
        }

        const toggleShare = (forceState) => {
            const isCurrentlyClosed = shareContainer.classList.contains("gj:layout:header-share-close");
            const shouldOpen = forceState !== undefined ? forceState : isCurrentlyClosed;

            shareContainer.classList.toggle("gj:layout:header-share-close", !shouldOpen);
            shareButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        };

        // Auto-cierre de cortesía tras 2.5s al cargar la página
        setTimeout(() => {
            toggleShare(false);
        }, 2500);

        // Abrir / Cerrar al hacer clic en el botón
        shareButton.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleShare();
        });

        // Cerrar al hacer clic en cualquier lugar fuera del contenedor
        document.addEventListener("click", (e) => {
            if (!shareContainer.contains(e.target)) {
                toggleShare(false);
            }
        });

        window.closeShareMenu = () => toggleShare(false);
    };

    initShare();

    // 4. Controlador de Aura Ambiental con Doble Buffer (Cross-Fade continuo y suave)
    const layerA = document.getElementById("gjShiningLayerA");
    const layerB = document.getElementById("gjShiningLayerB");
    let activeLayer = "A";
    let auraTimeout = null;

    window.setAuraGradient = (gradientString) => {
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
        if (!layerA || !layerB) return;
        if (auraTimeout) clearTimeout(auraTimeout);
        auraTimeout = setTimeout(() => {
            layerA.classList.remove("gj:active");
            layerB.classList.remove("gj:active");
        }, delay);
    };

    // 5. Atajos Globales de Teclado (Accesibilidad y Navegación Rápida)
    document.addEventListener("keydown", (e) => {
        // Ignorar si el usuario está escribiendo en un input, textarea o terminal
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
            if (pathname !== routes[e.key]) {
                window.location.href = routes[e.key];
            }
        } else if (e.key === "t" || e.key === "T" || e.key === "d" || e.key === "D") {
            e.preventDefault();
            if (typeof window.toggleTheme === "function") {
                window.toggleTheme();
            }
        } else if (e.key === "Escape") {
            if (typeof window.closeShareMenu === "function") {
                window.closeShareMenu();
            }
        }
    });
});



