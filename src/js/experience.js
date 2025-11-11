import $ from "jquery";

$(document).ready(() => {
    let currentListItemActive = $(".gj\\:experience\\:list-item")[0];
    $(".gj\\:experience\\:list").delegate("li", "click", (event) => {
        $(currentListItemActive).removeClass("gj:experience:list-item:active");
        $(event.currentTarget).addClass("gj:experience:list-item:active");
        currentListItemActive = event.currentTarget;
    });
});
