import $ from "jquery";
import Swiper from "swiper";

$(document).ready(() => {
    const swiperHomeProfile = new Swiper(".gj-swiper-home-profile", {
        loop: true,
        autoplay: {
            delay: 2000,
        },
        navigation: {
            prevEl: ".gj-home-swiper-prev",
            nextEl: ".gj-home-swiper-next",
        },
        pagination: {
            el: ".gj-home-swiper-pagination"
        }
    });
});
