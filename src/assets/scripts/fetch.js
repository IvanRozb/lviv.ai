// for implementation of localStorage functionality
if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage
    localStorage = new LocalStorage('./scratch')
}

/**
 * @Class
 * Represent a fetch container
 * @export Fetch
*/
export class Fetch {
    /*
    * Main async implementation
    */
    /*--Start page--*/
    static async getJobsPositions(){
        async function /*[array, array]*/getJobsAmounts(jobNames, cities){

            async function getJobAmount(job, city, resArray){
                await fetch(`https://jobs.dou.ua/vacancies/?search=${job}+${city}`).then(function (response) {
                    return response.text()
                }).then(function (data) {
                    const index = data.search("<div class=\"b-inner-page-header\">")
                    const jobAmount = parseInt(data.slice(index+41, index+46))

                    resArray.push(jobAmount)
                }).catch(function (err) {
                    console.warn('Something went wrong.', err)
                })
            }

            let firstCityJobAmount = []
            let secondCityJobAmount = []

            for (const jobName of jobNames) {

                await getJobAmount(jobName, cities[0], firstCityJobAmount)

                await getJobAmount(jobName, cities[1], secondCityJobAmount)

            }

            return {firstCity: firstCityJobAmount, secondCity: secondCityJobAmount}

        }

        const html = localStorage.getItem('jobsPositionsResult')
        let insertedDate = localStorage.getItem("jobsPositionsInsertedTime")

        if (html != null && insertedDate != null){
            insertedDate = new Date(insertedDate)
            insertedDate.setDate(insertedDate.getDate() + 1)

            //checks if item exists in localStorage more than 1 day
            if(insertedDate > new Date())
                return html
        }


        const locations = ["Ukraine", "Lviv"]

        await localStorage.setItem("jobsPositionsResult", await fetch("https://aidept.com.ua/aiwebsite/jobNames?language=ua",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async data => {

                let jobNames = data.names
                const jobAmounts = await getJobsAmounts(jobNames, locations)

                return [jobAmounts, jobNames]
            }).then(([jobAmounts, jobNames]) =>{
                //Convert camel case to normal words
                jobNames.map((name, idx) => {
                    for (let i = 0; i < name.length; i++) {
                        if (name[i] === name[i].toUpperCase() && name[i].match(/[a-z]/i)){
                            name = [name.slice(0, i), " ", name.slice(i)].join('')
                            i += 1
                        }
                    }

                    jobNames[idx] = name.charAt(0).toUpperCase() + name.slice(1)
                })

                let HTML = `<div class="vacancies_jobs">
                                    <div class="vacancies_job"></div>`
                jobNames.forEach(name => {
                    HTML += `<div class="vacancies_job">${name}</div>`
                })

                HTML += `</div>
                         <table class="vacancies_table">
                            <tr class="vacancies_row">
                                <th class="vacancies_column">Ukraine</th>`

                jobAmounts.firstCity.forEach(amount => {
                    HTML += `<th class="vacancies_column">${amount}</th>`
                })

                HTML += `</tr>
                     <tr class="vacancies_row">
                         <th class="vacancies_column">Lviv</th>`

                jobAmounts.secondCity.forEach(amount => {
                    HTML += `<th class="vacancies_column">${amount}</th>`
                })

                HTML += `</tr>
                </table>`

                return HTML
            }))

        localStorage.setItem("jobsPositionsInsertedTime", new Date().toJSON())

        return localStorage.getItem('jobsPositionsResult')
    }

    /*--About us--*/
    static async getCourseCardsPageAsync(language){
        function /*string*/getAboutUsCourseCard(term1, term2, termCounter){
            function sortSubjectsInGroups(term){
                Math.exp(2)
                let termGroups = {}

                Object.entries(term).forEach(subject => {
                    let area = subject[1].area
                    //TODO make this if prettier
                    if(!termGroups[`${area}`]){
                        termGroups[`${area}`] = Array()
                    }

                    termGroups[`${area}`].push(subject[1])
                })

                let termGroupsArray = Object.entries(termGroups)

                //sort in decreasing order
                return termGroupsArray
                    .sort( (one, other) => other[1].length - one[1].length)
            }
            function sortedSubjectsGroupsToHTML(sortedGroups){
                //bg for subjects groups
                const backgrounds = [
                    "#D94442",
                    "#CA605C",
                    "#BA7B75",
                    "#b78f8b",
                    "#861D13",
                    "#59130D",
                ]

                let bgIdx = 0
                let termHTML = ""

                for (const [area, subjects] of sortedGroups){

                    if(subjects.length === 1){
                        termHTML += `<div class="table_row single_row" data-area="${area}">
                                    <div class="card_table_subject" style="background: ${backgrounds[bgIdx]}"
                                         onclick="location.href='${subjects[0].link}';">
                                       ${subjects[0].title}
                                    </div>
                                    <div class="card_table_credit">${subjects[0].credits}</div>
                                </div>`
                    }else{
                        termHTML += `<div class="row_group" data-area="${area}">`

                        subjects.forEach(subject => {
                            termHTML += `<div class="table_row">
                                        <div class="card_table_subject" style="background: ${backgrounds[bgIdx]}"
                                             onclick="location.href='${subject.link}';">
                                            ${subject.title}
                                        </div>
                                        <div class="card_table_credit">${subject.credits}</div>
                                    </div>`
                        })

                        termHTML += `</div>`
                    }

                    bgIdx += 1
                }

                return termHTML
            }

            let term1Groups = sortSubjectsInGroups(term1)
            let term2Groups = sortSubjectsInGroups(term2)

            let courseCard = `<div class="term_group">
                           
                                <div class="course_card">
                                    <h6 class="course_card_term">${termCounter} семестр</h6>
                        
                                    <div class="course_card_table">
                                        <div class="table_row">
                                            <div class="card_table_header">Предмети</div>
                                            <div class="card_table_header">Кредити</div>
                                        </div>`

            courseCard += sortedSubjectsGroupsToHTML(term1Groups)

            courseCard += `</div>
                        </div>
                    
                        <div class="course_card">
                            <h6 class="course_card_term">${termCounter+1} семестр</h6>
            
                            <div class="course_card_table">
                                <div class="table_row">
                                    <div class="card_table_header">Предмети</div>
                                    <div class="card_table_header">Кредити</div>
                                </div>`

            courseCard += sortedSubjectsGroupsToHTML(term2Groups)

            courseCard += `</div>
                    </div>
                </div>
               `

            return courseCard
        }
        //TODO add links to it
        const page = localStorage.getItem("courseCardsPage")
        if(page) {
            return page
        }else{
            localStorage.setItem("courseCardsPage", await fetch(`https://aidept.com.ua/aiwebsite/CourseCards?language=${language}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    let HTML = `<div class="course_cards_container">`

                    for (let i = 1; i <= 8; i += 2) {
                        let currentTerm = data[0].curriculum[`term${i}`]
                        let nextTerm = data[0].curriculum[`term${i+1}`]

                        HTML += getAboutUsCourseCard(currentTerm, nextTerm, i)
                    }

                    HTML += "</div>"

                    return HTML
                }))
        }

        return localStorage.getItem("courseCardsPage")
    }
    static async getTeachersAsync(language) {
        function /*string*/getEditedFullName(name){
            let initials = name.split(' ')
            return (initials[0]?initials[0] + `<br>`: '') + (initials[1]?initials[1] +' ':'')+(initials[2]?initials[2]:'')
        }
        function /*string*/getDegreeComaIndex(degree){
            let index = 0
            for (const character of degree) {
                if(character === ',')
                    return index
                ++index
            }
            return -1
        }

        const item = localStorage.getItem('teachersResult')
        if (item != null)
            return item
        await localStorage.setItem('teachersResult', await fetch(`https://aidept.com.ua/aiwebsite/Employees?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                const rowAmount = 4, itemAmount = rowAmount*2

                let result = ''
                let amount = 0
                let isSecondRow = false
                for (const teacher of data) {
                    if(amount%itemAmount === 0) {
                        result += `<div class="teachers_item">`
                    }
                    if(amount%rowAmount === 0){
                        result += `<div class="teachers_row${isSecondRow?' teachers_row-second':''}">`
                    }
                    const commaPosition = getDegreeComaIndex(teacher.degree) + 1
                    const defaultPhotoUrl = "https://i2.wp.com/pescariusports.ro/wp-content/uploads/2018/09/male-avatar.png?ssl=1"
                    result += `<div class="teachers_column">
                                <img class="teachers_photo" src="${teacher.photoUrl === "" ? defaultPhotoUrl : teacher.photoUrl}" alt="teacher">
                                    <h5 class="teachers_full_name">${getEditedFullName(teacher.fullName)}</h5>
                                    <div class="teachers_position">${teacher.jobPosition}</div>
                                    <div class="teachers_line"></div>
                                    <p class="teachers_rank">${commaPosition !== 0 ?
                        [teacher.degree.slice(0, commaPosition), `<br>`, teacher.degree.slice(commaPosition)].join('')
                        : teacher.degree}</p>
                            </div>`

                    amount++
                    if(amount%4===0){
                        isSecondRow = !isSecondRow
                        result += `</div>`
                    }
                    if(amount > itemAmount - 1){
                        amount = 0
                        result += `</div>`
                    }
                }
                if(amount !== 0){
                    if(amount % rowAmount === 0)
                        result += `</div>`
                    result += `</div>`
                }
                return result
            }))
        return localStorage.getItem('teachersResult')
    }
    static async getUniversitiesAsync(language) {
        const item = localStorage.getItem('universitiesResult')
        if (item != null)
            return item
        await localStorage.setItem('universitiesResult', await fetch(`https://aidept.com.ua/aiwebsite/Universities?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                let result = ''
                for (const university of data) {
                    result += `<div class="programs_item">
                        <img src="${university.photo}" class="programs_image" alt="university_photo">
                        <h6 class="programs_carousel_title">${university.title}</h6>
                        <p class="programs_country">${university.country}</p>
                    </div>`
                }
                return result
            }))
        return localStorage.getItem('universitiesResult')
    }

    /*--Applicant--*/
    static async getApplicantsAsync(language) {
        function /*string*/getApplicantExplanations(element, headerText){

            let result=`<section class="docs_section applicant_section" style="display: block">
                                            <div class="docs_content">
                                                <h4 class="docs_maintitle applicant_title">
                                                ${headerText}
                                                </h4>`
            for (const explanation of element) {
                result += `<div class="docs_box">`
                result += "<p class=\"docs_list_title\">"+explanation.title+"</p>"
                result += `<ul class="docs_list">`
                for (const item of explanation.items) {
                    result += "<li class=\"docs_list_items\"><h6 class=\"docs_list_text\">"+item+"</h6></li>"
                }
                result += `</ul>`
                result += `</div>`
                if (explanation.photo != null) {
                    result += `<div class="docs_cabinet">
                                                        <img class="docs_cabinet_img" src="${explanation.photo}" alt="form">
                                                    </div>`
                }
            }
            result+=`</div>
                                    </section>`
            return result
        }
        function /*string*/getApplicantEducationCosts(element, headerText, language){
            let payColumnsText, payLinkText
            if (language === "ua"){
                payColumnsText = ["Ступінь", "Семестр", "Обсяги"]
                payLinkText = [
                    "*Maкcимaльнi oбcяги тa квaлiфiкaцiйний мiнiмyм дepжaвнoгo зaмoвлeння нa пpийoм y 2022 poцi можна переглянути за посиланням: ",
                    "тиць"
                ]
            }else{
                payColumnsText = ["Degree", "Term", "Amount"]
                payLinkText = [
                    "*Maximum amounts and qualifying minimum of a payment order for the year 2022 can be viewed by following the link: ",
                    "click"
                ]
            }
            let result=`<section class="pay_section applicant_section" style="display: none">`
            result+=`<h4 class="pay_title applicant_title">${headerText}</h4>
                                <div class="pay_columns">
                                    <div class="pay_column">${payColumnsText[0]}</div>
                                    <div class="pay_column">${payColumnsText[1]}</div>
                                    <div class="pay_column">${payColumnsText[2]}</div>
                                </div>
                                    <table class="pay_table">`
            for (const row of element) {
                result+=`<tr class="pay_table_row">
                                    <th class="pay_table_value ">${row.degree}</th>
                                    <th class="pay_table_value ">${row.term}</th>
                                    <th class="pay_table_value ">${row.capacity}</th>
                                    </tr>`
            }
            result+=`</table>`
            result+=`<div class="pay_link_div">
                                            <p class="pay_link">${payLinkText[0]}
                                                <a class="pay_link color_letter_red" href="https://lpnu.ua/vstupnyku/umovy-vstupu-dlia-bakalavriv">
                                                    ${payLinkText[1]}
                                                </a>
                                            </p>
                                        </div>`
            result+=`</section>`
            return result
        }
        function /*string*/getApplicantDates(element, headerText){
            let result=`<section class="calendar_section applicant_section" style="display: none">
                                            <h4 class="clnd-maintitle applicant_title">${headerText}</h4>
                                            <table class = "clnd-maintable" >`
            let j = 0
            let len = Object.keys(element).length
            for (const key in element) {

                const value = element[key]
                result+=`<tr class="clnd-row">`
                if(++j !== len)
                    result+=`<td class="clnd-row-cont">`
                else
                    result+=`<td class="clnd-row-cont clnd-row-cont-bottom">`
                result+=`
                                                    <div class="clnd-row-date">
                                                        <p class="clnd-row-text_date color_letter_red">${key}</p>
                                                    </div>
                                                    <div class="clnd_row_info">`
                let valueCopy = ''
                for (let i = 0; i < value.length; i++) {
                    if(value[i] === '«')
                        valueCopy+=`<span class ="color_letter_red">`
                    else if(value[i] === '»')
                        valueCopy+=`</span>`
                    else
                        valueCopy+=value[i]
                }
                result+=`
                                                        <p class="clnd-row-text">${valueCopy}</p>
                                                    </div>
                                                </td>
                                            </tr>`
            }
            result+=`</table></section>`
            return result
        }
        function /*string*/getApplicantCompetitiveSubjects(element, headerText, language){
            function /*string*/getNoteBlock(subject, delimiterLength, isFirst, headerText){
                let res_note_block = `<div class="subjects_notes subjects_notes-${subject.year}" style="display: ${(isFirst === 0) ? "block" : "none"}">
                                             <h5 class="subjects_notes_title color_letter_red">${headerText}</h5>
                                             <div class="subjects_content">`
                for (const note of subject.notes) {
                    let redactedNote = ''
                    let redStarted = 0
                    for (let i = 0; i < note.length-delimiterLength; i++) {
                        if(note.substring(i,delimiterLength+i) === '|r|')
                        {
                            if(redStarted === 0) {
                                redactedNote += `<span class="color_letter_red">`
                                redStarted = 1
                            }
                            else{
                                redactedNote += `</span>`
                                redStarted = 0
                            }
                            i+=delimiterLength-1
                        }
                        else
                            redactedNote+=note[i]
                    }
                    redactedNote+=note.substring(note.length-delimiterLength)
                    res_note_block += `<p class="subjects_note">*${redactedNote}</p>`
                }
                res_note_block += `</div></div>`
                return res_note_block
            }
            function /*string*/getContainer(containerSelector, container){
                let result=`<div class="${containerSelector}">`
                for (const element of container) {
                    result+=element
                }
                result+=`</div>`
                return result
            }

            const notesHeader = language === "ua" ? "Примітки:" : "Notes:"
            let result=`<section class="subjects_section applicant_section" style="display: none">
                                            <h4 class="subjects_title applicant_title">${headerText}</h4>
                                            <div class="subjects_dates">`
            let isFirst = 0
            let images = []
            let notes = []
            const delimiterLength = '|r|'.length
            for (const subject of element) {
                result+=`<p data-link="subjects_image-${subject.year} subjects_notes-${subject.year}" class="subjects_date ${(isFirst === 0) ? " active" : ""}">${subject.year}</p>`
                images.push(`<img class="subjects_image-${subject.year}" src="${subject.photo}" alt="table-${subject.year}" style="display: ${(isFirst === 0) ? "block" : "none"}">`)
                notes.push(getNoteBlock(subject, delimiterLength, isFirst, notesHeader))
                ++isFirst
            }
            result+=`</div>`
            result+=getContainer('subjects_images', images)
            result+=getContainer('subjects_notes_container', notes)
            result+=`</section>`

            return result
        }

        let itemName = (language === "ua") ? "applicantResultUA" : "applicantResultEN"

        const item = localStorage.getItem(itemName)
        if (item != null)
            return item

        localStorage.setItem(itemName, await fetch(`https://aidept.com.ua/aiwebsite/Applicants?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                const headers = document.querySelector(".sidebar_list").children
                let result = ''

                for (const name in data[0]) {
                    const element = data[0][name]
                    switch (name){
                        case "explanations":
                            result+=getApplicantExplanations(element, headers[0].textContent)
                            break
                        case "dates":
                            result+=getApplicantDates(element, headers[1].textContent, language)
                            break
                        case "competitiveSubjects":
                            result+=getApplicantCompetitiveSubjects(element, headers[2].textContent, language)
                            break
                        case "educationCosts":
                            result+=getApplicantEducationCosts(element, headers[3].textContent, language)
                            break
                        default:
                            break
                    }

                }


                return result + `<img class="logo" src="https://bit.ly/3WeWrpK" alt="logo">`
            }))
        return localStorage.getItem(itemName)
    }

    /*
    * Additional async implementation
    */
    /*--About us--*/
    static async getCourseCardsPageUA(){
        return await this.getCourseCardsPageAsync('ua')
    }
    static async getTeachersUA() {
        return await this.getTeachersAsync('ua')
    }
    static async getUniversitiesUA() {
        return await this.getUniversitiesAsync('ua')
    }

    /*--Applicant--*/
    static async getApplicantsUA() {
        return await this.getApplicantsAsync('ua')
    }
    static async getApplicantsEN() {
        return await this.getApplicantsAsync('en')
    }
}
