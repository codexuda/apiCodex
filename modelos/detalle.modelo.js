//cargar la libreria con la conexion a la bd
const ventaRutas = require('../rutas/venta.rutas');
var bd = require('./bd');
const producto = require('./producto.modelo')
const venta = require('./venta.modelo')

//constructor
const Detalle = function () { }

//metodo que obtiene la lista de ventas
Detalle.listar = function (idVenta, resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBD();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project: {
                    'detalles.producto': 1,
                    'detalles.cantidad': 1,
                    'detalles.valorunitario': 1,
                }
            }]
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando detalles", err);
                resultado(err, null);
            }
            else {
                resultado(null, res.length > 0 ? res[0].detalles : []);
            }
        });
}

//Metodo que agrega un registro 
Detalle.agregar = (idVenta, detalle, respuesta) => {
    const basedatos = bd.obtenerBD();

    //Verificar que el cliente exista
    producto.obtener(detalle.producto.id,
        function (error, resultado) {
            detalle.producto = resultado;
            detalle.valorunitario = resultado.precio;

            basedatos.collection('ventas')
                //***** Código MongoDB *****
                .updateOne(
                    {
                        id: eval(idVenta)
                    },
                    {
                        $push: {
                            detalles:
                            {
                                producto: detalle.producto,
                                cantidad: detalle.cantidad,
                                valorunitario: detalle.valorunitario
                            }

                        }
                    },
                    //**************************
                    function (err, res) {
                        //Verificar si hubo error ejecutando la consulta
                        if (err) {
                            console.log("Error agregando detalle de la venta:", err);
                            respuesta(err, null);
                            return;
                        }
                        //La consulta no afectó registros
                        if (res.modifiedCount == 0) {
                            //No se encontraron registros
                            respuesta({ mensaje: "No encontrado" }, null);
                            console.log("No se encontró la venta", err);
                            return;
                        }
                        console.log("Detalle de la venta agregado :", detalle);
                        respuesta(null, detalle);

                        venta.modificarValor(idVenta,
                            function (err, res) {
                                console.log(res);
                            });
                    }
                )

        });
}

//Metodo que modifica un registro 
Detalle.modificar = (idVenta, detalle, resultado) => {
    const basedatos = bd.obtenerBD();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idVenta),
                detalles: { $elemMatch: { nombre: detalle.nombre } }
            },
            {
                $set:
                {
                    'detalles.$.area': detalle.area,
                    'detalles.$.poblacion': detalle.poblacion
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error actualizando detalle de la venta:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la detalle de la venta", err);
                    return;
                }
                console.log("Venta actualizada :", detalle);
                resultado(null, detalle);
            }

        );
}

//Metodo que elimina un registro 
Detalle.eliminar = (idVenta, nombreDetalle, resultado) => {
    const basedatos = bd.obtenerBD();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idVenta)
            },
            {
                $pull: {
                    detalles:
                    {
                        nombre: nombreDetalle
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error eliminando detalle de la venta:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la detalle de la venta", err);
                    return;
                }
                console.log("Venta eliminada con nombre :", nombreDetalle);
                resultado(null, res);
            }
        );
}


module.exports = Detalle;