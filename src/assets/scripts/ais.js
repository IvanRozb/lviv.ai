import {Fetch} from "./fetch"

setTimeout(async ()=>{
    const language = document.documentElement.lang
    const dynamicPage = await Fetch.getAISPageAsync(language)

    document.querySelector(".page_container").insertAdjacentHTML("beforeend", dynamicPage)
},0)

