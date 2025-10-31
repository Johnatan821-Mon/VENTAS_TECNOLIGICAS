window.PasswordToggle = (function(){
  function makeButton(){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pwd-toggle';
    btn.setAttribute('aria-label','Mostrar contraseña');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    return btn;
  }
  function bindTo(input){
    if (!input) return;
    
    if (input.dataset.pwdToggleInit) return;
    input.dataset.pwdToggleInit = '1';
    const wrapper = document.createElement('div');
    wrapper.className = 'pwd-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    const btn = makeButton();
    wrapper.appendChild(btn);
    btn.addEventListener('click', function(){
      if (input.type === 'password'){
        input.type = 'text';
        btn.setAttribute('aria-label','Ocultar contraseña');
        btn.classList.add('active');
      } else {
        input.type = 'password';
        btn.setAttribute('aria-label','Mostrar contraseña');
        btn.classList.remove('active');
      }
    });
  }
  function init(selector){
    const els = document.querySelectorAll(selector || '[data-toggle="password"]');
    els.forEach(bindTo);
  }
  return { init };
})();
