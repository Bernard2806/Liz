// ============================================
// --- CONFIGURACIÓN ---
// ============================================
const textoCompleto = "Te amo Liz";
const velocidadEscritura = 150; // Milisegundos por letra

// Contraseña del candado (4 dígitos)
const CLAVE_CANDADO = "2349";

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

// ============================================
// PARTÍCULAS FLOTANTES (CORAZONES)
// ============================================

let particulasInterval = null;

function crearParticulasFlotantes() {
    const container = document.createElement('div');
    container.className = 'particulas-container';
    document.body.appendChild(container);
    
    // Crear corazones continuamente
    particulasInterval = setInterval(() => {
        crearCorazonFlotante(container);
    }, 800);
    
    // Crear algunos corazones iniciales
    for (let i = 0; i < 5; i++) {
        setTimeout(() => crearCorazonFlotante(container), i * 300);
    }
    
    // Limpiar el intervalo cuando la página se descarga
    window.addEventListener('beforeunload', () => {
        if (particulasInterval) {
            clearInterval(particulasInterval);
        }
    });
}

function crearCorazonFlotante(container) {
    const corazon = document.createElement('span');
    corazon.className = 'corazon-flotante';
    corazon.textContent = '❤';
    
    // Posición horizontal aleatoria
    corazon.style.left = Math.random() * 100 + '%';
    
    // Tamaño aleatorio
    const size = 0.8 + Math.random() * 1.2;
    corazon.style.fontSize = size + 'rem';
    
    // Duración aleatoria
    const duration = 8 + Math.random() * 12;
    corazon.style.animationDuration = duration + 's';
    
    // Opacidad aleatoria
    corazon.style.opacity = 0.15 + Math.random() * 0.25;
    
    container.appendChild(corazon);
    
    // Eliminar después de la animación
    setTimeout(() => {
        corazon.remove();
    }, duration * 1000);
}

// ============================================
// EFECTOS DE DESBLOQUEO
// ============================================

function crearParticulasExito() {
    const emojis = ['❤', '💕', '💖', '✨', '💗', '💝'];
    const candado = document.querySelector('.candado');
    const rect = candado.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particula = document.createElement('span');
            particula.className = 'particula-exito';
            particula.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Posición inicial en el centro del candado
            particula.style.left = centerX + 'px';
            particula.style.top = centerY + 'px';
            
            // Dirección aleatoria usando transform inline
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 100;
            
            // Aplicar animación personalizada con keyframes inline
            particula.style.animation = 'none';
            particula.animate([
                { opacity: 1, transform: 'translate(-50%, -50%) scale(0) rotate(0deg)' },
                { opacity: 1, transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5) rotate(180deg)` },
                { opacity: 0, transform: `translate(calc(-50% + ${tx * 1.5}px), calc(-50% + ${ty * 1.5}px)) scale(0.5) rotate(360deg)` }
            ], {
                duration: 1500,
                easing: 'ease-out',
                fill: 'forwards'
            });
            
            document.body.appendChild(particula);
            
            setTimeout(() => particula.remove(), 1500);
        }, i * 50);
    }
}

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
    
    // Crear partículas de éxito
    crearParticulasExito();
    
    // Añadir efecto al fondo
    document.body.classList.add('desbloqueado');
    
    // Añadir efecto de disolución al candado
    setTimeout(() => {
        const candado = document.querySelector('.candado');
        candado.classList.add('disolviendose');
    }, 500);
    
    // Redirigir después de la animación
    setTimeout(() => {
        window.location.href = URL_DESTINO;
    }, 2500);
}

// Empezamos la animación cuando la página carga
document.addEventListener("DOMContentLoaded", () => {
    crearParticulasFlotantes();
    escribirTexto();
});