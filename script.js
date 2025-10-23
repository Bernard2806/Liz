// --- Configuración (igual que antes) ---
const textoCompleto = "Te amo Liz, y gracias";
const velocidadEscritura = 150; // Milisegundos por letra
const pdfURL = "carta.pdf"; // IMPORTANTE: El nombre de tu archivo PDF
// ---------------------

// Obtenemos los elementos del HTML
const elementoTexto = document.getElementById("texto-animado");
const visorPdf = document.getElementById("visor-pdf"); // <-- NUEVO

let indice = 0;

function escribirTexto() {
    if (indice < textoCompleto.length) {
        // Añadimos la siguiente letra al H1
        elementoTexto.textContent += textoCompleto.charAt(indice);
        indice++;
        
        // Volvemos a llamar a esta función
        setTimeout(escribirTexto, velocidadEscritura);
    } else {
        // --- Animación Terminada (MODIFICADO) ---
        
        // 1. Ocultamos el cursor parpadeante
        elementoTexto.style.borderRight = "none";
        
        // 2. Esperamos un momento (1 segundo)
        setTimeout(() => {
            // 3. Ocultamos el texto "Te amo..."
            elementoTexto.style.display = "none";
            
            // 4. Asignamos la URL del PDF al visor
            visorPdf.src = pdfURL;
            
            // 5. Mostramos el visor del PDF
            visorPdf.style.display = "block";
            
        }, 1000); // 1000ms = 1 segundo de espera
    }
}

// Empezamos la animación cuando la página carga
document.addEventListener("DOMContentLoaded", escribirTexto);