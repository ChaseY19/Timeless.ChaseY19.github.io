<?php
// Conexión DB
include("conexion.php");

// Verifica envío
if (isset($_POST["send"])) {

    // Validar que los campos no estén vacíos
    if (
        strlen($_POST['name']) >= 1 &&
        strlen($_POST['password']) >= 1 &&
        strlen($_POST['email']) >= 1
    ) {

        // Nombre
        $name = trim($_POST['name']);
        // Contraseña
        $password = trim($_POST['password']);
        // Email
        $email = trim($_POST['email']);
        // Fecha (YY/MM/DD)
        $fecha = date("y/m/d");

        // Inserción
        $consulta = "INSERT INTO datos (nombre, contrasena, email, fecha)
                     VALUES ('$name', '$password', '$email', '$fecha')";

        // Ejecuta query
        $resultado = mysqli_query($conex, $consulta);

        // Mensaje de éxito/error
        if ($resultado) {
            ?>
            <h3 class="success">Tu registro se ha completado</h3>
            <?php
        } else {
            ?>
            <h3 class="error">Ocurrió un error</h3>
            <?php
        }

    } else {
        ?>
        <h3 class="error">Llena todos los datos</h3>
        <?php
    }
}
?>