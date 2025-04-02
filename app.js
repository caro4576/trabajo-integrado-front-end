const API_URL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;

// Elementos del DOM
const characterList = document.getElementById("character-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const statusFilter = document.getElementById("status-filter");
const modal = document.getElementById("character-modal");
const modalDetails = document.getElementById("modal-details");
const closeModal = document.querySelector(".close");

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
    }
}

// Mostrar personajes en la página
function displayCharacters(characters) {
    characterList.innerHTML = "";
    characters.forEach(character => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");
        characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>Estado: ${character.status}</p>
        `;
        characterCard.addEventListener("click", () => showCharacterDetails(character));
        characterList.appendChild(characterCard);
    });
}

// Actualizar los botones de paginación
function updatePagination(info) {
    prevBtn.disabled = !info.prev;
    nextBtn.disabled = !info.next;
}

// Mostrar detalles del personaje en un modal
function showCharacterDetails(character) {
    modalDetails.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
        <p>Especie: ${character.species}</p>
        <p>Género: ${character.gender}</p>
        <p>Origen: ${character.origin.name}</p>
    `;
    modal.classList.remove("hidden");
}

// Cerrar modal
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

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
