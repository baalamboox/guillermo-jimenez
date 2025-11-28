import $ from "jquery";
import data from "/src/data/data.js";

$(document).ready(() => {
    let currentNavLink = $(".gj\\:skills\\:nav-button-active");

    let currentContentLink = null;

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
    
    const functionX = (nameContentSkill, typeSkill) => {
        $("#gjSkillsContent").html(generateContentSkills(nameContentSkill, typeSkill));
        $(currentContentLink).removeClass("gj:skills:menubox-list-item-active");
        $(`.gj\\:skills\\:menubox-list-item[data-item="${ nameContentSkill }"]`).addClass("gj\:skills\:menubox-list-item-active");
        blink();
        currentContentLink = $(`.gj\\:skills\\:menubox-list-item[data-item="${ nameContentSkill }"]`);
    }

    window.functionX = functionX;

    const generateContentSkills = (nameContentSkill, typeSkill) => {

        const arrayKeysContentSkills = Object.keys(data.skills[typeSkill]);

        const currentIndexContentItem = arrayKeysContentSkills.indexOf(nameContentSkill);
        
        let prevContentItem = currentIndexContentItem - 1 != -1 ? currentIndexContentItem - 1 : arrayKeysContentSkills.length - 1;
        let nextContentItem = currentIndexContentItem + 1 != arrayKeysContentSkills.length ? currentIndexContentItem + 1 : 0;

        prevContentItem = arrayKeysContentSkills[prevContentItem];
        nextContentItem = arrayKeysContentSkills[nextContentItem];

        return `
            <p class="gj:skills:content-title">${ data.skills[typeSkill][nameContentSkill].title }</p>
            <div class="gj:skills:content-load-bar">
                <span class="gj:skills:content-load-bar-status" style="${ "--gj-percentage:" + data.skills[typeSkill][nameContentSkill].percentage_experience + "%;--gj-percentage-color:" + data.skills[typeSkill][nameContentSkill].emphasis_color + ";" }"></span>
                <span class="gj:skills:tag-percentage" style="--gj-percentage-bar:${ data.skills[typeSkill][nameContentSkill].percentage_experience }%;">${ data.skills[typeSkill][nameContentSkill].percentage_experience }%</span>
            </div>
            <div class="gj:skills:content-list-wrapper">
                <ul class="gj:skills:content-list">
                    ${
                        commasToArray(data.skills[typeSkill][nameContentSkill].mastered_topics, typeSkill, nameContentSkill)
                    }
                </ul>
            </div>
            ${
                arrayKeysContentSkills.length > 1 ? (`
                    <div class="gj:skills:nav-footer-buttons-wrapper" style="${ "--gj-icon-color:" + data.skills[typeSkill][nameContentSkill].emphasis_color + ";" }">
                        <div class="gj:skills:nav-footer-buttons">
                            <button class="gj:skills:nav-footer-button" type="button" onclick="window.functionX(${ "'" + prevContentItem + "', " + "'" + typeSkill + "'" })" title="${ prevContentItem }">
                                <span class="gj:layout:svg-wrapper">
                                    <svg width="8" height="16"><use href="./src/assets/icons/gj.svg#iconArrowLeft"></use></svg>
                                </span>
                            </button>
                            <button class="gj:skills:nav-footer-button" type="button" onclick="window.functionX(${ "'" + nextContentItem + "', " + "'" + typeSkill + "'" })" title="${ nextContentItem }">
                                <span class="gj:layout:svg-wrapper">
                                    <svg width="8" height="16"><use href="./src/assets/icons/gj.svg#iconArrowRight"></use></svg>
                                </span>
                            </button>
                        </div>
                    </div>
                `) : ""
            }
        `;
    }

    const blink = () => {
        $(".gj\\:skills\\:wrapper").removeClass("gj:skills:blink");
        setTimeout(() => {
            $(".gj\\:skills\\:wrapper").addClass("gj:skills:blink");
        }, 1);
    };

    $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
    $("#gjSkillsContent").html(generateContentSkills("bootstrap", "technical"));
    setTimeout(() => {
        $(".gj\\:skills\\:wrapper").addClass("gj:skills:blink");
    }, 1);
    $(".gj\\:skills\\:menubox-list > li:first-child").addClass("gj\:skills\:menubox-list-item-active");

    $("#gjSkillsNavList").delegate("li", "click", (event) => {
        $(currentNavLink).removeClass("gj:skills:nav-button-active");
        $(event.target).addClass("gj:skills:nav-button-active");
        switch($(event.target).data("nav-item")) {
            case "technical-skills":
                $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
                $(".gj\\:skills\\:menubox-list > li:first-child").addClass("gj\:skills\:menubox-list-item-active");
                $("#gjSkillsContent").html(generateContentSkills($(".gj\\:skills\\:menubox-list > li:first-child").data("item"), $(event.target).data("nav-item").split("-")[0]));
                currentContentLink = $(".gj\\:skills\\:menubox-list > li:first-child");
                blink();
                break;
            case "soft-skills":
                $("#gjSkillsMenuboxList").html(generateItemsSkills("soft"));
                $(".gj\\:skills\\:menubox-list > li:first-child").addClass("gj\:skills\:menubox-list-item-active");
                $("#gjSkillsContent").html(generateContentSkills($(".gj\\:skills\\:menubox-list > li:first-child").data("item"), $(event.target).data("nav-item").split("-")[0]));
                currentContentLink = $(".gj\\:skills\\:menubox-list > li:first-child");
                blink();
                break;
            default:
                $("#gjSkillsMenuboxList").html(generateItemsSkills("technical"));
        }
        currentNavLink = event.target;
    });

    currentContentLink = $(".gj\\:skills\\:menubox-list > li:first-child");

    $("#gjSkillsMenuboxList").delegate("li", "click", (event) => {
        $(currentContentLink).removeClass("gj:skills:menubox-list-item-active");
        $(event.target).addClass("gj:skills:menubox-list-item-active");
        blink();
        $("#gjSkillsContent").html(generateContentSkills($(event.target).data("item"), $(event.target).data("type")));
        currentContentLink = event.target;
    });

});
