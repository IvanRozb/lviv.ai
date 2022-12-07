if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

export class Fetch {
    //Help Functions
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
            images.push(`<img class="subjects_image-${key} src="${value}" alt="table-${key}"" style="display: ${(flag === 0) ? " block" : "none"}">`);
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

    static async /*[array, array]*/#getJobsAmounts(jobNames, cities){

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

    //Middle layer
    static async getApplicantsAsync(language) {
        const item = localStorage.getItem('applicantResult')
        console.log(item)
        // if (item != null)
        //     return item

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

                return result + `<img class="logo" src="assets/img/logo.svg" alt="logo">`;
            }))
        return localStorage.getItem('applicantResult');
    }

    //Implementations
    static async getJobsPositions(){
        const html = localStorage.getItem('jobsPositionsResult')
        let insertedDate = localStorage.getItem("jobsPositionsInsertedTime")

        if (html != null && insertedDate != null){
            insertedDate = new Date(insertedDate)
            insertedDate.setDate(insertedDate.getDate() + 1)

            //checks if item exists in localStorage more than 1 day
            if(insertedDate > new Date())
                return html
        }


        const locations = ["Lviv", "Ukraine"]

        await localStorage.setItem("jobsPositionsResult", await fetch("http://54.93.52.237/aiwebsite/jobNames?language=ua",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async data => {

                let jobNames = data.names
                const jobAmounts = await this.#getJobsAmounts(jobNames, locations)

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
                                <th class="vacancies_column">Україна</th>`


                jobAmounts.firstCity.forEach(amount => {
                    HTML += `<th class="vacancies_column">${amount}</th>`
                })

                HTML += `</tr>
                     <tr class="vacancies_row">
                         <th class="vacancies_column">Львів</th>`

                jobAmounts.secondCity.forEach(amount => {
                    HTML += `<th class="vacancies_column">${amount}</th>`
                })

                HTML += `</tr>
                </table>`


                return HTML
            }))

        localStorage.setItem("jobsPositionsInsertedTime", new Date().toJSON())

        return localStorage.getItem('jobsPositionsResult');
    }
    static async getJobPositionsAsync(){
        return await this.getJobsPositions()
    }
    static async getApplicantsUA() {
        return await this.getApplicantsAsync('ua');
    }
}
