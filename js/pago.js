
document.addEventListener('DOMContentLoaded', function(){
    const lista = document.getElementById('lista-items-pedido');
    const montoTotal = document.getElementById('monto-total');
    const form = document.getElementById('form-pago');
    const msg = document.getElementById('mensaje-estado-pago');
    const subtotalEl = document.getElementById('pago-subtotal');
    const ivaEl = document.getElementById('pago-iva');
    const envioEl = document.getElementById('pago-envio');
    const metodoRadios = document.querySelectorAll('input[name="metodoAlterno"]');
    const grupoTarjeta = document.getElementById('grupo-tarjeta');
    const grupoPse = document.getElementById('grupo-pse');
    const grupoContra = document.getElementById('grupo-contraentrega');
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    const expiracion = document.getElementById('expiracion');
    const cvv = document.getElementById('cvv');
    const validaNumero = document.getElementById('valida-numero');
    const validaExp = document.getElementById('valida-exp');
    let procesando = false;

    function formatearMoneda(valor){
        return valor.toLocaleString('es-CO', {style:'currency', currency:'COP'});
    }

    function normalizarCarrito(data){
        if(Array.isArray(data)) return data;
        if(data && typeof data === 'object') return Object.values(data);
        return [];
    }

    function obtenerCarrito(){
        let bruto = null;
        try { bruto = JSON.parse(localStorage.getItem('carrito')) || null; } catch(e) {}
        return normalizarCarrito(bruto);
    }

    function cargarCarrito(){
        const carrito = obtenerCarrito();
        lista.innerHTML = '';
        let subtotal = 0;
        if(!carrito.length){
            lista.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            carrito.forEach(item => {
                const precio = Number(item.precio)||0;
                const cant = Number(item.cantidad)||1;
                const line = precio * cant;
                subtotal += line;
                const div = document.createElement('div');
                div.className = 'item-resumen';
                div.innerHTML = `
                    <span class="nombre">${item.nombre || 'Producto'}</span>
                    <span class="cant">x${cant}</span>
                    <span class="subtotal">${formatearMoneda(line)}</span>
                `;
                lista.appendChild(div);
            });
        }
        const iva = subtotal * 0.19;
        // Regla de envío: gratis para compras >= 150.000, 20.000 para compras menores a 150.000 (si hay productos)
        let envio = 0;
        if (subtotal > 0) {
            envio = subtotal >= 150000 ? 0 : 20000;
        }
        const total = subtotal + iva + envio;
        subtotalEl.textContent = formatearMoneda(subtotal);
        ivaEl.textContent = formatearMoneda(iva);
    envioEl.textContent = formatearMoneda(envio);
        montoTotal.textContent = formatearMoneda(total);
        return {subtotal, iva, envio, total};
    }

    function limpiarNumeroTarjeta(valor){
        return valor.replace(/[^0-9]/g,'').slice(0,16);
    }

    function luhnValido(numero){
        const digitos = numero.replace(/\s+/g,'');
        if(!/^\d{13,16}$/.test(digitos)) return false;
        let suma = 0;
        let alternar = false;
        for(let i = digitos.length -1; i >=0; i--){
            let n = parseInt(digitos[i],10);
            if(alternar){
                n*=2; if(n>9) n-=9;
            }
            suma += n; alternar = !alternar;
        }
        return (suma % 10) === 0;
    }


    if(numeroTarjeta){
        numeroTarjeta.addEventListener('input', e => {
            const limpio = limpiarNumeroTarjeta(e.target.value);
            e.target.value = limpio.replace(/(.{4})/g,'$1 ').trim();
            if(e.target.value.length >= 14){
                if(luhnValido(e.target.value)){
                    validaNumero.textContent = 'Número válido';
                    validaNumero.className = 'mensaje-validacion ok';
                } else {
                    validaNumero.textContent = 'Número inválido';
                    validaNumero.className = 'mensaje-validacion error';
                }
            } else {
                validaNumero.textContent = '';
                validaNumero.className = 'mensaje-validacion';
            }
        });
    }

    if(expiracion){
        expiracion.addEventListener('input', e => {
            let v = e.target.value.replace(/[^0-9]/g,'').slice(0,4);
            if(v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
            e.target.value = v;
            if(v.length === 5){
                const mes = parseInt(v.slice(0,2),10);
                const anio = parseInt('20'+v.slice(3),10);
                const ahora = new Date();
                const valido = mes>=1 && mes<=12 && (anio>ahora.getFullYear() || (anio===ahora.getFullYear() && mes> (ahora.getMonth()+1)));
                if(valido){
                    validaExp.textContent = 'Fecha válida';
                    validaExp.className = 'mensaje-validacion ok';
                } else {
                    validaExp.textContent = 'Fecha expirada o inválida';
                    validaExp.className = 'mensaje-validacion error';
                }
            } else {
                validaExp.textContent = '';
                validaExp.className = 'mensaje-validacion';
            }
        });
    }


    metodoRadios.forEach(r => r.addEventListener('change', actualizarMetodos));
    function actualizarMetodos(){
        const val = document.querySelector('input[name="metodoAlterno"]:checked').value;
        grupoTarjeta.style.display = val==='tarjeta'? 'block':'none';
        grupoPse.style.display = val==='pse'? 'block':'none';
        grupoContra.style.display = val==='contraentrega'? 'block':'none';
    }

    window.addEventListener('storage', (e)=>{
        if(e.key === 'carrito') cargarCarrito();
    });

    function generarIdOrden(){
        const ahora = new Date();
        const year = ahora.getFullYear();
        const random = Math.floor(Math.random()*1_000_000).toString().padStart(6,'0');
        return `TV-${year}-${random}`;
    }

    function guardarHistorial(orden){
        let historial = [];
        try { historial = JSON.parse(localStorage.getItem('historialPedidos'))||[]; } catch(e) {}
        historial.push(orden);
        localStorage.setItem('historialPedidos', JSON.stringify(historial));
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        if(procesando) return;
        msg.textContent = '';
        const {subtotal, iva, envio, total} = cargarCarrito();
        if(total <= 0){
            msg.textContent = 'No hay productos para pagar.';
            return;
        }
        const metodo = document.querySelector('input[name="metodoAlterno"]:checked').value;
        if(!form.checkValidity()){
            msg.textContent = 'Por favor completa los campos obligatorios.';
            return;
        }
        if(metodo === 'tarjeta'){
         
            if(!luhnValido(numeroTarjeta.value)){
                msg.textContent = 'Número de tarjeta inválido.';
                return;
            }
            if(validaExp.classList.contains('error')){
                msg.textContent = 'Fecha de expiración inválida.';
                return;
            }
        }
        procesando = true;
        const btn = document.getElementById('btn-confirmar-pago');
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.textContent = 'Procesando...';
        msg.textContent = 'Procesando pago...';

        setTimeout(()=>{
            const orden = {
                id: generarIdOrden(),
                fecha: new Date().toISOString(),
                metodo,
                subtotal, iva, envio, total,
                items: obtenerCarrito()
            };
            guardarHistorial(orden);
            localStorage.removeItem('carrito');
            cargarCarrito();
            msg.textContent = `¡Gracias por tu compra! Orden: ${orden.id}`;
            btn.textContent = 'Pago Realizado';
            setTimeout(()=>{
                window.location.href = 'index.html';
            }, 2200);
        }, metodo === 'contraentrega' ? 800 : 1500);
    });

    actualizarMetodos();
    cargarCarrito();
});
