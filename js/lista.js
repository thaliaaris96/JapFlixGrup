let peliculas = [];

// Cargar datos al cargar la ventana
window.onload = function () {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            peliculas = data;
        });
}

// Evento de clic en el botón de búsqueda
document.getElementById('btnBuscar').addEventListener('click', function () {
    const busquedaPelicula = document.getElementById('inputBuscar').value.toLowerCase();
    if (busquedaPelicula === "") {
        alert("Ingrese una búsqueda");
    } else {
        // Filtrar películas según el término de búsqueda
        const resultados = peliculas.filter(pelicula => {
            return pelicula.title.toLowerCase().includes(busquedaPelicula) ||
                pelicula.genres.some(genre => genre.name.toLowerCase().includes(busquedaPelicula)) ||
                pelicula.tagline.toLowerCase().includes(busquedaPelicula) ||
                pelicula.overview.toLowerCase().includes(busquedaPelicula);
        });

        // Mostrar los resultados en la interfaz
        mostrarResultados(resultados);
    }
});

// Función para mostrar los resultados en la interfaz
function mostrarResultados(resultados) {
    const lista = document.getElementById('lista');
    const resultado = document.createDocumentFragment();

    resultados.forEach(pelicula => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `
            <strong>${pelicula.title}</strong>
            <p>${pelicula.tagline}</p>
            <p>Rating: ${generateStars(pelicula.vote_average)}</p>
        `;
        resultado.appendChild(item);
    });

    lista.innerHTML = '';
    lista.appendChild(resultado);
}

// Función para generar las estrellas según la puntuación
function generateStars(score) {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
        stars.push(`<span class="fa fa-star${i <= score ? ' checked' : ''}"></span>`);
    }
    return stars.join('');
}

// Función para obtener información detallada de una película
function obtenerInformacion(pelicula) {
    const titulo = pelicula.title;
    const generos = pelicula.genres.map(genero => genero.name).join(', ');
    const descripcion = pelicula.overview;

    // Obtén el elemento del offcanvas por su ID
    let offcanvas = document.getElementById("offcanvas");

    // Obtén el año de estreno de la película
    let fechaEstreno = pelicula.release_date;
    let fecha = new Date(fechaEstreno);
    let anio = fecha.getFullYear();

    // Configura el contenido del offcanvas
    offcanvas.innerHTML = `
        <div class="offcanvas offcanvas-custom">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasTopLabel">${titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        </div>

        <div class="offcanvas-body">
            <p>${descripcion}</p>
            <hr>
            <p>${generos}</p>
           
            <div class="dropdown-center">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Más
                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item">Year: ${anio}</li>
                    <li class="dropdown-item">Runtime: ${pelicula.runtime} mins</li>
                    <li class="dropdown-item">Budget: $ ${pelicula.budget}</li>
                    <li class="dropdown-item">Revenue: $ ${pelicula.revenue}</li>
                </ul>
            </div>
        </div>
    `;
    // Añadí estilos personalizados para el fondo del offcanvas
    offcanvas.style.backgroundColor = '#FADCD6'

    // Muestra el offcanvas
    let myOffcanvas = new bootstrap.Offcanvas(offcanvas);
    myOffcanvas.show();
}

// Evento de clic en la lista de películas
const lista = document.getElementById('lista');
lista.addEventListener("click", function (event) {
    // Verificar que el clic ocurrió en un elemento de la lista
    if (event.target.tagName === 'LI') {
        const tituloPelicula = event.target.querySelector('strong').textContent;
        const peliculaSeleccionada = peliculas.find(pelicula => pelicula.title === tituloPelicula);
        if (peliculaSeleccionada) {
            // Mostrar información detallada de la película seleccionada
            obtenerInformacion(peliculaSeleccionada);
        }
    }
});
