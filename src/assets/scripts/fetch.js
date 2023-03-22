// for implementation of localStorage functionality
import { checkIfSectionInStorage } from './utils'

if (typeof localStorage === 'undefined' || localStorage === null) {
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
    static async getJobsPositions() {
        async function /*[array, array]*/ getJobsAmounts(jobNames, cities) {
            async function getJobAmount(job, city, resArray) {
                await fetch(
                    `https://jobs.dou.ua/vacancies/?search=${job}+${city}`
                )
                    .then(function (response) {
                        return response.text()
                    })
                    .then(function (data) {
                        const index = data.search(
                            '<div class="b-inner-page-header">'
                        )
                        const jobAmount = parseInt(
                            data.slice(index + 41, index + 46)
                        )

                        resArray.push(jobAmount)
                    })
                    .catch(function (err) {
                        console.warn('Something went wrong.', err)
                    })
            }

            let firstCityJobAmount = []
            let secondCityJobAmount = []

            for (const jobName of jobNames) {
                await getJobAmount(jobName, cities[0], firstCityJobAmount)

                await getJobAmount(jobName, cities[1], secondCityJobAmount)
            }

            return {
                firstCity: firstCityJobAmount,
                secondCity: secondCityJobAmount,
            }
        }

        const sectionName = `jobsPositions`

        const section = checkIfSectionInStorage('UA', sectionName)
        if (section) return section

        const locations = ['Ukraine', 'Lviv']

        await localStorage.setItem(
            `${sectionName}UA`,
            await fetch(
                'https://aidept.com.ua/aiwebsite/jobNames?language=ua',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.json())
                .then(async (data) => {
                    let jobNames = data.names
                    const jobAmounts = await getJobsAmounts(jobNames, locations)

                    return [jobAmounts, jobNames]
                })
                .then(([jobAmounts, jobNames]) => {
                    //Convert camel case to normal words
                    jobNames.map((name, idx) => {
                        for (let i = 0; i < name.length; i++) {
                            if (
                                name[i] === name[i].toUpperCase() &&
                                name[i].match(/[a-z]/i)
                            ) {
                                name = [
                                    name.slice(0, i),
                                    ' ',
                                    name.slice(i),
                                ].join('')
                                i += 1
                            }
                        }

                        jobNames[idx] =
                            name.charAt(0).toUpperCase() + name.slice(1)
                    })

                    let HTML = `<div class='vacancies_jobs'>
                                    <div class='vacancies_job'></div>`
                    jobNames.forEach((name) => {
                        HTML += `<div class='vacancies_job'>${name}</div>`
                    })

                    HTML += `</div>
                         <table class='vacancies_table'>
                            <tr class='vacancies_row'>
                                <th class='vacancies_column'>Ukraine</th>`

                    jobAmounts.firstCity.forEach((amount) => {
                        HTML += `<th class='vacancies_column'>${amount}</th>`
                    })

                    HTML += `</tr>
                     <tr class='vacancies_row'>
                         <th class='vacancies_column'>Lviv</th>`

                    jobAmounts.secondCity.forEach((amount) => {
                        HTML += `<th class='vacancies_column'>${amount}</th>`
                    })

                    HTML += `</tr>
                </table>`

                    return HTML
                })
        )

        localStorage.setItem(
            `${sectionName}InsertedTimeUA`,
            new Date().toJSON()
        )

        return localStorage.getItem(`${sectionName}UA`)
    }

    /*--About us--*/
    static async getCourseCardsPageAsync(language) {
        language = language.toUpperCase()

        function /*string*/ getAboutUsCourseCard(term1, term2, termCounter) {
            function sortSubjectsInGroups(term) {
                Math.exp(2)
                let termGroups = {}

                Object.entries(term).forEach((subject) => {
                    const subjectObj = subject[1]

                    if (subjectObj) {
                        let area = subjectObj.area

                        if (!termGroups[`${area}`])
                            termGroups[`${area}`] = Array()

                        termGroups[`${area}`].push(subjectObj)
                    }
                })

                let termGroupsArray = Object.entries(termGroups)

                //sort in decreasing order
                return termGroupsArray.sort(
                    (one, other) => other[1].length - one[1].length
                )
            }

            function sortedSubjectsGroupsToHTML(sortedGroups) {
                //bg for subjects groups
                const backgrounds = [
                    '#D94442',
                    '#CA605C',
                    '#BA7B75',
                    '#b78f8b',
                    '#861D13',
                    '#59130D',
                ]

                let bgIdx = 0
                let termHTML = ''

                for (const [area, subjects] of sortedGroups) {
                    if (subjects.length === 1) {
                        termHTML += `<div class='table_row single_row' data-area='${area}'>
                                    <div class='card_table_subject' style='background: ${backgrounds[bgIdx]}'
                                         onclick="window.open('${subjects[0].link}', '_blank');">
                                       ${subjects[0].title}
                                    </div>
                                    <div class='card_table_credit'>${subjects[0].credits}</div>
                                </div>`
                    } else {
                        termHTML += `<div class='row_group' data-area='${area}'>`

                        subjects.forEach((subject) => {
                            termHTML += `<div class='table_row'>
                                        <div class='card_table_subject' style='background: ${backgrounds[bgIdx]}'
                                             onclick="window.open('${subject.link}', '_blank');">
                                            ${subject.title}
                                        </div>
                                        <div class='card_table_credit'>${subject.credits}</div>
                                    </div>`
                        })

                        termHTML += `</div>`
                    }

                    bgIdx += 1
                }

                return termHTML
            }

            let courseCard = `<div class='term_group'>
                           
                                <div class='course_card'>
                                    <h6 class='course_card_term'>
                                        ${termCounter} ${
                language === 'UA' ? 'семестр' : 'term'
            } 
                                    </h6>
                        
                                    <div class='course_card_table'>
                                        <div class='table_row'>
                                            <div class='card_table_header'>
                                                ${
                                                    language === 'UA'
                                                        ? 'Предмети'
                                                        : 'Subjects'
                                                }
                                            </div>
                                            <div class='card_table_header'>
                                                ${
                                                    language === 'UA'
                                                        ? 'Кредити'
                                                        : 'Credits'
                                                }
                                            </div>
                                        </div>`

            let term1Groups = sortSubjectsInGroups(term1)

            courseCard += sortedSubjectsGroupsToHTML(term1Groups)

            if (term2) {
                let term2Groups = sortSubjectsInGroups(term2)

                courseCard += `</div>
                        </div>
                    
                        <div class='course_card'>
                            <h6 class='course_card_term'>
                                ${termCounter + 1} ${
                    language === 'UA' ? 'семестр' : 'term'
                }
                            </h6>
            
                            <div class='course_card_table'>
                                <div class='table_row'>
                                    <div class='card_table_header'>${
                                        language === 'UA'
                                            ? 'Предмети'
                                            : 'Subjects'
                                    }</div>
                                    <div class='card_table_header'>${
                                        language === 'UA'
                                            ? 'Кредити'
                                            : 'Credits'
                                    }</div>
                                </div>`

                courseCard += sortedSubjectsGroupsToHTML(term2Groups)
            }

            courseCard += `</div>
                    </div>
                </div>`

            return courseCard
        }

        const sectionName = `courseCards`

        const section = checkIfSectionInStorage(language, sectionName)
        if (section) return section

        const pageName = `${sectionName}${language}`

        localStorage.setItem(
            pageName,
            await fetch(
                `https://aidept.com.ua/aiwebsite/CourseCards?language=${language.toLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    let controls = {
                        bachelorControlsHTML: '',
                        masterControlsHTML: '',
                    }

                    let courseCardsHTML = ''

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].isBachelor === true) {
                            controls.bachelorControlsHTML += `<button class='year_btn' data-year='${data[i].createdYear}'>
                                                                        ${data[i].createdYear}
                                                                  </button>`

                            courseCardsHTML += `<div class='course_cards_container bachelor_${data[i].createdYear}'>`
                        } else {
                            controls.masterControlsHTML += `<button class='year_btn' data-year='${data[i].createdYear}'>
                                                                    ${data[i].createdYear}
                                                                </button>`

                            courseCardsHTML += `<div class='course_cards_container master_${data[i].createdYear}' >`
                        }

                        for (let j = 1; j <= 8; j += 2) {
                            let currentTerm = data[i].curriculum[`term${j}`]
                            let nextTerm = data[i].curriculum[`term${j + 1}`]
                            if (currentTerm || nextTerm) {
                                courseCardsHTML += getAboutUsCourseCard(
                                    currentTerm,
                                    nextTerm,
                                    j
                                )
                            }
                        }

                        courseCardsHTML += '</div>'
                    }
                    let courseCardsMenuHTML = `<div class='course_cards_menu'>
                                        <div class='cards_menu_titles'>
                                            <p class='degree_title'>
                                                ${
                                                    language === 'UA'
                                                        ? 'Ступінь: '
                                                        : 'Degree: '
                                                }
                                            </p>
                                            <p class='year_title'> ${
                                                language === 'UA'
                                                    ? 'Рік: '
                                                    : 'Year: '
                                            }</p>
                                        </div>
                            
                                        <div class='cards_menu_nav'>
                                            <div class='degree_nav'>
                                                <button class='degree_btn bachelor_btn'>
                                                    ${
                                                        language === 'UA'
                                                            ? 'Бакалаврат'
                                                            : 'Bachelor'
                                                    }
                                                </button>
                                                <button class='degree_btn master_btn'>
                                                    ${
                                                        language === 'UA'
                                                            ? 'Магістратура'
                                                            : 'Master'
                                                    }
                                                </button>
                                            </div>
                            
                                            <div class='year_nav nav_bachelor'>
                                                ${controls.bachelorControlsHTML}
                                            </div>
                                            
                                            <div class='year_nav nav_master'>
                                                ${controls.masterControlsHTML}
                                            </div>
                                        </div>
                                    </div>`

                    return courseCardsMenuHTML + courseCardsHTML
                })
        )
        localStorage.setItem(
            `${sectionName}InsertedTime${language}`,
            new Date().toJSON()
        )

        return localStorage.getItem(pageName)
    }

    static async getTeachersAsync(language) {
        language = language.toUpperCase()

        function /*string*/ getEditedFullName(name) {
            let initials = name.split(' ')
            return (
                (initials[0] ? initials[0] + `<br>` : '') +
                (initials[1] ? initials[1] + ' ' : '') +
                (initials[2] ? initials[2] : '')
            )
        }

        function /*string*/ getDegreeComaIndex(degree) {
            let index = 0
            for (const character of degree) {
                if (character === ',') return index
                ++index
            }
            return -1
        }

        const sectionName = `teachersResult`

        const section = checkIfSectionInStorage(language, sectionName)
        if (section) return section

        await localStorage.setItem(
            `teachersResult${language}`,
            await fetch(
                `https://aidept.com.ua/aiwebsite/Employees?language=${language.toLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    let result = ''
                    for (const teacher of data) {
                        const commaPosition =
                            getDegreeComaIndex(teacher.degree) + 1
                        const defaultPhotoUrl =
                            'https://i2.wp.com/pescariusports.ro/wp-content/uploads/2018/09/male-avatar.png?ssl=1'
                        result += `<div class='teachers_column'>
                                <img class='teachers_photo' src='${
                                    teacher.photoUrl === ''
                                        ? defaultPhotoUrl
                                        : teacher.photoUrl
                                }' alt='teacher'>
                                    <h5 class='teachers_full_name'>${getEditedFullName(
                                        teacher.fullName
                                    )}</h5>
                                    <div class='teachers_position'>${
                                        teacher.jobPosition
                                    }</div>
                                    <div class='teachers_line'></div>
                                    <p class='teachers_rank'>${
                                        commaPosition !== 0
                                            ? [
                                                  teacher.degree.slice(
                                                      0,
                                                      commaPosition
                                                  ),
                                                  `<br>`,
                                                  teacher.degree.slice(
                                                      commaPosition
                                                  ),
                                              ].join('')
                                            : teacher.degree
                                    }</p>
                            </div>`
                    }
                    return result
                })
        )
        localStorage.setItem(
            `${sectionName}InsertedTime${language}`,
            new Date().toJSON()
        )
        return localStorage.getItem(`teachersResult${language}`)
    }

    static async getUniversitiesAsync(language) {
        language = language.toUpperCase()
        const sectionName = `universitiesResult`

        const section = checkIfSectionInStorage(language, sectionName)
        if (section) return section

        await localStorage.setItem(
            `universitiesResult${language}`,
            await fetch(
                `https://aidept.com.ua/aiwebsite/Universities?language=${language.toLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    let result = ''
                    for (const university of data) {
                        result += `<div class='programs_item'>
                        <img src='${university.photo}' class='programs_image' alt='university_photo'>
                        <h6 class='programs_carousel_title'>${university.title}</h6>
                        <p class='programs_country'>${university.country}</p>
                    </div>`
                    }
                    return result
                })
        )
        localStorage.setItem(
            `${sectionName}InsertedTime${language}`,
            new Date().toJSON()
        )
        return localStorage.getItem(`universitiesResult${language}`)
    }

    /*--Applicant--*/
    static async getApplicantsAsync(activeSection, language) {
        language = language.toUpperCase()
        const getApplicantExplanations = (element, headerText, isActive) => {
            let result = `<section class='docs_section${
                isActive ? ' active' : ''
            }' id='docs_section'><div class='docs_content'><h4 class='docs_main_title applicant_title'>${headerText}</h4>`
            for (const explanation of element) {
                result += `<div class='docs_box'><h5 class='docs_list_title'>${explanation.title}</h5><ul class='docs_list'>`
                for (const item of explanation.items) {
                    result += `<li class='docs_list_items'><h6 class='docs_list_text'>${item}</h6></li>`
                }
                result += `</ul></div>`
                if (explanation.photo != null) {
                    result += `<div class='docs_cabinet'><img class='docs_cabinet_img' src='${explanation.photo}' alt='form'></div>`
                }
            }
            result += `</div></section>`
            return result
        }

        const getApplicantEducationCosts = (
            element,
            headerText,
            language,
            isActive
        ) => {
            const payColumnsText =
                language === 'UA'
                    ? ['Ступінь', 'Семестр', 'Обсяги']
                    : ['Degree', 'Term', 'Amount']
            const payLinkText =
                language === 'UA'
                    ? [
                          '*Maкcимaльнi oбcяги тa квaлiфiкaцiйний мiнiмyм дepжaвнoгo зaмoвлeння нa пpийoм y 2022 poцi можна переглянути за посиланням: ',
                          'тиць',
                      ]
                    : [
                          '*Maximum amounts and qualifying minimum of a payment order for the year 2022 can be viewed by following the link: ',
                          'click',
                      ]
            let result = `<section class='pay_section${
                isActive ? ' active' : ''
            }' id='pay_section'><h4 class='pay_title applicant_title'>${headerText}</h4><div class='pay_columns'><div class='pay_column'>${
                payColumnsText[0]
            }</div><div class='pay_column'>${
                payColumnsText[1]
            }</div><div class='pay_column'>${
                payColumnsText[2]
            }</div></div><table class='pay_table'>`
            for (const row of element) {
                result += `<tr class='pay_table_row'><th class='pay_table_value'>${row.degree}</th><th class='pay_table_value'>${row.term}</th><th class='pay_table_value'>${row.capacity}</th></tr>`
            }
            result += `</table><div class='pay_link_div'><p class='pay_link'>${payLinkText[0]}<a class='pay_link color_letter_red' href='https://lpnu.ua/vstupnyku/umovy-vstupu-dlia-bakalavriv' target='_blank'>${payLinkText[1]}</a></p></div></section>`
            return result
        }

        function /*string*/ getApplicantDates(
            element,
            headerText,
            language,
            isActive
        ) {
            let result = `<section class='calendar_section${
                isActive ? ' active' : ''
            }' id='calendar_section'>
                                            <h4 class='calendar-main_title applicant_title'>${headerText}</h4>
                                            <table class = 'calendar-main_table' >`
            let j = 0
            let len = Object.keys(element).length
            for (const key in element) {
                const value = element[key]
                result += `<tr class='calendar-row'>`
                if (++j !== len) result += `<td class='calendar-row-cont'>`
                else
                    result += `<td class='calendar-row-cont calendar-row-cont-bottom'>`
                result += `
                                                    <div class='calendar-row-date'>
                                                        <p class='calendar-row-text_date color_letter_red'>${key}</p>
                                                    </div>
                                                    <div class='calendar_row_info'>`
                let valueCopy = ''
                for (let i = 0; i < value.length; i++) {
                    if (value[i] === '«')
                        valueCopy += `<span class ='color_letter_red'>`
                    else if (value[i] === '»') valueCopy += `</span>`
                    else valueCopy += value[i]
                }
                result += `
                                                        <p class='calendar-row-text'>${valueCopy}</p>
                                                    </div>
                                                </td>
                                            </tr>`
            }
            result += `</table></section>`
            return result
        }

        function /*string*/ getApplicantCompetitiveSubjects(
            element,
            headerText,
            language,
            isActive
        ) {
            const notesHeader = language === 'UA' ? 'Примітки:' : 'Notes:'
            const delimiter = '|r|'

            function getNoteBlock(subject) {
                return `<div class='subjects_notes subjects_notes-${
                    subject.year
                }'>
      <h5 class='subjects_notes_title color_letter_red'>${notesHeader}</h5>
      <div class='subjects_content'>
        ${subject.notes
            .map((note) => {
                const redactedNote = note.replace(
                    new RegExp(`${delimiter}(.+?)${delimiter}`, 'g'),
                    "<span class='color_letter_red'>$1</span>"
                )
                return `<p class='subjects_note'>*${redactedNote}</p>`
            })
            .join('')}
      </div>
    </div>`
            }

            function getContainer(selector, content) {
                return `<div class='${selector}'>${content.join('')}</div>`
            }

            const images = element.map(
                (subject, index) =>
                    `<img class='subjects_image-${subject.year}' src='${
                        subject.photo
                    }' alt='table-${subject.year}' style='display: ${
                        index > 0 ? 'none' : 'block'
                    };'>`
            )

            const notes = element.map((subject, index) =>
                getNoteBlock(subject, index === 0)
            )

            const dates = element
                .map(
                    (subject, index) =>
                        `<p data-link='subjects_image-${
                            subject.year
                        } subjects_notes-${subject.year}' class='subjects_date${
                            index === 0 ? ' active' : ''
                        }'>${subject.year}</p>`
                )
                .join('')

            const imagesContainer = getContainer('subjects_images', images)
            const notesContainer = getContainer(
                'subjects_notes_container',
                notes
            )

            return `<section class='subjects_section${
                isActive ? ' active' : ''
            }' id='subjects_section'>
                        <h4 class='subjects_title applicant_title'>${headerText}</h4>
                        <div class='subjects_dates'>${dates}</div>
                        ${imagesContainer}
                        ${notesContainer}
                      </section>`
        }

        const sectionName = 'applicantResult'
        const section = checkIfSectionInStorage(language, sectionName)
        if (section) return section

        localStorage.setItem(
            `${sectionName}${language}`,
            await fetch(
                `https://aidept.com.ua/aiwebsite/Applicants?language=${language.toLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    const headers =
                        document.querySelector('.sidebar_list').children
                    let result = ''

                    for (const name in data[0]) {
                        const element = data[0][name]
                        switch (name) {
                            case 'explanations':
                                result += getApplicantExplanations(
                                    element,
                                    headers[0].textContent,
                                    'docs_section' === activeSection
                                )
                                break
                            case 'dates':
                                result += getApplicantDates(
                                    element,
                                    headers[1].textContent,
                                    language,
                                    'calendar_section' === activeSection
                                )
                                break
                            case 'competitiveSubjects':
                                result += getApplicantCompetitiveSubjects(
                                    element,
                                    headers[2].textContent,
                                    language,
                                    'subjects_section' === activeSection
                                )
                                break
                            case 'educationCosts':
                                result += getApplicantEducationCosts(
                                    element,
                                    headers[3].textContent,
                                    language,
                                    'pay_section' === activeSection
                                )
                                break
                            default:
                                break
                        }
                    }
                    return (
                        result +
                        `<img class='logo' src='https://bit.ly/3WeWrpK' alt='logo'>`
                    )
                })
        )
        localStorage.setItem(
            `${sectionName}InsertedTime${language}`,
            new Date().toJSON()
        )
        return localStorage.getItem(`${sectionName}${language}`)
    }

    /*--AIS Page--*/
    static async getAISPageAsync(language) {
        language = language.toUpperCase()
        const sectionName = 'aisPage'

        const section = checkIfSectionInStorage(language, sectionName)
        if (section) return section

        function getBigProjectCards(projects, language) {
            let sectionHTML = `<section class='ais-content'>`

            for (const [index, project] of projects.entries()) {
                if (index % 2 === 0) {
                    sectionHTML += `<div class='ais-content-section'>
                                        <img src='${project.imageUrl}' alt='${
                        project.imageUrl
                    }' class='ais-img'>
                           
                                        <div class='ais-info'>
                                            <h4>${project.title}</h4>
                                            <div class='info-desc'>
                                                <p class='info-desc-text'>
                                                ${
                                                    language === 'UA'
                                                        ? project.descriptionUA
                                                        : project.descriptionEN
                                                }
                                                </p>
                                            <a class='ais-link' href='${
                                                project.link
                                            }' target='_blank'>${
                        project.link.slice(0,20)+"..."
                    }</a>
                                            </div>
                                        </div>
                                    </div>`
                } else {
                    sectionHTML += `<div class='ais-content-section'>
                                        <div class='ais-info'>
                                            <h4>${project.title}</h4>
                                            <div class='info-desc'>
                                                <p class='info-desc-text'>
                                                ${
                                                    language === 'UA'
                                                        ? project.descriptionUA
                                                        : project.descriptionEN
                                                }
                                                </p>
                                            <a class='ais-link' href='${
                                                project.link
                                            }' target='_blank'>${
                        project.link.slice(0,20)+"..."
                    }</a>
                                            </div>
                                        </div>
                                        
                                        <img src='${project.imageUrl}' alt='${
                        project.imageUrl
                    }' class='ais-img'>
                                    </div>`
                }
            }
            return sectionHTML + `</section>`
        }

        function getSmallProjectCards(projects, language) {
            let sectionHTML = `<section >
                                <h2 class='ais-subtitle'>Інструменти</h2>
                                <ul class='ais-list'>`

            projects.forEach((project) => {
                sectionHTML += `
                     <li class='ais-list-item'>
                        <img src='${project.imageUrl}' alt='${
                    project.imageUrl
                }' class='ais-photo'>
                        <h5><a class='ais-item-link' href='${
                            project.link
                        }' target='_blank'>${project.title}</a></h5>
                        <p class='ais-item-desc'>
                        ${
                            language === 'UA'
                                ? project.descriptionUA
                                : project.descriptionEN
                        }
                        </p>
                    </li>
                `
            })

            return (
                sectionHTML +
                `</ul>
                                </section>`
            )
        }

        function getAISPageHTML(data, language) {
            const { largeCards, smallCards } = data

            let aisHTML = getBigProjectCards(largeCards, language)
            aisHTML += getSmallProjectCards(smallCards, language)

            return aisHTML
        }

        //TODO: change to host fetch, instead of local
        const [aisHTMLua, aisHTMLen] = await fetch(
            `https://aidept.com.ua/aiwebsite/AISPage`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                const aisHTMLua = getAISPageHTML(data, 'UA')
                const aisHTMLen = getAISPageHTML(data, 'EN')

                return [aisHTMLua, aisHTMLen]
            })

        localStorage.setItem('aisPageUA', aisHTMLua)
        localStorage.setItem('aisPageEN', aisHTMLen)

        localStorage.setItem(
            `${sectionName}InsertedTimeUA`,
            new Date().toJSON()
        )
        localStorage.setItem(
            `${sectionName}InsertedTimeEN`,
            new Date().toJSON()
        )

        return localStorage.getItem(`aisPage${language}`)
    }
}
