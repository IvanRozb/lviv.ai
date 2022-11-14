// Application sidebar behavior
function sidebarBehavior(){
    const sidebar = document.querySelector(`.sidebar_list`);
    sidebar.childNodes.forEach(link => {
        link.addEventListener("click", e => {
            const sections = document.querySelectorAll(`section`)
            sections.forEach((section) => {
                section.style.display = "none"
                if(section.classList.contains(e.target.parentNode.dataset.link)){
                    section.style.display = "block"
                }
            })

            const links = document.querySelectorAll(`.sidebar_list > li`)
            links.forEach((link) => {
                if(link === e.target.parentNode){
                    link.classList.add("active")
                }else{
                    link.classList.remove("active")
                }
            })
        })
    })
}

// Application dates of subjects behavior
function subjectsDatesBehavior(){
    const dates = document.querySelector(`.subjects_dates`);
    dates.childNodes.forEach(link =>{
        link.addEventListener("click", e => {
            const images = document.querySelectorAll(`.subjects_images > img`);
            images.forEach((image) => {
                image.style.display = "none";
                if(image.classList.contains(e.target.dataset.link)){
                    image.style.display = "block";
                }
            });

            const dates = document.querySelectorAll(`.subjects_date`);
            dates.forEach((date) => {
                if(date === e.target){
                    e.target.classList.add("color_letter_red");
                }else{
                    date.classList.remove("color_letter_red");
                }
            })
        })
    })
}

function applicantBehavior(){
    sidebarBehavior();
    subjectsDatesBehavior();
}
applicantBehavior();
