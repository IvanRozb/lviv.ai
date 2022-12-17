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
        return initials[0] + `<br>` + initials[1] +' '+initials[2];
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
        debugger

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
        console.log(item)
        if (item != null)
            return item;
        await localStorage.setItem('applicantResult', await fetch(`http://54.93.52.237/aiwebsite/Applicants?language=${language}`,
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

                return result + `<img class="logo" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwNiIgdmlld0JveD0iMCAwIDEwMSAxMDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfMTAxNF8zNjEpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NC43NzAzIDQuMDU2NEg1NS43NTY3SDY0LjI3OTNINjQuNjc4OEw2NC45NjU3IDQuMzM0NDNMNzEuOTEwMSAxMS4wNjQzSDc5Ljc3NUg4MC4yMjI0TDgwLjUxNyAxMS40MDA5TDg3Ljc0ODQgMTkuNjYwM0w4Ny45OTI2IDE5LjkzOTNWMjAuMzFWMjAuMzEwM1YyMC4zMTA2VjIwLjMxMVYyMC4zMTE2VjIwLjMxMjJWMjAuMzEzVjIwLjMxMzlWMjAuMzE0OVYyMC4zMTYxVjIwLjMxNzRWMjAuMzE4N1YyMC4zMjAyVjIwLjMyMThWMjAuMzIzNlYyMC4zMjU0VjIwLjMyNzRWMjAuMzI5NFYyMC4zMzE2VjIwLjMzMzlWMjAuMzM2NFYyMC4zMzg5VjIwLjM0MTVWMjAuMzQ0M1YyMC4zNDcyVjIwLjM1MDFWMjAuMzUzMlYyMC4zNTY0VjIwLjM1OThWMjAuMzYzMlYyMC4zNjY3VjIwLjM3MDRWMjAuMzc0MVYyMC4zNzhWMjAuMzgxOVYyMC4zODZWMjAuMzkwMlYyMC4zOTQ1VjIwLjM5ODlWMjAuNDAzNFYyMC40MDhWMjAuNDEyN1YyMC40MTc1VjIwLjQyMjVWMjAuNDI3NVYyMC40MzI2VjIwLjQzNzlWMjAuNDQzMlYyMC40NDg2VjIwLjQ1NDJWMjAuNDU5OFYyMC40NjU2VjIwLjQ3MTRWMjAuNDc3NFYyMC40ODM0VjIwLjQ4OTZWMjAuNDk1OFYyMC41MDIxVjIwLjUwODZWMjAuNTE1MVYyMC41MjE4VjIwLjUyODVWMjAuNTM1M1YyMC41NDIyVjIwLjU0OTNWMjAuNTU2NFYyMC41NjM2VjIwLjU3MDlWMjAuNTc4M1YyMC41ODU4VjIwLjU5MzRWMjAuNjAxMVYyMC42MDg4VjIwLjYxNjdWMjAuNjI0N1YyMC42MzI3VjIwLjY0MDhWMjAuNjQ5MVYyMC42NTc0VjIwLjY2NThWMjAuNjc0M1YyMC42ODI5VjIwLjY5MTVWMjAuNzAwM1YyMC43MDkyVjIwLjcxODFWMjAuNzI3MVYyMC43MzYyVjIwLjc0NTRWMjAuNzU0N1YyMC43NjQxVjIwLjc3MzVWMjAuNzgzVjIwLjc5MjdWMjAuODAyNFYyMC44MTIxVjIwLjgyMlYyMC44MzJWMjAuODQyVjIwLjg1MjFWMjAuODYyM1YyMC44NzI2VjIwLjg4MjlWMjAuODkzM1YyMC45MDM5VjIwLjkxNDRWMjAuOTI1MVYyMC45MzU5VjIwLjk0NjdWMjAuOTU3NlYyMC45Njg2VjIwLjk3OTZWMjAuOTkwN1YyMS4wMDE5VjIxLjAxMzJWMjEuMDI0NlYyMS4wMzZWMjEuMDQ3NVYyMS4wNTkxVjIxLjA3MDdWMjEuMDgyNVYyMS4wOTQyVjIxLjEwNjFWMjEuMTE4VjIxLjEzMDFWMjEuMTQyMVYyMS4xNTQzVjIxLjE2NjVWMjEuMTc4OFYyMS4xOTExVjIxLjIwMzZWMjEuMjE2VjIxLjIyODZWMjEuMjQxMlYyMS4yNTM5VjIxLjI2NjdWMjEuMjc5NVYyMS4yOTI0VjIxLjMwNTRWMjEuMzE4NFYyMS4zMzE1VjIxLjM0NDZWMjEuMzU3OFYyMS4zNzExVjIxLjM4NDRWMjEuMzk3OFYyMS40MTEzVjIxLjQyNDhWMjEuNDM4NFYyMS40NTJWMjEuNDY1N1YyMS40Nzk1VjIxLjQ5MzNWMjEuNTA3MlYyMS41MjEyVjIxLjUzNTJWMjEuNTQ5MlYyMS41NjMzVjIxLjU3NzVWMjEuNTkxN1YyMS42MDZWMjEuNjIwM1YyMS42MzQ3VjIxLjY0OTJWMjEuNjYzN1YyMS42NzgyVjIxLjY5MjlWMjEuNzA3NVYyMS43MjIyVjIxLjczN1YyMS43NTE4VjIxLjc2NjdWMjEuNzgxNlYyMS43OTY2VjIxLjgxMTZWMjEuODI2N1YyMS44NDE4VjIxLjg1N1YyMS44NzIyVjIxLjg4NzVWMjEuOTAyOFYyMS45MTgxVjIxLjkzMzVWMjEuOTQ5VjIxLjk2NDVWMjEuOThWMjEuOTk1NlYyMi4wMTEzVjIyLjAyN1YyMi4wNDI3VjIyLjA1ODVWMjIuMDc0M1YyMi4wOTAxVjIyLjEwNlYyMi4xMjJWMjIuMTM3OVYyMi4xNTRWMjIuMTdWMjIuMTg2MVYyMi4yMDIzVjIyLjIxODRWMjIuMjM0N1YyMi4yNTA5VjIyLjI2NzJWMjIuMjgzNlYyMi4yOTk5VjIyLjMxNjNWMjIuMzMyOFYyMi4zNDkzVjIyLjM2NThWMjIuMzgyM1YyMi4zOTg5VjIyLjQxNTZWMjIuNDMyMlYyMi40NDg5VjIyLjQ2NTZWMjIuNDgyNFYyMi40OTkyVjIyLjUxNlYyMi41MzI4VjIyLjU0OTdWMjIuNTY2NlYyMi41ODM2VjIyLjYwMDZWMjIuNjE3NlYyMi42MzQ2VjIyLjY1MTdWMjIuNjY4N1YyMi42ODU5VjIyLjcwM1YyMi43MjAyVjIyLjczNzRWMjIuNzU0NlYyMi43NzE5VjIyLjc4OTFWMjIuODA2NFYyMi44MjM4VjIyLjg0MTFWMjIuODU4NVYyMi44NzU5VjIyLjg5MzNWMjIuOTEwN1YyMi45MjgyVjIyLjk0NTdWMjIuOTYzMlYyMi45ODA3VjIyLjk5ODNWMjMuMDE1OFYyMy4wMzM0VjIzLjA1MVYyMy4wNjg2VjIzLjA4NjNWMjMuMTA0VjIzLjEyMTZWMjMuMTM5M1YyMy4xNTdWMjMuMTc0OFYyMy4xOTI1VjIzLjIxMDNWMjMuMjI4VjIzLjI0NThWMjMuMjYzNlYyMy4yODE1VjIzLjI5OTNWMjMuMzE3MVYyMy4zMzVWMjMuMzUyOVYyMy4zNzA3VjIzLjM4ODZWMjMuNDA2NVYyMy40MjQ0VjIzLjQ0MjRWMjMuNDYwM1YyMy40NzgyVjIzLjQ5NjJWMjMuNTE0MVYyMy41MzIxVjIzLjU1MDFWMjMuNTY4MVYyMy41ODZWMjMuNjA0VjIzLjYyMlYyMy42NFYyMy42NTgxVjIzLjY3NjFWMjMuNjk0MVYyMy43MTIxVjIzLjczMDFWMjMuNzQ4MlYyMy43NjYyVjIzLjc4NDJWMjMuODAyM1YyMy44MjAzVjIzLjgzODNWMjMuODU2NFYyMy44NzQ0VjIzLjg5MjVWMjMuOTEwNVYyMy45Mjg1VjIzLjk0NjZWMjMuOTY0NlYyMy45ODI2VjI0LjAwMDdWMjQuMDE4N1YyNC4wMzY3VjI0LjA1NDdWMjQuMDcyN1YyNC4wOTA3VjI0LjEwODdWMjQuMTI2N1YyNC4xNDQ3VjI0LjE2MjdWMjQuMTgwN1YyNC4xOTg3VjI0LjIxNjZWMjQuMjM0NlYyNC4yNTI1VjI0LjI3MDVWMjQuMjg4NFYyNC4zMDYzVjI0LjMyNDJWMjQuMzQyMVYyNC4zNlYyNC4zNzc5VjI0LjM5NTdWMjQuNDEzNlYyNC40MzE0VjI0LjQ0OTJWMjQuNDY3VjI0LjQ4NDhWMjQuNTAyNlYyNC41MjA0VjI0LjUzODFWMjQuNTU1OVYyNC41NzM2VjI0LjU5MTNWMjQuNjA5VjI0LjYyNjZWMjQuNjQ0M1YyNC42NjE5VjI0LjY3OTVWMjQuNjk3MVYyNC43MTQ3VjI0LjczMjNWMjQuNzQ5OFYyNC43NjczVjI0Ljc4NDhWMjQuODAyM1YyNC44MTk3VjI0LjgzNzJWMjQuODU0NlYyNC44NzE5VjI0Ljg4OTNWMjQuOTA2NlYyNC45MjM5VjI0Ljk0MTJWMjQuOTU4NVYyNC45NzU3VjI0Ljk5MjlWMjUuMDEwMVYyNS4wMjczVjI1LjA0NDRWMjUuMDYxNVYyNS4wNzg2VjI1LjA5NTZWMjUuMTEyNlYyNS4xMjk2VjI1LjE0NjZWMjUuMTYzNVYyNS4xODA0VjI1LjE5NzNWMjUuMjE0MVYyNS4yMzA5VjI1LjI0NzdWMjUuMjY0NFYyNS4yODExVjI1LjI5NzhWMjUuMzE0NFYyNS4zMzFWMjUuMzQ3NlYyNS4zNjQxVjI1LjM4MDZWMjUuMzk3MVYyNS40MTM1VjI1LjQyOTlWMjUuNDQ2M1YyNS40NjI2VjI1LjQ3ODhWMjUuNDk1MVYyNS41MTEzVjI1LjUyNzRWMjUuNTQzNlYyNS41NTk2VjI1LjU3NTdWMjUuNTkxN1YyNS42MDc2VjI1LjYyMzVWMjUuNjM5NFYyNS42NTUyVjI1LjY3MVYyNS42ODY4VjI1LjcwMjVWMjUuNzE4MVYyNS43MzM3VjI1Ljc0OTNWMjUuNzY0OFYyNS43ODAzVjI1Ljc5NTdWMjUuODExMVYyNS44MjY0VjI1Ljg0MTdWMjUuODU3VjI1Ljg3MjJWMjUuODg3M1YyNS45MDI0VjI1LjkxNzRWMjUuOTMyNFYyNS45NDc0VjI1Ljk2MjNWMjUuOTc3MVYyNS45OTE5VjI2LjAwNjZWMjYuMDIxM1YyNi4wMzZWMjYuMDUwNVYyNi4wNjUxVjI2LjA3OTVWMjYuMDkzOVYyNi4xMDgzVjI2LjEyMjZWMjYuMTM2OVYyNi4xNTExVjI2LjE2NTJWMjYuMTc5M1YyNi4xOTMzVjI2LjIwNzNWMjYuMjIxMlYyNi4yMzVWMjYuMjQ4OFYyNi4yNjI1VjI2LjI3NjJWMjYuMjg5OFYyNi4zMDM0VjI2LjMxNjhWMjYuMzMwM1YyNi4zNDM2VjI2LjM1NjlWMjYuMzcwMlYyNi4zODMzVjI2LjM5NjVWMjYuNDA5NVYyNi40MjI1VjI2LjQzNTRWMjYuNDQ4M1YyNi40NjFWMjYuNDczOFYyNi40ODY0VjI2LjQ5OVYyNi41MTE1VjI2LjUyNFYyNi41MzY0VjI2LjU0ODdWMjYuNTYwOVYyNi41NzMxVjI2LjU4NTJWMjYuNTk3MlYyNi42MDkyVjI2LjYyMTFWMjYuNjMyOVYyNi42NDQ3VjI2LjY1NjNWMjYuNjY3OVYyNi42Nzk1VjI2LjY4MDRMOTQuNzAyMSAzMy45MDUxTDk0Ljk2NTcgMzQuMTg4OVYzNC41NzYzVjQ0LjMzNzRWNDQuNzM3NUw5NC42ODY5IDQ1LjAyNDVMOTEuMTQyMSA0OC42NzQ1TDk0Ljc2ODIgNTMuNTA2NUw5NC45NjU3IDUzLjc2OTVWNTQuMDk4NVY2NC4zNjAxVjY0Ljc4ODhMOTQuNjUyMyA2NS4wODEyTDg3Ljk5MjYgNzEuMjk2MlY3OS4xMjdWNzkuNTE1M0w4Ny43Mjc4IDc5Ljc5OTRMODAuNDk2NSA4Ny41NTgzTDgwLjIwNCA4Ny44NzIxSDc5Ljc3NUg3MS45MzAxTDY0Ljk4OTcgOTUuMDc4NUw2NC42OTg3IDk1LjM4MDZINjQuMjc5M0g1NS43NTY3SDU0Ljc3MDNWOTQuMzk0M1Y2OC42MTVWNjcuNjI4N0g1NS43NTY3SDcwLjUyNDNWNjAuNjA1OVYzNy43MjcxTDYzLjg1OTggMzAuODA3Mkg1NS43NTY3SDU0Ljc3MDNWMjkuODIwOVY1LjA0MjcxVjQuMDU2NFpNNzIuNDk2OSAzOC4zMTU3VjU5LjYxOTZIODAuMTExN0M4MC41NTYxIDU4Ljg2MzQgODEuMzk1MyA1OC4zNTM0IDgyLjM1NzUgNTguMzUzNEM4My43ODM5IDU4LjM1MzQgODQuOTQwMSA1OS40NzQgODQuOTQwMSA2MC44NTYzQzg0Ljk0MDEgNjIuMjM4NiA4My43ODM5IDYzLjM1OTEgODIuMzU3NSA2My4zNTkxQzgxLjE5NTQgNjMuMzU5MSA4MC4yMTI2IDYyLjYxNTMgNzkuODg4NCA2MS41OTIySDcyLjQ5NjlWNjguNjE1VjY5LjYwMTNINzEuNTEwNkg1Ni43NDNWOTMuNDA4SDYzLjg1OThMNzAuODAwMiA4Ni4yMDE2TDcxLjA5MTIgODUuODk5NUg3MS41MTA2SDc5LjM0NTlMODYuMDIgNzguNzM4NlY3MS44NTM5SDc3LjQ2NjRMNzIuOTY2NCA3OC43MDY4QzczLjAyNzUgNzguOTIwMiA3My4wNjAxIDc5LjE0NSA3My4wNjAxIDc5LjM3NzJDNzMuMDYwMSA4MC43NTk0IDcxLjkwMzggODEuODggNzAuNDc3NSA4MS44OEM2OS4wNTExIDgxLjg4IDY3Ljg5NDkgODAuNzU5NCA2Ny44OTQ5IDc5LjM3NzJDNjcuODk0OSA3Ny45OTQ5IDY5LjA1MTEgNzYuODc0MyA3MC40Nzc1IDc2Ljg3NDNDNzAuODkzOSA3Ni44NzQzIDcxLjI4NzQgNzYuOTY5OCA3MS42MzU3IDc3LjEzOTVMNzYuMTA5NiA3MC4zMjYyTDc2LjQwMTggNjkuODgxMkg3Ni45MzQxSDg2LjYxNzZMOTIuOTkzIDYzLjkzMTVWNTQuNDI3NEw4OS4zNTQyIDQ5LjU3ODVIODIuMDIwNkM4MS41NzYzIDUwLjMzNDggODAuNzM2OSA1MC44NDQ3IDc5Ljc3NDcgNTAuODQ0N0M3OC4zNDg0IDUwLjg0NDcgNzcuMTkyMSA0OS43MjQyIDc3LjE5MjEgNDguMzQxOUM3Ny4xOTIxIDQ2Ljk1OTYgNzguMzQ4NCA0NS44MzkxIDc5Ljc3NDcgNDUuODM5MUM4MC45MzY4IDQ1LjgzOTEgODEuOTE5NSA0Ni41ODI4IDgyLjI0MzkgNDcuNjA1OUg4OS40MzAxTDkyLjk5MyA0My45MzcyVjM0Ljk2MzZMODYuNTc2MiAyOC4wNTQxSDc2LjkzNDFINzYuNDYxTDc2LjE2NDkgMjcuNjg1MUw3MS4wMDcyIDIxLjI1ODZDNzAuODM2MiAyMS4yOTMxIDcwLjY1OSAyMS4zMTEzIDcwLjQ3NzUgMjEuMzExM0M2OS4wNTExIDIxLjMxMTMgNjcuODk0OSAyMC4xOTA3IDY3Ljg5NDkgMTguODA4NEM2Ny44OTQ5IDE3LjQyNjEgNjkuMDUxMSAxNi4zMDU2IDcwLjQ3NzUgMTYuMzA1NkM3MS45MDM4IDE2LjMwNTYgNzMuMDYwMSAxNy40MjYxIDczLjA2MDEgMTguODA4NEM3My4wNjAxIDE5LjMwNTMgNzIuOTEwNyAxOS43Njg0IDcyLjY1MyAyMC4xNTc3TDc3LjQwNzIgMjYuMDgxNEg4Ni4wMlYyNi4wNzk1VjI2LjA2NTFWMjYuMDUwNVYyNi4wMzZWMjYuMDIxM1YyNi4wMDY2VjI1Ljk5MTlWMjUuOTc3MVYyNS45NjIzVjI1Ljk0NzRWMjUuOTMyNFYyNS45MTc0VjI1LjkwMjRWMjUuODg3M1YyNS44NzIyVjI1Ljg1N1YyNS44NDE3VjI1LjgyNjRWMjUuODExMVYyNS43OTU3VjI1Ljc4MDNWMjUuNzY0OFYyNS43NDkzVjI1LjczMzdWMjUuNzE4MVYyNS43MDI1VjI1LjY4NjhWMjUuNjcxVjI1LjY1NTJWMjUuNjM5NFYyNS42MjM1VjI1LjYwNzZWMjUuNTkxN1YyNS41NzU3VjI1LjU1OTZWMjUuNTQzNlYyNS41Mjc0VjI1LjUxMTNWMjUuNDk1MVYyNS40Nzg4VjI1LjQ2MjZWMjUuNDQ2M1YyNS40Mjk5VjI1LjQxMzVWMjUuMzk3MVYyNS4zODA2VjI1LjM2NDFWMjUuMzQ3NlYyNS4zMzFWMjUuMzE0NFYyNS4yOTc4VjI1LjI4MTFWMjUuMjY0NFYyNS4yNDc3VjI1LjIzMDlWMjUuMjE0MVYyNS4xOTczVjI1LjE4MDRWMjUuMTYzNVYyNS4xNDY2VjI1LjEyOTZWMjUuMTEyNlYyNS4wOTU2VjI1LjA3ODZWMjUuMDYxNVYyNS4wNDQ0VjI1LjAyNzNWMjUuMDEwMVYyNC45OTI5VjI0Ljk3NTdWMjQuOTU4NVYyNC45NDEyVjI0LjkyMzlWMjQuOTA2NlYyNC44ODkzVjI0Ljg3MTlWMjQuODU0NlYyNC44MzcyVjI0LjgxOTdWMjQuODAyM1YyNC43ODQ4VjI0Ljc2NzNWMjQuNzQ5OFYyNC43MzIzVjI0LjcxNDdWMjQuNjk3MVYyNC42Nzk1VjI0LjY2MTlWMjQuNjQ0M1YyNC42MjY2VjI0LjYwOVYyNC41OTEzVjI0LjU3MzZWMjQuNTU1OVYyNC41MzgxVjI0LjUyMDRWMjQuNTAyNlYyNC40ODQ4VjI0LjQ2N1YyNC40NDkyVjI0LjQzMTRWMjQuNDEzNlYyNC4zOTU3VjI0LjM3NzlWMjQuMzZWMjQuMzQyMVYyNC4zMjQyVjI0LjMwNjNWMjQuMjg4NFYyNC4yNzA1VjI0LjI1MjVWMjQuMjM0NlYyNC4yMTY2VjI0LjE5ODdWMjQuMTgwN1YyNC4xNjI3VjI0LjE0NDdWMjQuMTI2N1YyNC4xMDg3VjI0LjA5MDdWMjQuMDcyN1YyNC4wNTQ3VjI0LjAzNjdWMjQuMDE4N1YyNC4wMDA3VjIzLjk4MjZWMjMuOTY0NlYyMy45NDY2VjIzLjkyODVWMjMuOTEwNVYyMy44OTI1VjIzLjg3NDRWMjMuODU2NFYyMy44MzgzVjIzLjgyMDNWMjMuODAyM1YyMy43ODQyVjIzLjc2NjJWMjMuNzQ4MlYyMy43MzAxVjIzLjcxMjFWMjMuNjk0MVYyMy42NzYxVjIzLjY1ODFWMjMuNjRWMjMuNjIyVjIzLjYwNFYyMy41ODZWMjMuNTY4MVYyMy41NTAxVjIzLjUzMjFWMjMuNTE0MVYyMy40OTYyVjIzLjQ3ODJWMjMuNDYwM1YyMy40NDI0VjIzLjQyNDRWMjMuNDA2NVYyMy4zODg2VjIzLjM3MDdWMjMuMzUyOVYyMy4zMzVWMjMuMzE3MVYyMy4yOTkzVjIzLjI4MTVWMjMuMjYzNlYyMy4yNDU4VjIzLjIyOFYyMy4yMTAzVjIzLjE5MjVWMjMuMTc0OFYyMy4xNTdWMjMuMTM5M1YyMy4xMjE2VjIzLjEwNFYyMy4wODYzVjIzLjA2ODZWMjMuMDUxVjIzLjAzMzRWMjMuMDE1OFYyMi45OTgzVjIyLjk4MDdWMjIuOTYzMlYyMi45NDU3VjIyLjkyODJWMjIuOTEwN1YyMi44OTMzVjIyLjg3NTlWMjIuODU4NVYyMi44NDExVjIyLjgyMzhWMjIuODA2NFYyMi43ODkxVjIyLjc3MTlWMjIuNzU0NlYyMi43Mzc0VjIyLjcyMDJWMjIuNzAzVjIyLjY4NTlWMjIuNjY4N1YyMi42NTE3VjIyLjYzNDZWMjIuNjE3NlYyMi42MDA2VjIyLjU4MzZWMjIuNTY2NlYyMi41NDk3VjIyLjUzMjhWMjIuNTE2VjIyLjQ5OTJWMjIuNDgyNFYyMi40NjU2VjIyLjQ0ODlWMjIuNDMyMlYyMi40MTU2VjIyLjM5ODlWMjIuMzgyM1YyMi4zNjU4VjIyLjM0OTNWMjIuMzMyOFYyMi4zMTYzVjIyLjI5OTlWMjIuMjgzNlYyMi4yNjcyVjIyLjI1MDlWMjIuMjM0N1YyMi4yMTg0VjIyLjIwMjNWMjIuMTg2MVYyMi4xN1YyMi4xNTRWMjIuMTM3OVYyMi4xMjJWMjIuMTA2VjIyLjA5MDFWMjIuMDc0M1YyMi4wNTg1VjIyLjA0MjdWMjIuMDI3VjIyLjAxMTNWMjEuOTk1NlYyMS45OFYyMS45NjQ1VjIxLjk0OVYyMS45MzM1VjIxLjkxODFWMjEuOTAyOFYyMS44ODc1VjIxLjg3MjJWMjEuODU3VjIxLjg0MThWMjEuODI2N1YyMS44MTE2VjIxLjc5NjZWMjEuNzgxNlYyMS43NjY3VjIxLjc1MThWMjEuNzM3VjIxLjcyMjJWMjEuNzA3NVYyMS42OTI5VjIxLjY3ODJWMjEuNjYzN1YyMS42NDkyVjIxLjYzNDdWMjEuNjIwM1YyMS42MDZWMjEuNTkxN1YyMS41Nzc1VjIxLjU2MzNWMjEuNTQ5MlYyMS41MzUyVjIxLjUyMTJWMjEuNTA3MlYyMS40OTMzVjIxLjQ3OTVWMjEuNDY1N1YyMS40NTJWMjEuNDM4NFYyMS40MjQ4VjIxLjQxMTNWMjEuMzk3OFYyMS4zODQ0VjIxLjM3MTFWMjEuMzU3OFYyMS4zNDQ2VjIxLjMzMTVWMjEuMzE4NFYyMS4zMDU0VjIxLjI5MjRWMjEuMjc5NVYyMS4yNjY3VjIxLjI1MzlWMjEuMjQxMlYyMS4yMjg2VjIxLjIxNlYyMS4yMDM2VjIxLjE5MTFWMjEuMTc4OFYyMS4xNjY1VjIxLjE1NDNWMjEuMTQyMVYyMS4xMzAxVjIxLjExOFYyMS4xMDYxVjIxLjA5NDJWMjEuMDgyNVYyMS4wNzA3VjIxLjA1OTFWMjEuMDQ3NVYyMS4wMzZWMjEuMDI0NlYyMS4wMTMyVjIxLjAwMTlWMjAuOTkwN1YyMC45Nzk2VjIwLjk2ODZWMjAuOTU3NlYyMC45NDY3VjIwLjkzNTlWMjAuOTI1MVYyMC45MTQ0VjIwLjkwMzlWMjAuODkzM1YyMC44ODI5VjIwLjg3MjZWMjAuODYyM1YyMC44NTIxVjIwLjg0MlYyMC44MzJWMjAuODIyVjIwLjgxMjFWMjAuODAyNFYyMC43OTI3VjIwLjc4M1YyMC43NzM1VjIwLjc2NDFWMjAuNzU0N1YyMC43NDU0VjIwLjczNjJWMjAuNzI3MVYyMC43MTgxVjIwLjcwOTJWMjAuNzAwM1YyMC42OTE1VjIwLjY4MjlWMjAuNjgwOEw3OS4zMjc2IDEzLjAzN0g3MS41MTA2SDcxLjExMTFMNzAuODI0MiAxMi43NTg5TDYzLjg3OTggNi4wMjkwMkg1Ni43NDNWMjguODM0Nkg2NC4yNzkzSDY0LjY5ODdMNjQuOTg5NyAyOS4xMzY3TDcxLjkzMDEgMzYuMzQzMUg4MS41MzI2QzgxLjkyNzUgMzUuNDUxMSA4Mi44NDIgMzQuODI2MyA4My45MDcxIDM0LjgyNjNDODUuMzMzNCAzNC44MjYzIDg2LjQ4OTcgMzUuOTQ2OCA4Ni40ODk3IDM3LjMyOTFDODYuNDg5NyAzOC43MTE0IDg1LjMzMzQgMzkuODMyIDgzLjkwNzEgMzkuODMyQzgyLjg0MjIgMzkuODMyIDgxLjkyNzkgMzkuMjA3NCA4MS41MzI4IDM4LjMxNTdINzIuNDk2OVpNMzEuNzg0OSA0Mi4wODVWNDQuMzYwNUwzMy40NDU1IDQyLjgwNDhMNDEuMTkzMyAzNS41NDY1TDQzLjAxNDUgMzMuODQwNEg0MC41MTlIMzIuNzcxMkgzMS43ODQ5VjM0LjgyNjdWNDIuMDg1Wk0zMy43NTc1IDM1LjgxMzFIMzguMDIzNUwzMy43NTc1IDM5LjgwOTVWMzUuODEzMVpNNjguODgwOSA1OC4zNTM0VjU2LjA3NzlMNjcuMjIwMyA1Ny42MzM2TDU5LjQ3MjUgNjQuODkxOUw1Ny42NTEzIDY2LjU5OEg2MC4xNDY4SDY3Ljg5NDZINjguODgwOVY2NS42MTE3VjU4LjM1MzRaTTY2LjkwODMgNjQuNjI1NEg2Mi42NDIzTDY2LjkwODMgNjAuNjI4OVY2NC42MjU0Wk00NS4xNjggOTUuNjMwOUg0Ni4xNTQzVjk0LjY0NDZWNjkuODY2NFY2OC44ODAxSDQ1LjE2OEgzNy4wNjQ4TDMwLjQwMDQgNjEuOTYwMlYzOS4wODE0VjMyLjA1ODZINDUuMTY4SDQ2LjE1NDNWMzEuMDcyM1Y1LjI5Mjk1VjQuMzA2NjNINDUuMTY4SDM2LjY0NTRIMzYuMjI1OUwzNS45MzQ5IDQuNjA4NzVMMjguOTk0NiAxMS44MTUySDIxLjE0OTdIMjAuNzIwN0wyMC40MjgyIDEyLjEyOUwxMy4xOTY4IDE5Ljg4NzhMMTIuOTMyIDIwLjE3MTlWMjAuNTYwM1YyOC4zOTExTDYuMjcyMzYgMzQuNjA2TDUuOTU4OTggMzQuODk4NVYzNS4zMjcxVjQ1LjU4ODhWNDUuOTE3N0w2LjE1NjQyIDQ2LjE4MDhMOS43ODI1NCA1MS4wMTI3TDYuMjM3NzQgNTQuNjYyN0w1Ljk1ODk4IDU0Ljk0OThWNTUuMzQ5OVY2NS4xMTFWNjUuNDk4M0w2LjIyMjU3IDY1Ljc4MjJMMTIuOTMyIDczLjAwNjlWNzMuMDA3OFY3My4wMTkzVjczLjAzMDlWNzMuMDQyNlY3My4wNTQ0VjczLjA2NjJWNzMuMDc4MVY3My4wOVY3My4xMDIxVjczLjExNDJWNzMuMTI2NFY3My4xMzg2VjczLjE1MDlWNzMuMTYzM1Y3My4xNzU4VjczLjE4ODNWNzMuMjAwOVY3My4yMTM1VjczLjIyNjJWNzMuMjM5VjczLjI1MTlWNzMuMjY0OFY3My4yNzc4VjczLjI5MDhWNzMuMzAzOVY3My4zMTcxVjczLjMzMDNWNzMuMzQzNlY3My4zNTdWNzMuMzcwNFY3My4zODM5VjczLjM5NzVWNzMuNDExMVY3My40MjQ3VjczLjQzODVWNzMuNDUyM1Y3My40NjYxVjczLjQ4VjczLjQ5NFY3My41MDhWNzMuNTIyMVY3My41MzYyVjczLjU1MDRWNzMuNTY0N1Y3My41NzlWNzMuNTkzM1Y3My42MDc3VjczLjYyMjJWNzMuNjM2N1Y3My42NTEzVjczLjY2NTlWNzMuNjgwNlY3My42OTU0VjczLjcxMDJWNzMuNzI1VjczLjczOTlWNzMuNzU0OFY3My43Njk4VjczLjc4NDlWNzMuOFY3My44MTUxVjczLjgzMDNWNzMuODQ1NVY3My44NjA4VjczLjg3NjJWNzMuODkxNVY3My45MDdWNzMuOTIyNFY3My45MzhWNzMuOTUzNVY3My45NjkxVjczLjk4NDhWNzQuMDAwNVY3NC4wMTYyVjc0LjAzMlY3NC4wNDc5Vjc0LjA2MzdWNzQuMDc5NlY3NC4wOTU2Vjc0LjExMTZWNzQuMTI3NlY3NC4xNDM3Vjc0LjE1OThWNzQuMTc2Vjc0LjE5MjJWNzQuMjA4NFY3NC4yMjQ3Vjc0LjI0MVY3NC4yNTc0Vjc0LjI3MzhWNzQuMjkwMlY3NC4zMDY2Vjc0LjMyMzFWNzQuMzM5N1Y3NC4zNTYyVjc0LjM3MjhWNzQuMzg5NVY3NC40MDYyVjc0LjQyMjlWNzQuNDM5NlY3NC40NTY0Vjc0LjQ3MzJWNzQuNDlWNzQuNTA2OVY3NC41MjM4Vjc0LjU0MDdWNzQuNTU3NlY3NC41NzQ2Vjc0LjU5MTZWNzQuNjA4N1Y3NC42MjU4Vjc0LjY0MjlWNzQuNjZWNzQuNjc3MVY3NC42OTQzVjc0LjcxMTVWNzQuNzI4OFY3NC43NDZWNzQuNzYzM1Y3NC43ODA2Vjc0Ljc5OFY3NC44MTUzVjc0LjgzMjdWNzQuODUwMVY3NC44Njc1Vjc0Ljg4NVY3NC45MDI1Vjc0LjkyVjc0LjkzNzVWNzQuOTU1Vjc0Ljk3MjZWNzQuOTkwMVY3NS4wMDc3Vjc1LjAyNTRWNzUuMDQzVjc1LjA2MDZWNzUuMDc4M1Y3NS4wOTZWNzUuMTEzN1Y3NS4xMzE0Vjc1LjE0OTFWNzUuMTY2OVY3NS4xODQ3Vjc1LjIwMjRWNzUuMjIwMlY3NS4yMzgxVjc1LjI1NTlWNzUuMjczN1Y3NS4yOTE2Vjc1LjMwOTRWNzUuMzI3M1Y3NS4zNDUyVjc1LjM2MzFWNzUuMzgxVjc1LjM5ODlWNzUuNDE2OFY3NS40MzQ4Vjc1LjQ1MjdWNzUuNDcwNlY3NS40ODg2Vjc1LjUwNjZWNzUuNTI0NlY3NS41NDI1Vjc1LjU2MDVWNzUuNTc4NVY3NS41OTY1Vjc1LjYxNDVWNzUuNjMyNlY3NS42NTA2Vjc1LjY2ODZWNzUuNjg2NlY3NS43MDQ2Vjc1LjcyMjdWNzUuNzQwN1Y3NS43NTg3Vjc1Ljc3NjhWNzUuNzk0OFY3NS44MTI5Vjc1LjgzMDlWNzUuODQ4OVY3NS44NjdWNzUuODg1Vjc1LjkwM1Y3NS45MjExVjc1LjkzOTFWNzUuOTU3MVY3NS45NzUyVjc1Ljk5MzJWNzYuMDExMlY3Ni4wMjkyVjc2LjA0NzJWNzYuMDY1MlY3Ni4wODMyVjc2LjEwMTJWNzYuMTE5MlY3Ni4xMzcyVjc2LjE1NTJWNzYuMTczMVY3Ni4xOTExVjc2LjIwOVY3Ni4yMjdWNzYuMjQ0OVY3Ni4yNjI4Vjc2LjI4MDdWNzYuMjk4NlY3Ni4zMTY1Vjc2LjMzNDRWNzYuMzUyM1Y3Ni4zNzAxVjc2LjM4OFY3Ni40MDU4Vjc2LjQyMzZWNzYuNDQxNFY3Ni40NTkyVjc2LjQ3N1Y3Ni40OTQ4Vjc2LjUxMjVWNzYuNTMwMlY3Ni41NDc5Vjc2LjU2NTZWNzYuNTgzM1Y3Ni42MDFWNzYuNjE4NlY3Ni42MzYyVjc2LjY1MzlWNzYuNjcxNFY3Ni42ODlWNzYuNzA2NlY3Ni43MjQxVjc2Ljc0MTZWNzYuNzU5MVY3Ni43NzY1Vjc2Ljc5NFY3Ni44MTE0Vjc2LjgyODhWNzYuODQ2MlY3Ni44NjM1Vjc2Ljg4MDhWNzYuODk4MVY3Ni45MTU0Vjc2LjkzMjdWNzYuOTQ5OVY3Ni45NjcxVjc2Ljk4NDNWNzcuMDAxNFY3Ny4wMTg1Vjc3LjAzNTZWNzcuMDUyN1Y3Ny4wNjk3Vjc3LjA4NjdWNzcuMTAzN1Y3Ny4xMjA2Vjc3LjEzNzVWNzcuMTU0NFY3Ny4xNzEzVjc3LjE4ODFWNzcuMjA0OVY3Ny4yMjE2Vjc3LjIzODRWNzcuMjU1MVY3Ny4yNzE3Vjc3LjI4ODNWNzcuMzA0OVY3Ny4zMjE1Vjc3LjMzOFY3Ny4zNTQ1Vjc3LjM3MDlWNzcuMzg3M1Y3Ny40MDM3Vjc3LjQyVjc3LjQzNjNWNzcuNDUyNlY3Ny40Njg4Vjc3LjQ4NVY3Ny41MDExVjc3LjUxNzNWNzcuNTMzM1Y3Ny41NDkzVjc3LjU2NTNWNzcuNTgxM1Y3Ny41OTcyVjc3LjYxM1Y3Ny42Mjg4Vjc3LjY0NDZWNzcuNjYwM1Y3Ny42NzZWNzcuNjkxNlY3Ny43MDcyVjc3LjcyMjhWNzcuNzM4M1Y3Ny43NTM3Vjc3Ljc2OTFWNzcuNzg0NVY3Ny43OTk4Vjc3LjgxNTFWNzcuODMwM1Y3Ny44NDU1Vjc3Ljg2MDZWNzcuODc1N1Y3Ny44OTA3Vjc3LjkwNTdWNzcuOTIwNlY3Ny45MzU1Vjc3Ljk1MDNWNzcuOTY1Vjc3Ljk3OThWNzcuOTk0NFY3OC4wMDlWNzguMDIzNlY3OC4wMzgxVjc4LjA1MjVWNzguMDY2OVY3OC4wODEzVjc4LjA5NTZWNzguMTA5OFY3OC4xMjM5Vjc4LjEzODFWNzguMTUyMVY3OC4xNjYxVjc4LjE4MDFWNzguMTkzOVY3OC4yMDc4Vjc4LjIyMTVWNzguMjM1MlY3OC4yNDg5Vjc4LjI2MjVWNzguMjc2Vjc4LjI4OTRWNzguMzAyOFY3OC4zMTYyVjc4LjMyOTVWNzguMzQyN1Y3OC4zNTU4Vjc4LjM2ODlWNzguMzgxOVY3OC4zOTQ5Vjc4LjQwNzhWNzguNDIwNlY3OC40MzMzVjc4LjQ0NlY3OC40NTg3Vjc4LjQ3MTJWNzguNDgzN1Y3OC40OTYxVjc4LjUwODVWNzguNTIwOFY3OC41MzNWNzguNTQ1MVY3OC41NTcyVjc4LjU2OTJWNzguNTgxMlY3OC41OTNWNzguNjA0OFY3OC42MTY1Vjc4LjYyODJWNzguNjM5OFY3OC42NTEzVjc4LjY2MjdWNzguNjc0Vjc4LjY4NTNWNzguNjk2NVY3OC43MDc3Vjc4LjcxODdWNzguNzI5N1Y3OC43NDA2Vjc4Ljc1MTRWNzguNzYyMlY3OC43NzI4Vjc4Ljc4MzRWNzguNzkzOVY3OC44MDQ0Vjc4LjgxNDdWNzguODI1Vjc4LjgzNTJWNzguODQ1M1Y3OC44NTUzVjc4Ljg2NTNWNzguODc1MVY3OC44ODQ5Vjc4Ljg5NDZWNzguOTA0MlY3OC45MTM4Vjc4LjkyMzJWNzguOTMyNlY3OC45NDE4Vjc4Ljk1MVY3OC45NjAyVjc4Ljk2OTJWNzguOTc4MVY3OC45ODdWNzguOTk1N1Y3OS4wMDQ0Vjc5LjAxM1Y3OS4wMjE1Vjc5LjAyOTlWNzkuMDM4MlY3OS4wNDY0Vjc5LjA1NDZWNzkuMDYyNlY3OS4wNzA2Vjc5LjA3ODRWNzkuMDg2MlY3OS4wOTM5Vjc5LjEwMTVWNzkuMTA5Vjc5LjExNjRWNzkuMTIzN1Y3OS4xMzA5Vjc5LjEzOFY3OS4xNDVWNzkuMTUxOVY3OS4xNTg4Vjc5LjE2NTVWNzkuMTcyMVY3OS4xNzg3Vjc5LjE4NTFWNzkuMTkxNVY3OS4xOTc3Vjc5LjIwMzlWNzkuMjA5OVY3OS4yMTU5Vjc5LjIyMTdWNzkuMjI3NFY3OS4yMzMxVjc5LjIzODZWNzkuMjQ0MVY3OS4yNDk0Vjc5LjI1NDZWNzkuMjU5OFY3OS4yNjQ4Vjc5LjI2OTdWNzkuMjc0NVY3OS4yNzkzVjc5LjI4MzlWNzkuMjg4NFY3OS4yOTI4Vjc5LjI5NzFWNzkuMzAxMlY3OS4zMDUzVjc5LjMwOTNWNzkuMzEzMlY3OS4zMTY5Vjc5LjMyMDZWNzkuMzI0MVY3OS4zMjc1Vjc5LjMzMDhWNzkuMzM0Vjc5LjMzNzFWNzkuMzQwMVY3OS4zNDNWNzkuMzQ1N1Y3OS4zNDg0Vjc5LjM1MDlWNzkuMzUzM1Y3OS4zNTU2Vjc5LjM1NzhWNzkuMzU5OVY3OS4zNjE5Vjc5LjM2MzdWNzkuMzY1NFY3OS4zNjdWNzkuMzY4NVY3OS4zNjk5Vjc5LjM3MTJWNzkuMzcyM1Y3OS4zNzMzVjc5LjM3NDNWNzkuMzc1Vjc5LjM3NTdWNzkuMzc2M1Y3OS4zNzY3Vjc5LjM3N1Y3OS4zNzcyVjc5Ljc0OEwxMy4xNzYzIDgwLjAyNjlMMjAuNDA3NiA4OC4yODYzTDIwLjcwMjMgODguNjIyOUgyMS4xNDk3SDI5LjAxNDVMMzUuOTU5IDk1LjM1MjhMMzYuMjQ1OSA5NS42MzA5SDM2LjY0NTRINDUuMTY4Wk0yOC40Mjc3IDQwLjA2NzdWNjEuMzcxNkgxOS44Njk0QzE5LjM5ODkgNjAuNzU1NCAxOC42NDM2IDYwLjM1NiAxNy43OTIgNjAuMzU2QzE2LjM2NTYgNjAuMzU2IDE1LjIwOTQgNjEuNDc2NSAxNS4yMDk0IDYyLjg1ODhDMTUuMjA5NCA2NC4yNDExIDE2LjM2NTYgNjUuMzYxNiAxNy43OTIgNjUuMzYxNkMxOS4wNDcgNjUuMzYxNiAyMC4wOTI5IDY0LjQ5NDIgMjAuMzI2MSA2My4zNDQySDI4Ljk5NDZMMzUuOTM0OSA3MC41NTA2TDM2LjIyNTkgNzAuODUyN0gzNi42NDU0SDQ0LjE4MTdWOTMuNjU4MkgzNy4wNDQ5TDMwLjEwMDQgODYuOTI4M0wyOS44MTM2IDg2LjY1MDNIMjkuNDE0SDIxLjU5NzFMMTQuOTA0NyA3OS4wMDY1Vjc5LjAwNDRWNzguOTk1N1Y3OC45ODdWNzguOTc4MVY3OC45NjkyVjc4Ljk2MDJWNzguOTUxVjc4Ljk0MThWNzguOTMyNlY3OC45MjMyVjc4LjkxMzhWNzguOTA0MlY3OC44OTQ2Vjc4Ljg4NDlWNzguODc1MVY3OC44NjUzVjc4Ljg1NTNWNzguODQ1M1Y3OC44MzUyVjc4LjgyNVY3OC44MTQ3Vjc4LjgwNDRWNzguNzkzOVY3OC43ODM0Vjc4Ljc3MjhWNzguNzYyMlY3OC43NTE0Vjc4Ljc0MDZWNzguNzI5N1Y3OC43MTg3Vjc4LjcwNzdWNzguNjk2NVY3OC42ODUzVjc4LjY3NFY3OC42NjI3Vjc4LjY1MTNWNzguNjM5OFY3OC42MjgyVjc4LjYxNjVWNzguNjA0OFY3OC41OTNWNzguNTgxMlY3OC41NjkyVjc4LjU1NzJWNzguNTQ1MVY3OC41MzNWNzguNTIwOFY3OC41MDg1Vjc4LjQ5NjFWNzguNDgzN1Y3OC40NzEyVjc4LjQ1ODdWNzguNDQ2Vjc4LjQzMzNWNzguNDIwNlY3OC40MDc4Vjc4LjM5NDlWNzguMzgxOVY3OC4zNjg5Vjc4LjM1NThWNzguMzQyN1Y3OC4zMjk1Vjc4LjMxNjJWNzguMzAyOFY3OC4yODk0Vjc4LjI3NlY3OC4yNjI1Vjc4LjI0ODlWNzguMjM1MlY3OC4yMjE1Vjc4LjIwNzhWNzguMTkzOVY3OC4xODAxVjc4LjE2NjFWNzguMTUyMVY3OC4xMzgxVjc4LjEyMzlWNzguMTA5OFY3OC4wOTU2Vjc4LjA4MTNWNzguMDY2OVY3OC4wNTI1Vjc4LjAzODFWNzguMDIzNlY3OC4wMDlWNzcuOTk0NFY3Ny45Nzk4Vjc3Ljk2NVY3Ny45NTAzVjc3LjkzNTVWNzcuOTIwNlY3Ny45MDU3Vjc3Ljg5MDdWNzcuODc1N1Y3Ny44NjA2Vjc3Ljg0NTVWNzcuODMwM1Y3Ny44MTUxVjc3Ljc5OThWNzcuNzg0NVY3Ny43NjkxVjc3Ljc1MzdWNzcuNzM4M1Y3Ny43MjI4Vjc3LjcwNzJWNzcuNjkxNlY3Ny42NzZWNzcuNjYwM1Y3Ny42NDQ2Vjc3LjYyODhWNzcuNjEzVjc3LjU5NzJWNzcuNTgxM1Y3Ny41NjUzVjc3LjU0OTNWNzcuNTMzM1Y3Ny41MTczVjc3LjUwMTFWNzcuNDg1Vjc3LjQ2ODhWNzcuNDUyNlY3Ny40MzYzVjc3LjQyVjc3LjQwMzdWNzcuMzg3M1Y3Ny4zNzA5Vjc3LjM1NDVWNzcuMzM4Vjc3LjMyMTVWNzcuMzA0OVY3Ny4yODgzVjc3LjI3MTdWNzcuMjU1MVY3Ny4yMzg0Vjc3LjIyMTZWNzcuMjA0OVY3Ny4xODgxVjc3LjE3MTNWNzcuMTU0NFY3Ny4xMzc1Vjc3LjEyMDZWNzcuMTAzN1Y3Ny4wODY3Vjc3LjA2OTdWNzcuMDUyN1Y3Ny4wMzU2Vjc3LjAxODVWNzcuMDAxNFY3Ni45ODQzVjc2Ljk2NzFWNzYuOTQ5OVY3Ni45MzI3Vjc2LjkxNTRWNzYuODk4MVY3Ni44ODA4Vjc2Ljg2MzVWNzYuODQ2MlY3Ni44Mjg4Vjc2LjgxMTRWNzYuNzk0Vjc2Ljc3NjVWNzYuNzU5MVY3Ni43NDE2Vjc2LjcyNDFWNzYuNzA2NlY3Ni42ODlWNzYuNjcxNFY3Ni42NTM5Vjc2LjYzNjJWNzYuNjE4NlY3Ni42MDFWNzYuNTgzM1Y3Ni41NjU2Vjc2LjU0NzlWNzYuNTMwMlY3Ni41MTI1Vjc2LjQ5NDhWNzYuNDc3Vjc2LjQ1OTJWNzYuNDQxNFY3Ni40MjM2Vjc2LjQwNThWNzYuMzg4Vjc2LjM3MDFWNzYuMzUyM1Y3Ni4zMzQ0Vjc2LjMxNjVWNzYuMjk4NlY3Ni4yODA3Vjc2LjI2MjhWNzYuMjQ0OVY3Ni4yMjdWNzYuMjA5Vjc2LjE5MTFWNzYuMTczMVY3Ni4xNTUyVjc2LjEzNzJWNzYuMTE5MlY3Ni4xMDEyVjc2LjA4MzJWNzYuMDY1MlY3Ni4wNDcyVjc2LjAyOTJWNzYuMDExMlY3NS45OTMyVjc1Ljk3NTJWNzUuOTU3MVY3NS45MzkxVjc1LjkyMTFWNzUuOTAzVjc1Ljg4NVY3NS44NjdWNzUuODQ4OVY3NS44MzA5Vjc1LjgxMjlWNzUuNzk0OFY3NS43NzY4Vjc1Ljc1ODdWNzUuNzQwN1Y3NS43MjI3Vjc1LjcwNDZWNzUuNjg2NlY3NS42Njg2Vjc1LjY1MDZWNzUuNjMyNlY3NS42MTQ1Vjc1LjU5NjVWNzUuNTc4NVY3NS41NjA1Vjc1LjU0MjVWNzUuNTI0NlY3NS41MDY2Vjc1LjQ4ODZWNzUuNDcwNlY3NS40NTI3Vjc1LjQzNDhWNzUuNDE2OFY3NS4zOTg5Vjc1LjM4MVY3NS4zNjMxVjc1LjM0NTJWNzUuMzI3M1Y3NS4zMDk0Vjc1LjI5MTZWNzUuMjczN1Y3NS4yNTU5Vjc1LjIzODFWNzUuMjIwMlY3NS4yMDI0Vjc1LjE4NDdWNzUuMTY2OVY3NS4xNDkxVjc1LjEzMTRWNzUuMTEzN1Y3NS4wOTZWNzUuMDc4M1Y3NS4wNjA2Vjc1LjA0M1Y3NS4wMjU0Vjc1LjAwNzdWNzQuOTkwMVY3NC45NzI2Vjc0Ljk1NVY3NC45Mzc1Vjc0LjkyVjc0LjkwMjVWNzQuODg1Vjc0Ljg2NzVWNzQuODUwMVY3NC44MzI3Vjc0LjgxNTNWNzQuNzk4Vjc0Ljc4MDZWNzQuNzYzM1Y3NC43NDZWNzQuNzI4OFY3NC43MTE1Vjc0LjY5NDNWNzQuNjc3MVY3NC42NlY3NC42NDI5Vjc0LjYyNThWNzQuNjA4N1Y3NC41OTE2Vjc0LjU3NDZWNzQuNTU3NlY3NC41NDA3Vjc0LjUyMzhWNzQuNTA2OVY3NC40OVY3NC40NzMyVjc0LjQ1NjRWNzQuNDM5NlY3NC40MjI5Vjc0LjQwNjJWNzQuMzg5NVY3NC4zNzI4Vjc0LjM1NjJWNzQuMzM5N1Y3NC4zMjMxVjc0LjMwNjZWNzQuMjkwMlY3NC4yNzM4Vjc0LjI1NzRWNzQuMjQxVjc0LjIyNDdWNzQuMjA4NFY3NC4xOTIyVjc0LjE3NlY3NC4xNTk4Vjc0LjE0MzdWNzQuMTI3NlY3NC4xMTE2Vjc0LjA5NTZWNzQuMDc5NlY3NC4wNjM3Vjc0LjA0NzlWNzQuMDMyVjc0LjAxNjJWNzQuMDAwNVY3My45ODQ4VjczLjk2OTFWNzMuOTUzNVY3My45MzhWNzMuOTIyNFY3My45MDdWNzMuODkxNVY3My44NzYyVjczLjg2MDhWNzMuODQ1NVY3My44MzAzVjczLjgxNTFWNzMuOFY3My43ODQ5VjczLjc2OThWNzMuNzU0OFY3My43Mzk5VjczLjcyNVY3My43MTAyVjczLjY5NTRWNzMuNjgwNlY3My42NjU5VjczLjY1MTNWNzMuNjM2N1Y3My42MjIyVjczLjYwNzdWNzMuNjA1OUgyMy41MTc1TDI2Ljc2NjEgNzcuNjUzNkMyNi4zMjYxIDc4LjEwMjQgMjYuMDU2MiA3OC43MDkyIDI2LjA1NjIgNzkuMzc3MkMyNi4wNTYyIDgwLjc1OTQgMjcuMjEyNCA4MS44OCAyOC42Mzg4IDgxLjg4QzMwLjA2NTEgODEuODggMzEuMjIxNCA4MC43NTk0IDMxLjIyMTQgNzkuMzc3MkMzMS4yMjE0IDc4LjAwNSAzMC4wODIgNzYuODkwOCAyOC42NzAxIDc2Ljg3NDVMMjQuNzU5OCA3Mi4wMDIyTDI0LjQ2MzcgNzEuNjMzMkgyMy45OTA2SDE0LjM0ODRMNy45MzE2MSA2NC43MjM2VjU1Ljc1TDExLjQ5NDUgNTIuMDgxNEgxOS4xNjE4QzE5LjYwNjEgNTIuODM3NiAyMC40NDU1IDUzLjM0NzYgMjEuNDA3NyA1My4zNDc2QzIyLjgzNCA1My4zNDc2IDIzLjk5MDMgNTIuMjI3MSAyMy45OTAzIDUwLjg0NDhDMjMuOTkwMyA0OS40NjI1IDIyLjgzNCA0OC4zNDE5IDIxLjQwNzcgNDguMzQxOUMyMC4yNDU3IDQ4LjM0MTkgMTkuMjYyOSA0OS4wODU3IDE4LjkzODYgNTAuMTA4N0gxMS41NzA1TDcuOTMxNjEgNDUuMjU5OVYzNS43NTU4TDE0LjMwNzEgMjkuODA2SDIzLjk5MDZIMjQuNTIyOEwyNC44MTUgMjkuMzYxMUwyOS41MDIxIDIyLjIyMzJDMjkuNzIwNiAyMi4yODE0IDI5Ljk1MDcgMjIuMzEyNSAzMC4xODgzIDIyLjMxMjVDMzEuNjE0NyAyMi4zMTI1IDMyLjc3MDkgMjEuMTkyIDMyLjc3MDkgMTkuODA5N0MzMi43NzA5IDE4LjQyNzQgMzEuNjE0NyAxNy4zMDY4IDMwLjE4ODMgMTcuMzA2OEMyOC43NjIgMTcuMzA2OCAyNy42MDU3IDE4LjQyNzQgMjcuNjA1NyAxOS44MDk3QzI3LjYwNTcgMjAuMjUwNCAyNy43MjMyIDIwLjY2NDQgMjcuOTI5NiAyMS4wMjQxTDIzLjQ1ODMgMjcuODMzNEgxNC45MDQ3VjIwLjk0ODdMMjEuNTc4NyAxMy43ODc4SDI5LjQxNEgyOS44MzM1TDMwLjEyNDUgMTMuNDg1N0wzNy4wNjQ4IDYuMjc5MjZINDQuMTgxN1YzMC4wODZIMjkuNDE0SDI4LjQyNzdWMzEuMDcyM1YzOC4wOTUxSDIwLjI2MTFDMTkuOTM2OCAzNy4wNzIgMTguOTU0IDM2LjMyODMgMTcuNzkyIDM2LjMyODNDMTYuMzY1NiAzNi4zMjgzIDE1LjIwOTQgMzcuNDQ4OCAxNS4yMDk0IDM4LjgzMTFDMTUuMjA5NCA0MC4yMTM0IDE2LjM2NTYgNDEuMzMzOSAxNy43OTIgNDEuMzMzOUMxOC43NTQyIDQxLjMzMzkgMTkuNTkzNSA0MC44MjQgMjAuMDM3OSA0MC4wNjc3SDI4LjQyNzdaTTQ2LjY5NTIgNDAuNDY4M0w0Ny42Mjc5IDQyLjcwNjVMNTAuODYxMiA1MC40NjUzTDUzLjA1MTQgNTUuNzIxM0w1MS4yMzA2IDU2LjQ4MDFMNDkuMjkzMiA1MS44MzFINDQuMzA3OUw0Mi40NjkgNTYuNDY0NUw0MC42MzU1IDU1LjczNjlMNDIuNzIxNSA1MC40ODA5TDQ1LjgwMDggNDIuNzIyMUw0Ni42OTUyIDQwLjQ2ODNaTTQ1LjA5MDggNDkuODU4NEg0OC40NzEyTDQ2LjczOTggNDUuNzAzNUw0NS4wOTA4IDQ5Ljg1ODRaTTU2LjMxOTkgNDAuNTgyOFY1Ni4xMDA1SDU4LjI5MjVWNDAuNTgyOEg1Ni4zMTk5WiIgZmlsbD0iI0E1NTIyNyIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9nPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9kXzEwMTRfMzYxKSI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIyX2RfMTAxNF8zNjEpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NC42MTQ0IDAuMDM3NTk3N0g1NS42NTg4SDY0LjY2MjZINjUuMDkyNUw2NS4zOTc5IDAuMzQwMjg1TDcyLjczMjIgNy42MTEzNUg4MS4wMzMySDgxLjUxNEw4MS44MjY3IDcuOTc2NjJMODkuNDY2MyAxNi45MDI5TDg5LjcxNzIgMTcuMTk2VjE3LjU4MTlWMTcuNTgyMlYxNy41ODI1VjE3LjU4M1YxNy41ODM2VjE3LjU4NDNWMTcuNTg1MVYxNy41ODYxVjE3LjU4NzJWMTcuNTg4NVYxNy41ODk4VjE3LjU5MTNWMTcuNTkyOVYxNy41OTQ3VjE3LjU5NjVWMTcuNTk4NVYxNy42MDA3VjE3LjYwMjlWMTcuNjA1M1YxNy42MDc4VjE3LjYxMDRWMTcuNjEzMVYxNy42MTZWMTcuNjE4OVYxNy42MjJWMTcuNjI1M1YxNy42Mjg2VjE3LjYzMjFWMTcuNjM1N1YxNy42Mzk0VjE3LjY0MzJWMTcuNjQ3MVYxNy42NTEyVjE3LjY1NTNWMTcuNjU5NlYxNy42NjRWMTcuNjY4NlYxNy42NzMyVjE3LjY3OFYxNy42ODI4VjE3LjY4NzhWMTcuNjkyOVYxNy42OTgxVjE3LjcwMzRWMTcuNzA4OVYxNy43MTQ0VjE3LjcyMDFWMTcuNzI1OFYxNy43MzE3VjE3LjczNzdWMTcuNzQzOFYxNy43NVYxNy43NTYzVjE3Ljc2MjhWMTcuNzY5M1YxNy43NzU5VjE3Ljc4MjdWMTcuNzg5NVYxNy43OTY1VjE3LjgwMzZWMTcuODEwN1YxNy44MThWMTcuODI1NFYxNy44MzI5VjE3Ljg0MDVWMTcuODQ4MlYxNy44NTZWMTcuODYzOFYxNy44NzE4VjE3Ljg3OTlWMTcuODg4MVYxNy44OTY0VjE3LjkwNDhWMTcuOTEzM1YxNy45MjE5VjE3LjkzMDZWMTcuOTM5NFYxNy45NDgzVjE3Ljk1NzNWMTcuOTY2NFYxNy45NzU2VjE3Ljk4NDlWMTcuOTk0MlYxOC4wMDM3VjE4LjAxMzNWMTguMDIyOVYxOC4wMzI3VjE4LjA0MjVWMTguMDUyNVYxOC4wNjI1VjE4LjA3MjZWMTguMDgyOFYxOC4wOTMxVjE4LjEwMzVWMTguMTE0VjE4LjEyNDZWMTguMTM1MlYxOC4xNDZWMTguMTU2OFYxOC4xNjc3VjE4LjE3ODhWMTguMTg5OVYxOC4yMDExVjE4LjIxMjNWMTguMjIzN1YxOC4yMzUxVjE4LjI0NjdWMTguMjU4M1YxOC4yN1YxOC4yODE3VjE4LjI5MzZWMTguMzA1NlYxOC4zMTc2VjE4LjMyOTdWMTguMzQxOVYxOC4zNTQyVjE4LjM2NjVWMTguMzc4OVYxOC4zOTE0VjE4LjQwNFYxOC40MTY3VjE4LjQyOTRWMTguNDQyM1YxOC40NTUyVjE4LjQ2ODFWMTguNDgxMlYxOC40OTQzVjE4LjUwNzVWMTguNTIwOFYxOC41MzQyVjE4LjU0NzZWMTguNTYxMVYxOC41NzQ3VjE4LjU4ODNWMTguNjAyVjE4LjYxNThWMTguNjI5N1YxOC42NDM2VjE4LjY1NzZWMTguNjcxN1YxOC42ODU4VjE4LjdWMTguNzE0M1YxOC43Mjg2VjE4Ljc0MzFWMTguNzU3NVYxOC43NzIxVjE4Ljc4NjdWMTguODAxNFYxOC44MTYxVjE4LjgzMDlWMTguODQ1OFYxOC44NjA4VjE4Ljg3NThWMTguODkwOFYxOC45MDZWMTguOTIxMVYxOC45MzY0VjE4Ljk1MTdWMTguOTY3MVYxOC45ODI1VjE4Ljk5OFYxOS4wMTM2VjE5LjAyOTJWMTkuMDQ0OVYxOS4wNjA2VjE5LjA3NjRWMTkuMDkyMlYxOS4xMDgxVjE5LjEyNDFWMTkuMTQwMVYxOS4xNTYyVjE5LjE3MjNWMTkuMTg4NVYxOS4yMDQ3VjE5LjIyMVYxOS4yMzc0VjE5LjI1MzdWMTkuMjcwMlYxOS4yODY3VjE5LjMwMzJWMTkuMzE5OFYxOS4zMzY1VjE5LjM1MzJWMTkuMzdWMTkuMzg2OFYxOS40MDM2VjE5LjQyMDVWMTkuNDM3NVYxOS40NTQ1VjE5LjQ3MTVWMTkuNDg4NlYxOS41MDU3VjE5LjUyMjlWMTkuNTQwMVYxOS41NTc0VjE5LjU3NDdWMTkuNTkyMVYxOS42MDk1VjE5LjYyNjlWMTkuNjQ0NFYxOS42NjE5VjE5LjY3OTVWMTkuNjk3MVYxOS43MTQ4VjE5LjczMjVWMTkuNzUwMlYxOS43NjhWMTkuNzg1OFYxOS44MDM3VjE5LjgyMTVWMTkuODM5NVYxOS44NTc0VjE5Ljg3NTRWMTkuODkzNVYxOS45MTE1VjE5LjkyOTdWMTkuOTQ3OFYxOS45NjZWMTkuOTg0MlYyMC4wMDI0VjIwLjAyMDdWMjAuMDM5VjIwLjA1NzRWMjAuMDc1OFYyMC4wOTQyVjIwLjExMjZWMjAuMTMxMVYyMC4xNDk2VjIwLjE2ODFWMjAuMTg2N1YyMC4yMDUyVjIwLjIyMzlWMjAuMjQyNVYyMC4yNjEyVjIwLjI3OTlWMjAuMjk4NlYyMC4zMTczVjIwLjMzNjFWMjAuMzU0OVYyMC4zNzM3VjIwLjM5MjZWMjAuNDExNVYyMC40MzA0VjIwLjQ0OTNWMjAuNDY4MlYyMC40ODcyVjIwLjUwNjJWMjAuNTI1MlYyMC41NDQyVjIwLjU2MzNWMjAuNTgyM1YyMC42MDE0VjIwLjYyMDVWMjAuNjM5NlYyMC42NTg4VjIwLjY3NzlWMjAuNjk3MVYyMC43MTYzVjIwLjczNTVWMjAuNzU0N1YyMC43NzRWMjAuNzkzMlYyMC44MTI1VjIwLjgzMThWMjAuODUxMVYyMC44NzA0VjIwLjg4OTdWMjAuOTA5MVYyMC45Mjg0VjIwLjk0NzhWMjAuOTY3MVYyMC45ODY1VjIxLjAwNTlWMjEuMDI1M1YyMS4wNDQ3VjIxLjA2NDFWMjEuMDgzNlYyMS4xMDNWMjEuMTIyNFYyMS4xNDE5VjIxLjE2MTNWMjEuMTgwOFYyMS4yMDAzVjIxLjIxOTdWMjEuMjM5MlYyMS4yNTg3VjIxLjI3ODJWMjEuMjk3NlYyMS4zMTcxVjIxLjMzNjZWMjEuMzU2MVYyMS4zNzU2VjIxLjM5NTFWMjEuNDE0NlYyMS40MzQxVjIxLjQ1MzZWMjEuNDczMVYyMS40OTI2VjIxLjUxMjFWMjEuNTMxNVYyMS41NTFWMjEuNTcwNVYyMS41OVYyMS42MDk1VjIxLjYyODlWMjEuNjQ4NFYyMS42Njc5VjIxLjY4NzNWMjEuNzA2OFYyMS43MjYyVjIxLjc0NTdWMjEuNzY1MVYyMS43ODQ1VjIxLjgwMzlWMjEuODIzM1YyMS44NDI3VjIxLjg2MjFWMjEuODgxNVYyMS45MDA4VjIxLjkyMDJWMjEuOTM5NVYyMS45NTg5VjIxLjk3ODJWMjEuOTk3NVYyMi4wMTY4VjIyLjAzNlYyMi4wNTUzVjIyLjA3NDVWMjIuMDkzOFYyMi4xMTNWMjIuMTMyMlYyMi4xNTE0VjIyLjE3MDVWMjIuMTg5N1YyMi4yMDg4VjIyLjIyNzlWMjIuMjQ3VjIyLjI2NjFWMjIuMjg1MlYyMi4zMDQyVjIyLjMyMzJWMjIuMzQyMlYyMi4zNjEyVjIyLjM4MDFWMjIuMzk5MVYyMi40MThWMjIuNDM2OVYyMi40NTU3VjIyLjQ3NDVWMjIuNDkzNFYyMi41MTIxVjIyLjUzMDlWMjIuNTQ5NlYyMi41NjgzVjIyLjU4N1YyMi42MDU3VjIyLjYyNDNWMjIuNjQyOVYyMi42NjE1VjIyLjY4VjIyLjY5ODVWMjIuNzE3VjIyLjczNTVWMjIuNzUzOVYyMi43NzIzVjIyLjc5MDZWMjIuODA5VjIyLjgyNzNWMjIuODQ1NVYyMi44NjM3VjIyLjg4MTlWMjIuOTAwMVYyMi45MTgyVjIyLjkzNjNWMjIuOTU0NFYyMi45NzI0VjIyLjk5MDRWMjMuMDA4M1YyMy4wMjYyVjIzLjA0NDFWMjMuMDYxOVYyMy4wNzk3VjIzLjA5NzRWMjMuMTE1MlYyMy4xMzI4VjIzLjE1MDVWMjMuMTY4VjIzLjE4NTZWMjMuMjAzMVYyMy4yMjA2VjIzLjIzOFYyMy4yNTU0VjIzLjI3MjdWMjMuMjlWMjMuMzA3MlYyMy4zMjQ0VjIzLjM0MTZWMjMuMzU4N1YyMy4zNzU4VjIzLjM5MjhWMjMuNDA5N1YyMy40MjY3VjIzLjQ0MzVWMjMuNDYwM1YyMy40NzcxVjIzLjQ5MzhWMjMuNTEwNVYyMy41MjcxVjIzLjU0MzdWMjMuNTYwMlYyMy41NzY3VjIzLjU5MzFWMjMuNjA5NVYyMy42MjU4VjIzLjY0MjFWMjMuNjU4M1YyMy42NzQ0VjIzLjY5MDVWMjMuNzA2NVYyMy43MjI1VjIzLjczODVWMjMuNzU0M1YyMy43NzAxVjIzLjc4NTlWMjMuODAxNlYyMy44MTcyVjIzLjgzMjhWMjMuODQ4M1YyMy44NjM4VjIzLjg3OTJWMjMuODk0NVYyMy45MDk4VjIzLjkyNVYyMy45NDAyVjIzLjk1NTNWMjMuOTcwM1YyMy45ODUzVjI0LjAwMDJWMjQuMDE1VjI0LjAyOThWMjQuMDQ0NVYyNC4wNTkxVjI0LjA3MzdWMjQuMDg4MlYyNC4xMDI3VjI0LjExN1YyNC4xMzEzVjI0LjE0NTZWMjQuMTU5N1YyNC4xNzM4VjI0LjE4NzlWMjQuMjAxOFYyNC4yMTU3VjI0LjIyOTVWMjQuMjQzM1YyNC4yNTdWMjQuMjcwNlYyNC4yODQxVjI0LjI5NzZWMjQuMzEwOVYyNC4zMjQyVjI0LjMzNzVWMjQuMzUwNlYyNC4zNjM3VjI0LjM3NjdWMjQuMzg5N1YyNC40MDI1VjI0LjQxNTNWMjQuNDI4VjI0LjQ0MDZWMjQuNDUzMlYyNC40NjU2VjI0LjQ3OFYyNC40ODE5TDk2LjgxMjkgMzIuMjk4TDk3LjA4NCAzMi41OTY3VjMzVjQzLjU0OTJWNDMuOTY2TDk2Ljc5NyA0NC4yNjgyTDkzLjAzMjUgNDguMjMzNkw5Ni44ODE3IDUzLjQ4MDdMOTcuMDg0IDUzLjc1NjRWNTQuMDk4NFY2NS4xODg2VjY1LjYzNTRMOTYuNzYwOCA2NS45NDRMODkuNzE3MiA3Mi42NjgyVjgxLjE0NzZWODEuNTUyTDg5LjQ0NDggODEuODUxTDgxLjgwNTIgOTAuMjM2Mkw4MS40OTQ1IDkwLjU3NzJIODEuMDMzMkg3Mi43NTM0TDY1LjQyMyA5OC4zNjM1TDY1LjExMzggOTguNjkySDY0LjY2MjZINTUuNjU4OEg1NC42MTQ0Vjk3LjY0NzdWNjkuNzg2OVY2OC43NDI2SDU1LjY1ODhINzEuMjU3OVY2MS4xMzEyVjM2LjM4OTZMNjQuMjExNSAyOC45MDVINTUuNjU4OEg1NC42MTQ0VjI3Ljg2MDdWMS4wODE5M1YwLjAzNzU5NzdaTTczLjM0NjYgMzcuMDE5N1Y2MC4wODY5SDgxLjM3NjdDODEuODQyOSA1OS4yNTc3IDgyLjczNjIgNTguNjk2OSA4My43NjE2IDU4LjY5NjlDODUuMjY4NSA1OC42OTY5IDg2LjQ5MDEgNTkuOTA3OSA4Ni40OTAxIDYxLjQwMThDODYuNDkwMSA2Mi44OTU3IDg1LjI2ODUgNjQuMTA2NyA4My43NjE2IDY0LjEwNjdDODIuNTI2IDY0LjEwNjcgODEuNDgyMiA2My4yOTI0IDgxLjE0NjUgNjIuMTc1NUg3My4zNDY2VjY5Ljc4NjlWNzAuODMxM0g3Mi4zMDIySDU2LjcwMzFWOTYuNjAzM0g2NC4yMTE1TDcxLjU0MTkgODguODE3TDcxLjg1MTEgODguNDg4Nkg3Mi4zMDIySDgwLjU3MTlMODcuNjI4NSA4MC43NDMyVjczLjI2NTdINzguNjAyNkw3My44Mzg2IDgwLjY4NzRDNzMuOTA0MiA4MC45MTk4IDczLjkzOTMgODEuMTY0OSA3My45MzkzIDgxLjQxODFDNzMuOTM5MyA4Mi45MTE5IDcyLjcxNzggODQuMTIzIDcxLjIxMDkgODQuMTIzQzY5LjcwNCA4NC4xMjMgNjguNDgyNSA4Mi45MTE5IDY4LjQ4MjUgODEuNDE4MUM2OC40ODI1IDc5LjkyNDIgNjkuNzA0IDc4LjcxMzEgNzEuMjEwOSA3OC43MTMxQzcxLjY1MjUgNzguNzEzMSA3Mi4wNjk2IDc4LjgxNzEgNzIuNDM4NyA3OS4wMDE4TDc3LjE1MzEgNzEuNjU3Mkw3Ny40NjEzIDcxLjE3NzFINzguMDMySDg4LjI1NDRMOTQuOTk1MyA2NC43NDE3VjU0LjQ0MDRMOTEuMTQ1IDQ5LjE5MTlIODMuNDE4MkM4Mi45NTIgNTAuMDIxMSA4Mi4wNTg3IDUwLjU4MTkgODEuMDMzMiA1MC41ODE5Qzc5LjUyNjMgNTAuNTgxOSA3OC4zMDQ4IDQ5LjM3MDkgNzguMzA0OCA0Ny44NzdDNzguMzA0OCA0Ni4zODMxIDc5LjUyNjMgNDUuMTcyMSA4MS4wMzMyIDQ1LjE3MjFDODIuMjY4OCA0NS4xNzIxIDgzLjMxMjYgNDUuOTg2NCA4My42NDg0IDQ3LjEwMzJIOTEuMjI1Nkw5NC45OTUzIDQzLjEzMjRWMzMuNDAzM0w4OC4yMTA0IDI1LjkyOTZINzguMDMySDc3LjUyMzlMNzcuMjEwMyAyNS41Mjk4TDcxLjc3NzggMTguNjA1NEM3MS41OTQ5IDE4LjY0MzcgNzEuNDA1MyAxOC42NjM4IDcxLjIxMDkgMTguNjYzOEM2OS43MDQgMTguNjYzOCA2OC40ODI1IDE3LjQ1MjggNjguNDgyNSAxNS45NTg5QzY4LjQ4MjUgMTQuNDY1IDY5LjcwNCAxMy4yNTQgNzEuMjEwOSAxMy4yNTRDNzIuNzE3OCAxMy4yNTQgNzMuOTM5MyAxNC40NjUgNzMuOTM5MyAxNS45NTg5QzczLjkzOTMgMTYuNDk4NiA3My43Nzk5IDE3LjAwMTMgNzMuNTA1MiAxNy40MjM0TDc4LjU0IDIzLjg0MDlIODcuNjI4NVYyMy44MzI4VjIzLjgxNzJWMjMuODAxNlYyMy43ODU5VjIzLjc3MDFWMjMuNzU0M1YyMy43Mzg1VjIzLjcyMjVWMjMuNzA2NVYyMy42OTA1VjIzLjY3NDRWMjMuNjU4M1YyMy42NDIxVjIzLjYyNThWMjMuNjA5NVYyMy41OTMxVjIzLjU3NjdWMjMuNTYwMlYyMy41NDM3VjIzLjUyNzFWMjMuNTEwNVYyMy40OTM4VjIzLjQ3NzFWMjMuNDYwM1YyMy40NDM1VjIzLjQyNjdWMjMuNDA5N1YyMy4zOTI4VjIzLjM3NThWMjMuMzU4N1YyMy4zNDE2VjIzLjMyNDRWMjMuMzA3MlYyMy4yOVYyMy4yNzI3VjIzLjI1NTRWMjMuMjM4VjIzLjIyMDZWMjMuMjAzMVYyMy4xODU2VjIzLjE2OFYyMy4xNTA1VjIzLjEzMjhWMjMuMTE1MlYyMy4wOTc0VjIzLjA3OTdWMjMuMDYxOVYyMy4wNDQxVjIzLjAyNjJWMjMuMDA4M1YyMi45OTA0VjIyLjk3MjRWMjIuOTU0NFYyMi45MzYzVjIyLjkxODJWMjIuOTAwMVYyMi44ODE5VjIyLjg2MzdWMjIuODQ1NVYyMi44MjczVjIyLjgwOVYyMi43OTA2VjIyLjc3MjNWMjIuNzUzOVYyMi43MzU1VjIyLjcxN1YyMi42OTg1VjIyLjY4VjIyLjY2MTVWMjIuNjQyOVYyMi42MjQzVjIyLjYwNTdWMjIuNTg3VjIyLjU2ODNWMjIuNTQ5NlYyMi41MzA5VjIyLjUxMjFWMjIuNDkzNFYyMi40NzQ1VjIyLjQ1NTdWMjIuNDM2OVYyMi40MThWMjIuMzk5MVYyMi4zODAxVjIyLjM2MTJWMjIuMzQyMlYyMi4zMjMyVjIyLjMwNDJWMjIuMjg1MlYyMi4yNjYxVjIyLjI0N1YyMi4yMjc5VjIyLjIwODhWMjIuMTg5N1YyMi4xNzA1VjIyLjE1MTRWMjIuMTMyMlYyMi4xMTNWMjIuMDkzOFYyMi4wNzQ1VjIyLjA1NTNWMjIuMDM2VjIyLjAxNjhWMjEuOTk3NVYyMS45NzgyVjIxLjk1ODlWMjEuOTM5NVYyMS45MjAyVjIxLjkwMDhWMjEuODgxNVYyMS44NjIxVjIxLjg0MjdWMjEuODIzM1YyMS44MDM5VjIxLjc4NDVWMjEuNzY1MVYyMS43NDU3VjIxLjcyNjJWMjEuNzA2OFYyMS42ODczVjIxLjY2NzlWMjEuNjQ4NFYyMS42Mjg5VjIxLjYwOTVWMjEuNTlWMjEuNTcwNVYyMS41NTFWMjEuNTMxNVYyMS41MTIxVjIxLjQ5MjZWMjEuNDczMVYyMS40NTM2VjIxLjQzNDFWMjEuNDE0NlYyMS4zOTUxVjIxLjM3NTZWMjEuMzU2MVYyMS4zMzY2VjIxLjMxNzFWMjEuMjk3NlYyMS4yNzgyVjIxLjI1ODdWMjEuMjM5MlYyMS4yMTk3VjIxLjIwMDNWMjEuMTgwOFYyMS4xNjEzVjIxLjE0MTlWMjEuMTIyNFYyMS4xMDNWMjEuMDgzNlYyMS4wNjQxVjIxLjA0NDdWMjEuMDI1M1YyMS4wMDU5VjIwLjk4NjVWMjAuOTY3MVYyMC45NDc4VjIwLjkyODRWMjAuOTA5MVYyMC44ODk3VjIwLjg3MDRWMjAuODUxMVYyMC44MzE4VjIwLjgxMjVWMjAuNzkzMlYyMC43NzRWMjAuNzU0N1YyMC43MzU1VjIwLjcxNjNWMjAuNjk3MVYyMC42Nzc5VjIwLjY1ODhWMjAuNjM5NlYyMC42MjA1VjIwLjYwMTRWMjAuNTgyM1YyMC41NjMzVjIwLjU0NDJWMjAuNTI1MlYyMC41MDYyVjIwLjQ4NzJWMjAuNDY4MlYyMC40NDkzVjIwLjQzMDRWMjAuNDExNVYyMC4zOTI2VjIwLjM3MzdWMjAuMzU0OVYyMC4zMzYxVjIwLjMxNzNWMjAuMjk4NlYyMC4yNzk5VjIwLjI2MTJWMjAuMjQyNVYyMC4yMjM5VjIwLjIwNTJWMjAuMTg2N1YyMC4xNjgxVjIwLjE0OTZWMjAuMTMxMVYyMC4xMTI2VjIwLjA5NDJWMjAuMDc1OFYyMC4wNTc0VjIwLjAzOVYyMC4wMjA3VjIwLjAwMjRWMTkuOTg0MlYxOS45NjZWMTkuOTQ3OFYxOS45Mjk3VjE5LjkxMTVWMTkuODkzNVYxOS44NzU0VjE5Ljg1NzRWMTkuODM5NVYxOS44MjE1VjE5LjgwMzdWMTkuNzg1OFYxOS43NjhWMTkuNzUwMlYxOS43MzI1VjE5LjcxNDhWMTkuNjk3MVYxOS42Nzk1VjE5LjY2MTlWMTkuNjQ0NFYxOS42MjY5VjE5LjYwOTVWMTkuNTkyMVYxOS41NzQ3VjE5LjU1NzRWMTkuNTQwMVYxOS41MjI5VjE5LjUwNTdWMTkuNDg4NlYxOS40NzE1VjE5LjQ1NDVWMTkuNDM3NVYxOS40MjA1VjE5LjQwMzZWMTkuMzg2OFYxOS4zN1YxOS4zNTMyVjE5LjMzNjVWMTkuMzE5OFYxOS4zMDMyVjE5LjI4NjdWMTkuMjcwMlYxOS4yNTM3VjE5LjIzNzRWMTkuMjIxVjE5LjIwNDdWMTkuMTg4NVYxOS4xNzIzVjE5LjE1NjJWMTkuMTQwMVYxOS4xMjQxVjE5LjEwODFWMTkuMDkyMlYxOS4wNzY0VjE5LjA2MDZWMTkuMDQ0OVYxOS4wMjkyVjE5LjAxMzZWMTguOTk4VjE4Ljk4MjVWMTguOTY3MVYxOC45NTE3VjE4LjkzNjRWMTguOTIxMVYxOC45MDZWMTguODkwOFYxOC44NzU4VjE4Ljg2MDhWMTguODQ1OFYxOC44MzA5VjE4LjgxNjFWMTguODAxNFYxOC43ODY3VjE4Ljc3MjFWMTguNzU3NVYxOC43NDMxVjE4LjcyODZWMTguNzE0M1YxOC43VjE4LjY4NThWMTguNjcxN1YxOC42NTc2VjE4LjY0MzZWMTguNjI5N1YxOC42MTU4VjE4LjYwMlYxOC41ODgzVjE4LjU3NDdWMTguNTYxMVYxOC41NDc2VjE4LjUzNDJWMTguNTIwOFYxOC41MDc1VjE4LjQ5NDNWMTguNDgxMlYxOC40NjgxVjE4LjQ1NTJWMTguNDQyM1YxOC40Mjk0VjE4LjQxNjdWMTguNDA0VjE4LjM5MTRWMTguMzc4OVYxOC4zNjY1VjE4LjM1NDJWMTguMzQxOVYxOC4zMjk3VjE4LjMxNzZWMTguMzA1NlYxOC4yOTM2VjE4LjI4MTdWMTguMjdWMTguMjU4M1YxOC4yNDY3VjE4LjIzNTFWMTguMjIzN1YxOC4yMTIzVjE4LjIwMTFWMTguMTg5OVYxOC4xNzg4VjE4LjE2NzdWMTguMTU2OFYxOC4xNDZWMTguMTM1MlYxOC4xMjQ2VjE4LjExNFYxOC4xMDM1VjE4LjA5MzFWMTguMDgyOFYxOC4wNzI2VjE4LjA2MjVWMTguMDUyNVYxOC4wNDI1VjE4LjAzMjdWMTguMDIyOVYxOC4wMTMzVjE4LjAwMzdWMTcuOTk0MlYxNy45ODQ5VjE3Ljk3NTZWMTcuOTY3OEw4MC41NTI0IDkuNzAwMDFINzIuMzAyMkg3MS44NzIzTDcxLjU2NyA5LjM5NzMyTDY0LjIzMjcgMi4xMjYyNkg1Ni43MDMxVjI2LjgxNjNINjQuNjYyNkg2NS4xMTM4TDY1LjQyMyAyNy4xNDQ4TDcyLjc1MzQgMzQuOTMxMUg4Mi44ODA4QzgzLjI5MjggMzMuOTU1NSA4NC4yNjUgMzMuMjcgODUuMzk4NiAzMy4yN0M4Ni45MDU1IDMzLjI3IDg4LjEyNzEgMzQuNDgxMSA4OC4xMjcxIDM1Ljk3NUM4OC4xMjcxIDM3LjQ2ODkgODYuOTA1NSAzOC42Nzk5IDg1LjM5ODYgMzguNjc5OUM4NC4yNjUzIDM4LjY3OTkgODMuMjkzNCAzNy45OTQ5IDgyLjg4MTIgMzcuMDE5N0g3My4zNDY2Wk0zMC4zMzExIDQxLjExNDhWNDMuNTYyMUwzMi4wOTggNDEuODY4OEw0MC4yODMzIDM0LjAyNDVMNDIuMTU5OCAzMi4yMjYySDM5LjU2MDdIMzEuMzc1NEgzMC4zMzExVjMzLjI3MDVWNDEuMTE0OFpNMzIuNDE5OCAzNC4zMTQ5SDM2Ljk2MTZMMzIuNDE5OCAzOC42Njc1VjM0LjMxNDlaTTY5LjUyNjggNTguNjk2OVY1Ni4yNDk2TDY3Ljc1OTkgNTcuOTQyOUw1OS41NzQ2IDY1Ljc4NzJMNTcuNjk4MSA2Ny41ODU1SDYwLjI5NzJINjguNDgyNUg2OS41MjY4VjY2LjU0MTJWNTguNjk2OVpNNjcuNDM4MSA2NS40OTY4SDYyLjg5NjJMNjcuNDM4MSA2MS4xNDQyVjY1LjQ5NjhaTTQ0LjQ3MjEgOTguOTYyM0g0NS41MTY0Vjk3LjkxNzlWNzEuMTM5MlY3MC4wOTQ4SDQ0LjQ3MjFIMzUuOTE5NEwyOC44NzI5IDYyLjYxMDJWMzcuODY4N1YzMC4yNTczSDQ0LjQ3MjFINDUuNTE2NFYyOS4yMTI5VjEuMzUyMjFWMC4zMDc4NzhINDQuNDcyMUgzNS40NjgySDM1LjAxNzFMMzQuNzA3OCAwLjYzNjM1NEwyNy4zNzc1IDguNDIyNjVIMTkuMDk3NkgxOC42MzYzTDE4LjMyNTYgOC43NjM2NEwxMC42ODYgMTcuMTQ4OUwxMC40MTM3IDE3LjQ0NzhWMTcuODUyMlYyNi4zMzE3TDMuMzcwMDggMzMuMDU1OUwzLjA0Njg4IDMzLjM2NDVWMzMuODExM1Y0NC45MDE1VjQ1LjI0MzVMMy4yNDkxNiA0NS41MTkyTDcuMDk4MzggNTAuNzY2M0wzLjMzMzgyIDU0LjczMTdMMy4wNDY4OCA1NS4wMzM5VjU1LjQ1MDdWNjUuOTk5OVY2Ni40MDMyTDMuMzE3OTggNjYuNzAxOEwxMC40MTM3IDc0LjUxOFY3NC41MjE5Vjc0LjUzNDJWNzQuNTQ2N1Y3NC41NTkyVjc0LjU3MTlWNzQuNTg0NlY3NC41OTczVjc0LjYxMDJWNzQuNjIzMVY3NC42MzYxVjc0LjY0OTJWNzQuNjYyNFY3NC42NzU2Vjc0LjY4ODlWNzQuNzAyM1Y3NC43MTU4Vjc0LjcyOTNWNzQuNzQyOVY3NC43NTY2Vjc0Ljc3MDNWNzQuNzg0MVY3NC43OThWNzQuODEyVjc0LjgyNlY3NC44NDAxVjc0Ljg1NDNWNzQuODY4NVY3NC44ODI4Vjc0Ljg5NzJWNzQuOTExN1Y3NC45MjYyVjc0Ljk0MDdWNzQuOTU1NFY3NC45NzAxVjc0Ljk4NDlWNzQuOTk5N1Y3NS4wMTQ2Vjc1LjAyOTZWNzUuMDQ0NlY3NS4wNTk3Vjc1LjA3NDhWNzUuMDkwMVY3NS4xMDUzVjc1LjEyMDdWNzUuMTM2MVY3NS4xNTE1Vjc1LjE2NzFWNzUuMTgyNlY3NS4xOTgzVjc1LjIxNFY3NS4yMjk3Vjc1LjI0NTVWNzUuMjYxNFY3NS4yNzczVjc1LjI5MzNWNzUuMzA5NFY3NS4zMjU1Vjc1LjM0MTZWNzUuMzU3OFY3NS4zNzQxVjc1LjM5MDRWNzUuNDA2N1Y3NS40MjMyVjc1LjQzOTZWNzUuNDU2MVY3NS40NzI3Vjc1LjQ4OTNWNzUuNTA2Vjc1LjUyMjdWNzUuNTM5NVY3NS41NTYzVjc1LjU3MzJWNzUuNTkwMVY3NS42MDcxVjc1LjYyNDFWNzUuNjQxMlY3NS42NTgzVjc1LjY3NTRWNzUuNjkyNlY3NS43MDk5Vjc1LjcyNzJWNzUuNzQ0NVY3NS43NjE5Vjc1Ljc3OTNWNzUuNzk2OFY3NS44MTQzVjc1LjgzMThWNzUuODQ5NFY3NS44NjdWNzUuODg0N1Y3NS45MDI0Vjc1LjkyMDJWNzUuOTM4Vjc1Ljk1NThWNzUuOTczN1Y3NS45OTE2Vjc2LjAwOTVWNzYuMDI3NVY3Ni4wNDU1Vjc2LjA2MzZWNzYuMDgxNlY3Ni4wOTk4Vjc2LjExNzlWNzYuMTM2MVY3Ni4xNTQzVjc2LjE3MjZWNzYuMTkwOVY3Ni4yMDkyVjc2LjIyNzZWNzYuMjQ2Vjc2LjI2NDRWNzYuMjgyOFY3Ni4zMDEzVjc2LjMxOThWNzYuMzM4NFY3Ni4zNTY5Vjc2LjM3NTVWNzYuMzk0MlY3Ni40MTI4Vjc2LjQzMTVWNzYuNDUwMlY3Ni40NjlWNzYuNDg3N1Y3Ni41MDY1Vjc2LjUyNTNWNzYuNTQ0MlY3Ni41NjNWNzYuNTgxOVY3Ni42MDA4Vjc2LjYxOTdWNzYuNjM4N1Y3Ni42NTc3Vjc2LjY3NjdWNzYuNjk1N1Y3Ni43MTQ3Vjc2LjczMzhWNzYuNzUyOFY3Ni43NzE5Vjc2Ljc5MVY3Ni44MTAyVjc2LjgyOTNWNzYuODQ4NVY3Ni44Njc3Vjc2Ljg4NjlWNzYuOTA2MVY3Ni45MjUzVjc2Ljk0NDZWNzYuOTYzOFY3Ni45ODMxVjc3LjAwMjRWNzcuMDIxN1Y3Ny4wNDFWNzcuMDYwM1Y3Ny4wNzk3Vjc3LjA5OVY3Ny4xMTg0Vjc3LjEzNzhWNzcuMTU3MlY3Ny4xNzY1Vjc3LjE5NlY3Ny4yMTU0Vjc3LjIzNDhWNzcuMjU0MlY3Ny4yNzM2Vjc3LjI5MzFWNzcuMzEyNVY3Ny4zMzJWNzcuMzUxNVY3Ny4zNzA5Vjc3LjM5MDRWNzcuNDA5OVY3Ny40MjkzVjc3LjQ0ODhWNzcuNDY4M1Y3Ny40ODc4Vjc3LjUwNzNWNzcuNTI2OFY3Ny41NDYzVjc3LjU2NThWNzcuNTg1M1Y3Ny42MDQ4Vjc3LjYyNDNWNzcuNjQzOFY3Ny42NjMyVjc3LjY4MjdWNzcuNzAyMlY3Ny43MjE3Vjc3Ljc0MTJWNzcuNzYwN1Y3Ny43ODAxVjc3Ljc5OTZWNzcuODE5MVY3Ny44Mzg1Vjc3Ljg1OFY3Ny44Nzc0Vjc3Ljg5NjlWNzcuOTE2M1Y3Ny45MzU3Vjc3Ljk1NTFWNzcuOTc0NlY3Ny45OTM5Vjc4LjAxMzNWNzguMDMyN1Y3OC4wNTIxVjc4LjA3MTRWNzguMDkwOFY3OC4xMTAxVjc4LjEyOTVWNzguMTQ4OFY3OC4xNjgxVjc4LjE4NzNWNzguMjA2NlY3OC4yMjU5Vjc4LjI0NTFWNzguMjY0M1Y3OC4yODM1Vjc4LjMwMjdWNzguMzIxOVY3OC4zNDExVjc4LjM2MDJWNzguMzc5M1Y3OC4zOTg1Vjc4LjQxNzVWNzguNDM2NlY3OC40NTU3Vjc4LjQ3NDdWNzguNDkzN1Y3OC41MTI3Vjc4LjUzMTZWNzguNTUwNlY3OC41Njk1Vjc4LjU4ODRWNzguNjA3M1Y3OC42MjYxVjc4LjY0NDlWNzguNjYzN1Y3OC42ODI1Vjc4LjcwMTNWNzguNzJWNzguNzM4N1Y3OC43NTc0Vjc4Ljc3NlY3OC43OTQ2Vjc4LjgxMzJWNzguODMxOFY3OC44NTAzVjc4Ljg2ODhWNzguODg3M1Y3OC45MDU3Vjc4LjkyNDFWNzguOTQyNVY3OC45NjA4Vjc4Ljk3OTFWNzguOTk3NFY3OS4wMTU3Vjc5LjAzMzlWNzkuMDUyMVY3OS4wNzAyVjc5LjA4ODNWNzkuMTA2NFY3OS4xMjQ0Vjc5LjE0MjRWNzkuMTYwNFY3OS4xNzgzVjc5LjE5NjJWNzkuMjE0MVY3OS4yMzE5Vjc5LjI0OTZWNzkuMjY3NFY3OS4yODUxVjc5LjMwMjdWNzkuMzIwM1Y3OS4zMzc5Vjc5LjM1NTVWNzkuMzcyOVY3OS4zOTA0Vjc5LjQwNzhWNzkuNDI1MVY3OS40NDI1Vjc5LjQ1OTdWNzkuNDc3Vjc5LjQ5NDFWNzkuNTExM1Y3OS41Mjg0Vjc5LjU0NTRWNzkuNTYyNFY3OS41NzkzVjc5LjU5NjNWNzkuNjEzMVY3OS42Mjk5Vjc5LjY0NjdWNzkuNjYzNFY3OS42OFY3OS42OTY2Vjc5LjcxMzJWNzkuNzI5N1Y3OS43NDYxVjc5Ljc2MjVWNzkuNzc4OVY3OS43OTUxVjc5LjgxMTRWNzkuODI3NlY3OS44NDM3Vjc5Ljg1OThWNzkuODc1OFY3OS44OTE3Vjc5LjkwNzZWNzkuOTIzNVY3OS45MzkzVjc5Ljk1NVY3OS45NzA3Vjc5Ljk4NjNWODAuMDAxOFY4MC4wMTczVjgwLjAzMjhWODAuMDQ4MlY4MC4wNjM1VjgwLjA3ODdWODAuMDkzOVY4MC4xMDlWODAuMTI0MVY4MC4xMzkxVjgwLjE1NDFWODAuMTY4OVY4MC4xODM3VjgwLjE5ODVWODAuMjEzMlY4MC4yMjc4VjgwLjI0MjNWODAuMjU2OFY4MC4yNzEyVjgwLjI4NTZWODAuMjk5OFY4MC4zMTQxVjgwLjMyODJWODAuMzQyM1Y4MC4zNTYzVjgwLjM3MDJWODAuMzg0MVY4MC4zOTc4VjgwLjQxMTZWODAuNDI1MlY4MC40Mzg4VjgwLjQ1MjNWODAuNDY1N1Y4MC40NzkxVjgwLjQ5MjNWODAuNTA1NVY4MC41MTg3VjgwLjUzMTdWODAuNTQ0N1Y4MC41NTc2VjgwLjU3MDRWODAuNTgzMlY4MC41OTU4VjgwLjYwODRWODAuNjIwOVY4MC42MzM0VjgwLjY0NTdWODAuNjU4VjgwLjY3MDJWODAuNjgyM1Y4MC42OTQzVjgwLjcwNjNWODAuNzE4MVY4MC43Mjk5VjgwLjc0MTZWODAuNzUzMlY4MC43NjQ3VjgwLjc3NjJWODAuNzg3NVY4MC43OTg4VjgwLjgxVjgwLjgyMTFWODAuODMyMVY4MC44NDNWODAuODUzOVY4MC44NjQ2VjgwLjg3NTNWODAuODg1OVY4MC44OTYzVjgwLjkwNjdWODAuOTE3VjgwLjkyNzNWODAuOTM3NFY4MC45NDc0VjgwLjk1NzNWODAuOTY3MlY4MC45NzY5VjgwLjk4NjZWODAuOTk2MlY4MS4wMDU2VjgxLjAxNVY4MS4wMjQzVjgxLjAzMzVWODEuMDQyNVY4MS4wNTE1VjgxLjA2MDRWODEuMDY5MlY4MS4wNzc5VjgxLjA4NjVWODEuMDk1VjgxLjEwMzRWODEuMTExN1Y4MS4xMTk5VjgxLjEyOFY4MS4xMzZWODEuMTQzOVY4MS4xNTE3VjgxLjE1OTRWODEuMTY3VjgxLjE3NDVWODEuMTgxOVY4MS4xODkxVjgxLjE5NjNWODEuMjAzNFY4MS4yMTAzVjgxLjIxNzJWODEuMjIzOVY4MS4yMzA2VjgxLjIzNzFWODEuMjQzNVY4MS4yNDk4VjgxLjI1NjFWODEuMjYyMlY4MS4yNjgxVjgxLjI3NFY4MS4yNzk4VjgxLjI4NTRWODEuMjkxVjgxLjI5NjRWODEuMzAxOFY4MS4zMDdWODEuMzEyMVY4MS4zMTdWODEuMzIxOVY4MS4zMjY3VjgxLjMzMTNWODEuMzM1OFY4MS4zNDAyVjgxLjM0NDVWODEuMzQ4N1Y4MS4zNTI4VjgxLjM1NjdWODEuMzYwNVY4MS4zNjQyVjgxLjM2NzhWODEuMzcxM1Y4MS4zNzQ2VjgxLjM3NzhWODEuMzgwOVY4MS4zODM5VjgxLjM4NjhWODEuMzg5NVY4MS4zOTIxVjgxLjM5NDZWODEuMzk3VjgxLjM5OTJWODEuNDAxM1Y4MS40MDMzVjgxLjQwNTJWODEuNDA2OVY4MS40MDg1VjgxLjQxVjgxLjQxMTRWODEuNDEyNlY4MS40MTM3VjgxLjQxNDdWODEuNDE1NlY4MS40MTYzVjgxLjQxNjlWODEuNDE3M1Y4MS40MTc3VjgxLjQxNzlWODEuODAzOEwxMC42NjQ2IDgyLjA5N0wxOC4zMDQyIDkxLjAyMzJMMTguNjE2OCA5MS4zODg1SDE5LjA5NzZIMjcuMzk4N0wzNC43MzMgOTguNjU5NkwzNS4wMzgzIDk4Ljk2MjNIMzUuNDY4Mkg0NC40NzIxWk0yNi43ODQzIDM4LjkxM1Y2MS45ODAxSDE3Ljc2MTRDMTcuMjY1NiA2MS4zMDIgMTYuNDYwMSA2MC44NjA5IDE1LjU1MDcgNjAuODYwOUMxNC4wNDM4IDYwLjg2MDkgMTIuODIyMyA2Mi4wNzE5IDEyLjgyMjMgNjMuNTY1OEMxMi44MjIzIDY1LjA1OTcgMTQuMDQzOCA2Ni4yNzA3IDE1LjU1MDcgNjYuMjcwN0MxNi44ODQyIDY2LjI3MDcgMTcuOTk0MyA2NS4zMjIzIDE4LjIzMjEgNjQuMDY4OEgyNy4zNzc1TDM0LjcwNzggNzEuODU1TDM1LjAxNzEgNzIuMTgzNUgzNS40NjgySDQzLjQyNzdWOTYuODczNkgzNS44OTgyTDI4LjU2MzkgODkuNjAyNUwyOC4yNTg1IDg5LjI5OTlIMjcuODI4NkgxOS41Nzg0TDEyLjUwMjMgODEuMDMyVjgxLjAyNDNWODEuMDE1VjgxLjAwNTZWODAuOTk2MlY4MC45ODY2VjgwLjk3NjlWODAuOTY3MlY4MC45NTczVjgwLjk0NzRWODAuOTM3NFY4MC45MjczVjgwLjkxN1Y4MC45MDY3VjgwLjg5NjNWODAuODg1OVY4MC44NzUzVjgwLjg2NDZWODAuODUzOVY4MC44NDNWODAuODMyMVY4MC44MjExVjgwLjgxVjgwLjc5ODhWODAuNzg3NVY4MC43NzYyVjgwLjc2NDdWODAuNzUzMlY4MC43NDE2VjgwLjcyOTlWODAuNzE4MVY4MC43MDYzVjgwLjY5NDNWODAuNjgyM1Y4MC42NzAyVjgwLjY1OFY4MC42NDU3VjgwLjYzMzRWODAuNjIwOVY4MC42MDg0VjgwLjU5NThWODAuNTgzMlY4MC41NzA0VjgwLjU1NzZWODAuNTQ0N1Y4MC41MzE3VjgwLjUxODdWODAuNTA1NVY4MC40OTIzVjgwLjQ3OTFWODAuNDY1N1Y4MC40NTIzVjgwLjQzODhWODAuNDI1MlY4MC40MTE2VjgwLjM5NzhWODAuMzg0MVY4MC4zNzAyVjgwLjM1NjNWODAuMzQyM1Y4MC4zMjgyVjgwLjMxNDFWODAuMjk5OFY4MC4yODU2VjgwLjI3MTJWODAuMjU2OFY4MC4yNDIzVjgwLjIyNzhWODAuMjEzMlY4MC4xOTg1VjgwLjE4MzdWODAuMTY4OVY4MC4xNTQxVjgwLjEzOTFWODAuMTI0MVY4MC4xMDlWODAuMDkzOVY4MC4wNzg3VjgwLjA2MzVWODAuMDQ4MlY4MC4wMzI4VjgwLjAxNzNWODAuMDAxOFY3OS45ODYzVjc5Ljk3MDdWNzkuOTU1Vjc5LjkzOTNWNzkuOTIzNVY3OS45MDc2Vjc5Ljg5MTdWNzkuODc1OFY3OS44NTk4Vjc5Ljg0MzdWNzkuODI3NlY3OS44MTE0Vjc5Ljc5NTFWNzkuNzc4OVY3OS43NjI1Vjc5Ljc0NjFWNzkuNzI5N1Y3OS43MTMyVjc5LjY5NjZWNzkuNjhWNzkuNjYzNFY3OS42NDY3Vjc5LjYyOTlWNzkuNjEzMVY3OS41OTYzVjc5LjU3OTNWNzkuNTYyNFY3OS41NDU0Vjc5LjUyODRWNzkuNTExM1Y3OS40OTQxVjc5LjQ3N1Y3OS40NTk3Vjc5LjQ0MjVWNzkuNDI1MVY3OS40MDc4Vjc5LjM5MDRWNzkuMzcyOVY3OS4zNTU1Vjc5LjMzNzlWNzkuMzIwM1Y3OS4zMDI3Vjc5LjI4NTFWNzkuMjY3NFY3OS4yNDk2Vjc5LjIzMTlWNzkuMjE0MVY3OS4xOTYyVjc5LjE3ODNWNzkuMTYwNFY3OS4xNDI0Vjc5LjEyNDRWNzkuMTA2NFY3OS4wODgzVjc5LjA3MDJWNzkuMDUyMVY3OS4wMzM5Vjc5LjAxNTdWNzguOTk3NFY3OC45NzkxVjc4Ljk2MDhWNzguOTQyNVY3OC45MjQxVjc4LjkwNTdWNzguODg3M1Y3OC44Njg4Vjc4Ljg1MDNWNzguODMxOFY3OC44MTMyVjc4Ljc5NDZWNzguNzc2Vjc4Ljc1NzRWNzguNzM4N1Y3OC43MlY3OC43MDEzVjc4LjY4MjVWNzguNjYzN1Y3OC42NDQ5Vjc4LjYyNjFWNzguNjA3M1Y3OC41ODg0Vjc4LjU2OTVWNzguNTUwNlY3OC41MzE2Vjc4LjUxMjdWNzguNDkzN1Y3OC40NzQ3Vjc4LjQ1NTdWNzguNDM2NlY3OC40MTc1Vjc4LjM5ODVWNzguMzc5M1Y3OC4zNjAyVjc4LjM0MTFWNzguMzIxOVY3OC4zMDI3Vjc4LjI4MzVWNzguMjY0M1Y3OC4yNDUxVjc4LjIyNTlWNzguMjA2NlY3OC4xODczVjc4LjE2ODFWNzguMTQ4OFY3OC4xMjk1Vjc4LjExMDFWNzguMDkwOFY3OC4wNzE0Vjc4LjA1MjFWNzguMDMyN1Y3OC4wMTMzVjc3Ljk5MzlWNzcuOTc0NlY3Ny45NTUxVjc3LjkzNTdWNzcuOTE2M1Y3Ny44OTY5Vjc3Ljg3NzRWNzcuODU4Vjc3LjgzODVWNzcuODE5MVY3Ny43OTk2Vjc3Ljc4MDFWNzcuNzYwN1Y3Ny43NDEyVjc3LjcyMTdWNzcuNzAyMlY3Ny42ODI3Vjc3LjY2MzJWNzcuNjQzOFY3Ny42MjQzVjc3LjYwNDhWNzcuNTg1M1Y3Ny41NjU4Vjc3LjU0NjNWNzcuNTI2OFY3Ny41MDczVjc3LjQ4NzhWNzcuNDY4M1Y3Ny40NDg4Vjc3LjQyOTNWNzcuNDA5OVY3Ny4zOTA0Vjc3LjM3MDlWNzcuMzUxNVY3Ny4zMzJWNzcuMzEyNVY3Ny4yOTMxVjc3LjI3MzZWNzcuMjU0MlY3Ny4yMzQ4Vjc3LjIxNTRWNzcuMTk2Vjc3LjE3NjVWNzcuMTU3MlY3Ny4xMzc4Vjc3LjExODRWNzcuMDk5Vjc3LjA3OTdWNzcuMDYwM1Y3Ny4wNDFWNzcuMDIxN1Y3Ny4wMDI0Vjc2Ljk4MzFWNzYuOTYzOFY3Ni45NDQ2Vjc2LjkyNTNWNzYuOTA2MVY3Ni44ODY5Vjc2Ljg2NzdWNzYuODQ4NVY3Ni44MjkzVjc2LjgxMDJWNzYuNzkxVjc2Ljc3MTlWNzYuNzUyOFY3Ni43MzM4Vjc2LjcxNDdWNzYuNjk1N1Y3Ni42NzY3Vjc2LjY1NzdWNzYuNjM4N1Y3Ni42MTk3Vjc2LjYwMDhWNzYuNTgxOVY3Ni41NjNWNzYuNTQ0MlY3Ni41MjUzVjc2LjUwNjVWNzYuNDg3N1Y3Ni40NjlWNzYuNDUwMlY3Ni40MzE1Vjc2LjQxMjhWNzYuMzk0MlY3Ni4zNzU1Vjc2LjM1NjlWNzYuMzM4NFY3Ni4zMTk4Vjc2LjMwMTNWNzYuMjgyOFY3Ni4yNjQ0Vjc2LjI0NlY3Ni4yMjc2Vjc2LjIwOTJWNzYuMTkwOVY3Ni4xNzI2Vjc2LjE1NDNWNzYuMTM2MVY3Ni4xMTc5Vjc2LjA5OThWNzYuMDgxNlY3Ni4wNjM2Vjc2LjA0NTVWNzYuMDI3NVY3Ni4wMDk1Vjc1Ljk5MTZWNzUuOTczN1Y3NS45NTU4Vjc1LjkzOFY3NS45MjAyVjc1LjkwMjRWNzUuODg0N1Y3NS44NjdWNzUuODQ5NFY3NS44MzE4Vjc1LjgxNDNWNzUuNzk2OFY3NS43NzkzVjc1Ljc2MTlWNzUuNzQ0NVY3NS43MjcyVjc1LjcwOTlWNzUuNjkyNlY3NS42NzU0Vjc1LjY1ODNWNzUuNjQxMlY3NS42MjQxVjc1LjYwNzFWNzUuNTkwMVY3NS41NzMyVjc1LjU1NjNWNzUuNTM5NVY3NS41MjI3Vjc1LjUwNlY3NS40ODkzVjc1LjQ3MjdWNzUuNDU2MVY3NS40Mzk2Vjc1LjQyMzJWNzUuNDA2N1Y3NS4zOTA0Vjc1LjM3NDFWNzUuMzU3OFY3NS4zNDE2Vjc1LjMyNTVWNzUuMzA5NFY3NS4yOTMzVjc1LjI3NzNWNzUuMjYxNFY3NS4yNDU1Vjc1LjIyOTdWNzUuMjE0Vjc1LjE5ODNWNzUuMTgyNlY3NS4xNjcxVjc1LjE1OUgyMS41OTA4TDI1LjAzNjIgNzkuNTUwNUMyNC41Njg3IDgwLjAzNjEgMjQuMjgxNiA4MC42OTM4IDI0LjI4MTYgODEuNDE4MUMyNC4yODE2IDgyLjkxMTkgMjUuNTAzMSA4NC4xMjMgMjcuMDEgODQuMTIzQzI4LjUxNjkgODQuMTIzIDI5LjczODQgODIuOTExOSAyOS43Mzg0IDgxLjQxODFDMjkuNzM4NCA3OS45MzIxIDI4LjUyOTggNzguNzI2IDI3LjAzNCA3OC43MTMyTDIyLjkyMDUgNzMuNDdMMjIuNjA2OSA3My4wNzAzSDIyLjA5ODlIMTEuOTIwNEw1LjEzNTU0IDY1LjU5NjVWNTUuODY3NEw4LjkwNTI2IDUxLjg5NjZIMTYuOTg1NUMxNy40NTE2IDUyLjcyNTkgMTguMzQ1IDUzLjI4NjkgMTkuMzcwNiA1My4yODY5QzIwLjg3NzUgNTMuMjg2OSAyMi4wOTkgNTIuMDc1OCAyMi4wOTkgNTAuNTgxOUMyMi4wOTkgNDkuMDg4MSAyMC44Nzc1IDQ3Ljg3NyAxOS4zNzA2IDQ3Ljg3N0MxOC4xMzUgNDcuODc3IDE3LjA5MTMgNDguNjkxMiAxNi43NTU1IDQ5LjgwOEg4Ljk4NThMNS4xMzU1NCA0NC41NTk1VjM0LjI1ODFMMTEuODc2NCAyNy44MjI4SDIyLjA5ODlIMjIuNjY5NUwyMi45Nzc3IDI3LjM0MjZMMjcuOTE2OCAxOS42NDgxQzI4LjE0OTIgMTkuNzExOSAyOC4zOTQxIDE5Ljc0NiAyOC42NDcgMTkuNzQ2QzMwLjE1MzkgMTkuNzQ2IDMxLjM3NTQgMTguNTM1IDMxLjM3NTQgMTcuMDQxMUMzMS4zNzU0IDE1LjU0NzIgMzAuMTUzOSAxNC4zMzYyIDI4LjY0NyAxNC4zMzYyQzI3LjE0MDEgMTQuMzM2MiAyNS45MTg1IDE1LjU0NzIgMjUuOTE4NSAxNy4wNDExQzI1LjkxODUgMTcuNTE5MSAyNi4wNDM2IDE3Ljk2ODIgMjYuMjYzMSAxOC4zNTc4TDIxLjUyODMgMjUuNzM0MkgxMi41MDIzVjE4LjI1NjZMMTkuNTU4OSAxMC41MTEzSDI3LjgyODZIMjguMjc5N0wyOC41ODkgMTAuMTgyOEwzNS45MTk0IDIuMzk2NTRINDMuNDI3N1YyOC4xNjg2SDI3LjgyODZIMjYuNzg0M1YyOS4yMTI5VjM2LjgyNDNIMTguMTY1OEMxNy44MzAxIDM1LjcwNzYgMTYuNzg2MyAzNC44OTMzIDE1LjU1MDcgMzQuODkzM0MxNC4wNDM4IDM0Ljg5MzMgMTIuODIyMyAzNi4xMDQ0IDEyLjgyMjMgMzcuNTk4M0MxMi44MjIzIDM5LjA5MjEgMTQuMDQzOCA0MC4zMDMyIDE1LjU1MDcgNDAuMzAzMkMxNi41NzYyIDQwLjMwMzIgMTcuNDY5NiAzOS43NDIzIDE3LjkzNTcgMzguOTEzSDI2Ljc4NDNaTTQ2LjA4NTggMzkuMzcwM0w0Ny4wNzY2IDQxLjgwMjZMNTAuNDkyNCA1MC4xODc5TDUyLjgwNjMgNTUuODY4Mkw1MC44NzIgNTYuNjU2Mkw0OC44MjMgNTEuNjI2Mkg0My41NzEzTDQxLjYyNjIgNTYuNjRMMzkuNjc4OSA1NS44ODQ1TDQxLjg4MjcgNTAuMjA0Mkw0NS4xMzU4IDQxLjgxODlMNDYuMDg1OCAzOS4zNzAzWk00NC4zODE2IDQ5LjUzNzZINDcuOTcyMUw0Ni4xMzMxIDQ1LjAyM0w0NC4zODE2IDQ5LjUzNzZaTTU2LjI1MTggMzkuNDkxNVY1Ni4yNjJINTguMzQwNVYzOS40OTE1SDU2LjI1MThaIiBmaWxsPSIjRTczRDNEIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9mXzEwMTRfMzYxIiB4PSIzLjA0NjY4IiB5PSIxLjE3NjMyIiB3aWR0aD0iOTQuODMxIiBoZWlnaHQ9Ijk3LjMzNDkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS40MzI3MSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzEwMTRfMzYxIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMTAxNF8zNjEiIHg9Ii0wLjAzMzk4MzciIHk9IjAiIHdpZHRoPSIxMDAuMTk5IiBoZWlnaHQ9IjEwNS4wNjgiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeT0iMy4wMzM5OCIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjUxNjk5Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzEwMTRfMzYxIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzEwMTRfMzYxIiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIyX2RfMTAxNF8zNjEiIHg9IjAuMDEyODkxMyIgeT0iMC4wMzc1OTc3IiB3aWR0aD0iMTAwLjEwNSIgaGVpZ2h0PSIxMDQuOTkzIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjMuMDMzOTgiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS41MTY5OSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xMDE0XzM2MSIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18xMDE0XzM2MSIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K" alt="logo">`;
            }))
        return localStorage.getItem('applicantResult');
    }
    static async getTeachersAsync(language) {
        const item = localStorage.getItem('teachersResult');
        if (item != null)
            return item;
        await localStorage.setItem('teachersResult', await fetch(`http://54.93.52.237/aiwebsite/Employees?language=${language}`,
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
                    result += `<div class="teachers_column">
                                <img class="teachers_photo" src="${teacher.photoUrl}" alt="teacher">
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
    static async getCourseCardsPageAsync(language){
        //TODO add links to it
        const page = localStorage.getItem("courseCardsPage")
        if(page) {
            return page
        }else{
            localStorage.setItem("courseCardsPage", await fetch(`https://localhost:7159/CourseCards?language=ua`,
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
}
