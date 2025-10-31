window.Socials = (function(){
  const KEY = 'tienda.socials';
  function getAll(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch(e){ return []; }
  }
  function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }

  function renderInto(container){
    if (!container) return;
    const list = getAll();
    
    if (!list.length) return;
    
    container.innerHTML = '';
    list.forEach(s=>{
      const a = document.createElement('a');
      a.href = s.profileUrl || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = s.platform || s.profileUrl || '';
      const img = document.createElement('img');
      img.src = s.iconUrl || '';
      img.alt = s.platform || '';
      img.style.width = '28px';
      img.style.height = '28px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '6px';
      a.appendChild(img);
      container.appendChild(a);
    });
  }

  
  function render(){
    const els = document.querySelectorAll('.social-links');
    els.forEach(renderInto);
  }

  
  function initAdmin(formSelector, listSelector){
    const form = document.querySelector(formSelector);
    const listEl = document.querySelector(listSelector);
    if (!form || !listEl) return;
    const platform = form.querySelector('[name="platform"]');
    const profile = form.querySelector('[name="profileUrl"]');
    const icon = form.querySelector('[name="iconUrl"]');
    const addBtn = form.querySelector('button[type="submit"]');

    function refreshList(){
      const arr = getAll();
      listEl.innerHTML = '';
      if (!arr.length){ listEl.innerHTML = '<div class="small">No hay enlaces sociales.</div>'; return; }
      arr.forEach(s=>{
        const row = document.createElement('div');
        row.className = 'social-row';
        row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.justifyContent = 'space-between'; row.style.gap='0.6rem'; row.style.padding='0.4rem 0';
        const left = document.createElement('div');
        left.style.display='flex'; left.style.alignItems='center'; left.style.gap='0.6rem';
        const img = document.createElement('img'); img.src = s.iconUrl; img.alt = s.platform; img.style.width='36px'; img.style.height='36px'; img.style.objectFit='cover'; img.style.borderRadius='6px';
        const info = document.createElement('div');
        info.innerHTML = `<div style="font-weight:700">${s.platform}</div><div class="small">${s.profileUrl}</div>`;
        left.appendChild(img); left.appendChild(info);
        const actions = document.createElement('div');
        const del = document.createElement('button'); del.className='btn-ghost'; del.textContent='Eliminar';
        del.addEventListener('click', function(){ if(!confirm('Eliminar enlace social?')) return; const arr = getAll().filter(x=>x.id!==s.id); save(arr); Toast.show('Enlace eliminado'); refreshList(); render(); });
        actions.appendChild(del);
        row.appendChild(left); row.appendChild(actions);
        listEl.appendChild(row);
      });
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const p = (platform.value || '').trim();
      const pr = (profile.value || '').trim();
      const ic = (icon.value || '').trim();
      if (!pr || !/^https?:\/\//i.test(pr)){ Toast.show('La URL de perfil es obligatoria y debe comenzar con http:// o https://'); return; }
      if (!ic || !/^https?:\/\//i.test(ic)){ Toast.show('La URL del icono es obligatoria y debe comenzar con http:// o https://'); return; }
      const arr = getAll();
      const id = 's_' + Date.now();
      arr.push({ id, platform: p || 'Social', profileUrl: pr, iconUrl: ic });
      save(arr);
      Toast.show('Enlace social agregado');
      form.reset();
      refreshList();
      render();
    });

    
    refreshList();
  }

  return { getAll, save, render, initAdmin };
})();
