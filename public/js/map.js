
mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
});


const marker = new mapboxgl.Marker({ color: 'red', rotation: 0 })
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(
    `exact location provided after booking in ${(listing.location).toUpperCase()}`
))
.addTo(map);