const data = {
    "skills" : {
        "technical" : {
            "reactjs" : {
                "icon" : "iconReactJS",
                "title" : "React JS",
                "category" : "frontend",
                "featured" : true,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Frontend Core & SPAs",
                "emphasis_color" : "#1399C4",
                "mastered_topics" : "Componentes Funcionales,Hooks & Custom Hooks,Manejo de Estado (Context/Zustand),React Router,Optimización & Virtual DOM,Integración de REST APIs"
            },
            "astro" : {
                "icon" : "iconAstro",
                "title" : "Astro",
                "category" : "frontend",
                "featured" : true,
                "level" : "Avanzado",
                "frequency" : "Producción",
                "application" : "SSG / SSR & Rendimiento",
                "emphasis_color" : "#FF5D01",
                "mastered_topics" : "Arquitectura Islas (Islands),Componentes Astro (.astro),Server-Side Rendering (SSR),Optimización de imágenes y Assets,Content Collections,Generación Estática (SSG)"
            },
            "typescript" : {
                "icon" : "iconTypeScript",
                "title" : "TypeScript",
                "category" : "frontend",
                "featured" : true,
                "level" : "Intermedio",
                "frequency" : "Uso Diario",
                "application" : "Tipado & Arquitectura",
                "emphasis_color" : "#3178C6",
                "mastered_topics" : "Tipado estático & Interfaces,Tipos genéricos (Generics),Uniones e Intersecciones,Type Narrowing,Configuración tsconfig,Integración con React/Node"
            },
            "javascript" : {
                "icon" : "iconJavaScript",
                "title" : "JavaScript (ES6+)",
                "category" : "frontend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Lógica & Web Apps",
                "emphasis_color" : "#EBDA1C",
                "mastered_topics" : "Async/Await & Promesas,Manipulación avanzada del DOM,Closures & Scope,Desestructuración & Modules,Programación funcional,Patrones de diseño"
            },
            "tailwind" : {
                "icon" : "iconTailwind",
                "title" : "Tailwind CSS",
                "category" : "frontend",
                "featured" : true,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Design Systems & UI",
                "emphasis_color" : "#3EBFF8",
                "mastered_topics" : "Utility-First Workflow,Diseño Responsivo Ágil,Configuración de temas personalizados,Dark Mode nativo,Optimización JIT,Componentes reutilizables"
            },
            "bootstrap" : {
                "icon" : "iconBootstrap",
                "title" : "Bootstrap",
                "category" : "frontend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Producción",
                "application" : "Maquetación & SASS",
                "emphasis_color" : "#7110F4",
                "mastered_topics" : "Diseños responsivos,Sistemas Grid y Flexbox,Personalización con SASS,Manejo de Breakpoints,Componentes interactivos,Migración a nuevas versiones"
            },
            "html5" : {
                "icon" : "iconHTML5",
                "title" : "HTML5",
                "category" : "frontend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Semántica & Accesibilidad",
                "emphasis_color" : "#DD4B25",
                "mastered_topics" : "HTML semántico,Accesibilidad web (ARIA/a11y),SEO On-page,Optimización de carga & Core Web Vitals,Audio/Video & Canvas,Formularios accesibles"
            },
            "css3" : {
                "icon" : "iconCSS3",
                "title" : "CSS3",
                "category" : "frontend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Layouts & Animaciones",
                "emphasis_color" : "#264DE4",
                "mastered_topics" : "CSS Grid & Flexbox,Animaciones & Keyframes GPU,Custom Properties (Variables),Glassmorphism & Neumorphism,Media Queries & Container Queries,Arquitecturas BEM"
            },
            "nodejs" : {
                "icon" : "iconNodeJS",
                "title" : "Node JS",
                "category" : "backend",
                "featured" : true,
                "level" : "Intermedio",
                "frequency" : "Frecuente",
                "application" : "REST APIs & Backend",
                "emphasis_color" : "#3F873B",
                "mastered_topics" : "Express.js framework,Creación de APIs RESTful,Autenticación JWT,Operaciones de sistema de archivos,Conexión a Bases de Datos,Middlewares & Routing"
            },
            "git" : {
                "icon" : "iconGit",
                "title" : "Git",
                "category" : "backend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "Control de Versiones",
                "emphasis_color" : "#F05133",
                "mastered_topics" : "Control de versiones,Branching Strategies (GitFlow),Resolución de conflictos,Rebase interactivo,Stash & Cherry-pick,Comandos avanzados CLI"
            },
            "github" : {
                "icon" : "iconGitHub",
                "title" : "GitHub",
                "category" : "backend",
                "featured" : false,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "CI/CD & Colaboración",
                "emphasis_color" : "#A1A1AA",
                "mastered_topics" : "Pull Requests & Code Reviews,GitHub Actions (CI/CD),GitHub Pages & Releases,Gestión de proyectos e Issues,Colaboración en equipo"
            },
            "laravel" : {
                "icon" : "iconLaravel",
                "title" : "Laravel",
                "category" : "backend",
                "featured" : false,
                "level" : "Intermedio",
                "frequency" : "Frecuente",
                "application" : "Backend MVC & ORM",
                "emphasis_color" : "#F53003",
                "mastered_topics" : "Arquitectura MVC,Eloquent ORM & Migraciones,Blade Templating,Middleware & Rutas,Creación de REST APIs,Autenticación & Seguridad"
            },
            "php" : {
                "icon" : "iconPHP",
                "title" : "PHP",
                "category" : "backend",
                "featured" : false,
                "level" : "Intermedio",
                "frequency" : "Frecuente",
                "application" : "Lógica Backend & APIs",
                "emphasis_color" : "#4F5B93",
                "mastered_topics" : "POO (Programación Orientada a Objetos),Manejo de formularios y sesiones,Conexión a base de datos PDO,Consumo y creación de APIs,Seguridad y validaciones"
            },
            "mysql" : {
                "icon" : "iconMySQL",
                "title" : "MySQL",
                "category" : "backend",
                "featured" : false,
                "level" : "Intermedio",
                "frequency" : "Frecuente",
                "application" : "Modelado & Consultas",
                "emphasis_color" : "#00758F",
                "mastered_topics" : "Modelado relacional,Consultas avanzadas (JOINs/GROUP BY),Índices y optimización,Claves foráneas e integridad,Procedimientos & Transacciones"
            },
            "figma" : {
                "icon" : "iconFigma",
                "title" : "Figma",
                "category" : "design",
                "featured" : true,
                "level" : "Avanzado",
                "frequency" : "Uso Diario",
                "application" : "UI/UX & Prototipado",
                "emphasis_color" : "#A259FF",
                "mastered_topics" : "Diseño UI/UX,Design Systems & Tokens,Auto-layout & Variantes,Prototipado interactivo,Handoff para desarrollo,Wireframing & Mockups"
            },
            "adobexd" : {
                "icon" : "iconAdobeXD",
                "title" : "Adobe XD",
                "category" : "design",
                "featured" : false,
                "level" : "Intermedio",
                "frequency" : "Ocasional",
                "application" : "Diseño de Interfaces",
                "emphasis_color" : "#FF61F6",
                "mastered_topics" : "Diseño de interfaces,Componentes y estados de componentes,Prototipos navegables,Guías de estilo visual,Exportación de recursos"
            }
        },
        "soft" : {
            "teamwork" : {
                "icon" : "iconWorkTeam",
                "title" : "Trabajo en Equipo",
                "category" : "soft",
                "featured" : true,
                "level" : "Clave",
                "frequency" : "Constante",
                "application" : "Colaboración & Mentoring",
                "emphasis_color" : "#6366F1",
                "mastered_topics" : "Colaboración multidisciplinaria,Comunicación asertiva y empática,Pair Programming & Mentoring,Revisión constructiva de código,Alineación con metas del equipo"
            },
            "agile" : {
                "icon" : "iconAgile",
                "title" : "Metodologías Ágiles",
                "category" : "soft",
                "featured" : false,
                "level" : "Clave",
                "frequency" : "Uso Diario",
                "application" : "Scrum & Kanban Sprints",
                "emphasis_color" : "#10B981",
                "mastered_topics" : "Framework Scrum & Tableros Kanban,Sprints & Daily Standup Meetings,Estimación y desglose de tareas,Retrospectivas y mejora continua,Enfoque en entregas de valor"
            },
            "problem_solving" : {
                "icon" : "iconProblemSolving",
                "title" : "Resolución de Problemas",
                "category" : "soft",
                "featured" : false,
                "level" : "Clave",
                "frequency" : "Constante",
                "application" : "Análisis Crítico & Debugging",
                "emphasis_color" : "#F59E0B",
                "mastered_topics" : "Pensamiento analítico y crítico,Depuración de errores complejos (Debugging),Análisis de causa raíz,Adaptabilidad ante cambios técnicos,Búsqueda eficiente de soluciones"
            },
            "continuous_learning" : {
                "icon" : "iconLearning",
                "title" : "Aprendizaje Continuo",
                "category" : "soft",
                "featured" : false,
                "level" : "Clave",
                "frequency" : "Constante",
                "application" : "Innovación & Crecimiento",
                "emphasis_color" : "#EC4899",
                "mastered_topics" : "Investigación técnica autodidacta,Adopción ágil de nuevos frameworks,Actualización en tendencias web,Proactividad e iniciativa técnica,Atención minuciosa al detalle"
            }
        }
    },
    "projects" : {
        "macstore" : {
            "title" : "MacStore",
            "screenshot" : "macstore-project",
            "category" : "E-Commerce & Retail",
            "experience_time" : "2 años",
            "brand_color" : "#555555",
            "technologies" : ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap", ".NET"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-1.png", "title": "Portal de Comercio Electrónico y Catálogo Apple", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-2.png", "title": "Embudo de Compra y Proceso de Checkout", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-3.png", "title": "Portal Empresarial MacStore B2B", "width": 1200, "height": 800 }
            ],
            "description" : "Durante mi experiencia en MacStore, participé activamente en el desarrollo y mantenimiento de la interfaz de usuario del sitio web oficial de retail Apple en México, enfocándome en mejorar la experiencia del cliente mediante interfaces intuitivas, accesibles y visualmente atractivas.\nTrabajé con tecnologías como HTML5, CSS3, JavaScript y React para la maquetación y desarrollo de componentes dinámicos, asegurando compatibilidad responsive en distintos dispositivos. También colaboré en la optimización del embudo de compra, gestión del carrito interactivo y validaciones seguras en el proceso de checkout."
        },
        "liverpool" : {
            "title" : "Liverpool",
            "screenshot" : "liverpool-project",
            "category" : "E-Commerce Masivo",
            "experience_time" : "1 año",
            "brand_color" : "#E1007A",
            "technologies" : ["React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "REST APIs"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-4.png", "title": "Catálogo Departamental y Filtros en Tiempo Real", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-5.png", "title": "Vista Detallada de Producto y Disponibilidad", "width": 1200, "height": 800 }
            ],
            "description" : "En Liverpool, formé parte del equipo frontend responsable de modernizar módulos clave del portal de comercio electrónico departamental más grande de México.\nImplementé interfaces modulares de alta velocidad con React y TypeScript, reduciendo tiempos de renderizado en catlogos con miles de productos. Desarrollé filtros dinámicos en tiempo real, mejoras en el sistema de búsqueda y optimizaciones de accesibilidad conforme a estándares WCAG."
        },
        "microsoft" : {
            "title" : "Microsoft",
            "screenshot" : "microsoft-project",
            "category" : "Enterprise Solutions",
            "experience_time" : "3 años",
            "brand_color" : "#00A4EF",
            "technologies" : ["TypeScript", "React", "Fluent UI", "Node.js", "Azure", "HTML5"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-6.png", "title": "Dashboard Corporativo con Design System Fluent UI", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-7.png", "title": "Módulo de Gestión y Flujos de Alta Concurrencia", "width": 1200, "height": 800 }
            ],
            "description" : "Durante mi colaboración en proyectos del ecosistema Microsoft, desarrollé plataformas y portales corporativos orientados a la productividad y gestión empresarial.\nDiseñé componentes altamente reutilizables aplicando el Design System Fluent UI, garantizando consistencia visual multiplataforma y tipado robusto con TypeScript. Integré servicios en la nube de Azure y optimicé la arquitectura frontend para flujos de trabajo de alta concurrencia."
        },
        "nu" : {
            "title" : "Nu Bank",
            "screenshot" : "nu-project",
            "category" : "Fintech & Banking",
            "experience_time" : "8 meses",
            "brand_color" : "#820AD1",
            "technologies" : ["React", "TypeScript", "Tailwind CSS", "Microfrontends", "Node.js"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-8.png", "title": "Onboarding Digital y Solicitud de Tarjeta de Crédito", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-1.png", "title": "Panel de Control Financiero y Movimientos", "width": 1200, "height": 800 }
            ],
            "description" : "En Nu Bank, colaboré en el desarrollo de experiencias web para productos financieros y onboarding digital de clientes.\nConstruí microfrontends responsivos con React y Tailwind CSS, priorizando la seguridad en el manejo de datos, la claridad en el flujo de solicitud de tarjetas y cuentas, y una interacción visual ágil que refleja la identidad fresca y moderna de la fintech."
        },
        "volkswagen" : {
            "title" : "Volkswagen",
            "screenshot" : "volkswagen-project",
            "category" : "Automotriz & UI Interactiva",
            "experience_time" : "1 año",
            "brand_color" : "#001E50",
            "technologies" : ["JavaScript", "HTML5", "CSS3", "Bootstrap", "Web Animations", "SASS"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-2.png", "title": "Configurador Interactivo de Modelos Vehiculares", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-3.png", "title": "Cotizador de Financiamiento y Agendado de Test Drive", "width": 1200, "height": 800 }
            ],
            "description" : "Para Volkswagen, desarrollé configuradores interactivos y páginas de aterrizaje dinámicas para el lanzamiento de nuevos modelos vehiculares.\nImplementé vistas 360° interactivas, cotizadores de financiamiento en tiempo real y módulos para agendar pruebas de manejo en concesionarias, optimizando la tasa de conversión en campañas publicitarias a nivel nacional."
        },
        "walmart" : {
            "title" : "Walmart",
            "screenshot" : "walmart-project",
            "category" : "Supermarket & Delivery",
            "experience_time" : "2 años",
            "brand_color" : "#0071DC",
            "technologies" : ["React", "TypeScript", "CSS Modules", "Redux", "REST APIs", "Node.js"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-4.png", "title": "Plataforma On Demand y Supermercado en Línea", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-5.png", "title": "Carrito Inteligente y Selección de Franja de Entrega", "width": 1200, "height": 800 }
            ],
            "description" : "En Walmart, participé en la mejora continua de la plataforma de compras en línea y entrega a domicilio (On Demand & Pickup).\nOptimicé la velocidad de carga de la página de inicio y categorías de producto, implementé el sistema de recomendaciones personalizadas y mejoré la sincronización del carrito de compras en tiempo real entre sesiones de usuario."
        },
        "bmw" : {
            "title" : "BMW",
            "screenshot" : "bmw-project",
            "category" : "Automotriz Premium",
            "experience_time" : "6 meses",
            "brand_color" : "#0066B1",
            "technologies" : ["React", "Tailwind CSS", "Framer Motion", "TypeScript", "HTML5"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-6.png", "title": "Showcase Digital de Vehículos Eléctricos BMW i", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-7.png", "title": "Configurador Personalizado M Sport y Paquetes de Lujo", "width": 1200, "height": 800 }
            ],
            "description" : "En BMW, creé experiencias digitales premium para la exhibición de la gama de vehículos de lujo y modelos eléctricos BMW i.\nDiseñé interfaces inmersivas con micro-animaciones fluidas, galerías multimedia en alta definición y un cotizador personalizado de especificaciones de equipamiento y paquetes M Sport."
        },
        "discord" : {
            "title" : "Discord",
            "screenshot" : "discord-project",
            "category" : "Social & Web Applications",
            "experience_time" : "4 años",
            "brand_color" : "#5865F2",
            "technologies" : ["React", "TypeScript", "WebSockets", "Node.js", "Tailwind CSS"],
            "screenshots_gallery" : [
                { "src": "/screenshots/screen-8.png", "title": "Dashboard de Moderación y Métricas de Servidores", "width": 1200, "height": 800 },
                { "src": "/screenshots/screen-1.png", "title": "Panel de Integración de Bots y Webhooks en Tiempo Real", "width": 1200, "height": 800 }
            ],
            "description" : "Participé en el desarrollo de dashboards web de administración de servidores, integración de bots comunitarios y herramientas interactivas de moderación en Discord.\nImplementé interfaces basadas en WebSockets para la actualización instantánea de métricas de canales y roles, garantizando una experiencia de usuario fluida, reactiva y de baja latencia."
        }
    },
    "experience" : [
        {
            "id" : "macstore",
            "company" : "MacStore",
            "role" : "Desarrollador Frontend",
            "period" : "2024 — Presente",
            "location" : "Ciudad de México",
            "modality" : "Híbrido",
            "brand_color" : "#555555",
            "website" : "https://www.macstoreonline.com.mx",
            "summary" : "Desarrollo y mantenimiento de la plataforma oficial de retail Apple en México, enfocado en experiencia de usuario, checkout seguro y optimización de conversión.",
            "achievements" : [
                "Lideré la modernización del embudo de compra y carrito interactivo con React.",
                "Optimicé los tiempos de carga y Core Web Vitals, reduciendo el First Contentful Paint en un 35%.",
                "Implementé componentes UI accesibles y responsivos bajo estándares WCAG."
            ],
            "technologies" : ["React", "JavaScript (ES6+)", "Bootstrap", "HTML5", "CSS3", "REST APIs", ".NET"]
        },
        {
            "id" : "intelimundo",
            "company" : "Grupo Educativo Intelimundo",
            "role" : "Desarrollador FullStack",
            "period" : "2022 — 2024",
            "location" : "Ciudad de México",
            "modality" : "Remoto",
            "brand_color" : "#3B82F6",
            "website" : "https://intelimundo.edu.mx",
            "summary" : "Diseño y construcción de plataformas de gestión educativa (LMS), sistemas de evaluación en línea y portales de seguimiento académico.",
            "achievements" : [
                "Desarrollé la arquitectura frontend del portal de aprendizaje interactivo con React y Tailwind CSS.",
                "Diseñé APIs RESTful seguras con Node.js y gestión de bases de datos PostgreSQL.",
                "Construí dashboards interactivos de calificaciones y métricas de desempeño estudiantil."
            ],
            "technologies" : ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "JavaScript", "Git"]
        },
        {
            "id" : "iuisa",
            "company" : "Industria IUISA",
            "role" : "Desarrollador Frontend",
            "period" : "2021 — 2022",
            "location" : "Ciudad de México",
            "modality" : "Presencial",
            "brand_color" : "#EAB308",
            "website" : "https://www.iuisa.com.mx",
            "summary" : "Desarrollo de portales web corporativos y catálogos digitales interactivos para la industria de manufactura y distribución.",
            "achievements" : [
                "Implementé interfaces modulares responsivas con HTML5, SASS y JavaScript moderno.",
                "Diseñé cotizadores dinámicos de productos que incrementaron la generación de leads comerciales.",
                "Optimicé el SEO On-Page y la velocidad de entrega de assets multimedia."
            ],
            "technologies" : ["JavaScript", "HTML5", "SASS", "Bootstrap", "REST APIs", "Git"]
        },
        {
            "id" : "tecnm",
            "company" : "TecNM Milpa Alta II",
            "role" : "Desarrollador Web & Colaborador Técnico",
            "period" : "2020 — 2021",
            "location" : "Ciudad de México",
            "modality" : "Presencial",
            "brand_color" : "#10B981",
            "website" : "https://milpaalta2.tecnm.mx",
            "summary" : "Desarrollo y soporte técnico de módulos institucionales para la gestión escolar y trámites académicos estudiantiles.",
            "achievements" : [
                "Digitalicé el proceso de reinscripciones y consulta de horarios escolares.",
                "Construí módulos administrativos para el control de expedientes y kardex de alumnos.",
                "Brindé capacitación y documentación técnica para el personal docente y administrativo."
            ],
            "technologies" : ["JavaScript", "PHP", "MySQL", "HTML5", "CSS3", "Bootstrap"]
        }
    ],
    "about" : {
        "name" : "Guillermo Jiménez",
        "title" : "Ingeniero de Software & Frontend Specialist",
        "birthday" : "20 de Octubre, 1998",
        "age" : 27,
        "location" : "Ciudad de México",
        "status" : "Disponible para proyectos",
        "bio" : "Desarrollador web especializado en el ecosistema Frontend moderno, con sólida experiencia en la creación de interfaces de usuario reactivas, sistemas de diseño (Design Systems) escalables y optimización de rendimiento web. Enfocado en transformar requerimientos complejos en experiencias digitales intuitivas y accesibles.",
        "stats" : [
            { "label": "Años de Experiencia", "value": "4+" },
            { "label": "Proyectos & Casos", "value": "8+" },
            { "label": "Especialidad Core", "value": "Frontend & UI/UX" }
        ],
        "personas" : {
            "developer" : {
                "id" : "developer",
                "badge" : "MODO INGENIERO",
                "label" : "💻 Developer",
                "title" : "Arquitectura Frontend & Performance",
                "brand_color" : "#3B82F6",
                "gradient" : "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                "aura" : "radial-gradient(circle, #3B82F6DD 0%, #1D4ED844 45%, transparent 75%)",
                "quote" : "El buen código no es solo el que funciona, sino el que es predecible, accesible y escalable para el equipo.",
                "highlights" : [
                    "Design Systems & Componentes Reutilizables",
                    "Optimización de Core Web Vitals (95+ score)",
                    "Arquitectura React, TypeScript & Astro",
                    "Integración de REST APIs & WebSockets"
                ],
                "skills_pill" : ["React", "TypeScript", "Astro", "Tailwind CSS", "Node.js", "WCAG a11y"],
                "image" : "./src/assets/img/beach-me.jpg"
            },
            "creative" : {
                "id" : "creative",
                "badge" : "MODO CREATIVO",
                "label" : "🎨 Creative & Audio",
                "title" : "Diseño Sonoro, Música & Fotografía",
                "brand_color" : "#06B6D4",
                "gradient" : "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                "aura" : "radial-gradient(circle, #06B6D4DD 0%, #3B82F644 45%, transparent 75%)",
                "quote" : "La creatividad musical y visual es el catalizador que transforma soluciones técnicas en experiencias memorables.",
                "highlights" : [
                    "Exploración Sonora: Synthwave, Ambient & Lo-Fi",
                    "Fotografía Urbana y de Paisajes",
                    "Diseño de Interacción (IxD) & Micro-animaciones",
                    "Armonía cromática y estética Dark Mode"
                ],
                "skills_pill" : ["Sound Design", "Fotografía", "UI Motion", "Figma", "Color Theory", "Storytelling"],
                "image" : "./src/assets/img/hobbies/hobbie-02.jpg"
            },
            "gamer" : {
                "id" : "gamer",
                "badge" : "MODO GAMER & TECH",
                "label" : "🎮 Gamer & Hardware",
                "title" : "Interfaces de Videojuegos & Hardware",
                "brand_color" : "#8B5CF6",
                "gradient" : "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                "aura" : "radial-gradient(circle, #8B5CF6DD 0%, #EC489944 45%, transparent 75%)",
                "quote" : "Los videojuegos representan la cúspide de la interacción en tiempo real, latencia ultra-baja y diseño inmersivo.",
                "highlights" : [
                    "Análisis de UI/HUD en Videojuegos Contemporáneos",
                    "Ensamblado de Hardware & Optimización de Setups",
                    "Narrativas Interactivas & Game Design",
                    "Exploración de Nuevas Tecnologías y Realidad Mixta"
                ],
                "skills_pill" : ["Game UI/HUD", "PC Hardware", "Low-Latency UX", "Periféricos", "VR/Spatial", "Benchmark"],
                "image" : "./src/assets/img/hobbies/hobbie-01.jpg"
            }
        },
        "hobbies" : [
            {
                "id" : "gaming",
                "title" : "Videojuegos & Tecnología",
                "icon" : "🎮",
                "image" : "./src/assets/img/hobbies/hobbie-01.jpg",
                "brand_color" : "#8B5CF6",
                "description" : "Me apasiona explorar mundos virtuales inmersivos, analizar las mecánicas de juego innovadoras y la arquitectura de interfaces y accesibilidad en motores de videojuegos contemporáneos."
            },
            {
                "id" : "music",
                "title" : "Música & Creación Sonora",
                "icon" : "🎧",
                "image" : "./src/assets/img/hobbies/hobbie-02.jpg",
                "brand_color" : "#06B6D4",
                "description" : "La música es mi canal de enfoque y creatividad diario. Disfruto descubrir géneros como synthwave, electrónica experimental y ambient lo-fi que potencian mis sesiones de desarrollo de software."
            },
            {
                "id" : "travel",
                "title" : "Viajes & Fotografía",
                "icon" : "✈️",
                "image" : "./src/assets/img/hobbies/hobbie-03.jpg",
                "brand_color" : "#F59E0B",
                "description" : "Explorar nuevos paisajes, culturas y entornos urbanos me permite enriquecer mi perspectiva visual y encontrar inspiración estética para diseñar interfaces frescas y atractivas."
            }
        ],
        "workspace" : {
            "files" : [
                {
                    "id" : "profile",
                    "name" : "profile.tsx",
                    "icon" : "⚛️",
                    "badge" : "TSX / React",
                    "language" : "typescript"
                },
                {
                    "id" : "journey",
                    "name" : "journey.json",
                    "icon" : "📊",
                    "badge" : "JSON / Data",
                    "language" : "json"
                },
                {
                    "id" : "hobbies",
                    "name" : "hobbies.yaml",
                    "icon" : "🎮",
                    "badge" : "YAML / Lifestyle",
                    "language" : "yaml"
                },
                {
                    "id" : "setup",
                    "name" : "setup.sh",
                    "icon" : "⚙️",
                    "badge" : "BASH / Gear",
                    "language" : "bash"
                }
            ],
            "setup" : {
                "workstation" : "MacBook Pro M-Series / Custom PC (Ryzen + RTX)",
                "display" : "34\" Curved UltraWide 144Hz HDR",
                "peripherals" : "Mechanical Keyboard (Custom Switches) + Logitech MX Master 3S",
                "audio" : "Beyerdynamic DT 770 Pro + Audio Interface",
                "editor" : "Visual Studio Code + One Dark Pro Theme + Fira Code Font",
                "terminal" : "Zsh + Starship Prompt + Warp Terminal"
            }
        }
    }
};

export default data;