const ESTADO_PENDIENTE = 1;
const ESTADO_APROBADA = 2;
const ESTADO_RECHAZADA = 3;

// Referencia al tbody de la tabla
const tbodySolicitudes = document.getElementById('solicitudesTable');

// Devuelve un badge bonito según el nombre del estado
function getEstadoBadge(estadoNombre) {
    if (!estadoNombre) {
        return '<span class="badge bg-secondary">Desconocido</span>';
    }

    const lower = estadoNombre.toLowerCase();
    let clase = 'bg-secondary';

    if (lower.includes('pend')) clase = 'bg-warning text-dark';
    if (lower.includes('aprob')) clase = 'bg-success';
    if (lower.includes('rech')) clase = 'bg-danger';

    return `<span class="badge ${clase}">${estadoNombre}</span>`;
}

//  ACTUALIZAR ESTADO (APROBAR/RECHAZAR)

function actualizarEstadoSolicitud(solicitud_id, nuevo_estado_id) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sesión no válida. Inicia sesión de nuevo.');
        window.location.href = '/login';
        return;
    }

    fetch(`/api/solicitudes/${solicitud_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nuevo_estado_id })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(errorData => {
            if (response.status === 401 || response.status === 403) {
                alert('Sesión no válida. Por favor, inicia sesión de nuevo.');
                localStorage.removeItem('userToken');
                window.location.href = '/login';
                throw new Error(errorData.message);
            }
            throw new Error(errorData.message || 'Error al actualizar el estado.');
        });
    })
    .then(() => {
        alert('Estado actualizado con éxito.');
        renderSolicitudes();
    })
    .catch(error => {
        console.error('Error al actualizar estado:', error);
        alert('Fallo al actualizar el estado: ' + error.message);
    });
}

//  ELIMINAR SOLICITUD

function borrarSolicitud(solicitud_id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
        return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sesión no válida. Inicia sesión de nuevo.');
        window.location.href = '/login';
        return;
    }

    fetch(`/api/solicitudes/${solicitud_id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(errorData => {
            if (response.status === 401 || response.status === 403) {
                alert('Sesión no válida. Por favor, inicia sesión de nuevo.');
                localStorage.removeItem('userToken');
                window.location.href = '/login';
                throw new Error(errorData.message);
            }
            throw new Error(errorData.message || 'Error al eliminar la solicitud.');
        });
    })
    .then(() => {
        alert('Solicitud eliminada con éxito.');
        renderSolicitudes();
    })
    .catch(error => {
        console.error('Error al eliminar la solicitud:', error);
        alert('Fallo al eliminar la solicitud: ' + error.message);
    });
}

//  CARGAR Y PINTAR SOLICITUDES

function renderSolicitudes() {
    if (!tbodySolicitudes) return;

    const token = localStorage.getItem('userToken');

    if (!token) {
        tbodySolicitudes.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    Inicia sesión como Administrador para ver las solicitudes.
                </td>
            </tr>`;
        return;
    }

    fetch('/api/solicitudes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar solicitudes. Permisos insuficientes.');
        }
        return response.json();
    })
    .then(solicitudes => {
        if (!solicitudes || solicitudes.length === 0) {
            tbodySolicitudes.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay solicitudes registradas.
                    </td>
                </tr>`;
            return;
        }

        tbodySolicitudes.innerHTML = '';

        solicitudes.forEach(sol => {
            const estadoBadge = getEstadoBadge(sol.estado);

            const rowHtml = `
                <tr>
                    <td>${new Date(sol.creada_en).toLocaleString()}</td>
                    <td>${sol.solicitante_nombre}</td>
                    <td>${sol.mascota_nombre}</td>
                    <td>-</td>
                    <td>${estadoBadge}</td>
                    <td class="text-center">
                        <button 
                            class="btn btn-success btn-sm me-2"
                            title="Aprobar"
                            onclick="actualizarEstadoSolicitud(${sol.solicitud_id}, ${ESTADO_APROBADA})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button 
                            class="btn btn-warning btn-sm me-2"
                            title="Rechazar"
                            onclick="actualizarEstadoSolicitud(${sol.solicitud_id}, ${ESTADO_RECHAZADA})">
                            <i class="fas fa-times"></i>
                        </button>
                        <button 
                            class="btn btn-danger btn-sm"
                            title="Eliminar"
                            onclick="borrarSolicitud(${sol.solicitud_id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbodySolicitudes.innerHTML += rowHtml;
        });
    })
    .catch(error => {
        console.error('Error al cargar solicitudes:', error);
        tbodySolicitudes.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger text-center">
                    Error: ${error.message}
                </td>
            </tr>`;
    });
}

//  INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', function() {
    renderSolicitudes();
});
