(function(){
  function updateNavbar(){
    if (!window.Auth || !window.Toast) return;
    const header = document.querySelector('header.header');
    if (!header) return;
    let nav = header.querySelector('.nav') || header.querySelector('nav');
    let userArea = header.querySelector('#userArea');
    if (!userArea){
      userArea = document.createElement('div');
      userArea.id = 'userArea';
      if (nav && nav.parentNode) nav.parentNode.insertBefore(userArea, nav.nextSibling);
      else header.appendChild(userArea);
    }
    const session = Auth.getSessionUser && Auth.getSessionUser();
    const display = (Auth.getSessionDisplay && Auth.getSessionDisplay()) || (session ? `Sr/a ${session}` : null);
    if (session){
      
      let isAdmin = false;
      try {
        const users = JSON.parse(localStorage.getItem('tienda.usuarios') || '[]');
        const me = users.find(u => u && u.usuario === session);
        if (me && me.role === 'admin') isAdmin = true;
      } catch (e) {
        
      }
      userArea.innerHTML = `
        <span id="userGreeting" class="user-greeting">${display}${isAdmin ? ' <a href="admin.html" class="admin-badge">(Panel Admin)</a>' : ''}</span>
        <a href="#" id="logoutBtn" class="logout-link">Cerrar sesión</a>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.addEventListener('click', function(e){
        e.preventDefault();
        Auth.logout();
        Toast.show('Has cerrado sesión');
        updateNavbar();
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
      });
    } else {
      userArea.innerHTML = `
        <a href="login.html" class="nav-cta">Iniciar sesión</a>
        <a href="registro.html" class="nav-cta">Registro</a>
      `;
    }
  }

  window.updateNavbar = updateNavbar;
  window.addEventListener('storage', function(e){
    if (e.key === 'tienda.session' || e.key === 'tienda.sessionDisplay') updateNavbar();
  });
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(updateNavbar, 50);
  });
})();
