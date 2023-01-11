import {readyStates} from "stream-http/lib/response";

if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

export class Fetch {
    /* Additional methods */
    static /*string*/#getApplicantExplanations(element){
        let result=`<section class="docs_section applicant_section" style="display: block">
                                            <div class="docs_content">
                                                <h4 class="docs_maintitle applicant_title">Що з документами?</h4>`
        for (const explanation of element) {
            result += `<div class="docs_box">`;
            result += "<p class=\"docs_list_title\">"+explanation.title+"</p>";
            result += `<ul class="docs_list">`;
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
        return result;
    }
    static /*string*/#getApplicantEducationCosts(element){
        let result=`<section class="pay_section applicant_section" style="display: none">`
        result+=`<h4 class="pay_title applicant_title">Вартість навчання</h4>
                                <div class="pay_columns">
                                    <div class="pay_column">Ступінь</div>
                                    <div class="pay_column">Семестр</div>
                                    <div class="pay_column">Обсяги</div>
                                </div>
                                    <table class="pay_table">`;
        for (const row of element) {
            result+=`<tr class="pay_table_row">
                                    <th class="pay_table_value ">${row.degree}</th>
                                    <th class="pay_table_value ">${row.term}</th>
                                    <th class="pay_table_value ">${row.capacity}</th>
                                    </tr>`
        }
        result+=`</table>`
        result+=`<div class="pay_link_div">
                                            <p class="pay_link">*Maкcимaльнi oбcяги тa квaлiфiкaцiйний мiнiмyм дepжaвнoгo зaмoвлeння нa пpийoм y 2022 poцi
                                                можна переглянути за посиланням:
                                                <a class="pay_link color_letter_red" href="https://lpnu.ua/vstupnyku/umovy-vstupu-dlia-bakalavriv">
                                                    тиць
                                                </a>
                                            </p>
                                        </div>`
        result+=`</section>`
        return result;
    }
    static /*string*/#getApplicantDates(element){
        let result=`<section class="calendar_section applicant_section" style="display: none">
                                            <h4 class="clnd-maintitle applicant_title">Важливі дати</h4>
                                            <table class = "clnd-maintable" >`;
        let j = 0;
        let len = Object.keys(element).length;
        for (const key in element) {

            const value = element[key];
            result+=`<tr class="clnd-row">`
            if(++j !== len)
                result+=`<td class="clnd-row-cont">`;
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
                    valueCopy+=`<span class ="color_letter_red">`;
                else if(value[i] === '»')
                    valueCopy+=`</span>`
                else
                    valueCopy+=value[i];
            }
            result+=`
                                                        <p class="clnd-row-text">${valueCopy}</p>
                                                    </div>
                                                </td>
                                            </tr>`
        }
        result+=`</table></section>`
        return result;
    }
    static /*string*/#getApplicantTables(element){
        let result=`<section class="subjects_section applicant_section" style="display: none">
                                            <h4 class="subjects_title applicant_title">Перелік конкурсних предметів</h4>
                                            <div class="subjects_dates">`
        let flag = 0;
        let images = [];
        for (const key in element) {
            const value = element[key];
            result+=`<p data-link="subjects_image-${key}" class="subjects_date color_letter_red${(flag === 0) ? " active" : ""}">${key}</p>`
            images.push(`<img class="subjects_image-${key}" src="${value}" alt="table-${key}" style="display: ${(flag === 0) ? "inline-block" : "none"}">`);
            ++flag;
        }
        result+=`</div>`;
        result+=`<div class="subjects_images">`;
        for (const image of images) {
            result+=image;
        }
        result+=`</div>`
        result+=`<div class="subjects_notes">
                                            <h5 class="subjects_notes_title color_letter_red">Примітки:</h5>
                                            <div class="subjects_content">
                                                <p class="subjects_note">*Замість результатів ЗНО з української мови можуть використовуватися результати ЗНО з української мови та літератури.</p>
                                                <p class="subjects_note">*Вагомий коефіцієнт за успішне закінчення підготовчих курсів в Університеті = 0</p>
                                                <p class="subjects_note">*Враховуйте значення <span class="color_letter_red">сільського</span> та <span class="color_letter_red">регіонального</span> коефіцієнтів, на які домножується Ваш конкурсний бал.</p>
                                            </div>
                                        </div>`
        result+=`</section>`
        return result;
    }
    static /*string*/#getEditedFullName(name){
        let initials = name.split(' ');
        return (initials[0]?initials[0] + `<br>`: '') + (initials[1]?initials[1] +' ':'')+(initials[2]?initials[2]:'');
    }
    static /*string*/#getDegreeComaIndex(degree){
        let index = 0;
        for (const character of degree) {
            if(character === ',')
                return index;
            ++index;
        }
        return -1;
    }
    //About Us
    static /*string*/#getAboutUsCourseCard(term1, term2, termCounter){
        function sortSubjectsInGroups(term){

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
                                    <div class="card_table_subject" style="background: ${backgrounds[bgIdx]}">
                                       ${subjects[0].title}
                                    </div>
                                    <div class="card_table_credit">${subjects[0].credits}</div>
                                </div>`
                }else{
                    termHTML += `<div class="row_group" data-area="${area}">`

                    subjects.forEach(subject => {
                        termHTML += `<div class="table_row">
                                        <div class="card_table_subject" style="background: ${backgrounds[bgIdx]}">
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
        // debugger

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

    /* Main methods */
    static async getApplicantsAsync(language) {
        const item = localStorage.getItem('applicantResult');
        if (item != null)
            return item;
        await localStorage.setItem('applicantResult', await fetch(`https://aidept.com.ua/aiwebsite/Applicants?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                let result = '';
                for (const name in data[0]) {
                    const element = data[0][name]
                    switch (name){
                        case "explanations":
                            result+=this.#getApplicantExplanations(element);
                            break;
                        case "educationCosts":
                            result+=this.#getApplicantEducationCosts(element);
                            break;
                        case "dates":
                            result+=this.#getApplicantDates(element);
                            break;
                        case "tables":
                            result+=this.#getApplicantTables(element);
                            break;
                        default:
                            break;
                    }
                }

                return result + `<img class="logo" src="assets/img/logo.svg" alt="logo">`;
            }))
        return localStorage.getItem('applicantResult');
    }
    static async getTeachersAsync(language) {
        const item = localStorage.getItem('teachersResult');
        if (item != null)
            return item;
        await localStorage.setItem('teachersResult', await fetch(`https://aidept.com.ua/aiwebsite/Employees?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                const rowAmount = 4, itemAmount = rowAmount*2;

                let result = '';
                let amount = 0;
                let isSecondRow = false;
                for (const teacher of data) {
                    if(amount%itemAmount === 0) {
                        result += `<div class="teachers_item">`;
                    }
                    if(amount%rowAmount === 0){
                        result += `<div class="teachers_row${isSecondRow?' teachers_row-second':''}">`;
                    }
                    const commaPosition = this.#getDegreeComaIndex(teacher.degree) + 1;
                    const defaultPhotoUrl = "https://i2.wp.com/pescariusports.ro/wp-content/uploads/2018/09/male-avatar.png?ssl=1"
                    result += `<div class="teachers_column">
                                <img class="teachers_photo" src="${teacher.photoUrl === "" ? defaultPhotoUrl : teacher.photoUrl}" alt="teacher">
                                    <h5 class="teachers_full_name">${this.#getEditedFullName(teacher.fullName)}</h5>
                                    <div class="teachers_position">${teacher.jobPosition}</div>
                                    <div class="teachers_line"></div>
                                    <p class="teachers_rank">${commaPosition !== 0 ?
                        [teacher.degree.slice(0, commaPosition), `<br>`, teacher.degree.slice(commaPosition)].join('')
                        : teacher.degree}</p>
                            </div>`;

                    amount++;
                    if(amount%4===0){
                        isSecondRow = !isSecondRow;
                        result += `</div>`;
                    }
                    if(amount > itemAmount - 1){
                        amount = 0;
                        result += `</div>`;
                    }
                }
                if(amount !== 0){
                    if(amount % rowAmount === 0)
                        result += `</div>`;
                    result += `</div>`
                }
                return result;
            }));
        return localStorage.getItem('teachersResult');
    }
    static async getUniversitiesAsync(language) {
        const item = localStorage.getItem('universitiesResult');
        if (item != null)
            return item;
        await localStorage.setItem('universitiesResult', await fetch(`https://aidept.com.ua/aiwebsite/Universities?language=${language}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                let result = '';
                for (const university of data) {
                    result += `<div class="programs_item">
                        <img src="${university.photo}" class="programs_image" alt="university_photo">
                        <h6 class="programs_carousel_title">${university.title}</h6>
                        <p class="programs_country">${university.country}</p>
                    </div>`;
                }
                return result;
            }));
        return localStorage.getItem('universitiesResult');
    }
    static async getCourseCardsPageAsync(language){
        const page = localStorage.getItem("courseCardsPage")
        if(page) {
            return page
        }else{
            localStorage.setItem("courseCardsPage", await fetch(`https://aidept.com.ua/aiwebsite/CourseCards?language=ua`,
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
                    let navHTML = ``
                    let HTML = `<div class="course_cards_container">`

                    for (let i = 1; i <= 8; i += 2) {
                        let currentTerm = data[0].curriculum[`term${i}`]
                        let nextTerm = data[0].curriculum[`term${i+1}`]

                        HTML += this.#getAboutUsCourseCard(currentTerm, nextTerm, i)
                    }

                    HTML += "</div>"

                    return HTML
                }))
        }

        return localStorage.getItem("courseCardsPage")
    }
    /* Async main methods */
    static async getApplicants() {
        return await this.getApplicantsAsync('ua');
    }
    static async getTeachers() {
        return await this.getTeachersAsync('ua');
    }
    static async getUniversities() {
        return await this.getUniversitiesAsync('ua');
    }
}
