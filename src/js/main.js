const body = document.querySelector("body");
const gjLoaderMask = document?.querySelector("#gjLoderMask");
const gjLoaderMaskSection = document?.querySelector("#gjLoaderMaskSection");

const indexView = () => {
    console.log(document.querySelector("#gjLayoutBase"));
}

window.addEventListener("load", () => {
    let currentView = "";

    body.classList.add("gj:content-loaded");
    switch (window.location.pathname) {
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
            break
        case "/acerca-de-mi":
            currentView = "gj:path:about-me";
            break;
        default:
            console.log("Ninguna URL encontrada");
            break;
    }
    document.documentElement.classList.add(currentView);
    gjLoaderMaskSection.addEventListener("transitionend", () => {
        body.classList.add("gj:lm:hidden");
    });
    gjLoaderMask.addEventListener("transitionend", () => {
        setTimeout(() => {
            body.classList.add("gj:lm:remove");
        }, 1000);
        
    });

    indexView();
});