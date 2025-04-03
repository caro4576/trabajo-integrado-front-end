const URL_API = "https://rickandmortyapi.com/api/character";
let paginaActual = 1;

// Elementos del DOM
const listaPersonajes = document.getElementById("lista-personajes");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const filtroEstado = document.getElementById("filtro-estado");
const detallesModal = document.getElementById("detalles-modal");

// Modal de Bootstrap
const modalPersonaje = new bootstrap.Modal(document.getElementById("modal-personaje"));

// Obtener personajes
async function obtenerPersonajes(pagina = 1, estado = "") {
    let url = `${URL_API}/?page=${pagina}`;
    if (estado) url += `&status=${estado}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        mostrarPersonajes(datos.results);
        actualizarPaginacion(datos.info);
    } catch (error) {
        console.error("Error al obtener personajes:", error);
        listaPersonajes.innerHTML = "<p class='text-danger text-center'>No se pudieron cargar los personajes. Inténtalo más tarde.</p>";
    }
}

// Mostrar personajes con tarjetas Bootstrap
function mostrarPersonajes(personajes) {
    listaPersonajes.innerHTML = "";
    personajes.forEach(personaje => {
        const tarjetaPersonaje = document.createElement("div");
        tarjetaPersonaje.classList.add("col-md-4", "col-lg-3");

        tarjetaPersonaje.innerHTML = `
            <div class="card bg-secondary text-light shadow-lg" style="cursor: pointer;">
                <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${personaje.name}</h5>
                    <p class="card-text">Estado: ${personaje.status}</p>
                </div>
            </div>
        `;

        // Agregar evento de clic en la tarjeta para mostrar detalles
        tarjetaPersonaje.addEventListener("click", () => mostrarDetallesPersonaje(personaje));

        listaPersonajes.appendChild(tarjetaPersonaje);
    });
}

// Actualizar los botones de paginación
function actualizarPaginacion(info) {
    btnAnterior.disabled = !info.prev;
    btnSiguiente.disabled = !info.next;
}

// Mostrar detalles del personaje en el modal
function mostrarDetallesPersonaje(personaje) {
    detallesModal.innerHTML = `
        <div class="text-center">
            <img src="${personaje.image}" class="img-fluid rounded border border-info" alt="${personaje.name}">
            <h2 class="mt-3 text-warning">${personaje.name}</h2>
            <p><strong>Especie:</strong> ${personaje.species}</p>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <p><strong>Origen:</strong> ${personaje.origin.name}</p>
            <p><strong>Ubicación actual:</strong> ${personaje.location.name}</p>
            <p><strong>Tipo:</strong> ${personaje.type ? personaje.type : "Desconocido"}</p>
            <p><strong>Apariciones en episodios:</strong> ${personaje.episode.length}</p>
        </div>
    `;
    modalPersonaje.show();
}

// Manejar eventos
btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        obtenerPersonajes(paginaActual, filtroEstado.value);
    }
});

btnSiguiente.addEventListener("click", () => {
    paginaActual++;
    obtenerPersonajes(paginaActual, filtroEstado.value);
});

filtroEstado.addEventListener("change", () => {
    paginaActual = 1;
    obtenerPersonajes(paginaActual, filtroEstado.value);
});

// Cargar personajes al inicio
obtenerPersonajes();

