import $ from "jquery";
import Swiper from "swiper/bundle";

$(document).ready(() => {
    const swiperProjects = new Swiper(".gj\\:swiper\\:projects", {
        slidesPerView: "auto",
        centeredSlides: true,
        // centeredSlidesBounds: true,
        init: false,
        navigation: {
            prevEl: ".gj\\:swiper\\:projects-prev",
            nextEl: ".gj\\:swiper\\:projects-next"
        },
        pagination: {
            el: ".gj\\:swiper\\:projects-pagination",
            clickable: true,
        }
    });

    swiperProjects.on("init", () => {
        console.log("Adios");
        $(".gj\\:layout\\:shining").css("background-image", `url("${ $(swiperProjects.slides[swiperProjects.activeIndex].children[0].lastElementChild).attr("src") }")`);
    })

    swiperProjects.on("slideChange", () => {
        $(".gj\\:layout\\:shining").css("background-image", `url("${ $(swiperProjects.slides[swiperProjects.activeIndex].children[0].lastElementChild).attr("src") }")`);
    });

    swiperProjects.init();
    
    swiperProjects.slideTo(swiperProjects.slides.length / 2);

    // swiperProjects.autoplay.start();
});
