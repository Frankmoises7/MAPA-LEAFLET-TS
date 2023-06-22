import { DivIcon } from 'leaflet';

export const BiclycleMarkers = (selectColor = 'blue') =>
  DivIcon.extend({
    options: {
      html: `<i class="fas fa-bicycle peak-${selectColor}"></i>`,
      className: 'mountain-peak',
    },
  });
