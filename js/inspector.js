// frontend/js/inspector.js
document.addEventListener('DOMContentLoaded', () => {
  const tareasList = document.getElementById('tareasList');
  const asignarForm = document.getElementById('asignarForm');
  const tecnicoSelect = document.getElementById('tecnico');
  const asignarMsg = document.getElementById('asignarMsg');

  // URL base del backend en Railway
  const API_BASE = 'https://devsky-backend-production.up.railway.app';

  // Cargar técnicos en el selector
  async function cargarTecnicos() {
    try {
      const resp = await fetch(`${API_BASE}/api/tareas`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        const tecnicos = {};
        for (const t of data.tareas || []) {
          if (t.id_tecnico && t.tecnico_nombre) {
            tecnicos[t.id_tecnico] = t.tecnico_nombre;
          }
        }
        tecnicoSelect.innerHTML = '';
        if (Object.keys(tecnicos).length === 0) {
          tecnicoSelect.innerHTML = '<option value="">No hay técnicos registrados en tareas. Ingresa el ID manualmente.</option>';
        } else {
          Object.entries(tecnicos).forEach(([id, nombre]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = nombre;
            tecnicoSelect.appendChild(opt);
          });
        }
      } else {
        tecnicoSelect.innerHTML = '<option value="">No hay técnicos disponibles</option>';
      }
    } catch (err) {
      tecnicoSelect.innerHTML = '<option value="">Error al cargar técnicos</option>';
    }
  }

  // Listar todas las tareas
  async function cargarTareas() {
    tareasList.innerHTML = '<div class="cargando">Cargando tareas...</div>';
    try {
      const resp = await fetch(`${API_BASE}/api/tareas`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        if (data.tareas.length === 0) {
          tareasList.innerHTML = '<div class="vacio">No hay tareas registradas.</div>';
        } else {
          tareasList.innerHTML = '';
          for (const tarea of data.tareas) {
            const div = document.createElement('div');
            div.className = 'tarea-card';
            div.innerHTML = `
              <div class="tarea-desc">${tarea.descripcion}</div>
              <div class="tarea-detalles">
                <span class="tarea-tecnico">👨‍🔧 Técnico: <b>${tarea.tecnico_nombre || 'Sin asignar'}</b></span>
                <span class="tarea-estado estado-${(tarea.estado||'').replace(/\s/g, '').toLowerCase()}">Estado: ${tarea.estado||'Sin estado'}</span>
              </div>
            `;
            tareasList.appendChild(div);
          }
        }
      } else {
        tareasList.innerHTML = '<div class="error">Error al cargar tareas.</div>';
      }
    } catch (err) {
      tareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  // Asignar nueva tarea
  asignarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    asignarMsg.textContent = '';
    const descripcion = document.getElementById('descripcion').value.trim();
    const id_tecnico_asignado = tecnicoSelect.value;
    if (!descripcion || !id_tecnico_asignado) {
      asignarMsg.textContent = 'Completa todos los campos.';
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, id_tecnico_asignado })
      });
      const data = await resp.json();
      if (data && data.success) {
        asignarMsg.textContent = '✅ Tarea asignada correctamente.';
        asignarForm.reset();
        cargarTareas();
      } else {
        asignarMsg.textContent = (data && data.message) || 'Error al asignar tarea.';
      }
    } catch (err) {
      asignarMsg.textContent = 'No se pudo conectar con el servidor.';
    }
  });

  // Inicializar
  cargarTecnicos();
  cargarTareas();
});
