import { Fetch } from './fetch'
import { navigationListBehavior, setDefaultSection } from './utils'

setTimeout(async () => {
    let activeSection = window.location.href.split('#')[1] || 'docs_section'
    setDefaultSection(activeSection)

    const language = document.documentElement.lang
    const page = await Fetch.getApplicantsAsync(activeSection, language)
    const container = document.createElement('div')
    container.innerHTML = `<div>${page.trim()}</div>`
    const section = document.querySelector('.applicant_section')
    section.removeChild(document.querySelector('.my-loader'))
    section.appendChild(container.firstChild)

    navigationListBehavior('.sidebar_list', ['section'], '.sidebar_list > li')
    navigationListBehavior(
        '.subjects_dates',
        ['.subjects_images > img', '.subjects_notes'],
        '.subjects_date'
    )
}, 0)
