// Formulario de contacto: no se envía a ningún servidor,
// solo muestra un mensaje de que se recibió.

const formulario = document.querySelector("#formulario");
const respuesta = document.querySelector("#respuesta");

formulario.addEventListener("submit", function (evento) {
    // preventDefault evita que la página se recargue
    evento.preventDefault();
    const nombre = document.querySelector("#nombre").value;
    respuesta.textContent = "Gracias, " + nombre + ". Recibimos tu mensaje y te respondemos pronto.";
    formulario.reset();
});
