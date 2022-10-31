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

class Fetch{
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

    static async getCollection(collection, language){
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

                        if(Array.isArray(data[i][name])) {
                            for (const element of data[i][name]) {
                                let tag = changeTagIfNeeded((this.objTags)[element], element);
                                
                                if (tag === 'img')
                                    result += `<${tag} src = '${element}' style='display: block;'></${tag}>`;
                                else if (name != 'id' && name != 'language')
                                    result += `<${tag}>${data[i][name]}</${tag}><br>`;
                            }
                        }
                        else if(typeof data[i][name] === 'object')
                        {
                            for (const element in data[i][name]) {
                                let tag = changeTagIfNeeded((this.objTags)[element], element);
                                result += `<${tag}>${element}:${data[i][name][element]}</${tag}><br>`;
                            }
                        }
                        else
                        {
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
}
//Render data

let response = Fetch.getCollection("Projects", "ua")
response.then((html) =>{
    document.querySelector(".applicant_sponsors").insertAdjacentHTML("afterbegin",html )
})

