if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
class Fetch {
    static async getApplicantsAsync(language) {
        // if (localStorage.getItem('applicantResult') != null)
        //     return;
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
                        // console.log(element)
                        switch (name){
                            case "explanations":
                                result+=`<section class="docs_section" style="display: block">
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
                                break;
                            case "educationCosts":
                                result+=`<section class="pay_section" style="display: block">`
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
                                break;
                            case "dates":
                                result+=`<section class="calendar_section" style="display: block">
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
                                break;
                            default:
                                break;
                        }
                    }

                return result + `<img class="logo" src="assets/img/logo.svg" alt="logo">`;
            }))
        return localStorage.getItem('applicantResult')
    }

    static async getApplicants() {
        return await this.getApplicantsAsync('ua');
    }
}

setTimeout(async ()=>document.getElementsByTagName('body')[0].innerHTML += await Fetch.getApplicants(), 0);