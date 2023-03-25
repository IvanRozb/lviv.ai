import { Fetch } from './fetch'

setTimeout(async () => {
	const language = document.documentElement.lang
	const dynamicPage = await Fetch.getAISPageAsync(language)

	const iframe = document.querySelector('iframe.responsive')
	const videoLoader = document.querySelector('.video-loader')

	iframe.onload = function () {
		iframe.classList.remove('hidden')
		iframe.classList.add('visible')
		videoLoader.classList[0] = 'hidden'
	}

	const mainLoader = document.querySelector('.main-loader')
	const container = document.querySelector('.page_container')

	container.insertAdjacentHTML('beforeend', dynamicPage)
	mainLoader.classList.add('hidden')
}, 0)
