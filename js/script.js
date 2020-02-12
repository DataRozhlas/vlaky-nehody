/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable new-cap */
import './byeie' // loučíme se s IE

const map = new mapboxgl.Map({
  container: 'mapa_nehod',
  style: {
    'version': 8,
    'sources': {
      'raster-tiles': {
        'type': 'raster',
        'tiles': [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.'
      }
    },
    'layers': [
      {
        'id': 'simple-tiles',
        'type': 'raster',
        'source': 'raster-tiles',
        'minzoom': 4,
        'maxzoom': 22
      }
    ]
  },
  center: [15.33507, 49.74175],
  zoom: 6
})
map.addControl(new mapboxgl.NavigationControl())

class Legend {
  onAdd (map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.id = 'legend'
    this.container.innerHTML = 'Pro zobrazení konkrétních míst přibližte mapu.'
    return this.container
  }

  onRemove () {
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}
const legend = new Legend()
map.addControl(legend, 'top-left')

map.on('load', () => {
  map.addSource('nehody', {
    'type': 'geojson',
    'data': './data/data.json'
  })

  map.addLayer(
    {
      'id': 'nehody-heat',
      'type': 'heatmap',
      'source': 'nehody',
      'maxzoom': 12,
      'paint': {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': [
          'interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
          0, 0,
          18, 1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
          'interpolate', ['linear'], ['zoom'],
          0, 1,
          15, 3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0.0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1.0, 'rgb(178,24,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate', ['linear'], ['zoom'],
          0, 2,
          18, 20
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
          'interpolate', ['linear'], ['zoom'],
          7, 1,
          9, 0
        ]
      }
    }
  )

  map.addLayer(
    {
      'id': 'nehody-point',
      'type': 'circle',
      'source': 'nehody',
      'minzoom': 8,
      'paint': {
      // Size circle radius by earthquake magnitude and zoom level
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          7, ['interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
            1, 1,
            18, 6
          ],
          16, ['interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
            1, 10,
            18, 50
          ]
        ],
        // Color circle by earthquake magnitude
        'circle-color': [
          'interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
          1, 'rgba(252,187,161,0)',
          5, 'rgb(254,229,217)',
          9, 'rgb(251,106,74)',
          12, 'rgb(203,24,29)',
          18, 'rgb(153,0,13)'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        // Transition from heatmap to circle layer by zoom level
        'circle-opacity': [
          'interpolate', ['linear'], ['zoom'],
          7, 1,
          8, 1
        ]
      }
    }
  )
})

map.on('zoomend', e => {
  if (map.getZoom() >= 8) {
    document.getElementById('legend').innerHTML = 'Kliknutím vyberte místo nehod.'
    map.getCanvas().style.cursor = 'default'
  } else {
    document.getElementById('legend').innerHTML = 'Pro zobrazení konkrétních míst přibližte mapu.'
    map.getCanvas().style.cursor = 'grab'
  }
})

function tratName(val) {
  if (val.length > 4) {
    return val
  } else {
    return `<i>bez jména</i>`
  }
}

map.on('click', e => {
  const d = map.queryRenderedFeatures(e.point, { layers: ['nehody-point'] })
  if (d.length > 0) {
    document.getElementById('legend').innerHTML = `<b>Trať ${tratName(d[0].properties.trat)}, ${d[0].properties.km_h}. km</b><br>Mrtvých: ${d[0].properties.ex}<br>Těžce raněných: ${d[0].properties.tr}<br>Lehce raněných: ${d[0].properties.lr}`
  }
})
