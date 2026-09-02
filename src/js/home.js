document.addEventListener("DOMContentLoaded", () => {
    const avatarWrapper = document.querySelector(".gj\\:home\\:avatar-wrapper");
    const badgeTop = document.querySelector(".gj\\:home\\:badge-top");
    const badgeBottom = document.querySelector(".gj\\:home\\:badge-bottom");
    const techChips = document.querySelectorAll(".gj\\:home\\:tech-chip");
    const btnPrimary = document.querySelector(".gj\\:home\\:btn-primary");
    const conicGlow = document.querySelector(".gj\\:home\\:conic-glow");
    const sparkles = document.querySelectorAll(".gj\\:home\\:sparkle");
    const avatarFrame = document.querySelector(".gj\\:home\\:avatar-frame");

    // Gradientes temáticos por tecnología para la capa reactiva
    const reactiveGradients = {
        react: "radial-gradient(circle, rgba(19, 153, 196, 0.85) 0%, rgba(0, 216, 255, 0.45) 45%, transparent 75%)",
        astro: "radial-gradient(circle, rgba(255, 93, 1, 0.85) 0%, rgba(224, 35, 78, 0.45) 45%, transparent 75%)",
        typescript: "radial-gradient(circle, rgba(49, 120, 198, 0.85) 0%, rgba(59, 130, 246, 0.45) 45%, transparent 75%)",
        javascript: "radial-gradient(circle, rgba(235, 218, 28, 0.85) 0%, rgba(247, 223, 30, 0.45) 45%, transparent 75%)",
        tailwind: "radial-gradient(circle, rgba(56, 189, 248, 0.85) 0%, rgba(2, 132, 199, 0.45) 45%, transparent 75%)",
        bootstrap: "radial-gradient(circle, rgba(121, 82, 179, 0.85) 0%, rgba(147, 51, 234, 0.45) 45%, transparent 75%)",
        nodejs: "radial-gradient(circle, rgba(63, 135, 59, 0.85) 0%, rgba(34, 197, 94, 0.45) 45%, transparent 75%)",
        projects: "radial-gradient(circle, rgba(99, 102, 241, 0.85) 0%, rgba(168, 85, 247, 0.45) 45%, transparent 75%)",
    };

    // Interacción con Tech Chips
    techChips.forEach((chip) => {
        const techKey = chip.getAttribute("data-tech");
        if (reactiveGradients[techKey]) {
            chip.addEventListener("mouseenter", () => {
                if (window.setAuraGradient) {
                    window.setAuraGradient(reactiveGradients[techKey]);
                }
            });

            chip.addEventListener("mouseleave", () => {
                if (window.resetAura) {
                    window.resetAura(250);
                }
            });
        }
    });

    // Interacción con Botón Primario
    if (btnPrimary) {
        btnPrimary.addEventListener("mouseenter", () => {
            if (window.setAuraGradient) {
                window.setAuraGradient(reactiveGradients.projects);
            }
        });

        btnPrimary.addEventListener("mouseleave", () => {
            if (window.resetAura) {
                window.resetAura(250);
            }
        });
    }

    // Parallax interactivo y Tilt 3D optimizado con requestAnimationFrame (60/120fps)
    if (avatarWrapper && window.matchMedia("(min-width: 992px)").matches) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isMoving = false;
        let rafId = null;

        const updateParallax = () => {
            // Suavizado exponencial (lerp)
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            if (badgeTop) {
                badgeTop.style.setProperty("--badge-x", `${(currentX * 1.6).toFixed(2)}px`);
                badgeTop.style.setProperty("--badge-y", `${(currentY * 1.6).toFixed(2)}px`);
            }
            if (badgeBottom) {
                badgeBottom.style.setProperty("--badge-x", `${(-currentX * 1.3).toFixed(2)}px`);
                badgeBottom.style.setProperty("--badge-y", `${(-currentY * 1.3).toFixed(2)}px`);
            }
            if (conicGlow) {
                conicGlow.style.transform = `translate(${(currentX * 0.8).toFixed(2)}px, ${(currentY * 0.8).toFixed(2)}px)`;
            }
            if (avatarFrame) {
                const tiltX = (currentY * -0.7).toFixed(2);
                const tiltY = (currentX * 0.7).toFixed(2);
                avatarFrame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            }

            sparkles.forEach((sparkle, idx) => {
                const mult = (idx + 1) * 0.9;
                sparkle.style.transform = `translate(${(currentX * mult).toFixed(2)}px, ${(currentY * mult).toFixed(2)}px)`;
            });

            if (Math.abs(mouseX - currentX) > 0.01 || Math.abs(mouseY - currentY) > 0.01) {
                rafId = requestAnimationFrame(updateParallax);
            } else {
                isMoving = false;
            }
        };

        window.addEventListener("mousemove", (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            mouseX = (e.clientX - centerX) / 40;
            mouseY = (e.clientY - centerY) / 40;

            if (!isMoving) {
                isMoving = true;
                rafId = requestAnimationFrame(updateParallax);
            }
        });

        avatarWrapper.addEventListener("mouseleave", () => {
            mouseX = 0;
            mouseY = 0;
            if (!isMoving) {
                isMoving = true;
                rafId = requestAnimationFrame(updateParallax);
            }
        });
    }
});



