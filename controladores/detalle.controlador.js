//cargar el modelo de detalles
const detalle = require('../modelos/detalle.modelo');

//metodo web para obtener la lista de detalles
exports.listar = (req, res) => {
    detalle.listar(req.params.id, (err, datos) => {
        //Verificar si hubo error
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de detalles' });
        }
        else {
            //devolver los registros obtenidos
            res.send(datos);
        }
    }
    );
}

//Metodo web para agregar un detalle
exports.agregar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener información con el detalle de la venta' });
    }

    detalle.agregar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando detalle de la venta' });
            }
            else {
                //Se devuelve el registro actualizado
                res.send(data);
            }
        }
    );
}


//Metodo web para actualizar un detalle
exports.modificar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener información con la región' });
    }

    detalle.modificar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error actualizando la región ' });
            }
            else {
                //Se devuelve el registro actualizado
                res.send(data);
            }
        });
}


//Metodo web para eliminar una detalle
exports.eliminar = (req, res) => {
    detalle.eliminar(req.params.id, req.params.nombre,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando la región ' });
            }
            else {
                //Se devuelve mensaje
                res.send({ mensaje: `La región con nombre:${req.params.nombre} fue eliminada` });
            }
        });
}
