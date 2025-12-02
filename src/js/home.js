import $ from "jquery";
import Swiper from "swiper/bundle";

$(document).ready(() => {
    const swiperHomeProfile = new Swiper(".gj\\:swiper\\:home-profile", {
        autoplay: {
            delay: 4000,
        },
        navigation: {
            prevEl: ".gj\\:home\\:swiper-prev",
            nextEl: ".gj\\:home\\:swiper-next",
        },
        pagination: {
            el: ".gj\\:home\\:swiper-pagination",
            clickable: true,
        },
        on: {
            init() {
                $(".gj\\:home\\:profile-gost-circle-1").css("transform", `translate(-${ Math.floor(Math.random() * (55 - 45) + 45) }%, -${ Math.floor(Math.random() * (55 - 45) + 45) }%)`);
                $(".gj\\:home\\:profile-gost-circle-2").css("transform", `translate(-${ Math.floor(Math.random() * (55 - 45) + 45) }%, -${ Math.floor(Math.random() * (55 - 45) + 45) }%)`);
            }
        },
    });

    const backgroundColors = [
        "linear-gradient(to right, #9028FF 0%, #FF74ED 50%, #4059FF 100%)",
        "linear-gradient(to right, #7BFF28 0%, #FF7474 50%, #40F2FF 100%)",
        "linear-gradient(to right, #FFBB28 0%, #CC74FF 50%, #FF4040 100%)"
    ];

    swiperHomeProfile.on("slideChange", (event) => {
        $("body").addClass("gj:layout:change-shining");
        setTimeout(() => {
            $(".gj\\:layout\\:shining").css(`background`, backgroundColors[event.activeIndex]);
            $("body").removeClass("gj:layout:change-shining");
        }, 750);
        $(".gj\\:home\\:profile-gost-circle-1").css("transform", `translate(-${ Math.floor(Math.random() * (55 - 45) + 45) }%, -${ Math.floor(Math.random() * (55 - 45) + 45) }%)`);
        $(".gj\\:home\\:profile-gost-circle-2").css("transform", `translate(-${ Math.floor(Math.random() * (55 - 45) + 45) }%, -${ Math.floor(Math.random() * (55 - 45) + 45) }%)`);
    });
});


