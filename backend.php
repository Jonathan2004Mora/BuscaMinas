<?php
function conectarBD() {
    $mysqli = new mysqli("localhost", "root", "", "BuscaMinas");
    if ($mysqli->connect_errno) {
        die("Error de conexión a la base de datos: " . $mysqli->connect_error);
    }
    $mysqli->set_charset("utf8");
    return $mysqli;
}

function agregarUsuarioBD($identificacion, $nombre, $correo, $contrasena) {
    $mysqli = conectarBD();
    // Generar hash seguro de la contraseña
    $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);
    $query = "INSERT INTO usuarios (id, nombre, correo_electronico, contrasena) VALUES (?, ?, ?, ?)";
    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("isss", $identificacion, $nombre, $correo, $contrasenaHash);
        $stmt->execute();
        $stmt->close();
    }
    $mysqli->close();
}

function obtenerUsuarioBD() {
    $mysqli = conectarBD();
    $query = "SELECT id, nombre, correo_electronico, contrasena FROM usuarios"; 
    $result = $mysqli->query($query);
    $usuarios = [];
    if ($result && $result->num_rows > 0) {   
        while ($row = $result->fetch_assoc()) { //recorrer todas las filas del resultado de una consulta SQL (clave => valor)
            $usuarios[] = $row;
        }
    }
    $mysqli->close();
    return $usuarios;
}

function obtenerUsuarioPorCorreo($correo) {
    $mysqli = conectarBD();
    $query = "SELECT * FROM usuarios WHERE correo_electronico = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $usuario;
}

function verificarExistenciaUsuario($correo, $identificacion) {
    $mysqli = conectarBD();
    $query = "SELECT COUNT(*) as count FROM usuarios WHERE correo_electronico = ? OR id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("si", $correo, $identificacion);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $row['count'] > 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

//  Petición desde formulario de index.php
if (isset($_POST['registrarse'])) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $correo = $_POST['correoRegistro'];
    $contrasena = $_POST['contrasenaRegistro'];
    if (verificarExistenciaUsuario($correo, $id)) {
        echo "<script>alert('Ese usuario ya existe, deberias iniciar sesion.');</script>";
        echo "<script>window.location.href = 'http://127.0.0.1/ProyectoPrograIVNewable/index.php';</script>";
    } else {
        agregarUsuarioBD($id, $nombre, $correo, $contrasena);
        $mensaje = "Usuario registrado correctamente.";
        header("Location: http://127.0.0.1/ProyectoPrograIVNewable/pages/buscaMinas.html?mensaje=" . urlencode($mensaje)); //url es por si el mnesaje lleva espacios
        exit;
    }

    
    
}
// Petición desde formulario de login.php
if (isset($_POST['iniciarSesion'])) {
    $correo = $_POST['correoLogin'];
    $contrasena = $_POST['contrasenaLogin'];
    $usuario = obtenerUsuarioPorCorreo($correo);
    if ($usuario && password_verify($contrasena, $usuario['contrasena'])) {
        header("Location: http://127.0.0.1/ProyectoPrograIVNewable/pages/buscaMinas.html");
        exit;
    } else {
        echo "<script>alert('Usuario o contraseña incorrectos.');</script>";
        echo "<script>window.location.href = 'http://127.0.0.1/ProyectoPrograIVNewable/index.php';</script>";
        exit;
    }
}
}
?>