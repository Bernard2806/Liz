// ============================================
// --- CONFIGURACIÓN ---
// ============================================
const textoCompleto = "Te amo Liz";
const velocidadEscritura = 150; // Milisegundos por letra

// Contraseña del candado (4 dígitos)
const CLAVE_CANDADO = "1234";

// URL a la que redirigir cuando se desbloquea
const URL_DESTINO = "sorpresa.html";

// ============================================

// Obtenemos los elementos del HTML
const elementoTexto = document.getElementById("texto-animado");
const candadoContainer = document.getElementById("candado-container");
const arco = document.getElementById("arco");
const mensajeCandado = document.getElementById("mensaje-candado");

// Estado de las ruedas (4 dígitos, empezando en 0)
let valoresRuedas = [0, 0, 0, 0];

let indice = 0;

function escribirTexto() {
    if (indice < textoCompleto.length) {
        elementoTexto.textContent += textoCompleto.charAt(indice);
        indice++;
        setTimeout(escribirTexto, velocidadEscritura);
    } else {
        // Animación terminada
        elementoTexto.style.borderRight = "none";
        
        setTimeout(() => {
            elementoTexto.style.display = "none";
            candadoContainer.style.display = "flex";
            inicializarCandado();
        }, 1000);
    }
}

function inicializarCandado() {
    const ruedas = document.querySelectorAll('.rueda');
    
    ruedas.forEach((rueda, index) => {
        const btnArriba = rueda.querySelector('.btn-arriba');
        const btnAbajo = rueda.querySelector('.btn-abajo');
        
        btnArriba.addEventListener('click', () => girarRueda(index, 'up'));
        btnAbajo.addEventListener('click', () => girarRueda(index, 'down'));
        
        // Soporte para scroll del mouse
        rueda.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                girarRueda(index, 'up');
            } else {
                girarRueda(index, 'down');
            }
        });
        
        actualizarDisplay(index);
    });
}

function girarRueda(index, direccion) {
    const rueda = document.querySelectorAll('.rueda')[index];
    const display = rueda.querySelector('.numero-display');
    
    // Añadir clase de animación
    display.classList.add(direccion === 'up' ? 'girando-arriba' : 'girando-abajo');
    
    // Actualizar valor
    if (direccion === 'up') {
        valoresRuedas[index] = (valoresRuedas[index] + 1) % 10;
    } else {
        valoresRuedas[index] = (valoresRuedas[index] - 1 + 10) % 10;
    }
    
    // Reproducir sonido de click (simulado con vibración visual)
    rueda.classList.add('click');
    setTimeout(() => rueda.classList.remove('click'), 100);
    
    // Quitar clase de animación y actualizar display
    setTimeout(() => {
        display.classList.remove('girando-arriba', 'girando-abajo');
        actualizarDisplay(index);
        verificarCombinacion();
    }, 150);
}

function actualizarDisplay(index) {
    const rueda = document.querySelectorAll('.rueda')[index];
    const numActual = rueda.querySelector('.num-actual');
    const numArriba = rueda.querySelector('.num-arriba');
    const numAbajo = rueda.querySelector('.num-abajo');
    
    const valor = valoresRuedas[index];
    numActual.textContent = valor;
    numArriba.textContent = (valor - 1 + 10) % 10;
    numAbajo.textContent = (valor + 1) % 10;
}

function verificarCombinacion() {
    const combinacionActual = valoresRuedas.join('');
    
    if (combinacionActual === CLAVE_CANDADO) {
        desbloquearCandado();
    }
}

function desbloquearCandado() {
    // Animación de desbloqueo
    arco.classList.add('desbloqueado');
    mensajeCandado.textContent = "¡Desbloqueado! ❤️";
    mensajeCandado.classList.add('exito');
    
    // Deshabilitar las ruedas
    const botones = document.querySelectorAll('.btn-rueda');
    botones.forEach(btn => btn.disabled = true);
    
    // Redirigir después de la animación
    setTimeout(() => {
        window.location.href = URL_DESTINO;
    }, 2000);
}

// Empezamos la animación cuando la página carga
document.addEventListener("DOMContentLoaded", escribirTexto);