import $ from 'jquery'
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

	$(document).ready(function () {
		const slider = $('.ais-list')
		const items = $('.ais-list-item')
		slider.slick({
			speed: 500,
			infinite: false,
			adaptiveHeight: true,
			waitForAnimate: false,
			slidesToShow: 3,
			slidesToScroll: 3,
			rows: 2,
			draggable: false,
			dots: items.length > 2 * 3,
			responsive: [
				{
					breakpoint: 600 + 1,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						rows: 1,
						dots: items.length > 2
					}
				}
			]
		})
		let maxHeight = 0

		items.each(function () {
			if ($(this).height() > maxHeight) maxHeight = $(this).height()
		})

		// Set the height of all items to the maximum height
		$(items).css('height', maxHeight)
	})
}, 0)
