const producto = require('../modelos/producto.modelo')

exports.obtener = (req, res) => {
    producto.obtener(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error buscando producto' }
                );
            }
            return res.send(datos);
        });
}

exports.listar = (req, res) => {
    producto.listar((error, datos) => {
        if (error) {
            return res.status(500).send(
                { mensaje: 'Error obteniendo la lista de productos' }
            );
        }
        return res.send(datos);
    });

}

exports.agregar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.id || !req.body.nombre) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir el producto' }
        );
    }

    producto.agregar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error agregando producto' }
                );
            }
            return res.send(datos);
        });
}

exports.modificar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.id || !req.body.nombre) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir el producto' }
        );
    }

    producto.modificar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: `Error modificando producto ${error.mensaje}` }
                );
            }
            return res.send(datos);
        });
}

exports.eliminar = (req, res) => {
    producto.eliminar(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error eliminando producto' }
                );
            }
            return res.send(datos);
        });
}