// script.js
class CarritoCompras {
    constructor() {
        this.productos = {
            'laptop-gaming': {
                nombre: 'Laptop Gaming Pro',
                precio: 1299.99,
                imagen: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Laptop'
            },
            'smartphone-ultra': {
                nombre: 'Smartphone Ultra',
                precio: 699.99,
                imagen: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Smartphone'
            },
            'tablet-pro': {
                nombre: 'Tablet Pro',
                precio: 899.99,
                imagen: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Tablet'
            },
            'auriculares-wireless': {
                nombre: 'Auriculares Inalámbricos',
                precio: 199.99,
                imagen: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Auriculares'
            },
            'monitor-4k': {
                nombre: 'Monitor 4K Gaming',
                precio: 449.99,
                imagen: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Monitor'
            },
            'teclado-mecanico': {
                nombre: 'Teclado Mecánico RGB',
                precio: 129.99,
                imagen: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Teclado'
            }
        };
        this.carrito = this.cargarCarrito();
        this.actualizarCarrito();
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : {};
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    agregarProducto(productoId) {
        if (this.productos[productoId]) {
            if (this.carrito[productoId]) {
                this.carrito[productoId].cantidad += 1;
            } else {
                this.carrito[productoId] = {
                    ...this.productos[productoId],
                    cantidad: 1
                };
            }
            this.guardarCarrito();
            this.actualizarCarrito();
            this.mostrarNotificacion(`${this.productos[productoId].nombre} agregado al carrito`);
        }
    }

    eliminarProducto(productoId) {
        if (this.carrito[productoId]) {
            delete this.carrito[productoId];
            this.guardarCarrito();
            this.actualizarCarrito();
            this.mostrarNotificacion('Producto eliminado del carrito');
        }
    }

    cambiarCantidad(productoId, nuevaCantidad) {
        if (this.carrito[productoId] && nuevaCantidad > 0) {
            this.carrito[productoId].cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.actualizarCarrito();
        }
    }

    vaciarCarrito() {
        this.carrito = {};
        this.guardarCarrito();
        this.actualizarCarrito();
        this.mostrarNotificacion('Carrito vaciado');
    }

    calcularSubtotal() {
        return Object.values(this.carrito).reduce((total, producto) => {
            return total + (producto.precio * producto.cantidad);
        }, 0);
    }

    actualizarCarrito() {
        const carritoItems = document.getElementById('carrito-items');
        const carritoVacio = document.getElementById('carrito-vacio');
        const carritoTotal = document.getElementById('carrito-total');

        if (!carritoItems) return; // Si no estamos en la página del carrito

        const itemsCarrito = Object.keys(this.carrito);

        if (itemsCarrito.length === 0) {
            carritoVacio.style.display = 'block';
            carritoTotal.style.display = 'none';
            carritoItems.innerHTML = '<div id="carrito-vacio" style="text-align: center; padding: 3rem;"><h3>Tu carrito está vacío</h3><p>¡Agrega algunos productos increíbles!</p><a href="productos.html" class="btn">Ver Productos</a></div>';
        } else {
            carritoVacio.style.display = 'none';
            carritoTotal.style.display = 'block';

            let html = '';
            Object.entries(this.carrito).forEach(([id, producto]) => {
                html += `
                    <div class="carrito-item">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;">
                            <div>
                                <h4>${producto.nombre}</h4>
                                <p>$${producto.precio.toFixed(2)}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <button onclick="carrito.cambiarCantidad('${id}', ${producto.cantidad - 1})" class="btn" style="padding: 0.25rem 0.5rem;">-</button>
                                <span style="padding: 0 1rem; font-weight: bold;">${producto.cantidad}</span>
                                <button onclick="carrito.cambiarCantidad('${id}', ${producto.cantidad + 1})" class="btn" style="padding: 0.25rem 0.5rem;">+</button>
                            </div>
                            <div style="font-weight: bold;">$${(producto.precio * producto.cantidad).toFixed(2)}</div>
                            <button onclick="carrito.eliminarProducto('${id}')" class="btn" style="background: #dc3545; padding: 0.5rem;">🗑️</button>
                        </div>
                    </div>
                `;
            });

            carritoItems.innerHTML = html;

            // Actualizar totales
            const subtotal = this.calcularSubtotal();
            const impuestos = subtotal * 0.1;
            const envio = subtotal > 0 ? 15.00 : 0;
            const total = subtotal + impuestos + envio;

            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('impuestos').textContent = impuestos.toFixed(2);
            document.getElementById('envio').textContent = envio.toFixed(2);
            document.getElementById('total-final').textContent = total.toFixed(2);
        }
    }

    mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notificacion);

        // Animar entrada
        setTimeout(() => {
            notificacion.style.opacity = '1';
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Animar salida y eliminar
        setTimeout(() => {
            notificacion.style.opacity = '0';
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    procederPago() {
        if (Object.keys(this.carrito).length === 0) {
            this.mostrarNotificacion('El carrito está vacío');
            return;
        }

        const total = this.calcularSubtotal() + (this.calcularSubtotal() * 0.1) + 15.00;
        
        if (confirm(`¿Proceder con el pago de $${total.toFixed(2)}?`)) {
            this.mostrarNotificacion('¡Gracias por tu compra! Procesando el pago...');
            setTimeout(() => {
                this.vaciarCarrito();
                this.mostrarNotificacion('¡Pago exitoso! Tu pedido está en camino.');
            }, 2000);
        }
    }
}

// Inicializar carrito al cargar la página
const carrito = new CarritoCompras();

// Funciones globales para usar en HTML
function agregarAlCarrito(productoId) {
    carrito.agregarProducto(productoId);
}

function vaciarCarrito() {
    carrito.vaciarCarrito();
}

function procederPago() {
    carrito.procederPago();
}

// Animaciones y efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Añadir efecto parallax suave en la página de inicio
    if (document.body.classList.contains('inicio-body')) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const background = document.querySelector('.inicio-body');
            if (background) {
                background.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Añadir efectos de hover mejorados
    const cards = document.querySelectorAll('.producto-card, .categoria-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animación de carga para las tarjetas
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});
