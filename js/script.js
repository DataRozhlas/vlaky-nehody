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
        'attribution': 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, data <a href="http://www.dicr.cz/">drážní inspekce</a>.'
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
          4, 1
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
          0.0, 'rgba(252,187,161,0)',
          0.2, 'rgb(252,146,114)',
          0.4, 'rgb(251,106,74)',
          0.6, 'rgb(239,59,44)',
          0.8, 'rgb(203,24,29)',
          1.0, 'rgb(153,0,13)'
        ],
        // polomer podle zoomu
        'heatmap-radius': [
          'interpolate', ['linear'], ['zoom'],
          0, 8,
          4, 20
        ],
        // prechod mezi heatmapou a body
        'heatmap-opacity': [
          'interpolate', ['linear'], ['zoom'],
          7, 1,
          10, 0
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
      // radius bodu podle zoomu a poctu mrtvych a ranenych
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          7, ['interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
            1, 1,
            4, 6
          ],
          16, ['interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
            1, 10,
            4, 50
          ]
        ],
        // barva podle mnozstvi mrtvych a zranenych
        'circle-color': [
          'interpolate', ['linear'], ['+', ['get', 'ex'], ['get', 'tr'], ['get', 'lr']],
          0, 'rgb(252,187,161)',
          4, 'rgb(153,0,13)'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        // prechod priuhlednosti mezi heatmapou a body
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

function tratName (val) {
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
