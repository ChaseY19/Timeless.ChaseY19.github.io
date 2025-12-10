<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link rel="stylesheet" href="style2.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

<!-- Mensajes de error -->
  <?php if (isset($_GET['error'])): ?>
    <?php if ($_GET['error'] === 'credenciales'): ?>
      <p style="color:red;">Acceso denegado. Verifica tu correo y contraseña.</p>
    <?php elseif ($_GET['error'] === 'faltan_campos'): ?>
      <p style="color:red;">Por favor, completa todos los campos.</p>
    <?php else: ?>
      <p style="color:red;">Ocurrió un error. Intenta de nuevo.</p>
    <?php endif; ?>
  <?php endif; ?>

  <!-- Formulario de login -->
  <form action="controlador_login.php" method="post">

  <h2>Inicio de sesión</h1>

  <div class="input-group">
    <div class="input-container">

    <!-- Campo email -->
    <input type="email" name="email" id="email" placeholder="Correo electrónico" required>
    <!-- Icono usuario -->
    <i class="fa-solid fa-user"></i>
    </div>

    <div class="input-container">
    <!-- Campo contraseña -->
    <input type="password" name="password" id="password" placeholder="Contraseña" required>
    <!-- Icono candado -->
    <i class="fa-solid fa-lock"></i>
    </div>
    </div>

    <!-- Botón -->
    <button class="btn" type="submit" name="login">Ingresar</button>
  <br> <br>
  <!-- Link registro -->
   <p>¿No tienes una cuenta? <a href="registro.php">Registrate</a></p>
  </form>
 
</body>
</html>
