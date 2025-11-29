/**
 * Cartas de Amor - Script Principal
 * Carga dinámicamente las cartas desde el JSON y las muestra en el grid
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarCartas();
});

/**
 * Carga las cartas desde el archivo JSON
 */
async function cargarCartas() {
    const container = document.getElementById('cartas-container');
    
    // Mostrar estado de carga
    container.innerHTML = '<div class="loading">Cargando cartas de amor</div>';
    
    try {
        const response = await fetch('data/cartas.json');
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de cartas');
        }
        
        const data = await response.json();
        
        if (!data.cartas || data.cartas.length === 0) {
            mostrarEstadoVacio(container);
            return;
        }
        
        renderizarCartas(data.cartas, data.configuracion, container);
        
    } catch (error) {
        console.error('Error al cargar las cartas:', error);
        container.innerHTML = `
            <div class="empty-state">
                <h3>💔 Oops...</h3>
                <p>No pudimos cargar las cartas. Por favor, intenta de nuevo.</p>
            </div>
        `;
    }
}

/**
 * Renderiza las cartas en el contenedor
 * @param {Array} cartas - Array de objetos carta
 * @param {Object} config - Configuración global (imágenes por defecto)
 * @param {HTMLElement} container - Contenedor donde renderizar
 */
function renderizarCartas(cartas, config, container) {
    const imagenPorDefecto = config?.imagenPorDefecto || 'images/sobre-cerrado.png';
    const imagenHover = config?.imagenHover || 'images/sobre-abierto.png';
    
    container.innerHTML = '';
    
    cartas.forEach((carta, index) => {
        const imagenCarta = carta.imagen && carta.imagen.trim() !== '' 
            ? carta.imagen 
            : imagenPorDefecto;
        
        const imagenCartaHover = carta.imagenHover && carta.imagenHover.trim() !== ''
            ? carta.imagenHover
            : imagenHover;
        
        const cartaElement = document.createElement('a');
        cartaElement.href = carta.url || '#';
        cartaElement.className = 'carta';
        cartaElement.style.animationDelay = `${index * 0.1}s`;
        
        cartaElement.innerHTML = `
            <div class="carta-imagen-container">
                <img 
                    src="${imagenCarta}" 
                    alt="${carta.titulo || 'Carta de amor'}" 
                    class="carta-imagen"
                    data-src-default="${imagenCarta}"
                    data-src-hover="${imagenCartaHover}"
                >
            </div>
            <div class="carta-contenido">
                <h3 class="carta-titulo">${carta.titulo || 'Carta de Amor'}</h3>
                <p class="carta-descripcion">${carta.descripcion || ''}</p>
                <span class="carta-boton">Abrir carta 💌</span>
            </div>
        `;
        
        // Agregar efectos de hover para cambiar la imagen del sobre
        const imagen = cartaElement.querySelector('.carta-imagen');
        
        cartaElement.addEventListener('mouseenter', () => {
            imagen.src = imagenCartaHover;
        });
        
        cartaElement.addEventListener('mouseleave', () => {
            imagen.src = imagenCarta;
        });
        
        // Efecto táctil para móviles
        cartaElement.addEventListener('touchstart', () => {
            imagen.src = imagenCartaHover;
        });
        
        cartaElement.addEventListener('touchend', () => {
            setTimeout(() => {
                imagen.src = imagenCarta;
            }, 300);
        });
        
        container.appendChild(cartaElement);
    });
}

/**
 * Muestra un estado vacío cuando no hay cartas
 * @param {HTMLElement} container - Contenedor donde mostrar
 */
function mostrarEstadoVacio(container) {
    container.innerHTML = `
        <div class="empty-state">
            <h3>💝 Sin cartas aún</h3>
            <p>Pronto habrá cartas de amor aquí para ti...</p>
        </div>
    `;
}
