import $ from 'jquery'
import { Fetch } from './fetch'
import {
    animatedBlob,
    animateNavUnderlines,
    setGroupSelectorPosition,
} from './utils'

// Carousel functions
function activateCarousel() {
    const underline = $('.navigation_underline')

    $(document).ready(function () {
        const slider = $('.carousel')

        slider.slick({
            speed: 500,
            dots: true,
            infinite: false,
            adaptiveHeight: true,
            waitForAnimate: false,
            draggable: false,
        })
        const buttons = $('.navigation_button')

        buttons.each(function (idx) {
            const btn = $(this)

            btn.addClass('navigation_element-' + (idx + 1).toString())

            btn.click(() => {
                slider.slick('slickGoTo', idx)
                underline.css(
                    'transform',
                    'translate3d(' + idx * 200 + '%,0,0)'
                )
            })
        })
    })
}
function activateTeacherCarousel() {
    $(document).ready(function () {
        const slider = $('.teachers_carousel')

        slider.slick({
            dots: true,
            draggable: false,
        })
    })
}
function activateProgramsCarousel() {
    $(document).ready(function () {
        const slider = $('.programs_carousel')
        slider.slick({
            centerMode: true,
            centerPadding: 5,
            speed: 500,
            slidesToShow: 5,
            draggable: false,
            lazyLoad: true,
        })

        const track = document.querySelector('.programs_carousel .slick-track')
        track.addEventListener('click', (e) => {
            let targetElement = e.target
            if (e.target.tagName !== 'DIV') targetElement = e.target.parentNode

            slider.slick('slickGoTo', targetElement.dataset['slickIndex'])
        })
    })
}

// Course cards page functions
function addCourseCardsBtnListeners() {
    $('.degree_btn').each(function () {
        $(this).on('click', function () {
            $(this).addClass('active').siblings().removeClass('active')

            if ($(this).hasClass('bachelor_btn')) {
                $('.nav_bachelor')
                    .addClass('active')
                    .siblings()
                    .removeClass('active')
            } else {
                $('.nav_master')
                    .addClass('active')
                    .siblings()
                    .removeClass('active')
            }
        })
    })

    const yearBtns = $('.year_btn')

    yearBtns.each(function () {
        const btn = $(this)

        btn.on('click', function () {
            yearBtns.removeClass('active')
            $(this).addClass('active')

            let slider

            btn.parent().hasClass('nav_bachelor')
                ? (slider = $(`.bachelor_${btn.data('year')}`))
                : (slider = $(`.master_${btn.data('year')}`))

            slider.addClass('active').siblings().removeClass('active')
            if (!slider.hasClass('slick-initialized'))
                slider.slick({
                    slidesToShow: 1,

                    dots: true,
                    arrows: false,
                })
        })
    })
}
// Teachers page functions
function setTeachersRowFullNameHeight() {
    let rows = document.querySelectorAll(`.teachers_row`)
    let rowIndex = 1
    rows.forEach((row) => {
        let max_name_height = -Infinity
        row.childNodes.forEach((column) => {
            column.childNodes.forEach((element) => {
                if (
                    element.classList
                        ? element.classList.contains('teachers_full_name')
                        : false
                ) {
                    max_name_height = Math.max(
                        element.getBoundingClientRect().height,
                        max_name_height
                    )
                }
            })
        })

        row.classList.add(row.classList[0] + '-' + rowIndex.toString())
        $(
            '.teachers_row-' +
                rowIndex.toString() +
                ' > .teachers_column > .teachers_full_name'
        ).css('height', max_name_height)
        rowIndex++
    })
}
//Animate BG
function animateBG() {
    const bg_cards_section = document.querySelector('.bg_cards_section')

    const blob1HTML = animatedBlob(1, 100)
    bg_cards_section.insertAdjacentHTML('beforeend', blob1HTML)

    const bg_teachers_section = document.querySelector('.bg_teachers_section')

    const blob2HTML = animatedBlob(2, 120)

    bg_teachers_section.insertAdjacentHTML('beforeend', blob2HTML)

    const bg_programs_section = document.querySelector('.bg_programs_section')

    const blob3HTML = animatedBlob(3, 120)

    bg_programs_section.insertAdjacentHTML('beforeend', blob3HTML)
}

setTimeout(async () => {
    const language = document.documentElement.lang

    // Course Cards FETCH
    const courseCardsPage = await Fetch.getCourseCardsPageAsync(language)

    document
        .querySelector('.course_cards_section')
        .insertAdjacentHTML('beforeend', courseCardsPage)

    setGroupSelectorPosition()
    addCourseCardsBtnListeners()

    // Activate Bachelor by default
    $('.bachelor_btn').addClass('active')
    $('.nav_bachelor').addClass('active')
    $('.year_btn').first().trigger('click')

    const courseCardContainer = document.querySelector('.course_card-loader')
    courseCardContainer.classList.add('hidden')

    // TODO: sort cards in backend: first bachelor with smallest createdYear field
    const teacherContainer = document.querySelector(`.teachers_carousel`)
    // Teachers FETCH
    teacherContainer.insertAdjacentHTML(
        'afterbegin',
        await Fetch.getTeachersAsync(language)
    )

    activateTeacherCarousel()

    // Universities FETCH
    setTeachersRowFullNameHeight()

    const teachersContainer = document.querySelector('.teachers-loader')
    teachersContainer.classList.add('hidden')

    document
        .querySelector('.programs_carousel')
        .insertAdjacentHTML(
            'afterbegin',
            await Fetch.getUniversitiesAsync(language)
        )
    activateProgramsCarousel()
    const programsContainer = document.querySelector('.programs-loader')
    programsContainer.classList.add('hidden')
}, 0)

animateNavUnderlines()
activateCarousel()
animateBG()
