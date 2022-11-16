module.exports = (app) => {

    const controladorVenta = require("../controladores/venta.controlador");
    const controladorDetalle = require("../controladores/detalle.controlador");

    app.get("/ventas", controladorVenta.listar);
    app.get("/ventas/:id", controladorVenta.obtener);
    app.post("/ventas", controladorVenta.agregar);

    app.delete("/ventas/:id", controladorVenta.eliminar);

    app.get("/ventas/detalle/:id", controladorDetalle.listar);
    app.post("/ventas/detalle/:id", controladorDetalle.agregar);

}