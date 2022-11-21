const usuario = require('../modelos/usuario.modelo')

exports.obtener = (req, res) => {
    usuario.obtener(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error buscando usuario' }
                );
            }
            return res.send(datos);
        });
}

exports.listar = (req, res) => {
    usuario.listar((error, datos) => {
        if (error) {
            return res.status(500).send(
                { mensaje: 'Error obteniendo la lista de usuarios' }
            );
        }
        return res.send(datos);
    });

}

exports.agregar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.correo || !req.body.nombre || !req.body.clave) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir todos los datos del usuario' }
        );
    }

    usuario.agregar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error agregando usuario' }
                );
            }
            return res.send(datos);
        });
}

exports.modificar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.correo || !req.body.nombre) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir el usuario' }
        );
    }

    usuario.modificar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: `Error modificando usuario:${error.mensaje}` }
                );
            }
            return res.send(datos);
        });
}

exports.cambiarClave = (req, res) => {
    usuario.cambiarClave(req.params.correo, req.params.clave,
        (error, datos) => {
            if(error){
                return res.status(500).send(
                    { mensaje: `Error cambiando la clave del usuario:${error.mensaje}` }
                );
            }
            return res.send(datos);
        });
}

exports.login = (req, res) => {
    usuario.login(req.params.correo, req.params.clave,
        (error, datos) => {
            if(error){
                return res.status(500).send(
                    { mensaje: `Error en el Loguin del usuario:${error.mensaje}` }
                );
            }
            return res.send(datos);
        });
}

exports.eliminar = (req, res) => {
    usuario.eliminar(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error eliminando usuario' }
                );
            }
            return res.send(datos);
        });
}