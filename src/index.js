import {CardsAnimate} from "./CardsAnimation"

function animate(){
    const sponsors_inner = document.querySelector(".sponsors_inner")
    const sponsors_container = document.querySelector(".sponsors_cards")

    const animation = new CardsAnimate(sponsors_inner, sponsors_container, 2.5)
    animation.init()
}

animate()


function initMap() {

    const cathedra = { lat: 49.837373745481536, lng: 24.033663701171104 };

    const map = new google.maps.Map(document.querySelector(".footer_map"), {
        zoom: 15,
        center: cathedra,
        disableDefaultUI: true,
    });
    const marker = new google.maps.Marker({
        position: cathedra,
        map: map,
    });
}

window.initMap = initMap;




