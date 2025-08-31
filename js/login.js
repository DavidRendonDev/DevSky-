// frontend/js/login.js
// Lógica para el formulario de login: conecta con el backend y muestra mensajes de error.
// Completamente comentado para fácil comprensión.

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    loginError.textContent = '';

    // Obtiene los valores del formulario
    const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

    // Llama a la API de login del backend
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, contraseña })
      });
      const data = await response.json();

      if (data.success) {
        // Guardar el id del usuario técnico en sessionStorage
        if (data.user.rol === 'tecnico') {
          sessionStorage.setItem('tecnicoId', data.user.id);
          window.location.href = 'tecnico.html';
        } else if (data.user.rol === 'inspector') {
          window.location.href = 'inspector.html';
        } else {
          loginError.textContent = 'Rol de usuario desconocido.';
        }
      } else {
        loginError.textContent = data.message || 'Error de autenticación.';
      }
    } catch (error) {
      loginError.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});
