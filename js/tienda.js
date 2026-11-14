// Chispa Verde: catálogo, filtros, buscador y carrito

// Valores que no cambian
const TARIFA = 950;     // lo que cuesta 1 kWh en pesos (tarifa de ejemplo)
const DIAS_MES = 30;    // días de un mes

// Lista de productos: un arreglo de objetos
// wattsAntes = vatios del equipo viejo que se reemplaza
// wattsDespues = vatios del equipo nuevo (0 si no gasta energía de la red)
// horasDia = horas que se usa al día
// codigo = el código del producto en Homecenter (sirve para la foto y el enlace)
// Los precios son los de la página de Homecenter el 13 de noviembre de 2026
const productos = [
    { id: 1, codigo: "904421", nombre: "Bombillo LED A60 9 W E27 luz cálida Dairu", categoria: "iluminacion", precio: 4900,
      wattsAntes: 60, wattsDespues: 9, horasDia: 5 },
    { id: 2, codigo: "3063376", nombre: "Reflector LED 30 W luz cálida Tecnolite", categoria: "iluminacion", precio: 23900,
      wattsAntes: 150, wattsDespues: 30, horasDia: 6 },
    { id: 3, codigo: "3063377", nombre: "Reflector LED 50 W luz cálida Tecnolite", categoria: "iluminacion", precio: 34900,
      wattsAntes: 250, wattsDespues: 50, horasDia: 6 },
    { id: 4, codigo: "718835", nombre: "Nevera Haceb No Frost 404 L inverter", categoria: "electrodomesticos", precio: 2049900,
      wattsAntes: 130, wattsDespues: 42, horasDia: 24 },
    { id: 5, codigo: "3022986", nombre: "Aire acondicionado Panasonic 12.000 BTU inverter", categoria: "electrodomesticos", precio: 1299900,
      wattsAntes: 1000, wattsDespues: 620, horasDia: 8 },
    { id: 6, codigo: "3059285", nombre: "Nevera Haceb Bottom Mount 543 L inverter", categoria: "electrodomesticos", precio: 4545900,
      wattsAntes: 160, wattsDespues: 48, horasDia: 24 },
    { id: 7, codigo: "700568", nombre: "Reflector LED solar 300 W luz fría Ilumax", categoria: "solar", precio: 299900,
      wattsAntes: 50, wattsDespues: 0, horasDia: 8 },
    { id: 8, codigo: "324168", nombre: "Farol de pared solar LED negro Just Home Collection", categoria: "solar", precio: 19900,
      wattsAntes: 9, wattsDespues: 0, horasDia: 10 },
    { id: 9, codigo: "881487", nombre: "Set de 2 faroles de muro solares cuadrados negros", categoria: "solar", precio: 39900,
      wattsAntes: 18, wattsDespues: 0, horasDia: 10 }
];

// Estas variables sí cambian, por eso van con let
let carrito = [];               // los productos que el usuario agregó
let categoriaActual = "todas";  // el filtro que está elegido
let textoBusqueda = "";         // lo que hay escrito en el buscador

// ---------- Funciones ----------

// Cuántos kWh se ahorran al mes con un producto
// Ejemplo con el bombillo: (60 - 9) * 5 * 30 / 1000 = 7,65 kWh
function ahorroKwhMes(producto) {
    return (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
}

// Cuántos pesos se ahorran al mes: los kWh por la tarifa
function ahorroPesosMes(producto) {
    return ahorroKwhMes(producto) * TARIFA;
}

// Escribe un número como pesos colombianos: 8900 -> "$8.900"
function pesos(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

// En los datos la categoría va sin tildes, y esta función devuelve el nombre para mostrar
function nombreCategoria(categoria) {
    if (categoria === "iluminacion") {
        return "Iluminación";
    } else if (categoria === "electrodomesticos") {
        return "Electrodomésticos";
    } else {
        return "Energía solar";
    }
}

// Dibuja las tarjetas según el filtro y el buscador que estén activos
function mostrarProductos() {
    const contenedor = document.querySelector("#productos");
    contenedor.innerHTML = "";
    let cantidad = 0;

    // El bucle pasa por cada producto del arreglo
    for (const producto of productos) {
        // Si hay una categoría elegida y el producto es de otra, se salta
        if (categoriaActual !== "todas" && producto.categoria !== categoriaActual) {
            continue;
        }
        // Si el nombre no tiene el texto del buscador, también se salta
        if (!producto.nombre.toLowerCase().includes(textoBusqueda)) {
            continue;
        }
        cantidad += 1;
        contenedor.innerHTML += `
            <article class="tarjeta">
                <img class="foto" src="https://media.falabella.com/sodimacCO/${producto.codigo}/w=400,h=400,f=webp,fit=contain,q=85" alt="Foto de ${producto.nombre}" width="160" height="160" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='img/${producto.categoria}.svg'">
                <span class="categoria">${nombreCategoria(producto.categoria)}</span>
                <h3>${producto.nombre}</h3>
                <p>Reemplaza un equipo de ${producto.wattsAntes} W.
                   Ahorra <span class="ahorro">${ahorroKwhMes(producto).toFixed(1)} kWh</span> al mes.</p>
                <p class="precio">${pesos(producto.precio)}</p>
                <p>Ahorro al mes: <span class="ahorro">${pesos(ahorroPesosMes(producto))}</span></p>
                <button type="button" class="btn btn-primary btn-sm" data-id="${producto.id}">Agregar al carrito</button>
                <p class="fuente"><a href="https://www.homecenter.com.co/homecenter-co/product/${producto.codigo}/" target="_blank" rel="noopener">Ver en Homecenter</a></p>
            </article>`;
    }

    // Si no quedó ningún producto, se avisa
    if (cantidad === 0) {
        contenedor.innerHTML = "<p>No hay productos que coincidan con la búsqueda.</p>";
    }
}

// Agrega al carrito el producto con ese id
function agregarAlCarrito(id) {
    for (const producto of productos) {
        if (producto.id === id) {
            carrito.push(producto);
        }
    }
    mostrarCarrito();
}

// Dibuja el carrito: la lista, el total y el ahorro
function mostrarCarrito() {
    const lista = document.querySelector("#lista-carrito");
    lista.innerHTML = "";
    let total = 0;
    let ahorroMes = 0;

    for (const producto of carrito) {
        lista.innerHTML += `<li>${producto.nombre}: ${pesos(producto.precio)}</li>`;
        total += producto.precio;
        ahorroMes += ahorroPesosMes(producto);
    }

    document.querySelector("#total").textContent = "Total: " + pesos(total);

    if (carrito.length === 0) {
        document.querySelector("#ahorro").textContent = "El carrito está vacío.";
    } else {
        // Meses que tarda el ahorro en pagar la compra (se redondea hacia arriba)
        const meses = Math.ceil(total / ahorroMes);
        document.querySelector("#ahorro").textContent =
            `Ahorra ${pesos(ahorroMes)} al mes: la compra se paga sola en ${meses} meses.`;
    }
}

// ---------- Eventos ----------

// Botones de filtro: al hacer clic se cambia la categoría y se resalta el botón
const botonesFiltro = document.querySelectorAll(".filtro");
for (const boton of botonesFiltro) {
    boton.addEventListener("click", function () {
        for (const otro of botonesFiltro) {
            otro.classList.remove("activo");
        }
        boton.classList.add("activo");
        categoriaActual = boton.dataset.categoria;
        mostrarProductos();
    });
}

// Buscador: cada vez que se escribe algo se vuelven a dibujar los productos
document.querySelector("#buscador").addEventListener("input", function (evento) {
    textoBusqueda = evento.target.value.toLowerCase().trim();
    mostrarProductos();
});

// Botón "Agregar al carrito". El clic se escucha en #productos porque
// los botones los crea JavaScript y se vuelven a crear con cada filtro
document.querySelector("#productos").addEventListener("click", function (evento) {
    if (evento.target.dataset.id) {
        // dataset.id es texto, Number lo pasa a número para poder compararlo
        agregarAlCarrito(Number(evento.target.dataset.id));
    }
});

// Botón para vaciar el carrito
document.querySelector("#vaciar").addEventListener("click", function () {
    carrito = [];
    mostrarCarrito();
});

// Al abrir la página
mostrarProductos();
mostrarCarrito();
