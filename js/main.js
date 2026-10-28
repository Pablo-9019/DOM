class productos{
    constructor(id, nombre, variedad, precio, stock){
        this.id = id
        this.nombre = nombre
        this.variedad = variedad
        this.precio = precio
        this.stock = stock
    }
    vender(cantidad){
        this.stock -= cantidad
    }
    aplicarDescuento(aplicar){
        if(isNaN(aplicar) || aplicar < 0 || aplicar > 100){
            mostrarMensaje("El descuento debe estar entre 0 y 100")
        }
        const precioAnterior = this.precio
        const descuento = this.precio * aplicar / 100
        this.precio = this.precio - descuento
        mostrarMensaje("Descuento aplicado a " + this.nombre + " (" + this.variedad + "). Precio anterior: $" + precioAnterior + " - Precio final: $" + this.precio, "exito")
    }
}
let carrito = []
const panaderia = [
    new productos(1, "Pan", "Ciabatta", 1000, 50),
    new productos(2, "Galletitas", "Surtidas", 2000, 50),
    new productos(3, "Facturas", "Medialunas", 1500, 20),
    new productos(4, "Tortas", "Raspadas", 1000, 25),
    new productos(5, "Sandwiches", "Jamon y Queso", 2500, 20),git
]
const mensaje = document.getElementById("mensaje")
const selectProducto = document.getElementById("select-producto")
const inputCantidad = document.querySelector("#input-cantidad")
const inputDescuento = document.querySelector("#input-descuento")
const contenedorItems = document.getElementById("contenedor-items")
const contenedorCarrito = document.getElementById("contenedor-carrito")
const totalCarrito = document.querySelector("#total-carrito")
const botonesMenu = document.querySelectorAll(".btn-menu")
function mostrarMensaje(texto, tipo){
    mensaje.textContent = texto
    mensaje.className = "mensaje " + tipo
}
function armarMenu(){
    return panaderia.map(producto => `<option value="${producto.id}">${producto.id}. ${producto.nombre}</option>`).join("")
}
function productoSeleccionado(){
    return panaderia.find(producto => producto.id === parseInt(selectProducto.value))
}
const mostrarProductos = function(){
    const tarjetas = []
    panaderia.forEach(function(producto){
        tarjetas.push(`
            <article class="tarjeta">
                <h3>${producto.nombre}</h3>
                <p class="variedad">${producto.variedad}</p>
                <p class="precio">$${producto.precio}</p>
                <p>Disponibles: ${producto.stock}</p>
            </article>`)
    })
    contenedorItems.innerHTML = tarjetas.join("")
}
function agregarAlCarrito(){
    const elegido = productoSeleccionado()
    const cantidad = parseInt(inputCantidad.value)
    if(!(cantidad > 0)){
        mostrarMensaje("Ingresa una cantidad valida", "error")
        return
    }
    if(cantidad > elegido.stock){
        mostrarMensaje("No hay suficiente stock. Solo quedan " + elegido.stock + " de " + elegido.nombre, "error")
        return
    }
    elegido.vender(cantidad)
    const yaEnCarrito = carrito.some(compra => compra.producto === elegido.nombre)
    if(yaEnCarrito){
        const compra = carrito.find(compra => compra.producto === elegido.nombre)
        compra.cantidad = compra.cantidad + cantidad
        compra.subtotal = compra.subtotal + cantidad * elegido.precio
    }
    else{
        carrito.push({
            producto: elegido.nombre,
            cantidad: cantidad,
            subtotal: cantidad * elegido.precio})
    }
    mostrarProductos()
    verCarrito()
    mostrarMensaje("Agregado a tu carrito: " + cantidad + " de " + elegido.nombre, "exito")
}
function descuentoProductos(){
    const elegido = productoSeleccionado()
    const porcentaje = parseInt(inputDescuento.value)
    elegido.aplicarDescuento(porcentaje)
    mostrarProductos()
}
function quitarDelCarrito(nombre){
    const quitar = carrito.find(compra => compra.producto === nombre)
    if(!quitar){
        mostrarMensaje(nombre + " no esta en el carrito", "error")
        return
    }
    carrito = carrito.filter(compra => compra !== quitar)
    const cambiarproducto = panaderia.find(producto => producto.nombre === nombre)
    cambiarproducto.stock += quitar.cantidad
    mostrarProductos()
    verCarrito()
    mostrarMensaje("Se quito del carrito: " + quitar.cantidad + " de " + quitar.producto, "exito")
}
function verCarrito(){
    if(carrito.length === 0){
        contenedorCarrito.innerHTML = "<p class='vacio'>El carrito esta vacio.</p>"
        totalCarrito.textContent = ""
        mostrarMensaje("El carrito esta vacio", "aviso")
        return
    }
    const lista = []
    carrito.forEach(function(compra){
        lista.push(`
            <div class="item-carrito">
                <div>
                    <h4>${compra.producto}</h4>
                    <p>Cantidad: ${compra.cantidad} - Subtotal: $${compra.subtotal}</p>
                </div>
                <button class="btn-quitar" data-producto="${compra.producto}">Quitar</button>
            </div>`)
    })
    contenedorCarrito.innerHTML = lista.join("")
    const total = carrito.reduce((suma, compra) => suma + compra.subtotal, 0)
    totalCarrito.textContent = "Total acumulado: $" + total
    mostrarMensaje("Total acumulado de tu carrito: $" + total, "exito")
 
    const botonesQuitar = document.querySelectorAll(".btn-quitar")
    botonesQuitar.forEach(function(boton){
        boton.addEventListener("click", function(){
            quitarDelCarrito(boton.dataset.producto)
        })
    })
}
function ejecutarOpcion(opciones){
    switch(opciones){
        case 1:
            mostrarProductos()
            mostrarMensaje("Mostrando " + panaderia.length + " productos", "exito")
            break
        case 2:
            agregarAlCarrito()
            break
        case 3:
            descuentoProductos()
            break
        case 4:
            quitarDelCarrito(productoSeleccionado().nombre)
            break
        case 5:
            verCarrito()
            break
        default:
            mostrarMensaje("Opcion invalida, elija del 1 al 5", "error")
            break
    }
}
botonesMenu.forEach(function(boton){
    boton.addEventListener("click", function(){
        ejecutarOpcion(parseInt(boton.dataset.opcion))
    })
})
inputCantidad.addEventListener("keydown", function(evento){
    if(evento.key === "Enter"){
        ejecutarOpcion(2)
    }
})
selectProducto.innerHTML = armarMenu()
mostrarProductos()
verCarrito()