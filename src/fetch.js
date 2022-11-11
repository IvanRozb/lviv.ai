function changeTagIfNeeded(tag, element) {
    let tagCopy = tag;
    if (tagCopy === undefined)
        tagCopy = 'p';
    if (tagCopy === 'p' && element.toString().substring(0, 5) === 'https') {
        if (element.toString().substring(element.length - 3) !== 'jpg')
            tagCopy = 'a';
        else
            tagCopy = 'img';
    }
    return tagCopy;
}

class Fetch {
    static objTags = {
        name: 'h3',
        title: 'h3',
        about: 'p',
        description: 'p',
        cooperation: 'p',
        logoUrl: 'img',
        summary: 'p',
        video: 'a',
    };

    static async getCollection(collection, language) {
        let result = ''
        await fetch(`http://54.93.52.237/aiwebsite/${collection}?language=${language}`,
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
                for (let i = 0; i < data.length; i++) {
                    for (const name in data[i]) {
                        console.log(data[i][name]);

                        if (Array.isArray(data[i][name])) {
                            for (const element of data[i][name]) {
                                let tag = changeTagIfNeeded((this.objTags)[element], element);

                                if (tag === 'img')
                                    result += `<${tag} src = '${element}' style='display: block;'></${tag}>`;
                                else if (name != 'id' && name != 'language')
                                    result += `<${tag}>${data[i][name]}</${tag}><br>`;
                            }
                        } else if (typeof data[i][name] === 'object') {
                            for (const element in data[i][name]) {
                                let tag = changeTagIfNeeded((this.objTags)[element], element);
                                result += `<${tag}>${element}:${data[i][name][element]}</${tag}><br>`;
                            }
                        } else {
                            let tag = changeTagIfNeeded((this.objTags)[data[i][name]], data[i][name]);
                            if (tag === 'img')
                                result += `<${tag} src = '${data[i][name]}' style='display: block;'></${tag}>`
                            else if (name != 'id' && name != 'language')
                                result += `<${tag}>${data[i][name]}</${tag}><br>`
                        }
                    }
                }
            });
        return result
    }

    static async getApplicants(language) {
        let result = '';
        await fetch(`http://54.93.52.237/aiwebsite/Applicants?language=${language}`,
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
                for (let i = 0; i < data.length; i++) {
                    for (const name in data[i]) {
                        const element = data[i][name]
                        console.log(element)
                        switch (name){
                            case "explanations":
                                for (const explanation in element) {
                                    result += `<div class="docs_box">`;
                                    result += `<p class="docs_list_title">&{explanation.title}</p>`;
                                    result += `<ul class="docs_list">`;
                                    for (const item in explanation.items) {
                                        result += `<li class="docs_list_items"><h6 class="docs_list_text">&{item}</h6></li>`
                                    }
                                    result += `</ul>`
                                    result += `</div>`
                                    if (explanation.photo != null) {
                                        result += ` <div class="docs_cabinet">
                                                        <img class="docs_cabinet_img" src="${explanation.photo}" alt="form">
                                                    </div>`
                                    }
                                }
                                break;
                            case "educationCosts":
                                for (const row in element) {
                                    result+=`<tr class="pay_table_row">`
                                    result+=`<th class="pay_table_value ">&{row.degree}</th>`
                                    result+=`<th class="pay_table_value ">&{row.term}</th>`
                                    result+=`<th class="pay_table_value ">&{row.capacity}</th>`
                                    result+=`</tr>`
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            });
    }
}
//Render data

let response = Fetch.getCollection("Projects", "ua")
response.then((html) =>{
    document.querySelector(".applicant_sponsors").insertAdjacentHTML("afterbegin",html )
})

