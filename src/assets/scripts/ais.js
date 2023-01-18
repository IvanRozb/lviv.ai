import {Fetch} from "./fetch"

setTimeout(async ()=>{
    const dynamicPage = await Fetch.getAISPageAsync()

    document.querySelector(".page_container").insertAdjacentHTML("beforeend", dynamicPage)
},0)

