import { Map, MarkerClusterGroup, marker, icon} from 'leaflet';
import 'leaflet.markercluster';
import { Path } from 'leaflet';
import { startMapTemplate } from './../assets/template/content';
import { tileLayerSelect } from './../config/tile-layers/functions';
import axios from 'axios';

startMapTemplate(
  document
);

const mymap = new Map('map').setView([-36.82699, -73.04977], 18);

tileLayerSelect().addTo(mymap);

const markers = new MarkerClusterGroup();
async function fetchData(): Promise<void> {
  try {
    const result = await axios.get('https://geobikesapi.onrender.com/api/talleres');
    const talleres = result.data;

    const defaultIcon = icon({
      iconUrl: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-bike-vacation-planning-cycling-tour-flaticons-lineal-color-flat-icons-2.png',
      iconSize: [45, 45], // Tamaño del icono en píxeles
      iconAnchor: [12, 12], // Punto de anclaje del icono en relación con su posición
    });

    if (Array.isArray(talleres)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      talleres.forEach((taller: any) => {
        marker([taller.lat, taller.lon], {
          icon: defaultIcon,
        })
          .addTo(markers)
          .bindPopup(
            `<h2><b>${taller.name}</b></h2>
                <p>${taller.direction}</p>
                <p>${taller.email}</p>
                <p>${taller.tags.ele}</p>
                `,
            {
              offset: [11, 5],
            }
          );
      });

      markers.addTo(mymap);
      mymap.fitBounds([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...talleres.map((taller: any) => [taller.lat, taller.lon] as [number, number]),
      ]);
    }
  } catch (error) {
    console.error(error);
  }
}

fetchData();



//FUNCION QUE FUNCIONA XD
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