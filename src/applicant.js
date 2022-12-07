import {Fetch} from "./fetch";
import {animateNavUnderlines} from "./utils";

function containsLink(classList, dataLink){
    let links = dataLink.split(' ');
    for (const link of links) {
        if(classList.contains(link))
            return true;
    }
    return false;
}

function navigationListBehavior(/*string*/containerSelector, /*[string]*/blocksSelectors, /*string*/linksSelector){
    const sidebar = document.querySelector(containerSelector);
    sidebar.addEventListener("click", e => {
        let sections = Array();
        for (const selector of blocksSelectors) {
            sections.push(document.querySelectorAll(selector));
        }
        sections.forEach((section) => {
            section.forEach((section) => {
                section.style.display = "none";
                if(containsLink(section.classList, e.target.dataset.link)){
                    section.style.display = "block";
                }
            })
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

    navigationListBehavior(`.sidebar_list`, [`section`], `.sidebar_list > li`);
    navigationListBehavior(`.subjects_dates`, [`.subjects_images > img`, `.subjects_notes`], `.subjects_date`);

    animateNavUnderlines();
}, 0);
