const ROL_ADMIN = 1;
const ROL_CLIENTE = 2;

let tbodyUsuarios;
let usuariosCountSpan;

// Badge según rol
function getRolBadge(rol_id) {
    if (rol_id === ROL_ADMIN) {
        return '<span class="badge bg-dark">Administrador</span>';
    }
    return '<span class="badge bg-secondary">Cliente</span>';
}

// ELIMINAR USUARIO
function borrarUsuario(usuario_id, esAdmin) {
    if (esAdmin) {
        alert('No se puede eliminar a un administrador.');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sesión no válida. Inicia sesión de nuevo.');
        window.location.href = '/login';
        return;
    }

    fetch(`/api/usuarios/${usuario_id}`, {
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
            throw new Error(errorData.message || 'Error al eliminar usuario.');
        });
    })
    .then(() => {
        alert('Usuario eliminado con éxito.');
        renderUsuarios();
    })
    .catch(error => {
        console.error('Error al eliminar usuario:', error);
        alert('Fallo al eliminar usuario: ' + error.message);
    });
}

// PROMOVER A ADMIN
function promoverUsuario(usuario_id, rol_id_actual) {
    if (rol_id_actual === ROL_ADMIN) {
        alert('Este usuario ya es administrador.');
        return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sesión no válida. Inicia sesión de nuevo.');
        window.location.href = '/login';
        return;
    }

    fetch(`/api/usuarios/${usuario_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rol_id: ROL_ADMIN })
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
            throw new Error(errorData.message || 'Error al actualizar rol.');
        });
    })
    .then(() => {
        alert('Usuario promovido a administrador con éxito.');
        renderUsuarios();
    })
    .catch(error => {
        console.error('Error al promover usuario:', error);
        alert('Fallo al promover usuario: ' + error.message);
    });
}

// CARGAR Y PINTAR USUARIOS 
function renderUsuarios() {
    if (!tbodyUsuarios) return;

    const token = localStorage.getItem('userToken');

    if (!token) {
        tbodyUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Inicia sesión como Administrador para ver los usuarios.
                </td>
            </tr>`;
        if (usuariosCountSpan) usuariosCountSpan.textContent = '0';
        return;
    }

    fetch('/api/usuarios', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar usuarios. Permisos insuficientes.');
        }
        return response.json();
    })
    .then(usuarios => {
        if (!usuarios || usuarios.length === 0) {
            tbodyUsuarios.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        No hay usuarios registrados.
                    </td>
                </tr>`;
            if (usuariosCountSpan) usuariosCountSpan.textContent = '0';
            return;
        }

        tbodyUsuarios.innerHTML = '';
        if (usuariosCountSpan) usuariosCountSpan.textContent = usuarios.length;

        usuarios.forEach(usuario => {
            const esAdmin = usuario.rol_id === ROL_ADMIN;
            const rolBadge = getRolBadge(usuario.rol_id);

            const rowHtml = `
                <tr ${esAdmin ? 'class="table-light border-start border-3 border-warning"' : ''}>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="${esAdmin ? 'bg-warning bg-opacity-10' : 'bg-light'} rounded-circle p-2 me-2 text-center" style="width: 40px; height: 40px;">
                                <i class="${esAdmin ? 'fas fa-crown text-warning' : 'fas fa-user text-secondary'}"></i>
                            </div>
                            <div>
                                <span class="fw-bold">${usuario.nombre}</span>
                                ${esAdmin ? '<br><small class="text-muted" style="font-size: 0.75rem;">Cuenta Principal</small>' : ''}
                            </div>
                        </div>
                    </td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefono || '-'}</td>
                    <td>${rolBadge}</td>
                    <td class="text-center">
                        <button 
                            class="btn btn-outline-success btn-sm me-1"
                            title="${esAdmin ? 'Usuario ya es Admin' : 'Promover a Administrador'}"
                            ${esAdmin ? 'disabled' : ''}
                            onclick="promoverUsuario(${usuario.usuario_id}, ${usuario.rol_id})">
                            <i class="${esAdmin ? 'fas fa-user-check' : 'fas fa-user-shield'}"></i>
                        </button>
                        <button 
                            class="btn btn-outline-danger btn-sm"
                            title="${esAdmin ? 'No se puede eliminar a un administrador' : 'Eliminar Usuario'}"
                            ${esAdmin ? 'disabled' : ''}
                            onclick="borrarUsuario(${usuario.usuario_id}, ${esAdmin})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbodyUsuarios.innerHTML += rowHtml;
        });
    })
    .catch(error => {
        console.error('Error al cargar usuarios:', error);
        tbodyUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="text-danger text-center">
                    Error: ${error.message}
                </td>
            </tr>`;
        if (usuariosCountSpan) usuariosCountSpan.textContent = '0';
    });
}

//INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    tbodyUsuarios = document.getElementById('usuariosTable');
    usuariosCountSpan = document.getElementById('usuariosCount');
    renderUsuarios();
});
