import {Fetch} from "./fetch";

function navigationListBehavior(/*string*/containerSelector, /*string*/blocksSelector, /*string*/linksSelector){
    const sidebar = document.querySelector(containerSelector);
    sidebar.addEventListener("click", e => {
        const sections = document.querySelectorAll(blocksSelector);
        sections.forEach((section) => {
            section.style.display = "none"
            if(section.classList.contains(e.target.dataset.link)){
                section.style.display = "block"
            }
        });

        const links = document.querySelectorAll(linksSelector);
        links.forEach((link) => {
            if(link === e.target){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }
        });
    });
}


setTimeout(async ()=>{
    document.getElementsByTagName('body')[0].innerHTML += await Fetch.getApplicants();

    navigationListBehavior(`.sidebar_list`, `section`, `.sidebar_list > li`);
    navigationListBehavior(`.subjects_dates`, `.subjects_images > img`, `.subjects_date`);
}, 0);
