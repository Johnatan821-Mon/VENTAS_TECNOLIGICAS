
window.Auth = {
  registerUser({ usuario, contrasena, codigo, celular }) {
    if (!usuario || !contrasena || !codigo || !celular) {
      return { ok: false, error: 'Todos los campos son obligatorios' };
    }
    let users = JSON.parse(localStorage.getItem('tienda.usuarios') || '[]');
    if (users.find(u => u.usuario === usuario)) {
      return { ok: false, error: 'El usuario ya existe' };
    }
    
    const role = arguments[0] && arguments[0].role ? arguments[0].role : 'user';
    users.push({ usuario, contrasena, codigo, celular, role });
    localStorage.setItem('tienda.usuarios', JSON.stringify(users));
    return { ok: true };
  },
  loginUser({ usuario, contrasena }) {
    if (!usuario || !contrasena) {
      return { ok: false, error: 'Usuario y contraseña son obligatorios' };
    }
    const users = JSON.parse(localStorage.getItem('tienda.usuarios') || '[]');
    const user = users.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (!user) {
      return { ok: false, error: 'Usuario o contraseña incorrectos' };
    }
    localStorage.setItem('tienda.session', usuario);
    return { ok: true };
  },
  setSessionUser(usuario) {
    localStorage.setItem('tienda.session', usuario);
    try {
      localStorage.setItem('tienda.sessionDisplay', `Sr/a ${usuario}`);
    } catch (e) {

    }
  },
  getSessionUser() {
    return localStorage.getItem('tienda.session');
  },
  getSessionDisplay() {
    return localStorage.getItem('tienda.sessionDisplay') || (localStorage.getItem('tienda.session') ? `Sr/a ${localStorage.getItem('tienda.session')}` : null);
  },
  logout() {
    localStorage.removeItem('tienda.session');
  }
};

(function(){
  try {
    var users = JSON.parse(localStorage.getItem('tienda.usuarios') || '[]');
    var hasAdmin = users.find(function(u){ return u && u.usuario === 'admin'; });
    if (!hasAdmin) {
      users.push({ usuario: 'admin', contrasena: 'Admin123', codigo: 'ADMIN', celular: '', role: 'admin' });
  localStorage.setItem('tienda.usuarios', JSON.stringify(users));
    }
  } catch (e) {
  }
})();
