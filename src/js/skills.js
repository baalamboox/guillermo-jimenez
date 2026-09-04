import data from "../data/data.js";
import { audioEngine } from "./audio-engine.js";

let skillsAbortController = null;

const cleanupSkills = () => {
    if (skillsAbortController) {
        skillsAbortController.abort();
        skillsAbortController = null;
    }
};

document.addEventListener("astro:before-swap", cleanupSkills);

const initSkills = () => {
    cleanupSkills();

    const navList = document.getElementById("gjSkillsNavList");
    const dockContainer = document.getElementById("gjSkillsDock");
    const dockWrapper = document.getElementById("gjSkillsDockWrapper");
    const dockTooltip = document.getElementById("gjDockTooltip");
    const holoCard = document.getElementById("gjSkillsHoloCard");
    const stagePrevBtn = document.getElementById("stagePrevBtn");
    const stageNextBtn = document.getElementById("stageNextBtn");
    const stage = document.getElementById("gjSkillsStage");

    if (!navList || !dockContainer || !holoCard) return;

    skillsAbortController = new AbortController();
    const { signal } = skillsAbortController;

    let currentType = "technical";
    let currentSkillKey = Object.keys(data.skills.technical)[0];

    const generateTopicsHtml = (topicsData, emphasisColor) => {
        if (!topicsData) return "";
        const topicsList = Array.isArray(topicsData)
            ? topicsData
            : typeof topicsData === "string"
                ? topicsData.split(",")
                : [];

        return topicsList
            .map((topic) => `
                <li class="gj:skills:topic-chip" style="--chip-accent: ${emphasisColor};">
                    <span class="gj:skills:chip-check" style="color: ${emphasisColor};">✓</span>
                    <span class="gj:skills:chip-text">${String(topic).trim()}</span>
                </li>
            `)
            .join("");
    };

    let currentTooltipTarget = null;

    const positionTooltip = (targetItem) => {
        if (!dockTooltip || !targetItem || !dockWrapper) return;
        const title = targetItem.getAttribute("aria-label");
        if (!title) return;

        const itemRect = targetItem.getBoundingClientRect();
        const wrapperRect = dockWrapper.getBoundingClientRect();

        // Ocultar si el botón está fuera de la zona visible del dock por scroll
        if (itemRect.right < wrapperRect.left || itemRect.left > wrapperRect.right) {
            hideTooltip();
            return;
        }

        dockTooltip.textContent = title;
        const accent = targetItem.style.getPropertyValue("--dock-accent");
        if (accent) {
            dockTooltip.style.setProperty("--dock-tooltip-accent", accent.trim());
        } else {
            dockTooltip.style.removeProperty("--dock-tooltip-accent");
        }

        const leftPos = (itemRect.left - wrapperRect.left) + (itemRect.width / 2);
        dockTooltip.style.left = `${leftPos}px`;
        dockTooltip.classList.add("gj:skills:dock-tooltip-visible");
        dockTooltip.setAttribute("aria-hidden", "false");
    };

    const showTooltip = (targetItem) => {
        currentTooltipTarget = targetItem;
        positionTooltip(targetItem);
    };

    const hideTooltip = () => {
        if (!dockTooltip) return;
        currentTooltipTarget = null;
        dockTooltip.classList.remove("gj:skills:dock-tooltip-visible");
        dockTooltip.setAttribute("aria-hidden", "true");
    };

    const renderDockItems = (typeSkill) => {
        if (!dockContainer || !data.skills[typeSkill]) return;

        const skills = data.skills[typeSkill];
        const itemsHtml = Object.keys(skills)
            .map((key) => {
                const item = skills[key];
                const isActive = key === currentSkillKey;
                return `
                    <button class="gj:skills:dock-item ${isActive ? "gj:skills:dock-item-active" : ""}" 
                            data-item="${key}" 
                            data-type="${typeSkill}" 
                            style="--dock-accent: ${item.emphasis_color};"
                            type="button"
                            role="tab"
                            aria-selected="${isActive ? "true" : "false"}"
                            aria-label="${item.title}">
                        <span class="gj:skills:dock-glow" aria-hidden="true"></span>
                        <span class="gj:layout:svg-wrapper gj:skills:dock-svg">
                            <svg><use href="./src/assets/icons/gj.svg#${item.icon}"></use></svg>
                        </span>
                    </button>
                `;
            })
            .join("");

        dockContainer.innerHTML = itemsHtml;
    };

    const renderHoloCard = (skillKey, typeSkill) => {
        if (!holoCard || !data.skills[typeSkill] || !data.skills[typeSkill][skillKey]) return;

        const skill = data.skills[typeSkill][skillKey];
        const keys = Object.keys(data.skills[typeSkill]);
        const currentIndex = keys.indexOf(skillKey) + 1;
        const totalSkills = keys.length;

        holoCard.setAttribute("aria-label", `Detalles de ${skill.title}`);

        holoCard.innerHTML = `
            <div class="gj:skills:holo-ambient-glow" style="--holo-glow: ${skill.emphasis_color};"></div>
            
            <div class="gj:skills:holo-inner">
                <!-- Micro-Contador de Posición -->
                <div class="gj:skills:counter-badge" id="gjSkillsCounter">
                    <span>${currentIndex}</span> / ${totalSkills}
                </div>

                <!-- Icono Holográfico 3D con Anillo de Luz -->
                <div class="gj:skills:holo-icon-wrapper" style="--icon-accent: ${skill.emphasis_color};">
                    <div class="gj:skills:holo-icon-ring" aria-hidden="true"></div>
                    <span class="gj:layout:svg-wrapper gj:skills:holo-svg-wrapper">
                        <svg class="gj:skills:holo-icon"><use href="./src/assets/icons/gj.svg#${skill.icon}"></use></svg>
                    </span>
                </div>

                <!-- Título y Badges -->
                <div class="gj:skills:holo-header">
                    <h2 class="gj:skills:holo-title">${skill.title}</h2>
                    <div class="gj:skills:dual-badges">
                        <span class="gj:skills:badge-pill" style="--badge-accent: ${skill.emphasis_color};">
                            <span class="gj:skills:badge-dot" style="background-color: ${skill.emphasis_color};"></span>
                            <span class="gj:skills:badge-text">Nivel: ${skill.level}</span>
                        </span>
                        <span class="gj:skills:badge-pill gj:skills:badge-pill-secondary">
                            <span class="gj:skills:badge-icon">⚡</span>
                            <span class="gj:skills:badge-text">${skill.frequency}</span>
                        </span>
                        <span class="gj:skills:badge-pill gj:skills:badge-pill-secondary">
                            <span class="gj:skills:badge-icon">🚀</span>
                            <span class="gj:skills:badge-text">${skill.application}</span>
                        </span>
                    </div>
                </div>

                <!-- Chips de Competencias y Especialidades -->
                <div class="gj:skills:holo-topics-wrapper">
                    <p class="gj:skills:topics-heading">Competencias y Especialidades</p>
                    <ul class="gj:skills:chips-grid">
                        ${generateTopicsHtml(skill.mastered_topics || skill.topics, skill.emphasis_color)}
                    </ul>
                </div>
            </div>
        `;

        // Transición de aura suave al cambiar de habilidad
        if (window.setAuraGradient) {
            const color = skill.emphasis_color;
            const gradient = `radial-gradient(circle, ${color}DD 0%, ${color}55 45%, transparent 75%)`;
            window.setAuraGradient(gradient);
        }
    };

    const selectSkill = (skillKey, typeSkill) => {
        if (!data.skills[typeSkill] || !data.skills[typeSkill][skillKey]) return;

        currentSkillKey = skillKey;
        currentType = typeSkill;

        // Actualizar estado activo en el Dock
        const dockItems = dockContainer.querySelectorAll(".gj\\:skills\\:dock-item");
        dockItems.forEach((btn) => {
            const isMatch = btn.getAttribute("data-item") === skillKey;
            btn.classList.toggle("gj:skills:dock-item-active", isMatch);
            btn.setAttribute("aria-selected", isMatch ? "true" : "false");

            if (isMatch) {
                btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
        });

        // Re-renderizar tarjeta central con efecto de salida/entrada fluido
        holoCard.classList.add("gj:skills:holo-transition");
        setTimeout(() => {
            renderHoloCard(skillKey, typeSkill);
            holoCard.classList.remove("gj:skills:holo-transition");
        }, 120);
    };

    const navigateSkill = (direction) => {
        const keys = Object.keys(data.skills[currentType]);
        const currentIndex = keys.indexOf(currentSkillKey);
        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= keys.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = keys.length - 1;

        audioEngine.playLaserClick();
        selectSkill(keys[nextIndex], currentType);
    };

    // Flechas de navegación en el escenario
    if (stagePrevBtn) {
        stagePrevBtn.addEventListener("click", () => {
            audioEngine.playLaserClick();
            navigateSkill("prev");
        }, { signal });
    }
    if (stageNextBtn) {
        stageNextBtn.addEventListener("click", () => {
            audioEngine.playLaserClick();
            navigateSkill("next");
        }, { signal });
    }

    // Navegación con teclado (← / →)
    window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
        if (e.key === "ArrowLeft") {
            navigateSkill("prev");
        } else if (e.key === "ArrowRight") {
            navigateSkill("next");
        }
    }, { signal });

    // Desplazamiento horizontal con la rueda del mouse en el Dock
    if (dockContainer) {
        dockContainer.addEventListener("wheel", (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                dockContainer.scrollLeft += e.deltaY;
            }
        }, { signal, passive: false });
    }

    // Gestos táctiles Swipe en móvil
    let touchStartX = 0;
    let touchEndX = 0;
    if (stage) {
        stage.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { signal, passive: true });

        stage.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    navigateSkill("next");
                } else {
                    navigateSkill("prev");
                }
            }
        }, { signal, passive: true });
    }

    // Selector de Categoría (Pestañas Técnicas / Blandas)
    if (navList) {
        navList.addEventListener("click", (e) => {
            const tabBtn = e.target.closest(".gj\\:skills\\:tab-btn");
            if (!tabBtn) return;

            audioEngine.playLaserClick();
            hideTooltip();

            const allTabs = navList.querySelectorAll(".gj\\:skills\\:tab-btn");
            allTabs.forEach((btn) => {
                btn.classList.remove("gj:skills:tab-btn-active");
                btn.setAttribute("aria-selected", "false");
            });
            tabBtn.classList.add("gj:skills:tab-btn-active");
            tabBtn.setAttribute("aria-selected", "true");

            const navItem = tabBtn.getAttribute("data-nav-item");
            const typeKey = navItem === "soft-skills" ? "soft" : "technical";

            currentType = typeKey;
            currentSkillKey = Object.keys(data.skills[typeKey])[0];

            renderDockItems(typeKey);
            renderHoloCard(currentSkillKey, typeKey);
        }, { signal });
    }

    // Interacciones del dock (clic, hover, focus y scroll para el tooltip flotante)
    if (dockContainer) {
        dockContainer.addEventListener("click", (e) => {
            const item = e.target.closest(".gj\\:skills\\:dock-item");
            if (!item) return;

            audioEngine.playNavPulse();
            const itemKey = item.getAttribute("data-item");
            const typeKey = item.getAttribute("data-type");
            selectSkill(itemKey, typeKey);
        }, { signal });

        dockContainer.addEventListener("pointerover", (e) => {
            const item = e.target.closest(".gj\\:skills\\:dock-item");
            if (item) {
                showTooltip(item);
            }
        }, { signal });

        dockContainer.addEventListener("pointerout", (e) => {
            const related = e.relatedTarget;
            if (!related || !dockContainer.contains(related)) {
                hideTooltip();
            } else {
                const nextItem = related.closest(".gj\\:skills\\:dock-item");
                if (nextItem) {
                    showTooltip(nextItem);
                } else {
                    hideTooltip();
                }
            }
        }, { signal });

        dockContainer.addEventListener("focusin", (e) => {
            const item = e.target.closest(".gj\\:skills\\:dock-item");
            if (item) {
                showTooltip(item);
            }
        }, { signal });

        dockContainer.addEventListener("focusout", (e) => {
            const related = e.relatedTarget;
            if (!related || !dockContainer.contains(related)) {
                hideTooltip();
            }
        }, { signal });

        dockContainer.addEventListener("scroll", () => {
            if (currentTooltipTarget) {
                positionTooltip(currentTooltipTarget);
            }
        }, { signal, passive: true });

        window.addEventListener("resize", () => {
            if (currentTooltipTarget) {
                positionTooltip(currentTooltipTarget);
            }
        }, { signal, passive: true });
    }

    // Inicializar Aura Ambiental inmediata
    if (window.setAuraGradient && data.skills.technical[currentSkillKey]) {
        const color = data.skills.technical[currentSkillKey].emphasis_color;
        const gradient = `radial-gradient(circle, ${color}DD 0%, ${color}55 45%, transparent 75%)`;
        window.setAuraGradient(gradient);
    }
};

document.addEventListener("astro:page-load", initSkills);
