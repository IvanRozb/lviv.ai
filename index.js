
function animate(){
    const sponsors_inner = document.querySelector(".sponsors_inner")
    const sponsors_container = document.querySelector(".sponsors_cards")
    // let sponsors_cards = sponsors_container.querySelectorAll(".sponsor_card")
    let sponsors_container2

    const speed = 1

    const width = sponsors_container.offsetWidth
    let x = 0
    let x2 = width

    function clone() {
        sponsors_container2 = sponsors_container.cloneNode(true);
        sponsors_inner.appendChild(sponsors_container2)
        sponsors_container2.style.left = `${width}px`
    }

    function moveFirst() {
        x += speed

        if (width >= Math.abs(x)) {
            sponsors_container.style.left = `${x}px`
        } else {
            x = -width
        }
    }

    function moveSecond() {
        x2 += speed

        if ( sponsors_container2.offsetWidth >= Math.abs(x2)) {
            sponsors_container2.style.left = `${x2}px`
        } else {
            x2 = -width
        }
    }

    function hover() {
        clearInterval(a)
        clearInterval(b)
    }

    function unhover() {
        a = setInterval(moveFirst, 10)
        b = setInterval(moveSecond, 10)
    }

    clone()

    let a = setInterval(moveFirst, 10)
    let b = setInterval(moveSecond, 10)

    sponsors_inner.addEventListener("mouseenter", hover)
    sponsors_inner.addEventListener("mouseleave", unhover)
}
animate()



