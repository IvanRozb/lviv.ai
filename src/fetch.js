if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

export class Fetch {
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

    static async getApplicantsAsync(language) {
        const item = localStorage.getItem('applicantResult');
        // if (item == null)
        //     return item;
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

    static async getApplicants() {
        return await this.getApplicantsAsync('ua');
    }
}