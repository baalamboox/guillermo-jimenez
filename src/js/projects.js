const carouselItems = document?.querySelector("#carouselItems");
const gjCarouselPrevButton = document?.querySelector("#gjCarouselPrevButton");
const gjCarouselNextButton = document?.querySelector("#gjCarouselNextButton");
const gjProjectsCarouselNav = document?.querySelector("#gjProjectsCarouselNav");


const moveCaraousel = () => {
    let valueTranslateX = 0;
    return {
        "decrement" : () => valueTranslateX -= 320,
        "increment" : () => valueTranslateX += 320,
        "value" : () => valueTranslateX
    }
}

let itemsBullets = "";

for(let i = 0; i < carouselItems.childElementCount; i++) {
    itemsBullets += "<div class=\"gj:projects:carousel-nav-bullet\"></div>";
}

gjProjectsCarouselNav.innerHTML = itemsBullets;

carouselItems.addEventListener("touchmove", (event) => console.log(event), false)

const mc = moveCaraousel();

console.log(carouselItems.childElementCount * 320 + (carouselItems.childElementCount - 1) * 16);

gjCarouselPrevButton.addEventListener("click", () => {
    carouselItems.style.transform = `translateX(${ mc.increment() }px)`;
    console.log(mc.increment());
});

gjCarouselNextButton.addEventListener("click", () => {
    carouselItems.style.transform = `translateX(${ mc.decrement() }px)`;
    console.log(mc.decrement());
});

// setInterval(() => console.log(mc.value()), 2000);