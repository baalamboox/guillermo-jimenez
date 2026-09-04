import data from "../data/data.js";

let experienceAbortController = null;

const cleanupExperience = () => {
    if (experienceAbortController) {
        experienceAbortController.abort();
        experienceAbortController = null;
    }
};

document.addEventListener("astro:before-swap", cleanupExperience);

const initExperience = () => {
    cleanupExperience();

    const listItems = Array.from(document.querySelectorAll(".gj\\:experience\\:list-item") || []);
    if (listItems.length === 0) return;

    experienceAbortController = new AbortController();
    const { signal } = experienceAbortController;

    let currentIndex = 0;
    const experiences = data.experience || [];

    const setActiveItem = (index) => {
        if (index < 0 || index >= listItems.length) return;
        currentIndex = index;

        listItems.forEach((item, i) => {
            const isActive = i === currentIndex;
            item.classList.toggle("gj:experience:list-item:active", isActive);
            item.setAttribute("aria-expanded", isActive ? "true" : "false");
        });

        // Sincronizar Aura Ambiental con el color de marca de la empresa
        const expData = experiences[currentIndex];
        if (expData && expData.brand_color && window.setAuraGradient) {
            const color = expData.brand_color;
            const gradient = `radial-gradient(circle, ${color}DD 0%, ${color}44 45%, transparent 75%)`;
            window.setAuraGradient(gradient);
        }
    };

    // Escuchador de clics en cada elemento de la lista
    listItems.forEach((item, i) => {
        item.addEventListener("click", (e) => {
            // Evitar interferir con el enlace externo si se hace clic directamente en él
            if (e.target.closest(".gj\\:experience\\:list-item\\:link")) return;
            setActiveItem(i);
        });

        // Soporte para teclado (Enter / Espacio)
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveItem(i);
            }
        });
    });

    // Navegación con flechas del teclado
    window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveItem((currentIndex + 1) % listItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveItem((currentIndex - 1 + listItems.length) % listItems.length);
        }
    }, { signal });

    // Activar el primer elemento y su aura inicial
    setActiveItem(0);
};

document.addEventListener("astro:page-load", initExperience);
