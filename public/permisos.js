function permisosNavegacion(url) {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!userToken || userRole !== '1') {
        alert('Acceso denegado. No tienes permisos de Administrador.');
        window.location.href = '/perfil-usuario';
        return;
    }

    window.location.href = `${url}?t=${userToken}`;
}