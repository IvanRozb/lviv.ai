import { CardsAnimate } from './CardsAnimation'
import { initMap } from './plugins'
import { animatedBlob, animateNavUnderlines } from './utils'
import { Fetch } from './fetch'

//Sidebar behavior
function sidebarLinks() {
    const links = document.querySelectorAll(`.sidebar_link`)

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll(`.sidebar_link`).forEach((link) => {
                link.parentElement.classList.remove('sidebar_link_visited')
            })
            e.target.parentElement.classList.add('sidebar_link_visited')
        })
    })
}
sidebarLinks()

//Animate BG

const introSection = document.querySelector('.intro')

const blob1HTML = animatedBlob(1, 100)
const blob2HTML = animatedBlob(2, 50)

introSection.insertAdjacentHTML('beforeend', blob1HTML)
introSection.insertAdjacentHTML('beforeend', blob2HTML)

const vacancies = document.querySelector('.vacancies')

const blob3HTML = animatedBlob(3, 90)
vacancies.insertAdjacentHTML('beforeend', blob3HTML)

// Get jobs info
setTimeout(async () => {
    const jobsTableContainer = document.querySelector('.vacancies_statistic')
    jobsTableContainer.innerHTML = await Fetch.getJobsPositions()
}, 0)

//Animate sponsors
function animateSponsors() {
    const sponsors_inner = document.querySelector('.sponsors_inner')
    const sponsors_container = document.querySelector('.sponsors_cards')

    const animation = new CardsAnimate(sponsors_inner, sponsors_container, 1)
    animation.init()
}
animateSponsors()

//Set google maps
window.initMap = initMap

//On resize functions
animateNavUnderlines()

animateNavUnderlines()
const menuIcon = document.querySelector('.menu-icon')

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('change')
})

const toggleShevrons = document.querySelectorAll('.nav_link_wrapper')
toggleShevrons.forEach((toggle) => {
    const shevron = toggle.querySelector('.nav_shevron')
    console.log(shevron)
    toggle.addEventListener('click', () => {
        shevron.classList.toggle('rotate')
        shevron.classList.toggle('rotated')
    })
})
