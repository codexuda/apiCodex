module.exports = (app) => {

    const controlador = require("../controladores/cliente.controlador");

    app.get("/clientes", controlador.listar);
    app.get("/clientes/:id", controlador.obtener);
    app.post("/clientes", controlador.agregar);
    app.put("/clientes", controlador.modificar);
    app.delete("/clientes/:id", controlador.eliminar);

}