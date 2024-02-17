var map = L.map('map').setView([20.5937,78.9629],5);
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
	
tiles.addTo(map);
	
function generateList(){
	const ul = document.querySelector('.list');
	storeList.forEach((shop) =>{
		const li = document.createElement('li');
		const div = document.createElement('div');
		const a = document.createElement('a');
		const p = document.createElement('p');
		
		a.addEventListener('click', ()=> {
			flyToStore(shop);
		})
		
		div.classList.add('shop-item');
		
		a.innerText = shop.properties.name;
		a.href = '#';
		p.innerText = shop.properties.address;
		
		div.appendChild(a);
		div.appendChild(p);
		
		li.appendChild(div);
		ul.appendChild(li);
	});
}
	
generateList();

function makePopupContent(shop){
	return `
		<div>
			<h4>${shop.properties.name}</h4>
			<p>${shop.properties.address}</>
			<div class='phone-number'>
				<a href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
			</div>
		</div>
		`;
}
	
function onEachFeature(feature, layer){
	layer.bindPopup(makePopupContent(feature), {
		closeButton: false,
		offset: L.point(0,-8),
	});
}

var myIcon = L.icon({
	iconUrl: './image/marker.png',
	iconSize: [30,40],
});

const shopsLayer = L.geoJSON(storeList, {
	onEachFeature: onEachFeature,
	pointToLayer: function(feature, latlng) {
		return L.marker(latlng, {
			icon: myIcon,
		});
	}
});

shopsLayer.addTo(map);

function flyToStore(store){
	const lat = store.geometry.coordinates[1];
	const lng = store.geometry.coordinates[0];

	map.flyTo([lat,lng], 14, {
		duration: 2,
	});
	
	setTimeout(() =>{
		L.popup({closeButton: false, offset: L.point(0,-8)})
		.setLatLng([lat,lng])
		.setContent(makePopupContent(store))
		.openOn(map);
	}, 2000);
}