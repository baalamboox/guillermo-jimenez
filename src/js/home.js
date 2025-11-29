import $ from "jquery";
import Swiper from "swiper/bundle";

$(document).ready(() => {
    const swiperHomeProfile = new Swiper(".gj\\:swiper\\:home-profile", {
        loop: true,
        // autoplay: {
        //     // delay: 4000,
        // },
        navigation: {
            prevEl: ".gj\\:home\\:swiper-prev",
            nextEl: ".gj\\:home\\:swiper-next",
        },
        pagination: {
            el: ".gj\\:home\\:swiper-pagination",
            clickable: true,
        }
    });
});
