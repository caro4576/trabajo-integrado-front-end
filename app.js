const API_URL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;

// Elementos del DOM
const characterList = document.getElementById("character-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const statusFilter = document.getElementById("status-filter");
const modalDetails = document.getElementById("modal-details");

// Modal Bootstrap
const characterModal = new bootstrap.Modal(document.getElementById("character-modal"));

// Obtener personajes
async function fetchCharacters(page = 1, status = "") {
    let url = `${API_URL}/?page=${page}`;
    if (status) url += `&status=${status}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayCharacters(data.results);
        updatePagination(data.info);
    } catch (error) {
        console.error("Error al obtener personajes:", error);
        characterList.innerHTML = "<p class='text-danger text-center'>No se pudieron cargar los personajes. Inténtalo más tarde.</p>";
    }
}

// Mostrar personajes con tarjetas Bootstrap (sin botón "Ver detalles")
function displayCharacters(characters) {
    characterList.innerHTML = "";
    characters.forEach(character => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("col-md-4", "col-lg-3");

        characterCard.innerHTML = `
            <div class="card bg-secondary text-light shadow-lg" style="cursor: pointer;">
                <img src="${character.image}" class="card-img-top" alt="${character.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${character.name}</h5>
                    <p class="card-text">Estado: ${character.status}</p>
                </div>
            </div>
        `;

        // Agregar evento de clic en la tarjeta para mostrar detalles
        characterCard.addEventListener("click", () => showCharacterDetails(character));

        characterList.appendChild(characterCard);
    });
}

// Actualizar los botones de paginación
function updatePagination(info) {
    prevBtn.disabled = !info.prev;
    nextBtn.disabled = !info.next;
}

// Mostrar detalles del personaje en el modal Bootstrap
// Mostrar detalles del personaje en el modal Bootstrap
function showCharacterDetails(character) {
    modalDetails.innerHTML = `
        <div class="text-center">
            <img src="${character.image}" class="img-fluid rounded" alt="${character.name}">
            <h2 class="mt-3">${character.name}</h2>
            <p><strong>Especie:</strong> ${character.species}</p>
            <p><strong>Género:</strong> ${character.gender}</p>
            <p><strong>Origen:</strong> ${character.origin.name}</p>
        </div>
    `;
    characterModal.show();
}


// Manejar eventos
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCharacters(currentPage, statusFilter.value);
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchCharacters(currentPage, statusFilter.value);
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    fetchCharacters(currentPage, statusFilter.value);
});

// Cargar los personajes al iniciar
fetchCharacters();
