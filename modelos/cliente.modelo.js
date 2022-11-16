const bd = require('./bd')

const Cliente = function () { }

Cliente.obtener = function (idCliente, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los clientes
    const clientes = basedatos.collection('clientes')
        .aggregate([
            { $match: { id: eval(idCliente) } },
            {
                $project: {
                    id: 1,
                    apellido: 1,
                    identificacion: 1,
                    edad: 1,
                    telefono: 1,
                    correo: 1,
                    direccion: 1,
                    nombre: 1
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los clientes ', error);
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

Cliente.listar = function (respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los clientes
    basedatos.collection('clientes')
        .find()
        .project(
            {
                id: 1,
                apellido: 1,
                identificacion: 1,
                edad: 1,
                telefono: 1,
                correo: 1,
                direccion: 1,
                nombre: 1
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los clientes ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}

Cliente.agregar = function (cliente, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para agregar un identificacion cliente
    basedatos.collection('clientes')
        .insertOne({
            id: cliente.id,
            apellido: cliente.apellido,
            identificacion: cliente.identificacion,
            edad: cliente.edad,
            telefono: cliente.telefono,
            correo: cliente.correo,
            direccion: cliente.direccion,
            nombre: cliente.nombre
        }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error agregando cliente ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, cliente);
                }
            }

        );
}

Cliente.modificar = function (cliente, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para moidifcar un identificacion cliente
    basedatos.collection('clientes')
        .updateOne(
            { id: cliente.id },
            {
                $set: {
                    apellido: cliente.apellido,
                    identificacion: cliente.identificacion,
                    edad: cliente.edad,
                    telefono: cliente.telefono,
                    correo: cliente.correo,
                    direccion: cliente.direccion,
                    nombre: cliente.nombre
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error modificando cliente ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, cliente);
                }
            }

        );
}

Cliente.eliminar = function (idcliente, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para eliminar un identificacion cliente
    basedatos.collection('clientes')
        .deleteOne(
            { id: eval(idcliente) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando cliente ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el cliente por no encontrarse');
                        respuesta({ mensaje: "cliente no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el cliente con id:${idcliente}`);
                        respuesta(null, { mensaje: `Se eliminó el cliente con id:${idcliente}` });
                    }
                }
            }
        );
}

module.exports = Cliente;