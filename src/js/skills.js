import data from "../data/data.js";

document.addEventListener("DOMContentLoaded", () => {
    const navList = document.getElementById("gjSkillsNavList");
    const dockContainer = document.getElementById("gjSkillsDock");
    const holoCard = document.getElementById("gjSkillsHoloCard");
    const stagePrevBtn = document.getElementById("stagePrevBtn");
    const stageNextBtn = document.getElementById("stageNextBtn");
    const stage = document.getElementById("gjSkillsStage");

    let currentType = "technical";
    let currentSkillKey = Object.keys(data.skills.technical)[0];

    const generateTopicsHtml = (stringCommas, emphasisColor) => {
        return stringCommas
            .split(",")
            .map((topic) => `
                <li class="gj:skills:topic-chip" style="--chip-accent: ${emphasisColor};">
                    <span class="gj:skills:chip-check" style="color: ${emphasisColor};">✓</span>
                    <span class="gj:skills:chip-text">${topic.trim()}</span>
                </li>
            `)
            .join("");
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
                        <span class="gj:skills:dock-tooltip" role="tooltip">${item.title}</span>
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
                        ${generateTopicsHtml(skill.mastered_topics, skill.emphasis_color)}
                    </ul>
                </div>
            </div>
        `;

        // Animación de entrada
        holoCard.classList.remove("gj:skills:card-enter");
        requestAnimationFrame(() => {
            holoCard.classList.add("gj:skills:card-enter");
        });

        // Actualizar Aura Ambiental
        if (window.setAuraGradient && skill.emphasis_color) {
            const gradient = `radial-gradient(circle, ${skill.emphasis_color}DD 0%, ${skill.emphasis_color}55 45%, transparent 75%)`;
            window.setAuraGradient(gradient);
        }
    };

    const selectSkill = (skillKey, typeSkill) => {
        currentSkillKey = skillKey;
        currentType = typeSkill;

        // Actualizar clases y roles activos en el dock
        const dockItems = dockContainer.querySelectorAll(".gj\\:skills\\:dock-item");
        dockItems.forEach((item) => {
            const isMatch = item.getAttribute("data-item") === skillKey;
            item.setAttribute("aria-selected", isMatch ? "true" : "false");
            if (isMatch) {
                item.classList.add("gj:skills:dock-item-active");
                item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            } else {
                item.classList.remove("gj:skills:dock-item-active");
            }
        });

        renderHoloCard(skillKey, typeSkill);
    };

    const navigateSkill = (direction) => {
        const keys = Object.keys(data.skills[currentType]);
        const currentIndex = keys.indexOf(currentSkillKey);
        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= keys.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = keys.length - 1;

        selectSkill(keys[nextIndex], currentType);
    };

    // Parallax 3D Tilt en la tarjeta central
    if (stage && holoCard) {
        stage.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;
            const rect = holoCard.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            const rotateX = (-mouseY / (rect.height / 2)) * 6;
            const rotateY = (mouseX / (rect.width / 2)) * 6;

            holoCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        stage.addEventListener("mouseleave", () => {
            holoCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    }

    // Navegación con flechas del escenario
    if (stagePrevBtn) {
        stagePrevBtn.addEventListener("click", () => navigateSkill("prev"));
    }
    if (stageNextBtn) {
        stageNextBtn.addEventListener("click", () => navigateSkill("next"));
    }

    // Navegación con teclado (← / →)
    window.addEventListener("keydown", (e) => {
        // Ignorar si el usuario está escribiendo en un input o textarea
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
        if (e.key === "ArrowLeft") {
            navigateSkill("prev");
        } else if (e.key === "ArrowRight") {
            navigateSkill("next");
        }
    });

    // Desplazamiento horizontal con la rueda del mouse en el Dock
    if (dockContainer) {
        dockContainer.addEventListener("wheel", (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                dockContainer.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // Gestos táctiles Swipe en móvil
    let touchStartX = 0;
    let touchEndX = 0;
    if (stage) {
        stage.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

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
        }, { passive: true });
    }

    // Selector de Categoría (Pestañas Técnicas / Blandas)
    if (navList) {
        navList.addEventListener("click", (e) => {
            const tabBtn = e.target.closest(".gj\\:skills\\:tab-btn");
            if (!tabBtn) return;

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
        });
    }

    // Clic en items del dock
    if (dockContainer) {
        dockContainer.addEventListener("click", (e) => {
            const item = e.target.closest(".gj\\:skills\\:dock-item");
            if (!item) return;

            const itemKey = item.getAttribute("data-item");
            const typeKey = item.getAttribute("data-type");
            selectSkill(itemKey, typeKey);
        });
    }

    // Inicializar Aura Ambiental inmediata
    if (window.setAuraGradient && data.skills.technical[currentSkillKey]) {
        const color = data.skills.technical[currentSkillKey].emphasis_color;
        const gradient = `radial-gradient(circle, ${color}DD 0%, ${color}55 45%, transparent 75%)`;
        window.setAuraGradient(gradient);
    }
});
