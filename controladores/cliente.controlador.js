const cliente = require('../modelos/cliente.modelo')

exports.obtener = (req, res) => {
    cliente.obtener(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error buscando cliente' }
                );
            }
            return res.send(datos);
        });
}

exports.listar = (req, res) => {
    cliente.listar((error, datos) => {
        if (error) {
            return res.status(500).send(
                { mensaje: 'Error obteniendo la lista de clientes' }
            );
        }
        return res.send(datos);
    });

}

exports.agregar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.id || !req.body.nombre) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir el cliente' }
        );
    }

    cliente.agregar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error agregando cliente' }
                );
            }
            return res.send(datos);
        });
}

exports.modificar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.id || !req.body.nombre) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir el cliente' }
        );
    }

    cliente.modificar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error modificando cliente' }
                );
            }
            return res.send(datos);
        });
}

exports.eliminar = (req, res) => {
    cliente.eliminar(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error eliminando cliente' }
                );
            }
            return res.send(datos);
        });
}