import "./byeie"; // loučíme se s IE

/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/


let mymap = L.map('mapa_nehod', {maxZoom: 15})
mymap.scrollWheelZoom.disable()
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',
}).addTo(mymap)


fetch('./data/data.json')
    .then(response => response.json())
    .then(data => {
        let ttip = L.control({position: 'topleft'})
        ttip.onAdd = function(map){
            let div = L.DomUtil.create('div', 'ttip')
            div.innerHTML = `ahoj`
            return div;
        }
        ttip.addTo(mymap)
        
        let pinGrp = new L.featureGroup()
        data.forEach( ftr => {
            if (ftr.x === '') {
              return
            }
            //body v mape
            let mrk = L.circleMarker([ftr.y, ftr.x], {
                radius: 5,
                color: '#de2d26',
                opacity: 1,
                weight: 1,
                fillColor: '#de2d26',
                fillOpacity: 0.5,
            })
            mrk.bindPopup(JSON.stringify(ftr, null, 2))
            mrk.addTo(pinGrp)
        })

        pinGrp.addTo(mymap)
        mymap.fitBounds(pinGrp.getBounds())
})