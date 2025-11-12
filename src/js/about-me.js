import $ from "jquery";
import Swiper from "swiper/bundle";

$(document).ready(() => {
    const swiperHobbies = new Swiper(".gj\\:swiper\\:hobbies", {
        slidesPerView: "auto",
        
        navigation: {
            prevEl: ".gj\\:swiper\\:hobbies-prev",
            nextEl: ".gj\\:swiper\\:hobbies-next",
        },
        pagination: {
            el: ".gj\\:swiper\\:hobbies-pagination",
            clickable: true,
        },
    });
});
