<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="style.css">
</head>
<body>
  
<form method="post" autocomplete="off">
  <h2>Bienvenido</h2>
  <br>

  <div class="input-group">

    <div class="input-container">
      <!-- Campo nombre -->
      <input type="text" name="name" placeholder="Nombre" required>
      <i class="fa-solid fa-user"></i>
    </div>

    <div class="input-container">
      <!-- Campo contraseña con reglas -->
      <input type="password" name="password" placeholder="Contraseña" required
      passwordrules="minlength: 8; required: upper; required: lower; required: digit; allowed: [-().&@?#_!¡¿%$];">
      <i class="fa-solid fa-lock"></i>
    </div>
    
    <div class="input-container">
      <!-- Campo correo -->
      <input type="email" name="email" placeholder="Correo electrónico" required>
      <i class="fa-solid fa-envelope"></i>
    </div>

    <!-- Botón enviar -->
    <input type="submit" name="send" class="btn" value="Enviar">
    <br> <br>

    <!-- Link al inicio de sesión -->
    <p>¿Ya tienes una cuenta? <a href="index.php">Inicia sesión</a></p>

  </div>
</form>

<?php
// Procesa registro
include("send.php");
?>

</body>
</html>