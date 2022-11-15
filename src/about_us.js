import {courseCard, getCourseCardHTML} from './utils'

const template = getCourseCardHTML()
document.querySelector(".course_cards_section").insertAdjacentHTML(
        'beforeend', localStorage.getItem('term1')
)



// debugger
