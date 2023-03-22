//Animated BG utils
import $ from 'jquery'

let blobsShapes = [
    'M410.5,280Q374,310,370.5,353Q367,396,326,399.5Q285,403,248.5,410Q212,417,189.5,385.5Q167,354,181.5,315Q196,276,139,263Q82,250,94,215.5Q106,181,131.5,157Q157,133,194,150.5Q231,168,250.5,165Q270,162,295.5,161.5Q321,161,361.5,169Q402,177,424.5,213.5Q447,250,410.5,280Z',
    'M411,279.5Q373,309,351,329Q329,349,311,394.5Q293,440,253,426Q213,412,198,373Q183,334,188,305.5Q193,277,195.5,263.5Q198,250,117.5,198.5Q37,147,75,112.5Q113,78,172.5,125.5Q232,173,250.5,170.5Q269,168,313.5,141.5Q358,115,377.5,147Q397,179,423,214.5Q449,250,411,279.5Z',
    'M403.5,284Q391,318,386,366Q381,414,338,431Q295,448,259.5,405.5Q224,363,163,399.5Q102,436,109,375.5Q116,315,101.5,282.5Q87,250,94.5,214.5Q102,179,103,123Q104,67,155,62.5Q206,58,255,36Q304,14,307.5,94Q311,174,328.5,189Q346,204,381,227Q416,250,403.5,284Z',
    'M445.5,292Q424,334,355,315Q286,296,294,386.5Q302,477,254.5,458Q207,439,166,423Q125,407,153.5,345Q182,283,120.5,266.5Q59,250,131.5,239Q204,228,162.5,158.5Q121,89,172,109.5Q223,130,245,153.5Q267,177,296.5,166Q326,155,387.5,154.5Q449,154,458,202Q467,250,445.5,292Z',
    'M405,280Q374,310,389,377Q404,444,341.5,410.5Q279,377,258,341Q237,305,210.5,318.5Q184,332,165.5,315.5Q147,299,79,274.5Q11,250,61.5,217Q112,184,149,177Q186,170,202,140.5Q218,111,241,150.5Q264,190,298.5,168Q333,146,334.5,177.5Q336,209,386,229.5Q436,250,405,280Z',
    'M402,264Q307,278,325.5,323Q344,368,321.5,416Q299,464,263,407Q227,350,206.5,340.5Q186,331,134.5,331Q83,331,113,290.5Q143,250,91.5,199.5Q40,149,119,167Q198,185,196,96Q194,7,246,22.5Q298,38,322,84Q346,130,410.5,136Q475,142,486,196Q497,250,402,264Z',
    'M351.5,277.5Q364,305,362.5,347Q361,389,318.5,375.5Q276,362,251,359.5Q226,357,194,359Q162,361,111.5,351Q61,341,50.5,295.5Q40,250,83.5,220.5Q127,191,136,154.5Q145,118,186.5,135Q228,152,261.5,102Q295,52,315,98Q335,144,397,147Q459,150,399,200Q339,250,351.5,277.5Z',
]

export function animatedBlob(n, width) {
    shuffle(blobsShapes)
    return `
        <div class='blob_bg' style=' width: ${width}vw; left: 0; top:0;'>
            <div id='blob${n}' >
            <svg viewBox='0 0 800 500' preserveAspectRatio='none'
                 xmlns='http://www.w3.org/2000/svg'
                 width='100%' class='blobSvg'>
                <path fill='#E92828' id='path'>
                    <animate attributeName='d' dur='25000ms' repeatCount='indefinite'
                    values='
                        ${blobsShapes[0]};
                        ${blobsShapes[1]};
                        ${blobsShapes[2]};
                        ${blobsShapes[3]};
                        ${blobsShapes[0]};'
                    ></animate>
                </path>
            </svg>
            </div>
    </div>
    `
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ]
    }

    return array
}

//Course card help function
export function setGroupSelectorPosition() {
    let groups = document.querySelectorAll('.row_group')

    for (let i = 0; i < groups.length; i++) {
        let groupRect = groups[i].getBoundingClientRect()
        let group_name = groups[i].getAttribute('data-area')
        groups[i].insertAdjacentHTML(
            'afterbegin',
            `<div class='group_selector group_selector-${i}'>${group_name}</div>`
        )

        const group = $(`.group_selector-${i}`)

        group.css({
            width: ((groups[i].childNodes.length - 1) * 6.75).toString() + 'vh',
            height: '3.125vw',
            left: '111%',
        })
        group.css({
            top:
                (
                    ((groupRect.height - group.width()) /
                        2 /
                        groupRect.height) *
                    100
                ).toString() + '%',
        })
    }
}

//Vacancies statics
export function vacanciesHTML() {
    return `<div class='vacancies_jobs'>
                    <div class='vacancies_job'></div>
                    <div class='vacancies_job'>Java Developer</div>
                    <div class='vacancies_job'>Data Science</div>
                    <div class='vacancies_job'>Python Developer</div>
                    <div class='vacancies_job'>Big Data</div>
                    <div class='vacancies_job'>C++ Developer</div>
                </div>
                <table class='vacancies_table'>
                    <tr class='vacancies_row'>
                        <th class='vacancies_column'>Україна</th>
                        <th class='vacancies_column'>531</th>
                        <th class='vacancies_column'>143</th>
                        <th class='vacancies_column'>339</th>
                        <th class='vacancies_column'>90</th>
                        <th class='vacancies_column'>193</th>
                    </tr>
                    <tr class='vacancies_row'>
                        <th class='vacancies_column'>Львів</th>
                        <th class='vacancies_column'>133</th>
                        <th class='vacancies_column'>26</th>
                        <th class='vacancies_column'>69</th>
                        <th class='vacancies_column'>28</th>
                        <th class='vacancies_column'>32</th>
                    </tr>
                </table>`
}

export function checkIfSectionInStorage(language, sectionName) {
    language = language.toUpperCase()

    const html = localStorage.getItem(`${sectionName}${language}`)
    let insertedDate = localStorage.getItem(
        `${sectionName}InsertedTime${language}`
    )

    if (html != null && insertedDate != null) {
        insertedDate = new Date(insertedDate)
        insertedDate.setDate(insertedDate.getDate() + 3)

        //checks if item exists in localStorage more than 3 day
        if (insertedDate > new Date()) return html
    }
    return null
}

export function navigationListBehavior(
    containerSelector,
    blocksSelectors,
    linksSelector
) {
    const containsLink = (classList, dataLink) =>
        dataLink.split(' ').some((link) => classList.contains(link))
    const sidebar = document.querySelector(containerSelector)

    sidebar.addEventListener('click', (e) => {
        const targetLink = e.target.dataset.link
        if (!targetLink) {
            // console.log("Not a link. Maybe you clicked on underline ?");
            return
        }
        const sections = []
        for (const selector of blocksSelectors) {
            const elems = document.querySelectorAll(selector)
            sections.push(...elems)
        }
        for (const section of sections) {
            let hasLink = containsLink(section.classList, targetLink)
            if (e.target.classList.contains('expanded')) {
                continue
            }
            section.style.display = hasLink ? 'block' : 'none'
        }
        const links = document.querySelectorAll(linksSelector)
        for (const link of links) {
            if (e.target.classList.contains('expanded')) {
                continue
            }
            if (link === e.target) {
                link.classList.add('active')
            } else {
                link.classList.remove('active')
            }
        }
    })
}

export function setDefaultSection(activeSection) {
    const blocks = document.querySelectorAll('[data-link]')
    blocks.forEach((block) => {
        block.classList.toggle('active', block.dataset.link === activeSection)
    })
}
