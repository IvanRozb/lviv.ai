import $ from 'jquery'
import {Fetch} from "./fetch";
import {animatedBlob, animateNavUnderlines, setGroupSelectorPosition} from './utils'



function activateCarousel() {
    $(document).ready(function (){
        const slider = $(".carousel");

        slider.slick({
            speed: 500,
            dots: true,
            infinite: false,
            adaptiveHeight: true,
            waitForAnimate: false,
            draggable: false
        });

        const buttons = document.getElementsByClassName('navigation_button')
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('navigation_element-' + (i + 1).toString())
            const element = $('.navigation_element-' + (i+1).toString())
            element.click(()=>slider.slick('slickGoTo',i))
        }
    })
}

function activateTeacherCarousel() {
    $(document).ready(function(){
        const slider = $(".teachers_carousel");

        slider.slick({
            dots: true
        });
    });
}

function activateProgramsCarousel(){
    $(document).ready(function(){
        const slider = $(".programs_carousel");

        slider.slick({
            centerMode: true,
            centerPadding: 5,
            speed: 500,
            slidesToShow: 5,
            draggable: false
        });

        const track = document.querySelector('.programs_carousel .slick-track')
        track.addEventListener('click', (e) => {
            let targetElement=e.target
            if(e.target.tagName !== 'DIV')
                targetElement = e.target.parentNode

            slider.slick('slickGoTo',(targetElement.dataset['slickIndex']))
        })
    });
}

function setTeachersRowFullNameHeight() {
    let rows = document.querySelectorAll(`.teachers_row`)
    let rowIndex = 1
    rows.forEach(row => {
        let max_name_height = -Infinity
        row.childNodes.forEach(column => {
            column.childNodes.forEach(element => {
                if(element.classList ? element.classList.contains('teachers_full_name') : false){
                    max_name_height = Math.max(element.getBoundingClientRect().height,max_name_height)
                }
            })
        })

        row.classList.add(row.classList[0]+'-' + rowIndex.toString())
        $('.teachers_row-' + rowIndex.toString() + ' > .teachers_column > .teachers_full_name').css('height', max_name_height)
        rowIndex++
    })
}

function setProgramsCarouselWrapper(){
    const itemHeight = $('.programs_item').height()
    const coefficient = 1.3
    const delta = itemHeight * (coefficient - 1) / 2

    $('.programs_carousel_wrap').css({'height': itemHeight + 2 * delta + 30/*,'margin-top': -(itemHeight + delta)*/})
}

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

    document.querySelector(`.teachers_carousel`)
        .insertAdjacentHTML('afterbegin', await Fetch.getTeachers());
    activateTeacherCarousel();

    setTeachersRowFullNameHeight();
    document.querySelector('.programs_carousel')
        .insertAdjacentHTML("afterbegin", await Fetch.getUniversities());
    activateProgramsCarousel();
    setProgramsCarouselWrapper();
}, 0)

animateNavUnderlines();
activateCarousel();