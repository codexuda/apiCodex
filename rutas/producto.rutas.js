module.exports = (app) => {

    const controlador = require("../controladores/producto.controlador");

    app.get("/productos", controlador.listar);
    app.get("/productos/:id", controlador.obtener);
    app.post("/productos", controlador.agregar);
    app.put("/productos/:id", controlador.modificar);
    app.delete("/productos/:id", controlador.eliminar);

}