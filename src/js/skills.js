import $ from "jquery";
import data from "/src/data/data.js";

$(document).ready(() => {
    let currentNavLink = $(".gj\\:skills\\:nav-button-active");

    const commasToArray = (stringCommas, typeSkill, nameContentSkill) => {
        let i = "";
        
        stringCommas.split(",").map((mastered_topic) => {
            i += `<li style="${ "--gj-marker-color:" + data.skills[typeSkill][nameContentSkill].emphasis_color + ";" }">${ mastered_topic }</li>`
        });

        return i;
    }

    const generateItemsSkills = (typeSkill) => {
        let itemsSkills = "";

        Object.keys(data.skills[typeSkill]).map((skill) => {
            itemsSkills += `
                <li class="gj:skills:menubox-list-item" style="${ "--gj-emphasis-color:" + data.skills[typeSkill][skill].emphasis_color + ";"}" data-item="${ skill }" data-type="${ typeSkill }">
                    <span class="gj:layout:svg-wrapper">
                        <svg class="gj:skills:menubox-icon" style="${ "--gj-emphasis-color:" + data.skills[typeSkill][skill].emphasis_color + ";"}"><use href="${ "./src/assets/icons/gj.svg#" + data.skills[typeSkill][skill].icon }"></use></svg>
                    </span>
                </li>
            `;
        });

        return itemsSkills;
    }
    
    const generateContentSkills = (nameContentSkill, typeSkill) => {
        return `
            <p class="gj:skills:content-title">${ data.skills[typeSkill][nameContentSkill].title }</p>
            <div class="gj:skills:content-load-bar">
                <span class="gj:skills:content-load-bar-status" style="${ "--gj-percentage:" + data.skills[typeSkill][nameContentSkill].percentage_experience + "%;--gj-percentage-color:" + data.skills[typeSkill][nameContentSkill].emphasis_color + ";" }"></span>
            </div>
            <div class="gj:skills:content-list-wrapper">
                <ul class="gj:skills:content-list">
                    ${
                        commasToArray(data.skills[typeSkill][nameContentSkill].mastered_topics, typeSkill, nameContentSkill)
                    }
                </ul>
            </div>
            <div class="gj:skills:nav-footer-buttons-wrapper" style="${ "--gj-icon-color:" + data.skills[typeSkill][nameContentSkill].emphasis_color + ";" }">
                <div class="gj:skills:nav-footer-buttons">
                    <button class="gj:skills:nav-footer-button" type="button">
                        <span class="gj:layout:svg-wrapper">
                            <svg width="8" height="16"><use href="./src/assets/icons/gj.svg#iconArrowLeft"></use></svg>
                        </span>
                    </button>
                    <button class="gj:skills:nav-footer-button" type="button">
                        <span class="gj:layout:svg-wrapper">
                            <svg width="8" height="16"><use href="./src/assets/icons/gj.svg#iconArrowRight"></use></svg>
                        </span>
                    </button>
                </div>
            </div>
        `;
    }

    $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
    $("#gjSkillsContent").html(generateContentSkills("bootstrap", "technical"));
    setTimeout(() => {
        $(".gj\\:skills\\:wrapper").addClass("gj:skills:blink");
    }, 1);

    $("#gjSkillsNavList").delegate("li", "click", (event) => {
        $(currentNavLink).removeClass("gj:skills:nav-button-active");
        $(event.target).addClass("gj:skills:nav-button-active");
        switch($(event.target).data("nav-item")) {
            case "technical-skills":
                $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
                break;
            case "soft-skills":
                $("#gjSkillsMenuboxList").html(generateItemsSkills("soft"));
                break;
            default:
                $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
        }
        currentNavLink = event.target;
    });

    $("#gjSkillsMenuboxList").delegate("li", "click", (event) => {



        $(".gj\\:skills\\:wrapper").removeClass("gj:skills:blink");
        setTimeout(() => {
            $(".gj\\:skills\\:wrapper").addClass("gj:skills:blink");
        }, 1);
        
        $("#gjSkillsContent").html(generateContentSkills($(event.target).data("item"), $(event.target).data("type")));
    });

    let currentContentSkillLink = $(".gj\\:skills\\:menubox-list > li:first-child");
    console.log(currentContentSkillLink);
});
