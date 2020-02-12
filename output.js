!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);r(1);function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=new mapboxgl.Map({container:"mapa_nehod",style:{version:8,sources:{"raster-tiles":{type:"raster",tiles:["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, data <a href="http://www.dicr.cz/">drážní inspekce</a>.'}},layers:[{id:"simple-tiles",type:"raster",source:"raster-tiles",minzoom:4,maxzoom:22}]},center:[15.33507,49.74175],zoom:6});o.addControl(new mapboxgl.NavigationControl);var a=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,r,o;return t=e,(r=[{key:"onAdd",value:function(e){return this.map=e,this.container=document.createElement("div"),this.container.id="legend",this.container.innerHTML="Pro zobrazení konkrétních míst přibližte mapu.",this.container}},{key:"onRemove",value:function(){this.container.parentNode.removeChild(this.container),this.map=void 0}}])&&n(t.prototype,r),o&&n(t,o),e}());o.addControl(a,"top-left"),o.on("load",(function(){o.addSource("nehody",{type:"geojson",data:"./data/data.json"}),o.addLayer({id:"nehody-heat",type:"heatmap",source:"nehody",maxzoom:12,paint:{"heatmap-weight":["interpolate",["linear"],["+",["get","ex"],["get","tr"],["get","lr"]],0,0,4,1],"heatmap-intensity":["interpolate",["linear"],["zoom"],0,1,15,3],"heatmap-color":["interpolate",["linear"],["heatmap-density"],0,"rgba(252,187,161,0)",.2,"rgb(252,146,114)",.4,"rgb(251,106,74)",.6,"rgb(239,59,44)",.8,"rgb(203,24,29)",1,"rgb(153,0,13)"],"heatmap-radius":["interpolate",["linear"],["zoom"],0,8,4,20],"heatmap-opacity":["interpolate",["linear"],["zoom"],7,1,10,0]}}),o.addLayer({id:"nehody-point",type:"circle",source:"nehody",minzoom:8,paint:{"circle-radius":["interpolate",["linear"],["zoom"],7,["interpolate",["linear"],["+",["get","ex"],["get","tr"],["get","lr"]],1,1,4,6],16,["interpolate",["linear"],["+",["get","ex"],["get","tr"],["get","lr"]],1,10,4,50]],"circle-color":["interpolate",["linear"],["+",["get","ex"],["get","tr"],["get","lr"]],0,"rgb(252,187,161)",4,"rgb(153,0,13)"],"circle-stroke-color":"white","circle-stroke-width":1,"circle-opacity":["interpolate",["linear"],["zoom"],7,1,8,1]}})})),o.on("zoomend",(function(e){o.getZoom()>=8?(document.getElementById("legend").innerHTML="Kliknutím vyberte místo nehod.",o.getCanvas().style.cursor="default"):(document.getElementById("legend").innerHTML="Pro zobrazení konkrétních míst přibližte mapu.",o.getCanvas().style.cursor="grab")})),o.on("click",(function(e){var t,r=o.queryRenderedFeatures(e.point,{layers:["nehody-point"]});r.length>0&&(document.getElementById("legend").innerHTML="<b>Trať ".concat((t=r[0].properties.trat,t.length>4?t:"<i>bez jména</i>"),", ").concat(r[0].properties.km_h,". km</b><br>Mrtvých: ").concat(r[0].properties.ex,"<br>Těžce raněných: ").concat(r[0].properties.tr,"<br>Lehce raněných: ").concat(r[0].properties.lr))}))},function(e,t){if("Microsoft Internet Explorer"===navigator.appName||navigator.userAgent.match(/Trident/)||navigator.userAgent.match(/rv:11/)){var r=document.createElement("div");r.innerHTML='Používáte zastaralý Internet Explorer, takže vám části tohoto webu nemusí fungovat. Navíc to <a target="_blank" style="color:white;" rel="noopener noreferrer" href="https://www.zive.cz/clanky/microsoft-internet-explorer-neni-prohlizec-prestante-ho-tak-pouzivat/sc-3-a-197149/default.aspx">není bezpečné</a>, zvažte přechod na <a target="_blank" style="color:white;" rel="noopener noreferrer" href="https://www.mozilla.org/cs/firefox/new/">jiný prohlížeč</a>.',r.style.cssText="text-align:center;position:absolute;width:100%;height:auto;opacity:1;z-index:100;background-color:#d52834;top:37px;padding-top:4px;padding-bottom:3px;color:white;",document.body.appendChild(r)}}]);