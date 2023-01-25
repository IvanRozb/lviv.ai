const timeOut = 300

function setNavigationButtons() {
    const buttons = document.getElementsByClassName('navigation_button')

    for (let i = 0; i < buttons.length; i++) {
        let element = $('.navigation_element-' + (i + 1).toString())
        setTimeout(
            () =>
                element.click(
                    moveUnderline(
                        document.querySelector(
                            '.navigation_element-' + (i + 1).toString()
                        )
                    )
                ),
            timeOut
        )
    }
}
function underlineMoving() {
    // set default underline position
    const underlineWidth = $('.navigation_underline').width()
    setTimeout(() => {
        const firstItem = document.querySelector(
            '.navigation_element-' +
                (
                    Number(
                        $(
                            '.carousel > .slick-list > .slick-track > .slick-active'
                        )[0].dataset['slickIndex']
                    ) + 1
                ).toString()
        )
        moveUnderline(firstItem, underlineWidth)
    }, timeOut)

    // add event for clicking at nav elements
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const element = document.querySelector(
                '.navigation_element-' + (i + 1).toString()
            )
            element.addEventListener('click', (e) => {
                moveUnderline(e.target, underlineWidth)
            })
        }, timeOut)
    }
}

function moveUnderline(targetNavElement) {
    const rect = targetNavElement.getBoundingClientRect()
    const coordinates =
        rect.x + rect.width / 2 - $('.nav_underline').width() / 2
    $('.navigation_underline').css(
        'left',
        ((coordinates / window.innerWidth) * 100).toString() + 'vw'
    )
    return 0
}
function navUnderlineMovement() {
    setNavigationButtons()
    underlineMoving()
}
