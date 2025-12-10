<?php
// Conexión a la base de datos
$conex = mysqli_connect("localhost", "root", "", "formulario");

// Verificar conexión
if (!$conex) {
    die("Error de conexión: " . mysqli_connect_error());
}
