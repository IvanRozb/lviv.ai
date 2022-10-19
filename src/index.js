import {CardsAnimate} from "./CardsAnimation"
import {initMap} from "./plugins"

//Animate intro lines ["AIS - it's when" block]
function animateIntroLines(animatedBlock){
    const introLines = document.querySelectorAll(".ais-info_label")
    let animations = []

    introLines.forEach((el,idx) =>{

        animations.push(new CardsAnimate(el, el.childNodes[0], idx+1))
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







