/* js/admin.js */

document.addEventListener('DOMContentLoaded', function() {
    const petModal = document.getElementById('petModal');
    
    if (petModal) {
        const form = document.getElementById('petForm');
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

                const petName = button.getAttribute('data-name');
                const petBreed = button.getAttribute('data-breed');
                const petAge = button.getAttribute('data-age');
                const petType = button.getAttribute('data-type');
                const petStatus = button.getAttribute('data-status');

                nameInput.value = petName;
                breedInput.value = petBreed;
                ageInput.value = petAge;
                
                typeSelect.value = petType;
                statusSelect.value = petStatus;

            } else {
                modalTitle.textContent = 'Agregar Nueva Mascota';
                form.reset();
            }
        });
    }
});