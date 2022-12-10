import {animateNavUnderlines, getCourseCardHTML} from './utils'
import {isNull} from "url/util";
import $ from 'jquery'

function getActiveCarouselIndex(){
    let activeIndex = localStorage.getItem('about_us_carousel_index');
    activeIndex = typeof activeIndex === "object"? 1 : activeIndex;
    return Number(activeIndex);
}

function getTargetCarouselItem(e){
    if(e.target.tagName === 'P' || e.target.tagName === 'IMG')
        return e.target.parentElement.parentElement;
    else if(e.target.tagName === 'BUTTON')
        return e.target.parentElement;
    else
        return null;
}

function moveUnderline(targetNavElement, underlineWidth){
    const rect = targetNavElement.getBoundingClientRect();
    $('.navigation_underline').css('left', rect.x + rect.width/2 - underlineWidth/2);
}

function activateCarousel() {
    let activeIndex = getActiveCarouselIndex();

    let programs_carousel = $(`.programs_carousel`);
    programs_carousel.css('display', `none`)
    const userWidth = ($(document).innerWidth())/document.querySelectorAll('.carousel_item').length;
    programs_carousel.css('display', `block`)

    localStorage.setItem('about_us_carousel_index', activeIndex);

    const carouselNavbar = document.querySelector(`.navigation_buttons`);
    const rect = carouselNavbar.childNodes[activeIndex].getBoundingClientRect();
    const underlineWidth = document.getElementsByClassName(`navigation_underline`)[0].getBoundingClientRect().width;
    const carousel = $('.carousel')[0];

    $(`.navigation_underline`).css('left',Number((rect.left + rect.right)/2)
        - underlineWidth/2);
    $(`.carousel`).css('margin-left', -(Math.floor(activeIndex/2))*userWidth);

    carouselNavbar.addEventListener("click", e => {
        let activeIndex = getActiveCarouselIndex();

        let targetNavElement = getTargetCarouselItem(e);
        if(isNull(targetNavElement))
            return;

        moveUnderline(targetNavElement, underlineWidth);

        const index = Array.from(carouselNavbar.childNodes).indexOf(targetNavElement);
        $('.carousel').css('margin-left', (Number(document.defaultView.getComputedStyle(carousel).marginLeft.split('p')[0])
            + userWidth * Math.abs((activeIndex - index)/2) * Math.sign(activeIndex-index)).toString()+'px');

        localStorage.setItem('about_us_carousel_index', index.toString());
    })
}

function activateProgramsCarousel(){
    $(document).ready(function(){
        $('.programs_carousel').slick({
            slidesToShow: 5,
            slidesToScroll: 3,
            waitForAnimate: true,
            centerMode: true,
        })
    });

    const slider = $(".programs_carousel");
    slider.on('wheel', (function(e) {
        e.preventDefault();

        if (e.originalEvent.deltaY < 0) {
            $(this).slick('slickNext');
        } else {
            $(this).slick('slickPrev');
        }
    }));
}

const template = getCourseCardHTML()
document.querySelector(".course_cards_section").insertAdjacentHTML(
    'beforeend', localStorage.getItem('term1')
)

animateNavUnderlines();
activateCarousel();
activateProgramsCarousel();

// debugger
