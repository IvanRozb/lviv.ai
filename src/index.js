import {CardsAnimate} from "./CardsAnimation"
import {initMap} from "./plugins"

//Animate sponsors
function animate(){
    const sponsors_inner = document.querySelector(".sponsors_inner")
    const sponsors_container = document.querySelector(".sponsors_cards")

    const animation = new CardsAnimate(sponsors_inner, sponsors_container, 2.5)
    animation.init()
}
animate()

//Set google maps
window.initMap = initMap;




