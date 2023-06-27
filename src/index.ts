import { Map, Marker, MarkerClusterGroup,Icon, icon } from 'leaflet';
import 'leaflet.markercluster';
import { startMapTemplate } from './../assets/template/content';
import { tileLayerSelect } from './../config/tile-layers/functions';
import axios from 'axios';
import * as L from 'leaflet';
import { Geosearch, ArcgisOnlineProvider } from 'esri-leaflet-geocoder';
import dotenv from 'dotenv';

dotenv.config();
startMapTemplate(document);

// <=========================== Inicializacion de MAPA =========================================>
const mymap = new Map('map').setView([-36.82699, -73.04977], 18);

// <=========================== Agregar el buscador al Mapa =========================================>
const apiKey: string | undefined = process.env.GEOSEARCH_APIKEY;

if (apiKey) {
  const searchControl: Geosearch = new Geosearch({
    position: 'topleft',
    placeholder: 'Ingresa una dirección...',
    useMapBounds: false,
    providers: [
      new ArcgisOnlineProvider({
        apikey: apiKey,
        nearby: {
          lat: -33.8688,
          lng: 151.2093,
        },
      }),
    ],
  });

  searchControl.addTo(mymap);

  // <=========================== Agregar PopUp a la ubicación encontrada en el buscador =========================================>
  const results: L.LayerGroup = L.layerGroup().addTo(mymap);

  searchControl.on('results', (data: { results: any[] }) => {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
      const marker = L.marker(data.results[i].latlng);

      const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000) / 100000}, ${
        Math.round(data.results[i].latlng.lat * 100000) / 100000
      }`;

      marker.bindPopup(`<b>${lngLatString}</b><p>${data.results[i].properties.LongLabel}</p>`);

      results.addLayer(marker);

      marker.openPopup();
    }
  });
}

// <=========================== Funcion para Centrar la vista en mi ubicacion =========================================>
function showUserLocationOnMap(): void {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const userIcon: Icon = icon({
          iconUrl: 'https://img.icons8.com/3d-fluency/94/user-location.png',
          iconSize: [45, 45],
          iconAnchor: [12, 12],
        });

        const userMarker: Marker = new Marker([latitude, longitude], {
          icon: userIcon,
        })
          .addTo(markers)
          .bindPopup(`<h5><b>¡Estás aquí!</b></h5>
                      <p> Lat: ${latitude} - Lng: ${longitude}`);

        markers.addTo(mymap);

        // Centrar el mapa en la ubicación del usuario
        mymap.setView([latitude, longitude], 15);
      },
      (error) => {
        console.log('Error al obtener la ubicación:', error.message);
      }
    );
  } else {
    console.log('La geolocalización no es compatible en este navegador.');
  }
}

const markers = new MarkerClusterGroup();

// <=========================== Funcion para traer los datos =========================================>
async function fetchData(): Promise<void> {
  try {
    const result = await axios.get(
      // Api
      'https://geobikesapi.onrender.com/api/talleres'
    );
    const talleres: any[] = result.data;

    const defaultIcon: Icon = icon({
      iconUrl:
        'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-bike-vacation-planning-cycling-tour-flaticons-lineal-color-flat-icons-2.png',
      iconSize: [45, 45], // Tamaño del icono en píxeles
      iconAnchor: [12, 12], // Punto de anclaje del icono en relación con su posición
    });

    if (Array.isArray(talleres)) {
      talleres.forEach((taller) => {
        const { lat, lon, name, direction, email } = taller;

        const tallerMarker: Marker = new Marker([lat, lon], {
          icon: defaultIcon,
        })
          .addTo(markers)
          .bindPopup(
            `<h5><b>${name}</b></h5>
                <p>${direction}<br>
                ${email}</p>`,
            {
              offset: [11, 5],
            }
          );
      });

      markers.addTo(mymap);

      //<======================== Centrar la vista en la localizacion de todos los talleres (descomentar para que funcione) ==========================================>
      /* mymap.fitBounds([
        ...talleres.map((taller) => [taller.lat, taller.lon] as [number, number]),
      ]); */

      // <=========================== Centrar la vista en mi ubicacion =========================================>
      showUserLocationOnMap();
    }
  } catch (error) {
    console.error(error);
  }
}

// LLAMADA A LA FUNCION TRAER DATOS
fetchData();

tileLayerSelect().addTo(mymap);







//FUNCION QUE FUNCIONA XD - PARA HACER TEST
/* axios
  .get( 
    'https://raw.githubusercontent.com/leaflet-maps-course/resources/f790b7cc895a33979ea3dbede861da7eb26cad9d/south_basque_country_peaks.json'
  )
  .then((result) => {
    const peaks: Array<{
      lat: number;
      lon: number;
      tags: {
        ele: string;
        name: string;
      };
    }> = result.data['peaks'];
    console.log(peaks);
    peaks.map((peak) => {
      const selectIcon = selectIconMarker(+peak.tags.ele);
      marker([peak.lat, peak.lon], {
        icon: new selectIcon(),
      })
        .addTo(markers)
        .bindPopup(
          `
            <h5>${
              peak.tags.name !== undefined ? peak.tags.name : 'No name'
            }</h5>
            <span>${peak.tags.ele !== undefined ? peak.tags.ele : '-'} m.</span>
            `,
          {
            offset: [11, 5],
          }
        );
    });
    markers.addTo(mymap);

    mymap.fitBounds([
      ...peaks.map((peak) => [peak.lat, peak.lon] as [number, number]),
    ]);
  });   */