const mensajes = [
    "¿Sabías que haces que todo se vea más lindo? ",
    "Tu sonrisa hace que todo valga la pena. ",
    "Eres mi foto favorita en el muro. ",
    "Esto es lindo, pero tú eres más. ❤️",
    "¿Te he dicho que eres increíble hoy? "
];

function getRandomMessage() {
    const index = Math.floor(Math.random() * mensajes.length);
    return mensajes[index];
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function saveToLocalStorage(dataUrl, type) {
    const savedMedia = JSON.parse(localStorage.getItem('mediaWall')) || [];
    savedMedia.push({ dataUrl, type });
    localStorage.setItem('mediaWall', JSON.stringify(savedMedia));
}

function loadFromLocalStorage() {
    const savedMedia = JSON.parse(localStorage.getItem('mediaWall')) || [];
    const mediaWall = document.getElementById('mediaWall');

    // Limpia el muro antes de cargar los elementos guardados
    mediaWall.innerHTML = "";

    savedMedia.forEach((media, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');

        if (media.type.startsWith("image")) {
            const img = document.createElement('img');
            img.src = media.dataUrl;
            mediaItem.appendChild(img);
        } else if (media.type.startsWith("video")) {
            const video = document.createElement('video');
            video.src = media.dataUrl;
            video.controls = true;
            mediaItem.appendChild(video);
        }

        const mensaje = document.createElement('p');
        mensaje.textContent = getRandomMessage();
        mensaje.classList.add('coqueteo');
        mediaItem.appendChild(mensaje);

        // Crear el botón de eliminación
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteMedia(index); // Llamar a `deleteMedia` con el índice actual
        mediaItem.appendChild(deleteButton);

        mediaWall.appendChild(mediaItem);
    });
}

function deleteMedia(index) {
    const savedMedia = JSON.parse(localStorage.getItem('mediaWall')) || [];
    
    savedMedia.splice(index, 1);
    
    localStorage.setItem('mediaWall', JSON.stringify(savedMedia));
    
    loadFromLocalStorage();
}


async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const mediaWall = document.getElementById('mediaWall');
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecciona una imagen o un video.");
        return;
    }

    const mediaItem = document.createElement('div');
    mediaItem.classList.add('media-item');

    const base64 = await toBase64(file);
    saveToLocalStorage(base64, file.type);

    if (file.type.startsWith("image")) {
        const img = document.createElement('img');
        img.src = base64;
        mediaItem.appendChild(img);
    } else if (file.type.startsWith("video")) {
        const video = document.createElement('video');
        video.src = base64;
        video.controls = true;
        mediaItem.appendChild(video);
    }

    const mensaje = document.createElement('p');
    mensaje.textContent = getRandomMessage();
    mensaje.classList.add('coqueteo');
    mediaItem.appendChild(mensaje);

    mediaWall.appendChild(mediaItem);
    fileInput.value = ""; // Limpiar el input después de cargar
}

window.onload = loadFromLocalStorage;
