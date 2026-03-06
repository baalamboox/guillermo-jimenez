import $ from "jquery";
import Swiper from "swiper/bundle";
import { GridStack } from "gridstack";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import data from "/src/data/data";

$(document).ready(() => {

    const swiperProjects = new Swiper(".gj\\:swiper\\:projects", {
        slidesPerView: "auto",
        centeredSlides: true,
        centeredSlidesBounds: true,
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
        $(".gj\\:layout\\:shining").css("background-image", `url("${ $(swiperProjects.slides[swiperProjects.activeIndex].children[0].lastElementChild).attr("src") }")`);
    })

    swiperProjects.on("slideChange", () => {
        $(".gj\\:layout\\:shining").css("background-image", `url("${ $(swiperProjects.slides[swiperProjects.activeIndex].children[0].lastElementChild).attr("src") }")`);
    });

    swiperProjects.init();
    
    // swiperProjects.slideTo(swiperProjects.slides.length / 2);

    // swiperProjects.autoplay.start();

    document.querySelector("#gjModalProjects").addEventListener("show.bs.modal", (event) => {
        const idProject = $(event.relatedTarget).data("id-project");
        const currentDataProject = data.projects[idProject];

        $(".gj\\:modal\\:projects\\:title").text(currentDataProject.title);
        $(".gj\\:modal\\:projects\\:category").html(`<span class="gj:modal:projects:prefix-cat-exp">Categoría: </span>${currentDataProject.category}`);
        $(".gj\\:modal\\:projects\\:experience").html(`<span class="gj:modal:projects:prefix-cat-exp">Experiencia: </span>${currentDataProject.experience_time}`);
        $("#gjModalProjectsBanner").attr("src", `/src/assets/img/projects/${ idProject }/${ currentDataProject.screenshot }.png`);

        let counterX = false;
        let swiperTechnologiesApplied;

        window.actionButtonResize = () => {
            $("#gjModalProjects .modal-dialog").toggleClass("modal-lg");
            $("#gjModalProjects").toggleClass("gj:modal:projects-resize");
            counterX ? [
                swiperTechnologiesApplied = "",
                console.log("True"),
                counterX = false
             ] : [
                swiperTechnologiesApplied = new Swiper(".gj\\:swiper\\:projects\\:technologies-applied", {
                    slidesPerView: 4,
                    loop: true,
                    speed: 8000,
                    allowTouchMove: false,
                    autoplay: {
                        delay: 1,
                        disableOnInteraction: false
                    }
                }),
                console.log("False"),
                counterX = true
             ];
        };

        const itemsGridStack = [
            {
                content: "<h1>My first item grid</h1>"
            },
            {
                content: "My first item grid",
                w: 2,
                h: 2
            },
        ];
        const myGridStack = GridStack.init();
        myGridStack.load(itemsGridStack);
    });

    document.querySelector("#gjModalProjects").addEventListener("hidden.bs.modal", () => {
        $("#gjModalProjects .modal-dialog").removeClass("modal-lg");
        $("#gjModalProjects").removeClass("gj:modal:projects-resize");
    });

    const lightbox = new PhotoSwipeLightbox({
        gallery: '#my-gallery',
        children: 'a',
        pswpModule: () => import('photoswipe')
    });

    console.log(lightbox);

    lightbox.init();
});
