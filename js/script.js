let contadorBombas = 0; // Contador de bombas restantes
let tiempo = 0; // Tiempo del cronómetro en milisegundos
let cronometroActivo = false; // Bandera para verificar si el cronómetro ha comenzado
let intervaloCronometro; // Referencia al intervalo del cronómetro
let juegoTerminado = false; //Esto funciona para definir cuando el juego termina
let clickInicial = true; // Bandera para verificar si es el primer clic
let filas, columnas, bombas;


// Evento que se ejecuta cuando se envía el formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtiene el valor seleccionado en el menú de dificultad
    const dificultad = document.getElementById("dificultad").value;

    // Asigna valores según la dificultad
    switch (dificultad) {
        case "facil":
            filas = 5;
            columnas = 5;
            bombas = 5;
            break;
        case "medio":
            filas = 8;
            columnas = 8;
            bombas = 15;
            break;
        case "dificil":
            filas = 10;
            columnas = 10;
            bombas = 25;
            break;
    }

    // Resetea el contador de bombas y el cronómetro
    contadorBombas = bombas;
    document.getElementById("contadorBombas").textContent = contadorBombas;

    // Genera el tablero con los parámetros definidos
    generarTablero(filas, columnas, bombas);
    clickInicial = true; // Reinicia la bandera para el primer click
    juegoTerminado = false; // Reinicia la bandera de juego terminado
});

function generarTablero(filas, columnas, bombas) {

    juegoTerminado = false;
    let tablero = document.getElementById("tablero");
    tablero.innerHTML = ""; // Limpia el contenido del tablero

    // Resetea el cronómetro
    tiempo = 0;
    document.getElementById("cronometro").textContent = "00:00:00"; // Reinicia el cronómetro en formato mm:ss:ms

    // Resetea la variable cronometroActivo y detiene cualquier intervalo previo
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro); // Detiene el cronómetro actual si está en ejecución
    }
    cronometroActivo = false; // Resetea la variable que nos dice si el cronometro está activo

    //Establece dinámicamente el tamaño del grid en CSS desde JS
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 50px)`;
    tablero.style.gridTemplateRows = `repeat(${filas}, 50px)`;

    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            var casilla = document.createElement("div");
            casilla.classList.add("casilla", "no-revelada"); // Añade la clase casilla y no-revelada a cada casilla
            casilla.setAttribute("data-x", i);
            casilla.setAttribute("data-y", j);
            casilla.textContent = '0';
            tablero.appendChild(casilla);
        }
    }
    generarBombas(bombas, filas, columnas); // Genera las bombas en el tablero
    contarBombasAlrededor(filas, columnas); // Cuenta las bombas alrededor de cada casilla
    agregarEventosClick(); // Añade los eventos de click a cada casilla
}

function agregarEventosClick() {
    if (juegoTerminado) {
        mostrarModal("🏁 <strong>El juego ha terminado</strong><br>¡Buen intento!<br><br>🔄 Haz clic en <strong>Generar Tablero</strong> para jugar otra vez.");
        return; // Bloquear si ya terminó el juego
    } else {
        document.querySelectorAll('.casilla').forEach(casilla => {
            // Click izquierdo - Revelar casilla
            casilla.addEventListener('click', (e) => {
                revelarCasilla(e.target); // tu función para mostrar el contenido
            });

            // Click derecho - Colocar o quitar bandera
            casilla.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // evita el menú del navegador
                colocarBandera(e.target); // tu función para poner/quitar bandera
            });
        });
    }
}

function contarBombas() {

    var contador = 0; // Inicializa el contador de bombas
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            var casilla = document.querySelector(`.casilla[data-x="${i}"][data-y="${j}"]`); // Selecciona la casilla correspondiente a las coordenadas generadas
            if (casilla.textContent == 'B' && casilla.classList.contains("no-revelada")) { // Si la casilla no tiene una bomba y no ha sido revelada
                contador += 1;
            }
        }
    }
    return contador; // Devuelve el número de bombas
}

function generarBombas(bombas, filas, columnas) {

    var colocadas = contarBombas();
    while (colocadas < bombas) {
        var x = Math.floor(Math.random() * filas);
        var y = Math.floor(Math.random() * columnas);
        var casilla = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`); // Selecciona la casilla correspondiente a las coordenadas generadas
        if (casilla.textContent != 'B' && casilla.classList.contains("no-revelada")) { // Si la casilla no tiene una bomba y no ha sido revelada  
            // Si la casilla no tiene una bomba se coloca
            casilla.textContent = 'B';
            if (casilla.classList.contains("numero")) {
                casilla.classList.remove("numero"); // Elimina la clase numero de la casilla
            }
            casilla.classList.add("bomba"); // Se le añade la clase bomba a la casilla
            casilla.setAttribute("data-valor-real", '💣');
            colocadas++;

        }
    }
}


function contarBombasAlrededor(filas, columnas) {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            var casilla = document.querySelector(`.casilla[data-x="${i}"][data-y="${j}"]`); // Selecciona la casilla correspondiente a las coordenadas generadas
            if (casilla.textContent != 'B' && casilla.classList.contains("no-revelada")) { // Si la casilla no tiene una bomba y no ha sido revelada
                var contador = 0;
                for (var x = i - 1; x <= i + 1; x++) {  // Recorre las casillas alrededor de la casilla seleccionada
                    for (var y = j - 1; y <= j + 1; y++) {
                        if (x >= 0 && y >= 0 && x < filas && y < columnas) {
                            var casillaAlrededor = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`); // Selecciona la casilla correspondiente a las coordenadas generadas
                            if (casillaAlrededor.textContent == 'B') {
                                contador++;
                            }
                        }
                    }
                }
                casilla.textContent = contador === 0 ? '' : contador;
                casilla.classList.add("numero"); // Se le añade la clase numero a la casilla
                casilla.setAttribute("data-valor-real", contador);
            }
            if (casilla.textContent != 'B' && casilla.classList.contains("revelada")) {
                var contador = 0;
                for (var x = i - 1; x <= i + 1; x++) {  // Recorre las casillas alrededor de la casilla seleccionada
                    for (var y = j - 1; y <= j + 1; y++) {
                        if (x >= 0 && y >= 0 && x < filas && y < columnas) {
                            var casillaAlrededor = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`); // Selecciona la casilla correspondiente a las coordenadas generadas
                            if (casillaAlrededor.textContent == 'B') {
                                contador++;
                            }
                        }
                    }
                }
                casilla.textContent = contador === 0 ? '' : contador;
                casilla.classList.add("numero"); // Se le añade la clase numero a la casilla
                casilla.setAttribute("data-valor-real", contador);
            }
        }
    }
}

function limpiarBombas(filas, columnas) {
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            let casilla = document.querySelector(`.casilla[data-x="${i}"][data-y="${j}"]`);
            if (casilla) {
                if (casilla.classList.contains("bomba")) {
                    casilla.classList.remove("bomba");
                    casilla.textContent = '';
                }
                casilla.classList.remove("numero");
                casilla.setAttribute("data-valor-real", '');
            }
        }
    }
}

function revelarCasilla(casilla) {
    if (juegoTerminado) return; // Valida si el juego terminó
    if (casilla.classList.contains("bandera")) return; // Bloquea clic si hay bandera

    var x = parseInt(casilla.getAttribute("data-x"));
    var y = parseInt(casilla.getAttribute("data-y"));

    // Iniciar cronómetro solo una vez al primer clic que revele una casilla
    if (!cronometroActivo) {
        cronometroActivo = true;
        intervaloCronometro = setInterval(function () {
            tiempo += 10; // Aumenta de 10 en 10 milisegundos

            const minutos = Math.floor(tiempo / 60000);
            const segundos = Math.floor((tiempo % 60000) / 1000);
            const milisegundos = Math.floor((tiempo % 1000) / 10); // Solo 2 dígitos

            const formato =
                String(minutos).padStart(2, '0') + ':' +
                String(segundos).padStart(2, '0') + ':' +
                String(milisegundos).padStart(2, '0');

            document.getElementById("cronometro").textContent = formato;
        }, 10);
    }

    if (clickInicial) {
        let valorReal;
        let casillaActualizada;
        do {
            limpiarBombas(filas, columnas); // <--- Limpia antes de regenerar
            generarBombas(bombas, filas, columnas);
            contarBombasAlrededor(filas, columnas);
            casillaActualizada = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`);
            valorReal = casillaActualizada.getAttribute("data-valor-real");
        } while (valorReal !== '0');

        revelarCerosYAdyacentes(x, y, filas, columnas);
        clickInicial = false;
        return;
    }


    var casillaRevelada = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`); // Selecciona la casilla correspondiente

    if (casillaRevelada.classList.contains("no-revelada")) {
        const valorReal = casillaRevelada.getAttribute("data-valor-real");

        if (valorReal == '💣') { // Si la casilla es una bomba
            juegoTerminado = true; // Define el juego como terminado
            var casillas = document.querySelectorAll('.casilla');
            for (var i = 0; i < casillas.length; i++) {
                var c = casillas[i];
                const valor = c.getAttribute("data-valor-real");
                if (valor == '💣') {
                    c.classList.remove("no-revelada");
                    c.classList.add("revelada");
                    c.textContent = '💣';
                }
            }

            casillaRevelada.classList.remove("no-revelada");
            casillaRevelada.textContent = '💣';
            casillaRevelada.classList.add("revelada");
            clearInterval(intervaloCronometro);
            setTimeout(function () {
                mostrarModal("💥 <strong>¡BOOM!</strong><br>Has perdido la partida.<br><br>😢 Inténtalo de nuevo haciendo clic en <strong>Generar Tablero</strong> para jugar otra vez.");
            }, 200);
        } else if (valorReal == '' || valorReal == '0') {
            revelarCerosYAdyacentes(x, y, filas, columnas);
        } else {
            casillaRevelada.classList.remove("no-revelada");
            casillaRevelada.classList.add("revelada");
            if (valorReal) casillaRevelada.textContent = valorReal;
        }
    }

    verificarVictoria(); // Verificar si ganó
}



function revelarCerosYAdyacentes(x, y, filas, columnas) {
    const visitadas = new Set();

    function expandir(x, y) {
        if (x < 0 || y < 0 || x >= filas || y >= columnas) return;

        const key = `${x},${y}`;
        if (visitadas.has(key)) return;
        visitadas.add(key);

        const casilla = document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`);
        if (!casilla || casilla.classList.contains("revelada") || casilla.classList.contains("bandera")) return;

        const valor = casilla.getAttribute("data-valor-real");
        casilla.classList.remove("no-revelada");
        casilla.classList.add("revelada");

        if (valor && valor !== "0" && valor !== '') {
            // Si es número (1..8) o cualquier valor no cero, mostrarlo y detener expansión aquí
            casilla.textContent = valor;
            casilla.classList.add("numero");
            return;
        }

        casilla.textContent = '';

        // Expandir vecinos
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && ny >= 0 && nx < filas && ny < columnas) {
                    const vecina = document.querySelector(`.casilla[data-x="${nx}"][data-y="${ny}"]`);
                    if (!vecina || vecina.classList.contains("revelada") || vecina.classList.contains("bandera")) continue;

                    const valorVecina = vecina.getAttribute("data-valor-real");

                    if (valorVecina && valorVecina !== "0" && valorVecina !== '') {
                        vecina.classList.remove("no-revelada");
                        vecina.classList.add("revelada");
                        vecina.textContent = valorVecina;
                        vecina.classList.add("numero");
                        // No expandir más aquí
                    } else {
                        // Revelar casilla vecina cero o vacía y expandir recursivamente
                        expandir(nx, ny);
                    }
                }
            }
        }
    }

    expandir(x, y);
}


function colocarBandera(casilla) {
    if (clickInicial) {
        mostrarModal("⚠️ <strong>Espera un momento:</strong><br>No puedes colocar banderas en el primer clic. ¡Primero descubre una casilla!");
        return;
    }

    if (juegoTerminado) return;

    const tieneBandera = casilla.classList.contains("bandera");

    // ✅ Quitar bandera siempre que esté puesta
    if (tieneBandera) {
        casilla.classList.remove("bandera");
        contadorBombas++;

        const valorReal = casilla.getAttribute("data-valor-real") || "";
        casilla.textContent = valorReal;

        document.getElementById("contadorBombas").textContent = contadorBombas;
        return;
    }

    // ⛔ Solo permitir colocar si está no revelada Y hay banderas disponibles
    const esNoRevelada = casilla.classList.contains("no-revelada");
    if (!esNoRevelada || contadorBombas <= 0) return;

    // ✅ Colocar bandera
    casilla.classList.add("bandera");
    casilla.textContent = '🚩';
    contadorBombas--;

    document.getElementById("contadorBombas").textContent = contadorBombas;
}

function verificarVictoria() {
    // Obtiene todas las casillas del tablero
    const casillas = document.querySelectorAll(".casilla");

    // Asume que el jugador ha ganado, a menos que se encuentre lo contrario
    let ganaste = true;

    // Recorre cada casilla para verificar si queda alguna no revelada que no sea bomba
    casillas.forEach(casilla => {
        if (
            !casilla.classList.contains("bomba") &&   // Si NO es una bomba
            casilla.classList.contains("no-revelada") // Y aún no ha sido revelada
        ) {
            ganaste = false; // El jugador aún no ha ganado
        }
    });
    // Si todas las casillas sin bomba están reveladas, se declara la victoria
    if (ganaste) {
        juegoTerminado = true; // Define el juego como terminado
        clearInterval(intervaloCronometro); // Detiene el cronómetro
        mostrarModal("🎉 <strong>¡Felicidades! Has ganado.</strong><br>Se generará un nuevo tablero para volver a jugar.");
    }
}

function mostrarRegistro() { // Muestra el formulario de registro y oculta el de inicio de sesión
    document.getElementById("formularioRegistro").style.display = "block";
    document.getElementById("formularioLogin").style.display = "none";
}

function mostrarLogin() { // Muestra el formulario de inicio de sesión y oculta el de registro
    document.getElementById("formularioRegistro").style.display = "none";
    document.getElementById("formularioLogin").style.display = "block";
}

function validarDatos() {// Valida los datos del formulario de registro
    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const contrasena = document.getElementById("contrasenaRegistro").value.trim();

    const regexCedula = /^[0-9]{9}$/;
    const regexNombre = /^[A-Za-z\s]+$/;
    const regexCorreo = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

    if (!regexCedula.test(cedula)) {
        alert("La cédula debe contener exactamente 9 dígitos.");
        return false;
    }
    if (!regexNombre.test(nombre)) {
        alert("El nombre solo debe contener letras.");
        return false;
    }
    if (!regexCorreo.test(correo)) {
        alert("El correo no es válido.");
        return false;
    }
    if (contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }
    return true;
}

function validarLogin() { // Valida los datos del formulario de inicio de sesión
    const correo = document.getElementById("correoLogin").value.trim();
    const contrasena = document.getElementById("contrasenaLogin").value.trim();
    const regexCorreo = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

    if (!regexCorreo.test(correo)) {
        alert("Correo no válido.");
        return false;
    }
    if (contrasena.length < 6) {
        alert("Contraseña mínima de 6 caracteres.");
        return false;
    }
    return true;
}


// Obtener elementos del DOM
const modal = document.getElementById("modalReglas");
const btnAbrir = document.getElementById("reglasBtn");
const btnCerrar = document.querySelector(".cerrar");

// Abrir el modal
btnAbrir.onclick = () => {
    modal.style.display = "block";
}

// Cerrar al hacer clic en la X
btnCerrar.onclick = () => {
    modal.style.display = "none";
}

// Cerrar al hacer clic fuera del contenido
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//***************Modal para JS */
function mostrarModal(mensaje) {
    const modal = document.getElementById("modalMensajes");
    const texto = document.getElementById("textoMensaje");
    const cerrar = document.getElementById("cerrarMensaje");

    texto.innerHTML = mensaje; // Puedes usar HTML si necesitas íconos o negritas
    modal.style.display = "block";

    cerrar.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}