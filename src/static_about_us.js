const timeOut = 300

function setNavigationButtons(){
    const buttons = document.getElementsByClassName('navigation_button')
    let dots = document.querySelectorAll('.carousel > .slick-dots > li')

    for (let i = 0; i < buttons.length; i++) {
        if(dots[i] === undefined){
            setTimeout(setNavigationButtons, timeOut);
            break;
        }
        dots[i].classList.add('navigation_element-' + (i+1).toString())
        let element = $('.navigation_element-' + (i+1).toString())
        const buttonRect = buttons[i].getBoundingClientRect();
        element.css({
            top:buttonRect.top,
            left:buttonRect.left,
            width:buttonRect.width,
            height:buttonRect.height
        })
        element.click(moveUnderline(document.querySelector('.navigation_element-' + (i+1).toString()), 150))
    }
}

function underlineMoving(){
    // set default underline position
    const underlineWidth = $('.navigation_underline').width();
    setTimeout(()=>{
        const firstItem = document.querySelector('.navigation_element-1');
        moveUnderline(firstItem, underlineWidth)
    }, timeOut)

    // add event for clicking at nav elements
    for (let i = 0; i < 3; i++) {
        setTimeout(()=>{
            const a = document.querySelector('.navigation_element-' + (i+1).toString())
            a.addEventListener("click", (e) => {
                moveUnderline(e.target, underlineWidth)
            })
        }, timeOut)
    }
}

function moveUnderline(targetNavElement, underlineWidth){
    const rect = targetNavElement.getBoundingClientRect();
    $('.navigation_underline').css('left', rect.x + rect.width/2 - underlineWidth/2);
}
function navUnderlineMovement(){
    setNavigationButtons();
    underlineMoving();
}