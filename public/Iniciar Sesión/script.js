// Registro
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            if (data.password !== data.confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            fetch('/api/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.message && result.message.includes('éxito')) {
                    alert('Registro exitoso. ¡Ahora inicia sesión!');
                    window.location.href = '/login'; 
                } else {
                    alert('Error en el registro: ' + (result.message || 'Inténtalo de nuevo.'));
                }
            })
            .catch(error => {
                console.error('Error al enviar registro:', error);
                alert('Hubo un error de conexión con el servidor.');
            });
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            
            fetch('/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.token) {
                    localStorage.setItem('userToken', result.token);
                    localStorage.setItem('userRole', result.rol_id);

                    alert('¡Bienvenido! Iniciando sesión...');

                    if (result.rol_id === 1) {
                        window.location.href = '/perfil-usuario';
                    } else {
                        window.location.href = '/perfil-usuario'; 
                    }
                } else {
                    alert(result.message || 'Credenciales incorrectas.');
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                alert('Hubo un error de conexión con el servidor.');
            });
        });
    }
});