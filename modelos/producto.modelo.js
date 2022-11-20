const bd = require('./bd')

const Producto = function () { }

Producto.obtener = function (idProducto, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los productos
    const productos = basedatos.collection('productos')
        .aggregate([
            { $match: { id: eval(idProducto) } },
            {
                $project: {
                    id: 1,
                    nombre: 1,
                    descripcion: 1,
                    urlImagen: 1,
                    precio: 1,
                    existencia: 1,
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los productos ', error);
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

Producto.listar = function (respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los productos
    basedatos.collection('productos')
        .find()
        .project(
            {
                id: 1,
                nombre: 1,
                descripcion: 1,
                urlImagen: 1,
                precio: 1,
                existencia: 1,
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los productos ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}

Producto.agregar = function (producto, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para agregar un Documento producto
    basedatos.collection('productos')
        .insertOne({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            urlImagen: producto.urlImagen,
            precio: producto.precio,
            existencia: producto.existencia,
        }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error agregando producto ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, producto);
                }
            }

        );
}

Producto.modificar = function (producto, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para moidifcar un Documento producto
    basedatos.collection('productos')
        .updateOne(
            { id: producto.id },
            {
                $set: {
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    urlImagen: producto.urlImagen,
                    precio: producto.precio,
                    existencia: producto.existencia,
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error modificando producto ', error);
                    respuesta(error, null);
                }

                //La consulta no afectó registros
                if (resultado.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "No actualizado" }, null);
                    console.log("No se actualizó el PRODUCTO ", producto);
                    return;
                }
                else {
                    console.log("Se modificó con éxito el PRODUCTO: ", producto);
                    respuesta(null, producto);
                }
              
            }
        );
} 
Producto.actualizarExistencia = function (id, unidades, respuesta) {
    const basedatos = bd.obtenerBD();

    this.obtener(id,
        function (error, resultado) {
            if (resultado) {
                //***** codigo MONGO para moidifcar un Documento producto
                basedatos.collection('productos')
                    .updateOne(
                        { id: id },
                        {
                            $set: {
                                existencia: resultado.existencia-unidades,
                            }
                        }
                        //*****
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error actualizando existencia ', error);
                                respuesta(error, null);
                                return;
                            }
                            //La consulta no afectó registros
                            if (resultado.modifiedCount == 0) {
                                //No se encontraron registros
                                respuesta({ mensaje: `Existencia no actualizada del producto ${resultado.nombre}` }, null);
                                console.log(`Existencia no actualizada del producto ${resultado.nombre}`);
                                return;
                            }

                            respuesta(null, `El inventario del producto ${resultado.nombre} fue actualizado`);

                        }

                    );
            }
        });
}



Producto.eliminar = function (idproducto, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para eliminar un Documento producto
    basedatos.collection('productos')
        .deleteOne(
            { id: eval(idproducto) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando producto ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el producto por no encontrarse');
                        respuesta({ mensaje: "producto no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el producto con id:${idproducto}`);
                        respuesta(null, { mensaje: `Se eliminó el producto con id:${idproducto}` });
                    }
                }
            }
        );
}

module.exports = Producto;