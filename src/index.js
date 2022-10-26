import {CardsAnimate} from "./CardsAnimation"
import {initMap} from "./plugins"

//Sidebar behavior
function sidebarLinks(){
    const links = document.querySelectorAll(`.sidebar_link`)

    links.forEach(link =>{
        link.addEventListener("click", (e) => {
            document.querySelectorAll(`.sidebar_link`).forEach((link) => {
                link.parentElement.classList.remove('sidebar_link_visited')
            })
            e.target.parentElement.classList.add("sidebar_link_visited")
        })
    })
}
sidebarLinks()


//Animate intro lines ["AIS - it's when" block]
function animateIntroLines(animatedBlock){
    const introLines = document.querySelectorAll(".ais-info_label")
    let animations = []

    introLines.forEach((el,idx) =>{

        animations.push(new CardsAnimate(el, el.childNodes[0], (idx+1)/2))
        animations[idx].init()
    })

}
animateIntroLines()


//Animate sponsors
function animate(){
    const sponsors_inner = document.querySelector(".sponsors_inner")
    const sponsors_container = document.querySelector(".sponsors_cards")

    const animation = new CardsAnimate(sponsors_inner, sponsors_container, 1)
    animation.init()
}
animate()

//Set google maps
window.initMap = initMap;







