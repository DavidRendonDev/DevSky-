// frontend/js/login.js
// Lógica para el formulario de login: conecta con el backend en Railway y muestra mensajes de error.

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  // URL base del backend en Railway
  const API_BASE = 'https://devsky-backend-production.up.railway.app';

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    loginError.textContent = '';

    // Obtiene los valores del formulario
    const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, contraseña })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

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
      console.error('Error en login:', error);
      loginError.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});

