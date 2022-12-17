import {animatedBlob, animateNavUnderlines, getCourseCardHTML, setGroupSelectorPosition} from './utils'
import {isNull} from "url/util";
import $ from 'jquery'
import {Fetch} from "./fetch";
const userWidth = ($(document).innerWidth())/document.querySelectorAll('.carousel_item').length;

//Animate BG
const bg_cards_section = document.querySelector(".bg_cards_section")

const blob1HTML = animatedBlob(1,100)

bg_cards_section.insertAdjacentHTML("beforeend", blob1HTML)

const bg_teachers_section = document.querySelector(".bg_teachers_section")

const blob2HTML = animatedBlob(2,120)

bg_teachers_section.insertAdjacentHTML("beforeend", blob2HTML)

const bg_programs_section = document.querySelector(".bg_programs_section")

const blob3HTML = animatedBlob(3,120)

bg_programs_section.insertAdjacentHTML("beforeend", blob3HTML)

//Course Card
const course_card_section =  document.querySelector(".course_cards_section")

setTimeout(async ()=>{
    const courseCardsPage = await Fetch.getCourseCardsPageAsync("ua")

    document.querySelector(".course_cards_menu")
        .insertAdjacentHTML("afterend", courseCardsPage)

    setGroupSelectorPosition(userWidth)

    $('.course_cards_container').slick({
        slidesToShow: 1,

        dots: true,
        arrows: false
    })

    /* insert items to carousels */
    document.querySelector(`.teachers_carousel`)
        .insertAdjacentHTML('afterbegin', await Fetch.getTeachers());
    document.querySelector('.programs_carousel')
        .insertAdjacentHTML("afterbegin", await Fetch.getUniversities());

    /* activate sub carousels on page */
    activateTeacherCarousel();
    activateProgramsCarousel();
}, 0)

//Carousel
function getActiveIndex(/*string*/indexName){
    let activeIndex = localStorage.getItem(indexName);
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
    let activeIndex = getActiveIndex('about_us_carousel_index');
    localStorage.setItem('about_us_carousel_index', activeIndex);

    const carouselNavbar = document.querySelector(`.navigation_buttons`);
    const rect = carouselNavbar.childNodes[activeIndex].getBoundingClientRect();
    const underlineWidth = document.getElementsByClassName(`navigation_underline`)[0].getBoundingClientRect().width;
    const carousel = $('.carousel');

    $(`.navigation_underline`).css('left',Number((rect.left + rect.right)/2)
        - underlineWidth/2);
    $(`.carousel`).css('margin-left', -(Math.floor(activeIndex/2))*userWidth);

    carouselNavbar.addEventListener("click", e => {
        let activeIndex = getActiveIndex('about_us_carousel_index');

        let targetNavElement = getTargetCarouselItem(e);
        if(isNull(targetNavElement))
            return;

        moveUnderline(targetNavElement, underlineWidth);

        const index = Array.from(carouselNavbar.childNodes).indexOf(targetNavElement);
        carousel.css('margin-left', (Number(document.defaultView.getComputedStyle(carousel[0]).marginLeft.split('p')[0])
            + userWidth * Math.abs((activeIndex - index)/2) * Math.sign(activeIndex-index)).toString()+'px');

        localStorage.setItem('about_us_carousel_index', index.toString());
        $('.programs_carousel').css('display', Math.ceil(index/2) === ((carousel[0].childNodes.length-1)/2-1) ? 'none' : 'block');
    })
}

function activateProgramsCarousel(){
    $(document).ready(function(){
        const slider = $(".programs_carousel");

        slider.slick({
            centerMode: true,
            speed: 500,
            slidesToShow: 5
        });
    });
}

function activateTeacherCarousel() {
    $(document).ready(function(){
        const slider = $(".teachers_carousel");

        slider.slick({
            dots: true
        });
    });
}
animateNavUnderlines();
activateCarousel();
