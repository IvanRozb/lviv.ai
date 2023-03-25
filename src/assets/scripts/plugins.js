// Google Map
export function initMap() {
	const cathedra = { lat: 49.837373745481536, lng: 24.033663701171104 }

	const map = new google.maps.Map(document.querySelector('.footer_map'), {
		zoom: 15,
		center: cathedra,
		disableDefaultUI: true
	})
	const marker = new google.maps.Marker({
		position: cathedra,
		map: map
	})
}
