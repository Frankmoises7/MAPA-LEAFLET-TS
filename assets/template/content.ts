const contentHtml = (projectTile: string, nameLastname: string) => `

<div class="grid-container">
    <span></span>
    <div><div id="map"></div></div>
    <span></span>  
</div>

<p id="attribution mt-02" class="text-center mt-02">Proyecto creado por <em>${nameLastname} </em> con la librería Leaflet y Typescript</p>
`;

export const startMapTemplate = (
    document: Document,
    projectTile = 'GeoBikes App',
    nameLastname = 'Frank Islas',
) => {
  document.title = projectTile;
  // 1. Seleccionamos el id del elemento principal
  const app = document.getElementById('app');

  // 2.- Creamos una capa temporal para añadir el con tenido HTML
  const temp = document.createElement('div');
  // 3.- Incrustamos el HTML de la constante
  temp.innerHTML = contentHtml(projectTile, nameLastname);
  // 4.- Añadimos en el primer nodo
  while (temp.firstChild) {
    app?.appendChild(temp.firstChild);
  }
};
