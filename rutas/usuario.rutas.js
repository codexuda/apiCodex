module.exports = (app) => {

    const controlador = require("../controladores/usuario.controlador");

    app.get("/usuarios", controlador.listar);
    app.get("/usuarios/:correo", controlador.obtener);
    app.post("/usuarios", controlador.agregar);
    app.post("/usuarios/cambiarclave/:correo/:clave", controlador.cambiarClave);
    app.post("/usuarios/login/:correo/:clave", controlador.login);
    app.put("/usuarios/", controlador.modificar);
    app.delete("/usuarios/:correo", controlador.eliminar);

}