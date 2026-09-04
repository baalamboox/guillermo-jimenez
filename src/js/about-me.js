import data from "../data/data.js";
import { audioEngine } from "./audio-engine.js";

const initAboutMe = () => {
    const terminalOutput = document.getElementById("gjTerminalOutput");
    if (!terminalOutput) return;

    // --------------------------------------------------------------------------
    // 1. Manejador de Pestañas del IDE
    // --------------------------------------------------------------------------
    const tabs = Array.from(document.querySelectorAll(".gj\\:ide\\:tab") || []);
    const panels = Array.from(document.querySelectorAll(".gj\\:ide\\:panel") || []);
    const breadcrumbFile = document.getElementById("gjIdeBreadcrumbFile");

    const tabAuras = {
        profile: "radial-gradient(circle, #3B82F6DD 0%, #1D4ED844 45%, transparent 75%)",
        journey: "radial-gradient(circle, #10B981DD 0%, #05966944 45%, transparent 75%)",
        hobbies: "radial-gradient(circle, #8B5CF6DD 0%, #7C3AED44 45%, transparent 75%)",
        setup: "radial-gradient(circle, #F59E0BDD 0%, #D9770644 45%, transparent 75%)",
    };

    const tabFiles = {
        profile: "profile.tsx",
        journey: "journey.json",
        hobbies: "hobbies.yaml",
        setup: "setup.sh",
    };

    const activateTab = (tabId) => {
        tabs.forEach((t) => {
            const isMatch = t.getAttribute("data-tab-id") === tabId;
            t.classList.toggle("gj:ide:tab:active", isMatch);
            t.setAttribute("aria-selected", isMatch ? "true" : "false");
        });

        panels.forEach((p) => {
            const isMatch = p.id === `pane-${tabId}`;
            p.classList.toggle("gj:ide:panel:active", isMatch);
        });

        if (breadcrumbFile && tabFiles[tabId]) {
            breadcrumbFile.textContent = tabFiles[tabId];
        }

        if (tabAuras[tabId] && window.setAuraGradient) {
            window.setAuraGradient(tabAuras[tabId]);
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab-id");
            if (tabId) {
                audioEngine.playNavPulse();
                activateTab(tabId);
            }
        });
        tab.addEventListener("mouseenter", () => {
            audioEngine.playHoverTick();
        });
    });

    // --------------------------------------------------------------------------
    // 2. Motor de la Terminal Interactiva (CLI / Bash)
    // --------------------------------------------------------------------------
    const terminalForm = document.getElementById("gjTerminalForm");
    const terminalInput = document.getElementById("gjTerminalInput");
    const quickCmdBtns = Array.from(document.querySelectorAll(".gj\\:ide\\:quick-cmd") || []);

    const history = [];
    let historyIndex = -1;

    const printOutput = (cmd, contentHtml) => {
        if (!terminalOutput) return;

        const cmdLine = document.createElement("div");
        cmdLine.className = "gj:ide:term-cmd-entry";
        cmdLine.innerHTML = `
            <span class="gj:ide:term-prompt-prefix">guest@guillermo:~$</span>
            <span class="gj:ide:term-cmd-text">${cmd}</span>
        `;
        terminalOutput.appendChild(cmdLine);

        if (contentHtml) {
            const resLine = document.createElement("div");
            resLine.className = "gj:ide:term-response";
            resLine.innerHTML = contentHtml;
            terminalOutput.appendChild(resLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const executeCommand = (rawCmd) => {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        history.push(rawCmd);
        historyIndex = history.length;

        switch (cmd) {
            case "help":
                printOutput(cmd, `
                    <p class="term-text">Comandos disponibles:</p>
                    <ul class="term-cmd-list">
                        <li><span class="term-highlight">whoami</span> — Resumen profesional y bio</li>
                        <li><span class="term-highlight">skills</span> — Tecnologías y nivel de dominio</li>
                        <li><span class="term-highlight">experience</span> — Trayectoria laboral y empresas</li>
                        <li><span class="term-highlight">hobbies</span> — Pasiones y proyectos creativos</li>
                        <li><span class="term-highlight">setup</span> — Hardware y entorno de trabajo</li>
                        <li><span class="term-highlight">contact</span> — Enlaces de contacto directo</li>
                        <li><span class="term-highlight">clear</span> — Limpiar la consola</li>
                    </ul>
                `);
                break;

            case "whoami":
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">👤 ${data.about.name}</p>
                        <p class="term-muted">💼 ${data.about.title} | 📍 ${data.about.location}</p>
                        <p class="term-text" style="margin-top: 6px;">${data.about.bio}</p>
                        <p class="term-status" style="margin-top: 6px;">🟢 Estado: <span class="term-highlight">${data.about.status}</span></p>
                    </div>
                `);
                break;

            case "skills":
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">⚡ STACK TECNOLÓGICO PRINCIPAL:</p>
                        <p>• <span class="term-highlight">React.js / Next.js</span> [██████████] 95% (Avanzado)</p>
                        <p>• <span class="term-highlight">TypeScript</span>        [████████░░] 85% (Intermedio-Alto)</p>
                        <p>• <span class="term-highlight">Astro / SSG</span>       [█████████░] 90% (Avanzado)</p>
                        <p>• <span class="term-highlight">Tailwind CSS / SASS</span>[██████████] 95% (Avanzado)</p>
                        <p>• <span class="term-highlight">Node.js / Express</span>  [████████░░] 80% (Intermedio)</p>
                    </div>
                `);
                break;

            case "experience":
                activateTab("journey");
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">🏢 TRAYECTORIA LABORAL:</p>
                        <p>1. <span class="term-highlight">MacStore</span> — Frontend Developer (2024 - Presente)</p>
                        <p>2. <span class="term-highlight">Grupo Educativo Intelimundo</span> — FullStack (2022 - 2024)</p>
                        <p>3. <span class="term-highlight">Industria IUISA</span> — Frontend Developer (2021 - 2022)</p>
                        <p>4. <span class="term-highlight">TecNM Milpa Alta II</span> — Web Developer (2020 - 2021)</p>
                        <p class="term-muted" style="margin-top: 6px;">↳ Cambiado a la pestaña <b>journey.json</b> en el editor.</p>
                    </div>
                `);
                break;

            case "hobbies":
                activateTab("hobbies");
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">🎮 INTERESES & PASIONES:</p>
                        <p>• <b>Videojuegos:</b> Narrativas inmersivas & análisis de interfaces UI/HUD.</p>
                        <p>• <b>Música:</b> Creación sonora, synthwave & ambient para coding.</p>
                        <p>• <b>Viajes:</b> Fotografía urbana y exploración estética.</p>
                        <p class="term-muted" style="margin-top: 6px;">↳ Cambiado a la pestaña <b>hobbies.yaml</b> en el editor.</p>
                    </div>
                `);
                break;

            case "setup":
                activateTab("setup");
                const s = data.about.workspace?.setup || {};
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">⚙️ WORKSTATION & GEAR:</p>
                        <p>• <b>Hardware:</b> ${s.workstation || 'MacBook Pro / Custom PC'}</p>
                        <p>• <b>Monitor:</b> ${s.display || 'UltraWide 34"'}</p>
                        <p>• <b>Teclado/Mouse:</b> ${s.peripherals || 'Mecánico Custom + MX Master 3S'}</p>
                        <p>• <b>Editor:</b> ${s.editor || 'VS Code'}</p>
                        <p class="term-muted" style="margin-top: 6px;">↳ Cambiado a la pestaña <b>setup.sh</b> en el editor.</p>
                    </div>
                `);
                break;

            case "contact":
                printOutput(cmd, `
                    <div class="term-box">
                        <p class="term-bold">📬 ENLACES DE CONTACTO DIRECTO:</p>
                        <p>• <b>Email:</b> <a href="mailto:guillermojimenez@example.com" class="term-link">guillermojimenez@example.com</a></p>
                        <p>• <b>GitHub:</b> <a href="https://github.com" target="_blank" class="term-link">github.com/guillermo-jimenez</a></p>
                        <p>• <b>LinkedIn:</b> <a href="https://linkedin.com" target="_blank" class="term-link">linkedin.com/in/guillermo-jimenez</a></p>
                    </div>
                `);
                break;

            case "clear":
                if (terminalOutput) {
                    terminalOutput.innerHTML = "";
                }
                audioEngine.playLaserClick();
                break;

            case "sudo":
                printOutput(cmd, `<p class="term-error">Permission denied: Guillermo is already root in this system 😎</p>`);
                break;

            default:
                printOutput(cmd, `<p class="term-error">Comando no reconocido: "${rawCmd}". Escribe <span class="term-highlight">help</span> para ver la lista.</p>`);
                break;
        }
    };

    if (terminalForm && terminalInput) {
        terminalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            audioEngine.playKeyClick("Enter");
            const val = terminalInput.value;
            terminalInput.value = "";
            executeCommand(val);
        });

        // Sonido de teclado mecánico al escribir y navegación por historial con teclas ↑ y ↓
        terminalInput.addEventListener("keydown", (e) => {
            // Ignorar modificadores solos (Shift, Ctrl, Alt, Meta, CapsLock)
            if (!["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) {
                if (e.key !== "Enter") {
                    audioEngine.playKeyClick(e.key);
                }
            }

            if (e.key === "ArrowUp") {
                if (history.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = history[historyIndex];
                }
            } else if (e.key === "ArrowDown") {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    terminalInput.value = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    terminalInput.value = "";
                }
            }
        });
    }

    // Botones de Comandos Rápidos con sonido mecánico al accionar y hover tick
    quickCmdBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const cmd = btn.getAttribute("data-cmd");
            if (cmd) {
                audioEngine.playKeyClick("Enter");
                executeCommand(cmd);
            }
        });
        btn.addEventListener("mouseenter", () => {
            audioEngine.playHoverTick();
        });
    });

    // Iniciar aura de la pestaña profile
    activateTab("profile");
};

document.addEventListener("astro:page-load", initAboutMe);
