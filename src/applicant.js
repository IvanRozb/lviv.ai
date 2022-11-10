//Applicant sidebar behavior
function applicantSidebar(){
    const sidebar = document.querySelector(`.sidebar_list`)

    sidebar.childNodes.forEach(link =>{
        link.addEventListener("click", (e) => {

            const sections = document.querySelectorAll(`section`)

            sections.forEach((section) => {
                section.style.display = "none"
                if(section.classList.contains(e.target.parentNode.dataset.link)){
                    section.style.display = "block"
                }
            })

            const links = document.querySelectorAll(`.sidebar_list > *`)
            debugger
            links.forEach((link) => {
                if(link == e.target.parentNode){
                    link.classList.add("active")
                }else{
                    link.classList.remove("active")
                }
            })

        })
    })
}
applicantSidebar()
