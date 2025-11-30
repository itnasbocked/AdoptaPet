function borrar(mascota_id){
        if(!confirm("¿Estás seguro de que deseas eliminar esta mascota?")){
            return;
        }
        const token = localStorage.getItem('userToken');
        fetch(`/api/mascotas/${mascota_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Mascota eliminada con éxito.');
                renderMascotas();
            } else if (response.status === 401 || response.status === 403) {
                alert('Sesión no válida. Por favor, reinicie la sesión.');
                localStorage.removeItem('userToken');
                window.location.href = '/login';
            }
            else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error al eliminar la mascota.');
                }
            );
            }
        })
        .catch(error => {
            console.error('Error al eliminar la mascota:', error);
            alert('Fallo al eliminar la mascota: ' + error.message);
        });
                
    }

//Lógica cambio de color para el estado de adopción
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'proceso':
            return 'bg-warning';
        case 'adoptado':
            return 'bg-danger';
        case 'disponible':
        default:
            return 'bg-success';
    }
}

//Lógica de inserción dinámica de mascotas en la tabla
const tbody = document.getElementById('mascotasTable');
function renderMascotas() {
    //Token de seguridad
    const token = localStorage.getItem('userToken');
    if (!token) {
        //No muestra los datos si no hay token
        if (tbody) tbody.innerHTML = '<tr><td colspan="6">Inicia sesión como Administrador para ver los datos.</td></tr>';
        return;
    }
    fetch('/api/mascotas', { 
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}` 
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error al cargar datos. Permisos insuficientes.');
    }
    return response.json();
})
.then(mascotas => {
    if (tbody) {
        tbody.innerHTML = '';  

        mascotas.forEach(mascota => {
            const estadoClase = getStatusClass(mascota.estado_adopcion);
            const estadoTexto = mascota.estado_adopcion || 'Disponible';
            const estadoBadge = `<span class="badge ${estadoClase}">${estadoTexto}</span>`;
                
            const rowHtml = `
                <tr>
                    <td>${mascota.nombre}</td>
                    <td>${mascota.raza}</td>
                    <td>${mascota.especie}</td>
                    <td>${mascota.edad_anios} años</td>
                    <td>${estadoBadge}</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm me-2" title="Editar" data-bs-toggle="modal" data-bs-target="#petModal" data-mode="edit" 
                        data-name="${mascota.nombre}" data-breed="${mascota.raza}" data-age="${mascota.edad_anios}" data-status="${mascota.disponible}"
                        data-id="${mascota.mascota_id}" data-type="${mascota.especie}">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Eliminar" onClick=borrar(${mascota.mascota_id})><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += rowHtml;
        });
    }
})
.catch(error => {
    console.error('Error al cargar la tabla:', error);
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-danger">Error: ${error.message}</td></tr>`;
});
}

document.addEventListener('DOMContentLoaded', function() {
    const petModal = document.getElementById('petModal');
    const petForm = document.getElementById('petForm');

    if (petModal && petForm) {
        const modalTitle = petModal.querySelector('.modal-title');
        
        const nameInput = document.getElementById('petName');
        const breedInput = document.getElementById('petBreed');
        const ageInput = document.getElementById('petAge');
        const typeSelect = document.getElementById('petType');
        const statusSelect = document.getElementById('petStatus');

        petModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget; 
            const mode = button.getAttribute('data-mode');

            if (mode === 'edit') {
                modalTitle.textContent = 'Editar Mascota';
                
                const petID = button.getAttribute('data-id');
                const petName = button.getAttribute('data-name');
                const petBreed = button.getAttribute('data-breed');
                const petAge = button.getAttribute('data-age');
                const petType = button.getAttribute('data-type');
                const petStatus = button.getAttribute('data-status');

                document.getElementById('petID').value = petID;
                nameInput.value = petName;
                breedInput.value = petBreed;
                ageInput.value = petAge;
                typeSelect.value = petType;
                statusSelect.value = petStatus;

            } else {
                modalTitle.textContent = 'Agregar Nueva Mascota';
                petForm.reset();
                document.getElementById('petID').value = '';
            }
        });

        petForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const token = localStorage.getItem('userToken');

            if (!token) {
                alert('Sesión expirada. Por favor, inicia sesión de nuevo.');
                window.location.href = '/login'; 
                return;
            }

            const formData = new FormData(petForm);
            const data = Object.fromEntries(formData.entries());
            const mascota_id = parseInt(data.mascota_id);

            //Define si se están agregando o modificando mascotas
            const isEditMode = modalTitle.textContent.includes('Editar');
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `/api/mascotas/${mascota_id}` : '/api/mascotas';
            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(errorData => {
                    if (response.status === 401 || response.status === 403) {
                         alert('Sesión no válida. Por favor, reinicie la sesión.');
                         localStorage.removeItem('userToken');
                         window.location.href = '/login';
                         throw new Error(errorData.message); 
                    }
                    throw new Error(errorData.message || 'Error desconocido.');
                });
            })
            .then(result => {
                alert(`Mascota ${isEditMode ? 'actualizada' : 'agregada'} con éxito!`);
                
                const modalInstance = bootstrap.Modal.getInstance(petModal);
                modalInstance.hide(); 
                window.location.reload(); 
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Fallo al ${isEditMode ? 'editar' : 'agregar'} mascota: ` + error.message);
            });
        });
    }
    
    renderMascotas(); 
    
});