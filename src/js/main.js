import $ from "jquery";

$(document).ready(() => console.log("Adios"));

const body = document.querySelector("body");
const gjLoaderMask = document?.querySelector("#gjLoderMask");
const gjLoaderMaskSection = document?.querySelector("#gjLoaderMaskSection");

// const bottonTheme = document?.querySelector("#buttonTheme");

const gjSwitchTheme = document?.querySelector("#gjSwitchTheme");

const indexView = () => {
    // console.log(document.querySelector("#gjLayoutBase"));
}

const changeTheme = () => {
    // bottonTheme.addEventListener("click", (event) => {
    //     localStorage.setItem("dark-mode", "true");
    //     document.documentElement.setAttribute("dark-mode", "true");
    //     console.log(event);
    // });

    document.documentElement.setAttribute("dark-mode", localStorage.getItem("dark-mode"));

    if(localStorage.getItem("dark-mode") === "dark") {
        gjSwitchTheme.checked = "false";
    } else {
        gjSwitchTheme.checked = "true";
    }

    gjSwitchTheme.addEventListener("click", (event) => {
        event.target.checked ? [
            localStorage.setItem("dark-mode", "false"),
            document.documentElement.setAttribute("dark-mode", "false"),
        ] : [
            localStorage.setItem("dark-mode", "true"),
            document.documentElement.setAttribute("dark-mode", "true"),
        ];
        
        console.log(event.target.checked);
    });
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
    changeTheme();
    indexView();
});