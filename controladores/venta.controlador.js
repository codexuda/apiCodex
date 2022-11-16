const venta = require('../modelos/venta.modelo')

exports.obtener = (req, res) => {
    venta.obtener(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error buscando venta' }
                );
            }
            return res.send(datos);
        });
}

exports.listar = (req, res) => {
    venta.listar((error, datos) => {
        if (error) {
            return res.status(500).send(
                { mensaje: 'Error obteniendo la lista de ventas' }
            );
        }
        return res.send(datos);
    });

}

exports.agregar = (req, res) => {
    //Validar que se recibe un objeto
    if (!req.body || !req.body.id || !req.body.cliente) {
        return res.status(400).send(
            { mensaje: 'El contenido de la solicitud debe incluir la venta' }
        );
    }

    venta.agregar(req.body,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: `Error agregando venta: ${error}` }
                );
            }
            return res.send(datos);
        });
}



exports.eliminar = (req, res) => {
    venta.eliminar(req.params.id,
        (error, datos) => {
            if (error) {
                return res.status(500).send(
                    { mensaje: 'Error eliminando venta' }
                );
            }
            return res.send(datos);
        });
}