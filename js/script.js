/* eslint-disable new-cap */
import './byeie' // loučíme se s IE

const mymap = L.map('mapa_nehod', { maxZoom: 15 })
mymap.scrollWheelZoom.disable()
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',
}).addTo(mymap)

fetch('./data/data.json')
  .then(response => response.json())
  .then(data => {
    /*
    let ttip = L.control({position: 'topleft'})
    ttip.onAdd = function(map){
        let div = L.DomUtil.create('div', 'ttip')
        div.innerHTML = `ahoj`
        return div;
    }
    ttip.addTo(mymap)
    */
    const cases = data.map(ftr => ftr['Usmrcených'] + ftr['Těžce zraněných'] + ftr['Lehce zraněných'])
    const cWidth = d3.scalePow().domain([0, Math.max(...cases)]).range([5, 15])

    const pinGrp = new L.featureGroup()
    data.forEach(ftr => {
      if (ftr.x === '') {
        return
      }
      // body v mape
      const mrk = L.circleMarker([ftr.y, ftr.x], {
        radius: cWidth(ftr['Usmrcených'] + ftr['Těžce zraněných'] + ftr['Lehce zraněných']),
        color: '#de2d26',
        opacity: 1,
        weight: 1,
        fillColor: '#de2d26',
        fillOpacity: 0.5
        // meta: ftr,
      })
      mrk.bindPopup(
        `<b>${ftr.trat_ojr_n}, ${ftr.km_h}. km</b><br>Usmrcených: ${ftr['Usmrcených']}<br>Těžce zraněných: ${ftr['Těžce zraněných']}<br>Lehce zraněných: ${ftr['Lehce zraněných']}`
      )
      mrk.addTo(pinGrp)
    })

    pinGrp.addTo(mymap)
    mymap.fitBounds(pinGrp.getBounds())
  })
