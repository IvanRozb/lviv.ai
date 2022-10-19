export async function getSponsors(language){
    let result = ''
   await fetch(`http://54.93.52.237/aiwebsite/Sponsors?language=${language}`,
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

            data = data[0]
            console.log(data.links)

            let linksHTML = ``
            Object.entries(data.links).forEach(([k,v]) => {
                linksHTML += ` <a href="${v}">${k}</a>\n`
            })

            result = `<h3>${data.name}</h3>
                    <p>${data.summary}</p>
                    ${linksHTML}`
        });
    return result
}

//Render data

let response = getSponsors("ua")
response.then((html) =>{
    document.querySelector(".applicant_sponsors").insertAdjacentHTML("afterbegin",html )
})

