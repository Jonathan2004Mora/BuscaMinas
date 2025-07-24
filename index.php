<!DOCTYPE html>
<html lang="en">
<head>
    <link type="image/png" sizes="96x96" rel="icon" href="images/icons8-minesweeper-96.png">
    <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
   <meta name="description" content="Busca Minas-Minesweeper."> 
   <meta name="keywords" content="HTML, PHP, CSS, Bootstrap, diseño web, metas">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
  
   <meta name="author" content="Jonathan Mora Castro, Jairo"> 
    <title>Index</title>
</head>
<body>
    <div class="container py-5">
        <img src="images/buscaminas.png" alt="imagen logo de buscaminas" class="img-fluid mb-4" style="width: 200px; height: 200px; display: block; margin: auto;">
        <h1 class="text-center mb-4">Bienvenido a Busca Minas - Minesweeper</h1>

        <div class="text-center mb-4">
        <button class="btn btn-success" onclick="mostrarRegistro()">Registrarse</button>
        <button class="btn btn-primary" onclick="mostrarLogin()">Iniciar Sesión</button>
        </div>

        <div class="card shadow p-4">
        <h3 class="h3">Datos</h3> <br>

        <!-- Formulario de Registro -->
        <div id="formularioRegistro">
            <form action="http://localhost/ProyectoPrograIVNewable/backend.php" method="POST" onsubmit="return validarDatos()">
            <div class="form-group">
                <label>Cédula:</label>
                <input id="cedula" class="form-control" type="text" name="id" maxlength="9">
            </div>
            <div class="form-group">
                <label>Nombre:</label>
                <input id="nombre" class="form-control" type="text" name="nombre" required>
            </div>
            <div class="form-group">
                <label>Correo electrónico:</label>
                <input id="correoRegistro" class="form-control" type="email" name="correoRegistro" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input id="contrasenaRegistro" class="form-control" type="password" name="contrasenaRegistro">
            </div>
            <button type="submit" class="btn btn-success" name="registrarse">Registrarse</button>
            </form>
        </div>

        <!-- Formulario de Inicio de Sesión -->
        <div id="formularioLogin" style="display: none;">
            <form action="http://localhost/ProyectoPrograIVNewable/backend.php" method="POST" onsubmit="return validarLogin()">
            <div class="form-group">
                <label>Correo electrónico:</label>
                <input id="correoLogin" class="form-control" type="email" name="correoLogin" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input id="contrasenaLogin" class="form-control" type="password" name="contrasenaLogin" required>
            </div>
            <button type="submit" class="btn btn-primary" name="iniciarSesion">Iniciar Sesión</button>
            </form>
        </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossorigin="anonymous"></script>
    <script src="js/script.js"></script>
</body>
</html>