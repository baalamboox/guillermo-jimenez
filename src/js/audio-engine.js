/**
 * ============================================================================
 * CYBERPUNK & SCI-FI HUD AUDIO SYNTHESIS ENGINE 2.0
 * Síntesis de sonido y música procedural en tiempo real mediante Web Audio API (0 KB)
 * ============================================================================
 */

// Progresión armónica futurista cinematográfica (Ciclos cada 14 segundos)
const CYBER_PROGRESSION = [
    // Acorde 0: Dm9 (Deep Cyber Foundation - introspectivo y firme)
    { root: 73.42, notes: [110.00, 164.81, 220.00, 293.66, 329.63] },
    // Acorde 1: Bbmaj9#11 (Blade Runner Cosmic Void - etéreo y expansivo)
    { root: 58.27, notes: [116.54, 174.61, 233.08, 293.66, 369.99] },
    // Acorde 2: G9 sus4 (Solar Cyber Grid - tecnológico y envolvente)
    { root: 49.00, notes: [98.00, 146.83, 196.00, 261.63, 293.66] },
    // Acorde 3: Asus4 add9 (Quantum Singularity - resolución cuántica luminosa)
    { root: 55.00, notes: [110.00, 164.81, 220.00, 293.66, 329.63] }
];

// Escala Lidia/Dórica cibernética para arpegios y telemetría generativa
const TELEMETRY_SCALE = [
    440.00, // A4
    493.88, // B4
    554.37, // C#5
    587.33, // D5
    659.25, // E5
    739.99, // F#5
    880.00, // A5
    987.77, // B5
    1108.73, // C#6
    1318.51  // E6
];

class CyberAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxBus = null;
        this.bgmBus = null;
        this.bgmNodes = [];
        this.bgmTimers = [];
        this.bgmVoiceOscs = [];
        this.bgmRootOsc = null;
        this.bgmRootDetunedOsc = null;
        this.currentChordIndex = 0;
        this.bgmPlaying = false;
        this.bgmNominalGain = 0.16; // Nivel calibrado para atmósfera de fondo sutil
        this.lastHoverTime = 0;
        this.hoverDebounceMs = 35;

        // Estado inicial: persistido en localStorage (por defecto activado para experiencia inmersiva)
        let saved = null;
        try {
            saved = localStorage.getItem("gj_sound_enabled");
        } catch (e) {}
        this.enabled = saved !== null ? saved === "true" : true;

        this.listeners = new Set();
        this._bindGlobalWakeup();
    }

    /**
     * Reactiva proactivamente el contexto de audio en cambios de visibilidad o primer toque
     */
    _bindGlobalWakeup() {
        if (typeof window === "undefined") return;

        const wake = () => {
            this.resumeIfSuspended();
        };

        window.addEventListener("pointerdown", wake, { passive: true });
        window.addEventListener("keydown", wake, { passive: true });
        window.addEventListener("touchstart", wake, { passive: true });
        window.addEventListener("focus", wake, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                wake();
                if (this.enabled && this.bgmPlaying && this.bgmBus && this.ctx) {
                    const now = this.ctx.currentTime;
                    this.bgmBus.gain.cancelScheduledValues(now);
                    this.bgmBus.gain.setValueAtTime(this.bgmBus.gain.value, now);
                    this.bgmBus.gain.linearRampToValueAtTime(this.bgmNominalGain, now + 1.2);
                    this._resumeBgmGenerators();
                }
            } else if (document.visibilityState === "hidden") {
                if (this.bgmPlaying && this.bgmBus && this.ctx) {
                    const now = this.ctx.currentTime;
                    this.bgmBus.gain.cancelScheduledValues(now);
                    this.bgmBus.gain.setValueAtTime(this.bgmBus.gain.value, now);
                    this.bgmBus.gain.linearRampToValueAtTime(0.0001, now + 0.6);
                    this._pauseBgmGenerators();
                }
            }
        });
    }

    /**
     * Inicializa o reactiva el AudioContext con arquitectura de buses (SFX + BGM)
     */
    initContext() {
        if (typeof window === "undefined") return null;

        // Si el contexto se cerró por suspensión profunda del sistema operativo o cambio de dispositivo de audio
        if (this.ctx && this.ctx.state === "closed") {
            this.ctx = null;
            this.masterGain = null;
            this.sfxBus = null;
            this.bgmBus = null;
            this.bgmPlaying = false;
            this.bgmNodes = [];
            window.__gjSharedAudioCtx = null;
        }

        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;

            this.ctx = (window.__gjSharedAudioCtx && window.__gjSharedAudioCtx.state !== "closed")
                ? window.__gjSharedAudioCtx
                : new AudioContextClass();

            window.__gjSharedAudioCtx = this.ctx;

            // Master Gain: Control general de salida
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // Bus de Efectos de Sonido (SFX): Prioridad al 100% de presencia
            this.sfxBus = this.ctx.createGain();
            this.sfxBus.gain.setValueAtTime(1.0, this.ctx.currentTime);
            this.sfxBus.connect(this.masterGain);

            // Bus de Música de Fondo (BGM): Colchón ambiental atenuado con ducking
            this.bgmBus = this.ctx.createGain();
            this.bgmBus.gain.setValueAtTime(0.0001, this.ctx.currentTime);
            this.bgmBus.connect(this.masterGain);
        }

        return this.ctx;
    }

    /**
     * Reanuda el contexto si está suspendido e inicia BGM si corresponde
     */
    resumeIfSuspended() {
        const ctx = this.initContext();
        if (ctx && ctx.state === "suspended") {
            return ctx.resume().then(() => {
                if (this.enabled && !this.bgmPlaying) {
                    this.startBgm();
                }
            }).catch(() => {});
        } else if (ctx && ctx.state === "running") {
            if (this.enabled && !this.bgmPlaying) {
                this.startBgm();
            }
        }
        return Promise.resolve();
    }

    /**
     * Audio Ducking Dinámico (Sidechain en tiempo real):
     * Atenúa la música de fondo de manera inmediata y suave durante la reproducción de un efecto
     * y la restaura gradualmente a su volumen nominal cuando el efecto concluye.
     */
    duckBgm(duration = 0.22, duckRatio = 0.42) {
        if (!this.bgmBus || !this.ctx || !this.bgmPlaying) return;
        try {
            const now = this.ctx.currentTime;
            const nominal = this.bgmNominalGain;
            const target = nominal * duckRatio;

            const gainParam = this.bgmBus.gain;
            gainParam.cancelScheduledValues(now);
            gainParam.setValueAtTime(gainParam.value, now);
            // Caída suave y rápida en 20ms
            gainParam.linearRampToValueAtTime(target, now + 0.02);
            // Mantener durante la duración del efecto
            gainParam.setValueAtTime(target, now + duration);
            // Recuperación elegante hacia el volumen nominal
            gainParam.linearRampToValueAtTime(nominal, now + duration + 0.32);
        } catch (e) {}
    }

    /**
     * Inicia la atmósfera musical procedural si el sonido está habilitado
     */
    startBgm() {
        if (!this.enabled) return;
        const ctx = this.initContext();
        if (!ctx || ctx.state !== "running") return;
        if (this.bgmPlaying) return;

        this.bgmPlaying = true;
        this._createBgmNodes(ctx);
    }

    /**
     * Generador de Música Procedural Sci-Fi Avanzada (0 KB de audio externo):
     * 1. Progresión armónica dinámica entre 4 acordes cyberpunk con glide analógico suave.
     * 2. Arpegio cuántico generativo con destellos de telemetría holográfica espacial.
     * 3. Latido sub-bajo cibernético a 44 BPM (núcleo de estación orbital).
     * 4. Doble filtrado paso bajo y modulación LFO viva.
     */
    _createBgmNodes(ctx) {
        this._destroyBgmNodes();

        const now = ctx.currentTime;
        this.bgmNodes = [];
        this.bgmVoiceOscs = [];
        this.currentChordIndex = 0;
        const initialChord = CYBER_PROGRESSION[0];

        // 1. Filtro Paso Bajo Maestro para BGM (Separación Espectral)
        const bgmFilter = ctx.createBiquadFilter();
        bgmFilter.type = "lowpass";
        bgmFilter.frequency.setValueAtTime(380, now);
        bgmFilter.Q.setValueAtTime(1.1, now);
        bgmFilter.connect(this.bgmBus);
        this.bgmNodes.push(bgmFilter);

        // 2. Modulación LFO lenta ("Respiración" a ~0.03 Hz = ciclo de 33 segundos)
        const lfoOsc = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfoOsc.type = "sine";
        lfoOsc.frequency.setValueAtTime(0.03, now);
        lfoGain.gain.setValueAtTime(140, now);
        lfoOsc.connect(lfoGain);
        lfoGain.connect(bgmFilter.frequency);
        lfoOsc.start(now);
        this.bgmNodes.push(lfoOsc, lfoGain);

        // 3. Sub-Drone Raíz con Batimiento Analógico Detuned
        const rootOsc = ctx.createOscillator();
        const rootDetuned = ctx.createOscillator();
        const rootGain = ctx.createGain();

        rootOsc.type = "sine";
        rootOsc.frequency.setValueAtTime(initialChord.root, now);

        rootDetuned.type = "sine";
        rootDetuned.frequency.setValueAtTime(initialChord.root, now);
        rootDetuned.detune.setValueAtTime(3.8, now); // Batimiento analógico lento

        rootGain.gain.setValueAtTime(0.0001, now);
        rootGain.gain.linearRampToValueAtTime(0.24, now + 2.5);

        rootOsc.connect(rootGain);
        rootDetuned.connect(rootGain);
        rootGain.connect(bgmFilter);

        rootOsc.start(now);
        rootDetuned.start(now);

        this.bgmRootOsc = rootOsc;
        this.bgmRootDetunedOsc = rootDetuned;
        this.bgmNodes.push(rootOsc, rootDetuned, rootGain);

        // 4. Voces Armónicas Evolutivas del Acorde
        const voiceConfigs = [
            { gain: 0.16, type: "sine", pan: -0.2 },
            { gain: 0.12, type: "triangle", pan: 0.2 },
            { gain: 0.08, type: "sine", pan: -0.3 },
            { gain: 0.06, type: "sine", pan: 0.3 },
            { gain: 0.04, type: "triangle", pan: 0.0 }
        ];

        initialChord.notes.forEach((freq, idx) => {
            const config = voiceConfigs[idx] || { gain: 0.05, type: "sine", pan: 0 };
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = config.type;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(config.gain, now + 2.2 + (idx * 0.4));

            osc.connect(gain);

            if (ctx.createStereoPanner && config.pan !== 0) {
                try {
                    const panner = ctx.createStereoPanner();
                    panner.pan.setValueAtTime(config.pan, now);
                    gain.connect(panner);
                    panner.connect(bgmFilter);
                    this.bgmNodes.push(panner);
                } catch (e) {
                    gain.connect(bgmFilter);
                }
            } else {
                gain.connect(bgmFilter);
            }

            osc.start(now);
            this.bgmVoiceOscs.push(osc);
            this.bgmNodes.push(osc, gain);
        });

        // 5. Fade-in suave del bus de música de fondo (2.4s)
        this.bgmBus.gain.cancelScheduledValues(now);
        this.bgmBus.gain.setValueAtTime(0.0001, now);
        this.bgmBus.gain.linearRampToValueAtTime(this.bgmNominalGain, now + 2.4);

        // 6. Activar generadores dinámicos: progresión armónica, destellos de telemetría y sub-pulso
        this._resumeBgmGenerators();
    }

    _clearBgmTimers() {
        if (!this.bgmTimers) return;
        this.bgmTimers.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this.bgmTimers = [];
    }

    _pauseBgmGenerators() {
        this._clearBgmTimers();
    }

    _resumeBgmGenerators() {
        if (!this.bgmPlaying || !this.enabled) return;
        this._clearBgmTimers();
        this._scheduleChordProgression();
        this._scheduleNextTelemetrySparkle();
        this._startSubPulseLoop();
    }

    /**
     * Hace evolucionar el acorde hacia la siguiente etapa del ciclo armónico cada 14 segundos
     */
    _scheduleChordProgression() {
        if (!this.bgmPlaying || !this.enabled) return;
        const interval = setInterval(() => {
            if (!this.bgmPlaying || !this.enabled || !this.ctx || this.ctx.state !== "running") return;
            this.currentChordIndex = (this.currentChordIndex + 1) % CYBER_PROGRESSION.length;
            const targetChord = CYBER_PROGRESSION[this.currentChordIndex];
            const now = this.ctx.currentTime;
            const glideTime = 4.2; // 4.2 segundos de deslizamiento armónico orgánico

            if (this.bgmRootOsc) {
                try {
                    this.bgmRootOsc.frequency.cancelScheduledValues(now);
                    this.bgmRootOsc.frequency.setValueAtTime(this.bgmRootOsc.frequency.value, now);
                    this.bgmRootOsc.frequency.exponentialRampToValueAtTime(targetChord.root, now + glideTime);
                } catch (e) {}
            }
            if (this.bgmRootDetunedOsc) {
                try {
                    this.bgmRootDetunedOsc.frequency.cancelScheduledValues(now);
                    this.bgmRootDetunedOsc.frequency.setValueAtTime(this.bgmRootDetunedOsc.frequency.value, now);
                    this.bgmRootDetunedOsc.frequency.exponentialRampToValueAtTime(targetChord.root, now + glideTime);
                } catch (e) {}
            }

            if (this.bgmVoiceOscs && this.bgmVoiceOscs.length > 0) {
                this.bgmVoiceOscs.forEach((osc, i) => {
                    const targetFreq = targetChord.notes[i] || targetChord.notes[targetChord.notes.length - 1];
                    try {
                        osc.frequency.cancelScheduledValues(now);
                        osc.frequency.setValueAtTime(osc.frequency.value, now);
                        osc.frequency.exponentialRampToValueAtTime(targetFreq, now + glideTime);
                    } catch (e) {}
                });
            }
        }, 14000);
        this.bgmTimers.push(interval);
    }

    /**
     * Genera destellos cristalinos esparcidos en el espacio estéreo (Micro-telemetría holográfica)
     */
    _triggerTelemetrySparkle(ctx) {
        if (!this.bgmPlaying || !this.ctx || !this.bgmBus || this.ctx.state !== "running") return;

        try {
            const now = ctx.currentTime;
            const freq = TELEMETRY_SCALE[Math.floor(Math.random() * TELEMETRY_SCALE.length)];
            const panVal = (Math.random() * 1.2) - 0.6; // Panning estéreo flotante

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = Math.random() > 0.4 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, now);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(freq, now);
            filter.Q.setValueAtTime(3.8, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

            osc.connect(filter);
            filter.connect(gain);

            if (ctx.createStereoPanner) {
                try {
                    const panner = ctx.createStereoPanner();
                    panner.pan.setValueAtTime(panVal, now);
                    gain.connect(panner);
                    panner.connect(this.bgmBus);
                } catch (e) {
                    gain.connect(this.bgmBus);
                }
            } else {
                gain.connect(this.bgmBus);
            }

            osc.start(now);
            osc.stop(now + 1.45);
        } catch (e) {}
    }

    _scheduleNextTelemetrySparkle() {
        if (!this.bgmPlaying || !this.enabled) return;
        const delay = 1600 + Math.random() * 2400; // Intervalo pseudo-aleatorio de 1.6s a 4.0s
        const timer = setTimeout(() => {
            if (this.bgmPlaying && this.enabled && this.ctx) {
                this._triggerTelemetrySparkle(this.ctx);
                this._scheduleNextTelemetrySparkle();
            }
        }, delay);
        this.bgmTimers.push(timer);
    }

    /**
     * Genera un pulso sutil de sub-bajo (latido del reactor orbital a ~44 BPM)
     */
    _triggerSubPulse(ctx) {
        if (!this.bgmPlaying || !this.ctx || !this.bgmBus || this.ctx.state !== "running") return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(54, now);
            osc.frequency.exponentialRampToValueAtTime(38, now + 0.4);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(80, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.055, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.bgmBus);

            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {}
    }

    _startSubPulseLoop() {
        if (!this.bgmPlaying || !this.enabled) return;
        const interval = setInterval(() => {
            if (this.bgmPlaying && this.enabled && this.ctx) {
                this._triggerSubPulse(this.ctx);
            }
        }, 1350);
        this.bgmTimers.push(interval);
    }

    /**
     * Limpia y desconecta de forma segura todos los nodos y temporizadores
     */
    _destroyBgmNodes() {
        this._clearBgmTimers();
        this.bgmRootOsc = null;
        this.bgmRootDetunedOsc = null;
        this.bgmVoiceOscs = [];

        if (!this.bgmNodes || this.bgmNodes.length === 0) return;
        this.bgmNodes.forEach(node => {
            try {
                if (typeof node.stop === "function") {
                    node.stop();
                }
                node.disconnect();
            } catch (e) {}
        });
        this.bgmNodes = [];
    }

    /**
     * Detiene la música de fondo con un desvanecimiento suave (fade-out)
     */
    stopBgm(fadeDuration = 0.8) {
        if (!this.bgmPlaying || !this.ctx || !this.bgmBus) {
            this.bgmPlaying = false;
            this._destroyBgmNodes();
            return;
        }

        this.bgmPlaying = false;
        try {
            const now = this.ctx.currentTime;
            const gainParam = this.bgmBus.gain;
            gainParam.cancelScheduledValues(now);
            gainParam.setValueAtTime(gainParam.value, now);
            gainParam.linearRampToValueAtTime(0.0001, now + fadeDuration);

            setTimeout(() => {
                if (!this.bgmPlaying) {
                    this._destroyBgmNodes();
                }
            }, (fadeDuration * 1000) + 50);
        } catch (e) {
            this._destroyBgmNodes();
        }
    }

    /**
     * Wrapper de ejecución garantizada con Ducking automático:
     */
    _play(fn, duckDuration = 0.22) {
        if (!this.enabled) return;
        const ctx = this.initContext();
        if (!ctx) return;

        if (duckDuration > 0) {
            this.duckBgm(duckDuration);
        }

        if (ctx.state === "running") {
            try {
                if (!this.bgmPlaying) {
                    this.startBgm();
                }
                fn(ctx, ctx.currentTime);
            } catch (e) {
                console.warn("Audio play error:", e);
            }
        } else {
            ctx.resume().then(() => {
                if (ctx.state === "running") {
                    try {
                        if (!this.bgmPlaying) {
                            this.startBgm();
                        }
                        fn(ctx, ctx.currentTime);
                    } catch (e) {
                        console.warn("Audio play error:", e);
                    }
                }
            }).catch(() => {});
        }
    }

    /**
     * Alternar estado de sonido (Mute / Unmute)
     */
    toggleSound() {
        this.enabled = !this.enabled;
        try {
            localStorage.setItem("gj_sound_enabled", this.enabled ? "true" : "false");
        } catch (e) {}

        if (this.enabled) {
            this.resumeIfSuspended().then(() => {
                this.startBgm();
                this.playLaserClick();
            });
        } else {
            this.stopBgm();
        }

        this.notifyListeners();
        return this.enabled;
    }

    setSound(val) {
        this.enabled = !!val;
        try {
            localStorage.setItem("gj_sound_enabled", this.enabled ? "true" : "false");
        } catch (e) {}

        if (this.enabled) {
            this.resumeIfSuspended().then(() => {
                this.startBgm();
            });
        } else {
            this.stopBgm();
        }

        this.notifyListeners();
    }

    onStateChange(cb) {
        this.listeners.add(cb);
        cb(this.enabled);
        return () => this.listeners.delete(cb);
    }

    notifyListeners() {
        this.listeners.forEach(cb => {
            try { cb(this.enabled); } catch (e) { console.error(e); }
        });
    }

    /**
     * Efecto 1: Cybernetic Boot Chime (Carga completada / Sistema listo)
     * Resonancia ascendente con shimmer holográfico
     */
    playBoot() {
        this._play((ctx, now) => {
            // Tono 1: Reactor Sweep ascendente
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(160, now);
            osc1.frequency.exponentialRampToValueAtTime(780, now + 0.32);

            gain1.gain.setValueAtTime(0.001, now);
            gain1.gain.linearRampToValueAtTime(0.22, now + 0.08);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc1.connect(gain1);
            gain1.connect(this.sfxBus || this.masterGain);
            osc1.start(now);
            osc1.stop(now + 0.48);

            // Tono 2: Shimmer armónico de confirmación holográfica
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(1320, now + 0.16);
            osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.38);

            gain2.gain.setValueAtTime(0.001, now + 0.16);
            gain2.gain.linearRampToValueAtTime(0.12, now + 0.22);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

            osc2.connect(gain2);
            gain2.connect(this.sfxBus || this.masterGain);
            osc2.start(now + 0.16);
            osc2.stop(now + 0.55);
        }, 0.55);
    }

    /**
     * Efecto 2: Laser Tactical Click (Botones principales y conmutadores)
     * Disparo de capacitores cyber rápido (~45ms)
     */
    playLaserClick() {
        this._play((ctx, now) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(1300, now);
            osc.frequency.exponentialRampToValueAtTime(240, now + 0.045);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

            osc.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.05);
        }, 0.08);
    }

    /**
     * Efecto 3: Sonar Nav Pulse (Menú inferior & atajos de vista 1-5)
     * Pulso armónico filtrado con sensación espacial
     */
    playNavPulse() {
        this._play((ctx, now) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(700, now);
            filter.Q.setValueAtTime(6, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.085);
        }, 0.12);
    }

    /**
     * Efecto 4: Telemetry Hover Tick (Hover sobre chips y tarjetas)
     * Micro-blip ultrasutil con debounce para evitar saturación
     */
    playHoverTick() {
        if (!this.enabled) return;
        const nowMs = performance.now();
        if (nowMs - this.lastHoverTime < this.hoverDebounceMs) return;
        this.lastHoverTime = nowMs;

        const ctx = this.initContext();
        if (!ctx) return;

        // Si está suspendido por falta de interacción, intentar reanudar sin encolar hover stale
        if (ctx.state !== "running") {
            ctx.resume().catch(() => {});
            return;
        }

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(2400, now);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

            osc.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.026);
        } catch (e) {}
    }

    /**
     * Efecto 5: Airlock Modal Open (Apertura de caso de estudio)
     * Expansión y despresurización sónica holográfica
     */
    playModalOpen() {
        this._play((ctx, now) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(380, now + 0.16);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.2);
        }, 0.25);
    }

    /**
     * Efecto 6: Hydraulic Modal Close (Cierre con Esc o botón de cerrar)
     * Cierre hermético amortiguado
     */
    playModalClose() {
        this._play((ctx, now) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

            gain.gain.setValueAtTime(0.16, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.14);
        }, 0.18);
    }

    /**
     * Efecto 7: Cybernetic Access Granted (Copiar enlace del portafolio)
     * Secuencia de dos tonos brillantes armónicos
     */
    playSuccess() {
        this._play((ctx, now) => {
            // Tono 1 (E5 - 659.25 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0.18, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc1.connect(gain1);
            gain1.connect(this.sfxBus || this.masterGain);
            osc1.start(now);
            osc1.stop(now + 0.09);

            // Tono 2 (B5 - 987.77 Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(987.77, now + 0.07);
            gain2.gain.setValueAtTime(0.2, now + 0.07);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc2.connect(gain2);
            gain2.connect(this.sfxBus || this.masterGain);
            osc2.start(now + 0.07);
            osc2.stop(now + 0.24);
        }, 0.32);
    }

    /**
     * Efecto 8: Theme Switcher (Cambio de Modo Oscuro / Claro)
     */
    playThemeToggle(isDark) {
        this._play((ctx, now) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle";
            if (isDark) {
                // Sweep hacia arriba (activación de sensores nocturnos)
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);
            } else {
                // Sweep hacia abajo (activación de modo diurno)
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(260, now + 0.07);
            }

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

            osc.connect(gain);
            gain.connect(this.sfxBus || this.masterGain);

            osc.start(now);
            osc.stop(now + 0.085);
        }, 0.12);
    }

    /**
     * Efecto 9: Mechanical Keyboard Thock & Click (Terminal Interactiva)
     * Síntesis acústica de switch mecánico táctil (Cherry MX / Custom Lubed Switch)
     * @param {string} key - Tecla presionada (opcional: "Enter", " ", "Backspace", etc.)
     */
    playKeyClick(key = "") {
        this._play((ctx, now) => {
            const isEnter = key === "Enter";
            const isSpace = key === " " || key === "Space";
            const isBackspace = key === "Backspace";

            // Variación sutil de tono para realismo orgánico en cada tecla (acústica de keycaps)
            const pitchMod = 0.93 + Math.random() * 0.14;

            // 1. Componente de Chasquido / Click del Stem (Transitorio de alta frecuencia)
            const clickOsc = ctx.createOscillator();
            const clickGain = ctx.createGain();

            let clickFreq = 1900;
            if (isEnter) clickFreq = 1400;
            else if (isSpace) clickFreq = 1200;
            else if (isBackspace) clickFreq = 2100;
            else clickFreq = 1750 + Math.random() * 400;

            clickOsc.type = "triangle";
            clickOsc.frequency.setValueAtTime(clickFreq * pitchMod, now);
            clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.018);

            const clickGainVal = isEnter ? 0.2 : isSpace ? 0.17 : 0.14;
            clickGain.gain.setValueAtTime(clickGainVal, now);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

            clickOsc.connect(clickGain);
            clickGain.connect(this.sfxBus || this.masterGain);
            clickOsc.start(now);
            clickOsc.stop(now + 0.022);

            // 2. Componente de Resonancia / Thock de Fondo (Toque de la placa / chasis)
            const thockOsc = ctx.createOscillator();
            const thockFilter = ctx.createBiquadFilter();
            const thockGain = ctx.createGain();

            let baseFreq = 260;
            let decayDuration = 0.035;
            let thockGainVal = 0.16;

            if (isEnter) {
                baseFreq = 160;
                decayDuration = 0.055;
                thockGainVal = 0.24;
            } else if (isSpace) {
                baseFreq = 185;
                decayDuration = 0.045;
                thockGainVal = 0.2;
            } else if (isBackspace) {
                baseFreq = 290;
                decayDuration = 0.03;
                thockGainVal = 0.14;
            } else {
                baseFreq = 240 + Math.random() * 50;
            }

            thockOsc.type = "sine";
            thockOsc.frequency.setValueAtTime(baseFreq * pitchMod, now);
            thockOsc.frequency.exponentialRampToValueAtTime((baseFreq * 0.6) * pitchMod, now + decayDuration);

            thockFilter.type = "lowpass";
            thockFilter.frequency.setValueAtTime(isEnter ? 650 : 850, now);
            thockFilter.Q.setValueAtTime(2.2, now);

            thockGain.gain.setValueAtTime(0.001, now);
            thockGain.gain.linearRampToValueAtTime(thockGainVal, now + 0.002);
            thockGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

            thockOsc.connect(thockFilter);
            thockFilter.connect(thockGain);
            thockGain.connect(this.sfxBus || this.masterGain);

            thockOsc.start(now);
            thockOsc.stop(now + decayDuration + 0.008);
        }, 0.06);
    }
}

// Instancia única (Singleton) exportada y accesible globalmente
export const audioEngine = new CyberAudioEngine();
if (typeof window !== "undefined") {
    window.cyberAudio = audioEngine;
    window.__gjAudioEngine = audioEngine;
}
