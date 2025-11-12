import $ from "jquery";
import Swiper from "swiper/bundle";

$(document).ready(() => {
    const swiperProjects = new Swiper(".gj\\:swiper\\:projects", {
        slidesPerView: 5,
        loop: true,
        freeMode: true,
        centeredSlides: true,
        navigation: {
            prevEl: ".gj\\:swiper\\:projects-prev",
            nextEl: ".gj\\:swiper\\:projects-next"
        },
        pagination: {
            el: ".gj\\:swiper\\:projects-pagination",
            clickable: true,
        }
    });

    swiperProjects.autoplay.start();


});
