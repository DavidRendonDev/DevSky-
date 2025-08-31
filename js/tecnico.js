
// frontend/js/tecnico.js
document.addEventListener('DOMContentLoaded', () => {
  const misTareasList = document.getElementById('misTareasList');

  // URL base del backend en Railway
  const API_BASE = 'https://devsky-backend-production.up.railway.app';

  // Obtener el id del técnico desde sessionStorage
  const tecnicoId = sessionStorage.getItem('tecnicoId');
  if (!tecnicoId) {
    misTareasList.innerHTML = '<div class="error">No se encontró el ID del técnico. Por favor, inicia sesión nuevamente.</div>';
    return;
  }

  // Listar tareas asignadas al técnico
  async function cargarMisTareas() {
    misTareasList.innerHTML = '<div class="cargando">Cargando tus tareas...</div>';
    try {
      const resp = await fetch(`${API_BASE}/api/tareas/tecnico/${tecnicoId}`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        if (data.tareas.length === 0) {
          misTareasList.innerHTML = '<div class="vacio">No tienes tareas asignadas.</div>';
        } else {
          misTareasList.innerHTML = '';
          data.tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = 'tarea-card';
            div.innerHTML = `
              <div class="tarea-desc">${tarea.descripcion}</div>
              <div class="tarea-detalles">
                <span class="tarea-estado estado-${(tarea.estado||'').replace(/\s/g, '').toLowerCase()}">Estado: ${tarea.estado||'Sin estado'}</span>
                <select class="estado-select">
                  <option value="En Progreso" ${tarea.estado==="En Progreso"?"selected":''}>En Progreso</option>
                  <option value="Realizado" ${tarea.estado==="Realizado"?"selected":''}>Realizado</option>
                  <option value="No Realizado" ${tarea.estado==="No Realizado"?"selected":''}>No Realizado</option>
                </select>
                <button class="btn-actualizar">Actualizar</button>
                <span class="msg-estado"></span>
              </div>
            `;
            // Lógica para actualizar estado
            const select = div.querySelector('.estado-select');
            const btn = div.querySelector('.btn-actualizar');
            const msg = div.querySelector('.msg-estado');
            btn.addEventListener('click', async () => {
              const nuevoEstado = select.value;
              try {
                const resp = await fetch(`${API_BASE}/api/tareas/${tarea.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ estado: nuevoEstado })
                });
                const result = await resp.json();
                if (result && result.success) {
                  msg.textContent = '✅ Estado actualizado';
                  cargarMisTareas();
                } else {
                  msg.textContent = (result && result.message) || 'Error al actualizar.';
                }
              } catch (err) {
                msg.textContent = 'No se pudo conectar con el servidor.';
              }
            });
            misTareasList.appendChild(div);
          });
        }
      } else {
        misTareasList.innerHTML = '<div class="error">Error al cargar tus tareas.</div>';
      }
    } catch (err) {
      misTareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  cargarMisTareas();
});

 
