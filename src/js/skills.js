import $ from "jquery";
import data from "/src/data/data.js";

$(document).ready(() => {
    let currentNavLink = $(".gj\\:skills\\:nav-button-active");
    
    let itemsSkills = "";

    Object.keys(data.skills["technical"]).map((item) => {
        console.log(item);
    });

    $("#gjSkillsNavList").delegate("li", "click", (event) => {
        $(currentNavLink).removeClass("gj:skills:nav-button-active");
        $(event.target).addClass("gj:skills:nav-button-active");
        currentNavLink = event.target;
    });
});
