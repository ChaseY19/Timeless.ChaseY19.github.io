<?php
declare(strict_types=1);

// Inicia sesión
session_start();

// Carga la conexión
require_once __DIR__ . '/conexion.php';

// Tabla de usuarios
const TABLE_NAME = 'datos';

// Valida método y botón de login
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['login'])) {
    header('Location: index.php');
    exit;
}

// Obtiene campos del formulario
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Verifica campos obligatorios
if ($email === '' || $password === '') {
    header('Location: index.php?error=faltan_campos');
    exit;
}

// Consulta preparada por email
$sql  = "SELECT id, nombre, email, contrasena
         FROM `" . TABLE_NAME . "`
         WHERE email = ?
         LIMIT 1";

// Prepara sentencia
$stmt = mysqli_prepare($conex, $sql);
if (!$stmt) {
    header('Location: index.php?error=credenciales');
    exit;
}

// Bind del email
mysqli_stmt_bind_param($stmt, 's', $email);
// Ejecuta consulta
mysqli_stmt_execute($stmt);
// Obtiene resultado
$result = mysqli_stmt_get_result($stmt);
// Fetch usuario
$user   = $result ? mysqli_fetch_assoc($result) : null;

// Valida credenciales
if ($user && $password === $user['contrasena']) {

    // Guarda datos en sesión
    $_SESSION['id']     = (int)$user['id'];
    $_SESSION['email']  = $user['email'];
    $_SESSION['nombre'] = $user['nombre'];

    // Redirige al app
    header('Location: Timeless.php');
    exit;

} else {
    // Error login
    header('Location: index.php?error=credenciales');
    exit;
}