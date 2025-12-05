import $ from "jquery";

$(document).ready(() => {

    let currentView = "";

    const changeTheme = () => {

        const changeThemeOptions = expresion => expresion ? [
            $(":root").attr("dark-mode", true),
            $("#gjSwitchTheme").prop("checked", true),
        ] : [
            $(":root").attr("dark-mode", false),
            $("#gjSwitchTheme").prop("checked", false),
        ];

        window.localStorage.key("dark-mode") != null ? [
            $(":root").attr("dark-mode", window.localStorage.getItem("dark-mode")),
            $("#gjSwitchTheme").prop("checked", window.localStorage.getItem("dark-mode")),
        ] :  [
            changeThemeOptions(window.matchMedia("(prefers-color-scheme: dark)").matches),
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => changeThemeOptions(event.matches)),
        ];

        $("#gjSwitchTheme").on("click", () => {
            changeThemeOptions($("#gjSwitchTheme").prop("checked"));
            $("#gjSwitchTheme").prop("checked") ? window.localStorage.setItem("dark-mode", true) : window.localStorage.setItem("dark-mode", false);
        });
    }

    $(":root").addClass("gj:content-loaded");

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

    $(":root").addClass(currentView);

    changeTheme();

    setTimeout(() => {
        $(".gj\\:layout\\:header-share").addClass("gj:layout:header-share-close");
    }, 2000);

    $("#gjShareButton").click(() => {
        $(".gj\\:layout\\:header-share").toggleClass("gj:layout:header-share-close");
        $(".gj\\:layout\\:header-share").toggleClass("gj:layout:header-share-close-blink");
    });
    
    $("#headerShareList").on("transitionend", () => {
        $(".gj\\:layout\\:header-share").addClass("gj:layout:header-share-close-blink");
    });
});
