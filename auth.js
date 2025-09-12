// Utilidad Auth básica para registro y sesión en localStorage
window.Auth = {
  registerUser({ usuario, contrasena, codigo, celular }) {
    if (!usuario || !contrasena || !codigo || !celular) {
      return { ok: false, error: 'Todos los campos son obligatorios' };
    }
    let users = JSON.parse(localStorage.getItem('tienda.usuarios') || '[]');
    if (users.find(u => u.usuario === usuario)) {
      return { ok: false, error: 'El usuario ya existe' };
    }
    users.push({ usuario, contrasena, codigo, celular });
    localStorage.setItem('tienda.usuarios', JSON.stringify(users));
    return { ok: true };
  },
  setSessionUser(usuario) {
    localStorage.setItem('tienda.session', usuario);
  },
  getSessionUser() {
    return localStorage.getItem('tienda.session');
  },
  logout() {
    localStorage.removeItem('tienda.session');
  }
};
