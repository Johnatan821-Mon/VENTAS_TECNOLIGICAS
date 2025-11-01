window.Socials = (function(){

  function render(){
    const template = `
      <a href="#" title="Facebook" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png" alt="Facebook" class="social-icon" data-placeholder="facebook" />
      </a>
      <a href="#" title="Twitter" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/128/14417/14417709.png" alt="Twitter" class="social-icon" data-placeholder="twitter" />
      </a>
      <a href="#" title="Instagram" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/128/15707/15707749.png" alt="Instagram" class="social-icon" data-placeholder="instagram" />
      </a>
      <a href="#" title="LinkedIn" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/128/145/145807.png" alt="LinkedIn" class="social-icon" data-placeholder="linkedin" />
      </a>
    `;
    const els = document.querySelectorAll('.social-links');
    els.forEach(el => {
      if (!el) return;
      el.innerHTML = template;
    });
  }

  return { render };
})();
