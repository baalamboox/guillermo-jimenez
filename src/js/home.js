import $ from "jquery";
import Swiper from "swiper";

$(document).ready(() => {
    const swiperHomeProfile = new Swiper(".gj-swiper-home-profile", {
        navigation: {
            prevEl: ".gj-home-swiper-prev",
            nextEl: ".gj-home-swiper-next",
        },
        pagination: {
            el: ".gj-home-swiper-pagination"
        }
    });
});
