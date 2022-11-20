const bd = require('./bd')
const cliente = require('./cliente.modelo');
const Detalle = require('./detalle.modelo');

const Venta = function () { }

Venta.obtenerValor = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para totalizar el valor una venta
    const totalVenta = basedatos.collection('ventas')
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project:
                {
                    valorTotal:
                    {
                        $map:
                        {
                            input: "$detalles",
                            as: "detalle",
                            in: { $multiply: ["$$detalle.cantidad", "$$detalle.valorunitario"] }
                        }
                    }
                }
            },
            {
                $project:
                {
                    valorTotalVenta: { $sum: "$valorTotal" }
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error consultando total de venta ', error);
                    respuesta(error, -1);
                }
                else {
                    if (resultado) {
                        console.log(resultado[0]);
                        respuesta(null, resultado[0].valorTotalVenta);
                    }
                    else {
                        respuesta(null, -1);
                    }
                }
            });
}

Venta.obtener = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los ventas
    const ventas = basedatos.collection('ventas')
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project: {
                    id: 1,
                    cliente: 1,
                    fecha: 1,
                    estado: 1,
                    valor: 1,
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los ventas ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado) {
                        respuesta(null, resultado[0]);
                    }
                    else {
                        respuesta(null, null);
                    }
                }
            });

}

Venta.listar = function (respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los ventas
    basedatos.collection('ventas')
        .find()
        .project(
            {
                id: 1,
                cliente: 1,
                fecha: 1,
                estado: 1,
                valor: 1,
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los ventas ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}

Venta.agregar = function (venta, respuesta) {
    const basedatos = bd.obtenerBD();

    //Verificar que el cliente exista
    cliente.obtener(venta.cliente.id,
        function (error, resultado) {
            venta.cliente = resultado;
            //***** codigo MONGO para agregar un Documento venta
            basedatos.collection('ventas')
                .insertOne({
                    id: venta.id,
                    cliente: venta.cliente,
                    fecha: venta.fecha,
                    estado: 'COMPRANDO',
                    valor: 0,
                }
                    //*****
                    , function (error, resultado) {
                        if (error) {
                            console.log('Error agregando venta ', error);
                            respuesta(error, null);
                        }
                        else {
                            respuesta(null, venta);
                        }
                    }

                );

        });
}

Venta.modificarValor = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBD();

    this.obtenerValor(idVenta,
        function (error, resultado) {
            console.log(resultado);
            //***** codigo MONGO para modificar el estado de la venta
            basedatos.collection('ventas')
                .updateOne(
                    { id: eval(idVenta) },
                    {
                        $set: {
                            valor: resultado,
                        }
                    }
                    //*****
                    , function (error, resultado) {
                        if (error) {
                            console.log('Error totalizando venta ', error);
                            respuesta(error, null);
                        }
                        else {
                            respuesta(null, "Venta fue totalizada");
                        }
                    }

                );
        })
}

Venta.pagar = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para modificar el estado de la venta
    basedatos.collection('ventas')
        .updateOne(
            { id: idVenta },
            {
                $set: {
                    estado: 'PAGADO',
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error pagando venta ', error);
                    respuesta(error, null);
                    return
                }
                Detalle.actualizarInventario(idVenta,
                    function (err, res) {
                        console.log(res);
                    });
                respuesta(null, "La venta ha sido pagada");

            }

        );
}


Venta.eliminar = function (idventa, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para eliminar un Documento venta
    basedatos.collection('ventas')
        .deleteOne(
            { id: eval(idventa) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando venta ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el venta por no encontrarse');
                        respuesta({ mensaje: "venta no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el venta con id:${idventa}`);
                        respuesta(null, { mensaje: `Se eliminó el venta con id:${idventa}` });
                    }
                }
            }
        );
}

module.exports = Venta;