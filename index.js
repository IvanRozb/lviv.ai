export class CardsAnimate{

    constructor(container, cards_container,speed) {
        this.container = container
        this.cards_container = cards_container
        this.speed = speed
    }

    init(){
        this.stop()

        this.width = this.cards_container.offsetWidth
        this.first_block_pos = 0
        this.second_block_pos = this.width

        if(this.container.childElementCount == 1 ){
            this.clone()

            this.container.addEventListener("mouseenter", this.stop.bind(this))
            this.container.addEventListener("mouseleave", this.start.bind(this))

            window.onresize = this.init.bind(this)
        }

        this.start()

    }

    clone() {
        this.cards_container2 = this.cards_container.cloneNode(true)
        this.container.appendChild(this.cards_container2)
        this.cards_container2.style.left = `${this.width}px`
    }

    moveFirst() {
        this.first_block_pos += this.speed

        if (this.width >= Math.abs(this.first_block_pos)) {
            this.cards_container.style.left = `${this.first_block_pos}px`
        } else {
            this.first_block_pos = -this.width
        }
    }

    moveSecond() {
        this.second_block_pos += this.speed

        if ( this.cards_container2.offsetWidth >= Math.abs(this.second_block_pos)) {
            this.cards_container2.style.left = `${this.second_block_pos}px`
        } else {
            this.second_block_pos = -this.width
        }
    }

    stop() {
        clearInterval(this.first_block_interval)
        clearInterval(this.second_block_interval)
    }

    start() {
        this.first_block_interval = setInterval(this.moveFirst.bind(this), 10)
        this.second_block_interval = setInterval(this.moveSecond.bind(this), 10)
    }


}


function animate(){
    const sponsors_inner = document.querySelector(".sponsors_inner")
    const sponsors_container = document.querySelector(".sponsors_cards")

    const animation = new CardsAnimate(sponsors_inner, sponsors_container, 1)
    animation.init()
}

animate()




